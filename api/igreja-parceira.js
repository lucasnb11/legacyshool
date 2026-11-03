const CAMPAIGN = 'Desconto Igreja-Parceira 2027';
const CRM_BASE = 'https://crm.rdstation.com/api/v1';

function normalLabel(s) {
  return String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase();
}

async function crmRequest(path, token, options) {
  const url = new URL(CRM_BASE + path);
  url.searchParams.set('token', token);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  try {
    return await fetch(url, {...options, signal:controller.signal});
  } finally {
    clearTimeout(timeout);
  }
}

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  if (req.method !== 'POST') return res.status(405).json({ok:false});
  if (!String(req.headers['content-type'] || '').includes('application/json')) {
    return res.status(415).json({ok:false,message:'Formato inválido.'});
  }
  if (Number(req.headers['content-length'] || 0) > 4096) {
    return res.status(413).json({ok:false,message:'Cadastro muito extenso.'});
  }
  if (req.headers.origin) {
    try {
      if (new URL(req.headers.origin).host !== req.headers.host) return res.status(403).json({ok:false});
    } catch (_) {
      return res.status(403).json({ok:false});
    }
  }
  const data = req.body && typeof req.body === 'object' && !Array.isArray(req.body) ? req.body : {};
  if (typeof data.website === 'string' && data.website.trim()) return res.status(200).json({ok:true});

  const name = typeof data.nome === 'string' ? data.nome.trim().slice(0,100) : '';
  const church = typeof data.igreja === 'string' ? data.igreja.trim().slice(0,120) : '';
  let phone = typeof data.whatsapp === 'string' ? data.whatsapp.replace(/\D/g,'') : '';
  if (/^55\d{10,11}$/.test(phone)) phone = phone.slice(2);
  const consented = data.consentimento === true && data.origem === 'igreja-parceira';

  if (name.length < 2 || church.length < 2 || !/^[1-9]{2}[2-9]\d{7,8}$/.test(phone) || !consented) {
    return res.status(400).json({ok:false,message:'Verifique seu cadastro e o consentimento.'});
  }
  const token = process.env.RD_CRM_TOKEN;
  if (!token) return res.status(503).json({ok:false,message:'Cadastro ainda indisponível. Fale com a escola.'});

  // Os campos devem existir no CRM e estar visíveis para contatos.
  // Não confirmar cadastros que não possam gravar igreja e origem corretamente.
  let fields;
  try {
    const response = await crmRequest('/custom_fields?for=contact', token, {
      method:'GET', headers:{Accept:'application/json'}
    });
    if (!response.ok) throw new Error('Campos não disponíveis: ' + response.status);
    const result = await response.json();
    fields = Array.isArray(result) ? result : Array.isArray(result.custom_fields) ? result.custom_fields : [];
  } catch (_) {
    return res.status(503).json({ok:false,message:'Não foi possível validar os campos do CRM. Tente novamente.'});
  }

  const findField = (label, envId) => {
    if (envId && /^[a-z0-9]{24}$/i.test(envId)) return envId;
    const match = fields.find(f=> f.for === 'contact' && f.type === 'text' &&
      normalLabel(f.label) === normalLabel(label));
    return match ? (match.id || match._id) : null;
  };
  const churchFieldId = findField('Sua Igreja', process.env.RD_IGREJA_CUSTOM_FIELD_ID);
  const originFieldId = findField('Origem do cadastro', process.env.RD_ORIGEM_CUSTOM_FIELD_ID);
  if (!churchFieldId || !originFieldId) {
    return res.status(503).json({ok:false,message:'Cadastro em configuração. A escola precisa ativar os campos Igreja e Origem no CRM.'});
  }

  const contact = {
    name,
    phones:[{phone:'55'+phone,type:'work'}],
    legal_bases:[
      {category:'data_processing',type:'consent',status:'granted'},
      {category:'communications',type:'consent',status:'granted'}
    ],
    contact_custom_fields:[
      {custom_field_id:churchFieldId,value:church},
      {custom_field_id:originFieldId,value:CAMPAIGN}
    ],
    notes:'Origem: '+CAMPAIGN+'; consentimento expresso recebido em '+new Date().toISOString()+'; versão: igreja-parceira-2027-v1'
  };

  try {
    const response = await crmRequest('/contacts', token, {
      method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},
      body:JSON.stringify({contact})
    });
    if (response.ok) return res.status(201).json({ok:true});
    if (response.status === 429) return res.status(429).json({ok:false,message:'Muitas solicitações. Tente novamente em instantes.'});
    // Evitar logs contendo dados pessoais ou a URL com o token.
    console.error('RD CRM rejeitou cadastro Igreja-Parceira: HTTP '+response.status);
    return res.status(502).json({ok:false,message:'Não foi possível confirmar o cadastro. Entre em contato com a escola.'});
  } catch (_) {
    return res.status(502).json({ok:false,message:'Integração indisponível no momento. Tente novamente.'});
  }
};
