/* Página de revenda (www.vcacompany.com/revendedores), 02/11/2026: pedido do João, "quero uma página assim no meu site"
   (modelo: a página de revenda da Food Sistemas). Texto próprio da VCA; a estrutura segue a referência:
   topo com números, como funciona, o que se revende, telas, perguntas e chamada final.
   As condições (percentual da comissão) ficam no contrato de revenda: nada de número inventado aqui. */
const WA = "https://wa.me/5512982014685?text=";
export const REVENDA = {
  slug: "revendedores",
  titulo_seo: "Seja revendedor de sistemas e automação com IA",
  descricao: "Revenda os sistemas, o CRM com IA e as automações de WhatsApp da VCA Company e receba comissão todo mês enquanto o cliente estiver ativo. Cadastro sem custo.",
  h1: "Revenda sistemas, automação e IA para empresas",
  sub: "Você apresenta a VCA para empresas da sua rede. A VCA faz o diagnóstico, monta o sistema, implanta, treina a equipe e dá o suporte. Você recebe comissão todo mês enquanto o cliente continuar com a gente.",
  wa_quero: WA + encodeURIComponent("Olá! Vim pelo site e quero ser revendedor da VCA Company."),
  wa_duvida: WA + encodeURIComponent("Olá! Vim pelo site e tenho uma dúvida sobre a revenda da VCA Company."),
  numeros: [
    ["Todo mês", "comissão recorrente por cliente ativo"],
    ["R$ 0", "para se cadastrar"],
    ["Sem meta", "mínima de vendas"],
    ["Brasil todo", "atendimento 100% online"],
  ],
  texto: [
    "A comissão não é de uma venda só. Enquanto a empresa que você trouxe continuar usando o sistema, você recebe a sua parte da mensalidade, todo mês. Quanto mais clientes ativos na sua carteira, maior a sua renda recorrente.",
    "Você não precisa programar, não paga para entrar e não tem meta para cumprir. A parte técnica fica com a VCA: diagnóstico, desenvolvimento, implantação, treinamento e suporte. Como todo o atendimento é online, você pode revender de qualquer cidade do Brasil.",
  ],
  perfis: [
    ["Agências de marketing", "Seus clientes já pedem atendimento mais rápido no WhatsApp e um lugar para acompanhar os contatos que os anúncios trazem."],
    ["Contadores e consultores", "Você conhece a rotina das empresas por dentro e sabe onde o trabalho manual pesa."],
    ["Profissionais de TI", "Indique sistema e automação sem precisar desenvolver nem manter nada."],
    ["Representantes comerciais", "Some uma renda recorrente à carteira que você já visita."],
  ],
  passos: [
    ["Conversa com a VCA", "Você fala com a gente pelo WhatsApp, entende o programa e assina o contrato de revenda, sem custo."],
    ["Treinamento", "Mostramos os sistemas funcionando, o que cada nicho mais usa e como apresentar a VCA para os seus contatos."],
    ["Indicação", "Você apresenta a empresa e a VCA faz o diagnóstico gratuito, a proposta e a implantação, com você acompanhando."],
    ["Comissão todo mês", "Cliente fechado, a sua comissão entra todo mês enquanto ele continuar ativo."],
  ],
  oferta: [
    "CRM com funil de vendas",
    "Atendimento no WhatsApp pela API oficial",
    "IA que responde, qualifica e marca reunião",
    "Agenda com lembretes automáticos",
    "Financeiro, cobranças e contratos",
    "Portal do cliente com a marca da empresa",
    "Relatórios e painéis de resultado",
    "Automação de processos e tarefas",
    "Integração com Google Drive, Gmail e Agenda",
    "Aplicativo no celular",
    "Site integrado ao sistema",
    "Sistemas prontos para 6 nichos",
  ],
  telas: [
    ["/blog/img/automacao-para-empresas-caraguatatuba-litoral-norte/painel.webp", "Painel inicial do sistema com faturamento, contatos recebidos, consultas agendadas e sugestões da IA", "Painel", "Tudo da empresa em uma tela", "Faturamento, contatos, agenda e o que a IA sugere fazer hoje."],
    ["/blog/img/automacao-whatsapp-para-empresas/crm-whatsapp-ia.webp", "CRM com as conversas do WhatsApp e a IA atendendo os contatos", "WhatsApp e IA", "Atendimento que não para", "A IA responde, qualifica e leva o contato para o funil."],
    ["/blog/img/crm-para-clinicas/agenda.webp", "Agenda do sistema com os horários marcados da semana", "Agenda", "Horários organizados", "Agendamentos com lembrete automático e confirmação."],
    ["/blog/img/sistema-para-escritorio-de-contabilidade/portal-do-cliente.webp", "Portal do cliente com impostos do período, faturamento e carga tributária da empresa", "Portal do cliente", "A marca da empresa na frente", "Um portal para os clientes de quem contrata acompanharem tudo."],
  ],
  faq: [
    ["Quanto eu ganho por cliente?", "Você recebe um percentual da mensalidade de cada cliente que trouxe, todo mês, enquanto ele estiver ativo. O percentual fica no contrato de revenda e explicamos tudo na primeira conversa."],
    ["Preciso pagar alguma coisa para ser revendedor?", "Não. O cadastro e o treinamento não têm custo, e não existe meta mínima de vendas."],
    ["Preciso saber programar?", "Não. Você apresenta e indica. Diagnóstico, desenvolvimento, implantação e suporte ficam com a VCA."],
    ["Quem dá o suporte para o cliente?", "A VCA. O cliente fala direto com a nossa equipe pelo WhatsApp, e você acompanha como está a conta dele."],
    ["Por quanto tempo recebo a comissão?", "Enquanto o cliente indicado continuar com a VCA, nas condições do contrato de revenda."],
    ["Posso revender em qualquer cidade?", "Sim. O diagnóstico, a implantação e o treinamento são feitos online, para empresas de todo o Brasil."],
  ],
};
