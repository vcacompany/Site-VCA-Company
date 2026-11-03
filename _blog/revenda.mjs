/* Página de revenda (www.vcacompany.com/revendedores), 02/11/2026. O João: "quero que seja tipo assim [a página de
   revenda da Food Sistemas], o meu ficou com muita informação, poluído". Versão enxuta: topo centralizado com 4 números,
   um parágrafo em destaque, quem faz o quê, como funciona (cartões do Método da página inicial), perguntas e a chamada final.
   Texto próprio da VCA, no dourado do logo.
   Comissão: 20% da mensalidade de cada cliente ativo, recorrente (02/11, o João: "programa de parceiros comerciais da VCA,
   com comissão recorrente, vai ser 20%"). Cada parceiro tem o seu painel no sistema da VCA.
   03/11: NÃO é programa de indicação. O João, depois da conversa com um interessado: "não é só indicar, você tem que
   fechar, deixar tudo explicadinho". O parceiro faz prospecção, qualificação, reunião comercial e negociação até o
   fechamento (palavras do João ao interessado); a VCA faz desenvolvimento, implantação, treinamento e suporte. Tudo em
   contrato, com regra de transição se o parceiro sair (o prazo fica no contrato, não na página). */
const WA = "https://wa.me/5512974030135?text=";
export const REVENDA = {
  slug: "revendedores",
  video: { src: "/videos/vca-partners.mp4?v=4", capa: "/videos/vca-partners-capa.webp?v=3", titulo: "Como funciona o VCA Partners", descricao: "Como funciona o programa de parceiros comerciais da VCA: 20% de comissão todos os meses sobre os clientes que você fecha, enquanto eles permanecerem ativos. Painel próprio, treinamento e sem metas por mês.", data: "2026-11-03", duracao: "PT50S" },
  titulo_seo: "Parceiros VCA: 20% de comissão recorrente",
  descricao: "Seja parceiro comercial da VCA: prospecte e feche empresas e ganhe 20% da mensalidade de cada cliente ativo, todo mês. Cadastro grátis, contrato e painel próprio.",
  h1: ["Venda sistemas com IA", "e ganhe 20% todo mês"],
  sub: "Programa de parceiros comerciais da VCA: você prospecta, apresenta e fecha a venda; a VCA desenvolve, implanta e atende o cliente. Você recebe 20% de cada mensalidade, todo mês, enquanto o cliente estiver ativo.",
  wa_quero: WA + encodeURIComponent("Olá! Vim pelo site e quero ser revendedor da VCA Company."),
  wa_duvida: WA + encodeURIComponent("Olá! Vim pelo site e tenho uma dúvida sobre a revenda da VCA Company."),
  numeros: [["20%", "Comissão recorrente"], ["Você", "Prospecta e fecha"], ["Contrato", "Regras claras"], ["Painel", "Só seu"]],
  destaque: "O VCA Partners não é um programa de indicação. O parceiro é o comercial da venda: encontra as empresas, entende o que cada uma precisa, faz a reunião comercial e conduz a negociação até o contrato fechado. Depois do fechamento, a VCA assume a parte técnica: desenvolvimento, implantação, treinamento da equipe do cliente e suporte. Você recebe 20% de cada mensalidade paga pelos clientes que fechou, todo mês, enquanto eles continuarem ativos e com os pagamentos em dia. A comissão, os pagamentos e as responsabilidades de cada lado ficam em contrato. O cadastro é gratuito, sem taxa de entrada nem meta mínima, e no seu painel você acompanha as negociações, os clientes ativos e as comissões.",
  // quem faz o quê: o que fica com o parceiro e o que fica com a VCA
  papeis: {
    olho: "Quem faz o quê",
    titulo: ["Você vende, ", "a VCA entrega"],
    sub: "Não é só indicar: a comissão é dos clientes que você mesmo prospecta e fecha.",
    voce: { rotulo: "Parceiro", tit: "O que fica com você", itens: [
      ["Prospecção", "encontrar as empresas e abrir a conversa."],
      ["Qualificação", "entender o que cada empresa precisa."],
      ["Reunião comercial", "apresentar a VCA e os sistemas para o cliente."],
      ["Negociação", "conduzir a proposta até o contrato fechado."],
      ["Acompanhamento", "registrar cada empresa no seu painel e seguir o andamento."],
    ] },
    vca: { rotulo: "VCA", tit: "O que fica com a VCA", itens: [
      ["Treinamento", "você aprende o que a VCA faz e como apresentar os sistemas."],
      ["Desenvolvimento", "o sistema, as automações e a IA de cada cliente."],
      ["Implantação", "configuração e treinamento da equipe do cliente."],
      ["Suporte", "atendimento ao cliente pelo WhatsApp depois do fechamento."],
      ["Comissão", "20% de cada mensalidade paga, todo mês, acompanhada no seu painel."],
    ] },
  },
  passos: [
    ["Fale com a gente", "Uma conversa pelo WhatsApp para entender o seu perfil. Se fizer sentido para os dois lados, formalizamos a parceria em contrato e liberamos o seu painel."],
    ["Receba o treinamento", "Você aprende o que a VCA faz e como apresentar os sistemas para cada tipo de empresa. Sem custo."],
    ["Prospecte e feche", "Você encontra as empresas, qualifica, faz a reunião comercial e negocia até o contrato assinado. Cada empresa fica registrada no seu painel."],
    ["Receba 20% todo mês", "A VCA implanta e atende o cliente. Você recebe 20% de cada mensalidade paga, enquanto ele continuar ativo."],
  ],
  faq: [
    ["É só indicar?", "Não. O parceiro faz a parte comercial completa: prospecção, qualificação, reunião comercial e negociação até o fechamento do contrato. A comissão é sobre os clientes que você fecha."],
    ["Quanto eu ganho por cliente?", "20% da mensalidade de cada cliente que você fechou, todo mês, enquanto ele estiver ativo e com os pagamentos em dia."],
    ["Existe contrato?", "Sim. A parceria é formalizada em contrato, com a comissão, os pagamentos e as responsabilidades de cada lado."],
    ["Preciso pagar para ser parceiro?", "Não. O cadastro e o treinamento não têm custo, e não existe meta mínima de vendas."],
    ["Preciso saber programar?", "Não. Você cuida da venda. Desenvolvimento, implantação, treinamento do cliente e suporte ficam com a VCA."],
    ["Quem atende o cliente depois do fechamento?", "A VCA: implantação, treinamento da equipe e suporte pelo WhatsApp. Você acompanha a conta pelo seu painel."],
    ["Como acompanho minhas negociações e comissões?", "No seu painel de parceiro: as empresas que você está negociando, em que etapa cada uma está, os clientes ativos e quanto você tem a receber no mês."],
    ["E se eu sair da parceria?", "O contrato prevê uma regra de transição: você continua recebendo a comissão dos clientes que fechou por um período depois da saída, e a VCA segue com os projetos e o atendimento deles. O prazo fica definido no contrato."],
    ["Posso vender para empresas de qualquer cidade?", "Sim. A implantação, o treinamento e o suporte são feitos online, para empresas de todo o Brasil."],
  ],
  final: { tit: "Comece a ganhar 20% todo mês", sub: "Cadastro gratuito, sem meta mínima, parceria em contrato e um painel só seu para acompanhar negociações, clientes e comissões." },
};
