/* Página de revenda (www.vcacompany.com/revendedores), 02/11/2026. O João: "quero que seja tipo assim [a página de
   revenda da Food Sistemas], o meu ficou com muita informação, poluído". Versão enxuta: topo centralizado com 4 números,
   um parágrafo em destaque, como funciona (cartões do Método da página inicial), perguntas e a chamada final. Texto próprio da VCA, no dourado do logo.
   O percentual da comissão fica no contrato de revenda: nenhum número inventado aqui. */
const WA = "https://wa.me/5512974030135?text=";
export const REVENDA = {
  slug: "revendedores",
  titulo_seo: "Seja revendedor de sistemas e automação com IA",
  descricao: "Revenda os sistemas, o CRM com IA e as automações de WhatsApp da VCA Company e receba comissão todo mês enquanto o cliente estiver ativo. Cadastro grátis.",
  h1: ["Revenda sistemas com IA", "e ganhe todo mês"],
  sub: "Comissão recorrente, cadastro gratuito e suporte da VCA. CRM, WhatsApp com IA, agenda, financeiro e sistemas prontos para 6 nichos.",
  wa_quero: WA + encodeURIComponent("Olá! Vim pelo site e quero ser revendedor da VCA Company."),
  wa_duvida: WA + encodeURIComponent("Olá! Vim pelo site e tenho uma dúvida sobre a revenda da VCA Company."),
  numeros: [["Recorrente", "Comissão"], ["6 nichos", "Sistemas prontos"], ["Grátis", "Cadastro"], ["100% online", "Brasil todo"]],
  destaque: "O programa de revenda da VCA paga uma comissão sobre a mensalidade de cada cliente ativo, todo mês, enquanto ele continuar com a gente. O cadastro é gratuito, não tem taxa de entrada nem meta mínima, e você não precisa programar: diagnóstico, implantação, treinamento e suporte ficam com a VCA. Você apresenta e indica. Como o atendimento é 100% online, dá para revender de qualquer cidade do Brasil.",
  passos: [
    ["Fale com a gente", "Uma conversa rápida pelo WhatsApp para entender o seu perfil."],
    ["Receba o treinamento", "Você aprende a apresentar os sistemas. Sem custo."],
    ["Indique o cliente", "Você apresenta e a VCA faz o diagnóstico e a demonstração junto, se quiser."],
    ["Receba todo mês", "Cliente ativo, comissão na conta. Enquanto durar."],
  ],
  faq: [
    ["Quanto eu ganho por cliente?", "Você recebe um percentual da mensalidade de cada cliente que trouxe, todo mês, enquanto ele estiver ativo. O percentual fica no contrato de revenda e explicamos tudo na primeira conversa."],
    ["Preciso pagar para ser revendedor?", "Não. O cadastro e o treinamento não têm custo, e não existe meta mínima de vendas."],
    ["Preciso saber programar?", "Não. Você apresenta e indica. Diagnóstico, desenvolvimento, implantação e suporte ficam com a VCA."],
    ["Quem dá suporte ao cliente que eu trouxer?", "A VCA. O cliente fala direto com a nossa equipe pelo WhatsApp, e você acompanha como está a conta dele."],
    ["A comissão é por quanto tempo?", "Enquanto o cliente indicado continuar com a VCA, nas condições do contrato de revenda."],
    ["Posso revender em qualquer cidade?", "Sim. O diagnóstico, a implantação e o treinamento são feitos online, para empresas de todo o Brasil."],
  ],
  final: { tit: "Comece a revender sem custo", sub: "Cadastro gratuito, sem meta mínima e com comissão todo mês por cliente ativo." },
};
