/* Página de revenda (www.vcacompany.com/revendedores), 02/11/2026. O João: "quero que seja tipo assim [a página de
   revenda da Food Sistemas], o meu ficou com muita informação, poluído". Versão enxuta: topo centralizado com 4 números,
   um parágrafo em destaque, como funciona (cartões do Método da página inicial), perguntas e a chamada final. Texto próprio da VCA, no dourado do logo.
   Comissão: 20% da mensalidade de cada cliente ativo, recorrente (02/11, o João: "programa de parceiros comerciais da VCA,
   com comissão recorrente, vai ser 20%"). Cada parceiro tem o seu painel no sistema da VCA. */
const WA = "https://wa.me/5512974030135?text=";
export const REVENDA = {
  slug: "revendedores",
  video: { src: "/videos/vca-partners.mp4?v=2", capa: "/videos/vca-partners-capa.webp?v=2", titulo: "Como funciona o VCA Partners", descricao: "Indique empresas para a VCA e receba 20% de comissão todos os meses enquanto seus clientes permanecerem ativos. Painel próprio, treinamento e sem metas por mês.", data: "2026-11-03", duracao: "PT54S" },
  titulo_seo: "Parceiros VCA: 20% de comissão recorrente",
  descricao: "Seja parceiro comercial da VCA: indique empresas e ganhe 20% da mensalidade de cada cliente ativo, todo mês. Cadastro grátis e painel próprio.",
  h1: ["Revenda sistemas com IA", "e ganhe 20% todo mês"],
  sub: "Programa de parceiros comerciais da VCA: 20% de comissão recorrente sobre cada cliente ativo, cadastro gratuito, painel próprio e suporte da VCA.",
  wa_quero: WA + encodeURIComponent("Olá! Vim pelo site e quero ser revendedor da VCA Company."),
  wa_duvida: WA + encodeURIComponent("Olá! Vim pelo site e tenho uma dúvida sobre a revenda da VCA Company."),
  numeros: [["20%", "Comissão recorrente"], ["Grátis", "Cadastro"], ["Painel", "Só seu"], ["100% online", "Brasil todo"]],
  destaque: "O programa de parceiros comerciais da VCA paga 20% da mensalidade de cada cliente ativo que você indicar, todo mês, enquanto ele continuar com a gente. Não é comissão de venda única. O cadastro é gratuito, não tem taxa de entrada nem meta mínima, e você não precisa programar: diagnóstico, implantação, treinamento e suporte ficam com a VCA. No seu painel de parceiro você acompanha as indicações, os clientes ativos e as comissões. Como o atendimento é 100% online, dá para indicar empresas de qualquer cidade do Brasil.",
  passos: [
    ["Fale com a gente", "Uma conversa rápida pelo WhatsApp para entender o seu perfil e liberar o seu painel."],
    ["Receba o treinamento", "Você aprende a apresentar os sistemas da VCA. Sem custo."],
    ["Indique o cliente", "Pelo seu painel ou pelo seu link. A VCA faz o diagnóstico e a demonstração, com você junto se quiser."],
    ["Receba 20% todo mês", "Cliente ativo, 20% de cada mensalidade paga vai para você. Enquanto ele continuar."],
  ],
  faq: [
    ["Quanto eu ganho por cliente?", "20% da mensalidade de cada cliente que você indicou, todo mês, enquanto ele estiver ativo. A comissão sai sobre cada mensalidade paga pelo cliente."],
    ["Preciso pagar para ser parceiro?", "Não. O cadastro e o treinamento não têm custo, e não existe meta mínima de vendas."],
    ["Preciso saber programar?", "Não. Você apresenta e indica. Diagnóstico, desenvolvimento, implantação e suporte ficam com a VCA."],
    ["Como acompanho minhas indicações e comissões?", "No seu painel de parceiro: as empresas que você indicou, em que etapa cada uma está, os clientes ativos e quanto você tem a receber no mês."],
    ["Quem dá suporte ao cliente que eu trouxer?", "A VCA. O cliente fala direto com a nossa equipe pelo WhatsApp, e você acompanha a conta dele pelo painel."],
    ["A comissão é por quanto tempo?", "Enquanto o cliente indicado continuar com a VCA: 20% de cada mensalidade paga, mês após mês."],
    ["Posso indicar empresas de qualquer cidade?", "Sim. O diagnóstico, a implantação e o treinamento são feitos online, para empresas de todo o Brasil."],
  ],
  final: { tit: "Comece a ganhar 20% todo mês", sub: "Cadastro gratuito, sem meta mínima e com um painel só seu para acompanhar as indicações e as comissões." },
};
