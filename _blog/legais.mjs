/* Termos de uso e Política de Privacidade (www.vcacompany.com/termos e /privacidade), 02/11/2026.
   Pedido do João: "quero as políticas de privacidade e termos clicáveis, pode modelar do site deles" (Food Sistemas).
   Texto próprio da VCA, com a estrutura da referência: data no topo, selos, seções numeradas em tópicos e contato no fim.
   Cada seção: [título, [parágrafos], [itens da lista]] */
const CONTATO = "vcacompanyofficial@gmail.com";
export const EMAIL_CONTATO = CONTATO;

export const TERMOS = {
  slug: "termos",
  nome: "Termos de uso",
  titulo_seo: "Termos de uso",
  descricao: "Termos de uso dos sistemas, automações e serviços da VCA Company: contratação, pagamento, suporte, dados, integrações e cancelamento.",
  atualizado: "2026-11-02",
  selos: ["Contrato claro, sem taxa escondida", "Seus dados são seus", "Exportação dos dados quando pedir", "De acordo com a LGPD"],
  intro: "Estes termos explicam como funcionam os sistemas, as automações e os serviços da VCA Company (CNPJ 65.431.552/0001-08). Ao contratar ou usar um sistema da VCA, você concorda com o que está aqui. Quando houver contrato assinado, o que estiver no contrato vale sobre estes termos.",
  secoes: [
    ["1. O que a VCA oferece", [], [
      "Sistemas de gestão e CRM montados para o jeito de trabalhar de cada empresa.",
      "Automação de atendimento e vendas no WhatsApp, pela API oficial, com assistente de inteligência artificial.",
      "Automação de processos e integração com as ferramentas que a empresa já usa.",
      "Implantação, treinamento da equipe, hospedagem, manutenção e suporte.",
      "Sites e portais integrados ao sistema, quando fizerem parte da proposta.",
    ]],
    ["2. Contratação", [], [
      "Tudo começa com um diagnóstico gratuito, sem compromisso.",
      "Depois do diagnóstico, enviamos uma proposta com o escopo, os prazos e os valores.",
      "Com a proposta aceita, assinamos um contrato. Ele define o que será entregue, a forma de pagamento e as condições de cancelamento.",
    ]],
    ["3. Pagamento", [], [
      "Os valores, a forma de pagamento e as datas de vencimento ficam na proposta e no contrato.",
      "A cobrança é enviada por boleto, Pix ou cartão, pelo meio indicado.",
      "Não cobramos taxa que não esteja na proposta.",
      "Em caso de atraso, avisamos antes de qualquer suspensão do acesso, conforme o contrato.",
    ]],
    ["4. Suporte", [], [
      "Atendimento pelo WhatsApp e por e-mail, de segunda a sexta, das 9h às 18h.",
      "Treinamento da equipe na implantação e sempre que entrar uma função nova importante.",
      "Pedidos de mudança são avaliados com você. Os ajustes que fogem do escopo contratado são combinados antes de começar.",
    ]],
    ["5. Dados e privacidade", [], [
      "Os dados que a sua empresa coloca no sistema (clientes, contatos, agenda, financeiro) pertencem à sua empresa.",
      "Nesses dados, a VCA atua como operadora: trata as informações só para fazer o sistema funcionar e seguindo as suas instruções.",
      "Seguimos a Lei Geral de Proteção de Dados (Lei 13.709/2018). Os detalhes estão na Política de Privacidade.",
      "Ao fim do contrato, você pode pedir a exportação dos seus dados. Depois do prazo combinado, eles são apagados ou anonimizados, exceto o que a lei obrigar a guardar.",
    ]],
    ["6. Integrações com outras empresas", [], [
      "Alguns recursos dependem de serviços de terceiros, como WhatsApp (Meta), Google, meios de pagamento e provedores de inteligência artificial.",
      "Esses serviços têm regras e preços próprios. A Meta, por exemplo, cobra algumas conversas do WhatsApp oficial direto da empresa.",
      "A VCA não responde por mudanças, falhas ou bloqueios feitos por esses serviços, mas ajuda a resolver o que estiver ao nosso alcance.",
    ]],
    ["7. Uso correto do sistema", [], [
      "Mantenha os acessos da sua equipe atualizados e não compartilhe senhas.",
      "Use o sistema e o WhatsApp de acordo com a lei e com as políticas da Meta, sem envio de spam nem mensagens para quem pediu para não receber.",
      "Avise a VCA se perceber qualquer acesso estranho ou uso indevido.",
    ]],
    ["8. Atualizações", [], [
      "Os sistemas recebem melhorias e correções com frequência, sem custo extra dentro do que foi contratado.",
      "Manutenções que possam parar o sistema são feitas, sempre que possível, fora do horário comercial e com aviso.",
      "Se uma função usada pela sua empresa for retirada, avisamos com antecedência e mostramos a alternativa.",
    ]],
    ["9. Propriedade das telas e da marca", [], [
      "O código, as telas, os modelos e a marca VCA Company pertencem à VCA.",
      "As imagens de telas publicadas no site usam dados de exemplo e não podem ser reproduzidas sem autorização.",
      "A marca e o conteúdo da sua empresa continuam sendo da sua empresa.",
    ]],
    ["10. Cancelamento", [], [
      "As regras de cancelamento, aviso prévio e eventuais valores ficam no contrato.",
      "No cancelamento, entregamos a exportação dos seus dados em formato comum, como planilha.",
    ]],
    ["11. Responsabilidade", [], [
      "Trabalhamos para manter os sistemas no ar e os dados seguros, com cópias de segurança.",
      "A VCA não responde por perdas causadas por uso indevido, por senhas compartilhadas ou por falhas de serviços de terceiros.",
      "Resultados de vendas e atendimento dependem também da operação de cada empresa e não são garantidos.",
    ]],
    ["12. Mudanças nestes termos", [], [
      "Podemos atualizar estes termos. A data da última versão fica no topo desta página.",
      "Mudanças importantes são avisadas aos clientes antes de valer.",
    ]],
    ["13. Lei e foro", [], [
      "Estes termos seguem a lei brasileira.",
      "Fica eleito o foro da comarca da sede da VCA Company, salvo o que estiver diferente no contrato ou o que a lei garantir ao consumidor.",
    ]],
  ],
};

