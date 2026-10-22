# Legacy School Belém — Landing page

Página estática responsiva para a campanha de matrículas 2027. HTML, CSS e JavaScript estão em index.html. As imagens e o logotipo ficam em assets/. Não precisa instalar dependências, usar Node.js ou executar build.

## Publicar no GitHub

1. Extraia este ZIP no computador.
2. Crie um repositório no GitHub, por exemplo legacy-school-belem.
3. Use Add file → Upload files e envie o conteúdo extraído, incluindo a pasta assets.
4. Confirme em Commit changes. O arquivo index.html e vercel.json devem ficar na raiz do repositório, ao lado da pasta assets. Não envie apenas o ZIP nem crie uma pasta adicional acima dos arquivos.

## Publicar na Vercel

1. Entre em https://vercel.com e escolha Add New → Project.
2. Conecte sua conta do GitHub e importe o repositório.
3. Use Framework Preset: Other e Root Directory: a raiz do repositório.
4. Não configure comandos de instalação ou build. Output Directory: . (um ponto).
5. Clique em Deploy. O vercel.json incluído já define essas opções para o projeto estático.
6. Abra o endereço publicado e teste os botões, o formulário e as imagens no celular e no computador.

Referências: https://vercel.com/docs/builds/configure-a-build e https://vercel.com/docs/project-configuration/vercel-json

## Como funciona o formulário

O formulário prepara uma mensagem para o WhatsApp da unidade: +55 (91) 98418-9183. A pessoa precisa revisar e enviar a mensagem no WhatsApp. O envio não confirma o atendimento; a equipe combina o horário pelo WhatsApp.

Esta versão não armazena os dados, não envia e-mails, não cadastra contatos automaticamente no RD Station CRM e não contém pixels de anúncios. O cadastro e o acompanhamento no CRM Basic devem ser feitos pela equipe.

Os parâmetros utm_source, utm_medium, utm_campaign e utm_content do endereço são incluídos na mensagem para ajudar a identificar a campanha. Exemplo:

https://SEU-DOMINIO.vercel.app/?utm_source=instagram&utm_medium=paid_social&utm_campaign=matriculas_2027_belem&utm_content=fundamental

Isso identifica a origem na mensagem; não equivale a mensuração automática de conversões.

## Alterar o conteúdo

- Edite index.html em um editor de texto. O CSS fica em <style> e o JavaScript em <script>.
- WhatsApp: procure 5591984189183 no JavaScript e atualize também o telefone visível na seção de contato.
- Endereço, e-mail e Instagram: edite a seção com id="unidade".
- Campanha: procure Matrículas 2027 e revise também as opções do campo de ano letivo.
- Imagens: substitua os arquivos em assets mantendo os nomes, ou atualize os caminhos no HTML.
- As imagens são institucionais da rede Legacy; não são apresentadas como fotos exclusivas da unidade Belém.

Informações e imagens baseadas no site oficial https://legacyschool.com.br/ e na página de unidades. Revise as informações comerciais, turmas e turnos da unidade antes de divulgar a campanha.

## Ver localmente

Abra index.html no navegador. Para testar o fluxo completo, preencha o formulário e confira a mensagem no WhatsApp. Cancele o envio caso esteja apenas testando.

## Identidade visual

Paleta obtida do CSS do site oficial: azul #103948, azul índigo #262853, amarelo #FFD800 e laranja #FEA92D. Botões usam o degradê oficial #FFA82F → #FFDD41. Estrutura, conteúdo e formulário da versão anterior preservados.

Imagem adicional: assets/high-school.webp — original oficial de 1080 × 1350 px, https://legacyschool.com.br/wp-content/uploads/2024/04/HIGH-SCHOOL.webp. Arte escolhida para substituir a foto repetida no card Fundamental II; contém a inscrição High School.

## Localização e atendimento durante as obras

A escola fica na Av. Gentil Bittencourt, 663, Nazaré, Belém — PA. O bairro exibido segue a identificação da localidade informada pela unidade.

Durante as obras, o plantão de pré-matrículas funciona temporariamente na Almirante Wandenkolk, 213, entre Municipalidade e Senador Lemos, em Belém. A página diferencia os dois endereços e oferece um link de mapa para cada um. Quando o atendimento mudar, revise o aviso no topo, a seção de localização, o formulário, a mensagem de WhatsApp e as perguntas frequentes.
