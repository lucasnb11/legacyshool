# Campanha 2027 — Desconto Igreja-Parceira

**Ambiente:** branch `feature/desconto-igreja-parceira-2027`. Não publicar a arte com QR até validar o cadastro em produção.

## Fluxo
1. QR Code → `/igreja-parceira`.
2. Formulário: Nome, WhatsApp, Sua Igreja e consentimento específico.
3. O navegador envia os dados para `POST /api/igreja-parceira`.
4. A função cria um contato no **RD Station CRM API v1**; o navegador só redireciona se receber sucesso.
5. Após confirmação, a pessoa vai à landing institucional já existente, com destaque da campanha e botão para WhatsApp da escola.

## Requisitos para ativação
- Na Vercel, configurar **RD_CRM_TOKEN** como variável de ambiente da função (credencial da conta RD Station CRM). Nunca inserir o token em arquivos públicos ou compartilhar em mensagens.
- Criar no RD Station um campo personalizado de **contato** chamado "Sua Igreja". Configure **RD_IGREJA_CUSTOM_FIELD_ID** com o ID do campo; sem ele, a informação fica apenas nas anotações do contato.
- Testar um cadastro com dados de teste autorizados, conferir a criação do contato no CRM, origem da campanha, redirecionamento e botão do WhatsApp.
- Verificar a política do CRM para contatos duplicados e a recepção de erros de validação.
- Revisar com a escola o aviso de privacidade, prazo de retenção, canal de exercício de direitos e base legal. A informação sobre igreja pode revelar crença religiosa, dado sensível pela LGPD.
- Antes de divulgar, implementar proteção operacional de taxa contra envio abusivo ao endpoint público.

## Endereços previstos
- Cadastro: `https://legacy-school-tau.vercel.app/igreja-parceira`
- Página institucional após cadastro: `https://legacy-school-tau.vercel.app/?origem=igreja-parceira`

**Atenção:** na ausência do token do CRM, o endpoint retorna HTTP 503 e não simula confirmação de cadastro. O site público atual permanece intacto até promover as alterações.

## Documentação oficial
- https://developers.rdstation.com/reference/crm-v1-create-contact
- https://developers.rdstation.com/reference/crm-v1-custom-fields