export const PRIVACIDADE = {
  slug: "privacidade",
  nome: "Política de Privacidade",
  titulo_seo: "Política de Privacidade",
  descricao: "Como a VCA Company coleta, usa, guarda e protege dados pessoais no site, no WhatsApp e nos sistemas, de acordo com a LGPD.",
  atualizado: "2026-11-02",
  selos: ["De acordo com a LGPD", "Não vendemos dados", "Sem cookies de publicidade", "Você pede a exclusão quando quiser"],
  intro: "Esta política explica como a VCA Company (CNPJ 65.431.552/0001-08) trata dados pessoais de quem visita o site, conversa com a gente, agenda um diagnóstico, é cliente ou revendedor, de acordo com a Lei Geral de Proteção de Dados (Lei 13.709/2018).",
  secoes: [
    ["1. Quem somos", [
      "A VCA Company desenvolve sistemas, CRM com inteligência artificial e automações para empresas de todo o Brasil. Para os dados de quem visita o site e fala com a gente, a VCA é a controladora. Para os dados que os nossos clientes colocam nos sistemas, a VCA é operadora e segue as instruções de cada cliente.",
    ], []],
    ["2. Dados que coletamos", [], [
      "Formulário de diagnóstico: nome, empresa, ramo, quantidade de clientes, WhatsApp, e-mail e o que mais atrapalha hoje (este campo é opcional).",
      "Conversas: o que você escreve para a VCA no WhatsApp ou por e-mail.",
      "Navegação no site: páginas vistas, de onde a visita veio e tipo de aparelho, por uma medição própria, sem cookies de publicidade.",
      "Clientes e revendedores: dados de cadastro, contrato e cobrança.",
      "Prospecção: dados públicos de empresas (nome, ramo, telefone e e-mail comerciais do cadastro de CNPJ) para um primeiro contato comercial.",
    ]],
    ["3. Para que usamos", [], [
      "Marcar e fazer o diagnóstico gratuito, com o convite da reunião.",
      "Responder mensagens e enviar propostas.",
      "Prestar o serviço contratado: implantação, suporte, cobrança e avisos sobre o sistema.",
      "Entender quais páginas do site ajudam mais as visitas e melhorar o conteúdo.",
      "Cumprir obrigações legais, fiscais e contábeis.",
    ]],
    ["4. Bases legais", [], [
      "Execução de contrato e procedimentos antes do contrato, quando você pede um diagnóstico ou uma proposta.",
      "Legítimo interesse, para medir o uso do site e para o primeiro contato comercial com empresas, sempre com a opção de pedir para não receber mais.",
      "Cumprimento de obrigação legal, para notas fiscais e registros contábeis.",
      "Consentimento, quando ele for pedido, e você pode retirar a qualquer momento.",
    ]],
    ["5. Atendimento com inteligência artificial", [
      "No WhatsApp, algumas mensagens são respondidas por um assistente de inteligência artificial da VCA, acompanhado pela nossa equipe. Para isso, o texto da conversa é processado por provedores de IA contratados, só para gerar a resposta. Se perguntar, dizemos com clareza quando é o assistente que está respondendo, e você pode pedir para falar com uma pessoa.",
    ], []],
    ["6. Com quem compartilhamos", [], [
      "Provedores de hospedagem, banco de dados e e-mail que mantêm o site e os sistemas funcionando.",
      "Google, para a agenda e o link da reunião, e Meta, para as conversas no WhatsApp.",
      "Provedores de inteligência artificial, para as respostas do assistente.",
      "Meio de pagamento, para emitir as cobranças dos clientes.",
      "Autoridades, quando a lei ou uma ordem judicial exigir.",
      "Não vendemos nem alugamos dados pessoais.",
    ]],
    ["7. Transferência para fora do Brasil", [
      "Alguns desses provedores guardam dados em servidores fora do Brasil. Nesses casos, escolhemos empresas com proteção adequada e cláusulas de proteção de dados, como pede a LGPD.",
    ], []],
    ["8. Segurança", [], [
      "Acesso aos dados só para quem precisa, com login e senha e controle por usuário.",
      "Conexão criptografada (HTTPS) e cópias de segurança.",
      "Chaves e senhas de integrações guardadas em cofre, fora do código.",
    ]],
    ["9. Por quanto tempo guardamos", [], [
      "Contatos e diagnósticos que não viraram contrato: até 2 anos depois do último contato, ou antes, se você pedir.",
      "Clientes: durante o contrato e depois pelo prazo que a lei exigir para registros fiscais e contratuais.",
      "Depois desses prazos, os dados são apagados ou anonimizados.",
    ]],
    ["10. Seus direitos", [
      "Pela LGPD, você pode pedir a qualquer momento:",
    ], [
      "Confirmação de que tratamos seus dados e acesso a eles.",
      "Correção de dados incompletos ou errados.",
      "Anonimização, bloqueio ou exclusão de dados desnecessários.",
      "Portabilidade para outro fornecedor.",
      "Informação sobre com quem compartilhamos.",
      "Revisão de decisões tomadas só de forma automática.",
      "Retirada do consentimento e oposição ao tratamento por legítimo interesse.",
    ]],
    ["11. Como pedir", [
      "Mande um e-mail para " + CONTATO + " ou uma mensagem no WhatsApp (12) 98201-4685 dizendo o que deseja. Respondemos em até 15 dias. Se preferir, você também pode procurar a Autoridade Nacional de Proteção de Dados (ANPD).",
    ], []],
    ["12. Cookies e armazenamento no navegador", [], [
      "O site não usa cookies de publicidade de terceiros.",
      "Guardamos no seu navegador só a preferência de tema (claro ou escuro), a página por onde a visita começou e um identificador anônimo da medição própria de visitas.",
      "As fontes do site são carregadas do Google Fonts.",
    ]],
    ["13. Mudanças nesta política", [], [
      "Esta política pode ser atualizada. A data da última versão fica no topo da página, e mudanças importantes são avisadas aos clientes.",
    ]],
  ],
};
