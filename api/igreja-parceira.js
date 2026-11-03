module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ok:false});
  const data = req.body || {};
  const name = typeof data.nome === 'string' ? data.nome.trim().slice(0,100) : '';
  const church = typeof data.igreja === 'string' ? data.igreja.trim().slice(0,120) : '';
  let phone = String(data.whatsapp || '').replace(/\D/g,'');
  if (phone.startsWith('55') && phone.length > 11) phone = phone.slice(2);
  if (name.length < 2 || church.length < 2 || !/^[0-9]{10,11}$/.test(phone) || data.consentimento !== true) {
    return res.status(400).json({ok:false,message:'Verifique seu cadastro.'});
  }
  if (!process.env.RD_CRM_TOKEN) {
    return res.status(503).json({ok:false,message:'Cadastro temporariamente indisponível.'});
  }
  const contact = {name,phones:[{phone:'55'+phone,type:'work'}],
    notes:'Campanha Igreja-Parceira 2027; igreja: '+church+'; consentimento expresso em '+new Date().toISOString()};
  if(process.env.RD_IGREJA_CUSTOM_FIELD_ID){
    contact.contact_custom_fields=[{custom_field_id:process.env.RD_IGREJA_CUSTOM_FIELD_ID,value:church}];
  }
  const url=new URL('https://crm.rdstation.com/api/v1/contacts');
  url.searchParams.set('token',process.env.RD_CRM_TOKEN);
  try {
    const response=await fetch(url,{method:'POST',
      headers:{'Content-Type':'application/json','Accept':'application/json'},
      body:JSON.stringify({contact})});
    if(!response.ok) return res.status(502).json({ok:false,message:'Não foi possível registrar. Contate a escola.'});
    return res.status(201).json({ok:true});
  } catch {
    return res.status(502).json({ok:false,message:'Serviço indisponível no momento.'});
  }
};