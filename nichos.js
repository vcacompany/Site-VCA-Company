/* =====================================================================
   "Para qualquer negócio": a pessoa escolhe o nicho e vê o sistema VCA
   funcionando nele (conversa de exemplo + o que roda sozinho). O botão
   leva ao agendamento do diagnóstico já com o nicho escolhido.
   Conversas e nomes são fictícios.
   ===================================================================== */
(function () {
  var raiz = document.querySelector('[data-nx]');
  if (!raiz) return;

  var NICHOS = [
    { id: 'clinica', marca: 'Sua clínica', nome: 'Clínicas e consultórios', ic: 'stethoscope', sel: 'Clínica / consultório', em: 'na sua clínica',
      chat: [['c', 'Oi! Tem horário para limpeza essa semana?'],
             ['ia', 'Oi, Carla! Tenho quinta às 9h ou sexta às 14h30 com a Dra. Paula. Qual fica melhor?'],
             ['c', 'Sexta, 14h30.'],
             ['ia', 'Agendado. Te mando um lembrete na véspera e, se precisar remarcar, é só responder aqui.']],
      faz: [['message-circle', 'Atende e agenda no WhatsApp', 'A IA responde na hora, a qualquer hora, e marca direto na agenda de cada profissional.'],
            ['bell-ring', 'Lembrete antes da consulta', 'Confirmação automática na véspera para diminuir as faltas.'],
            ['clipboard-list', 'Paciente acompanhado', 'Histórico, retornos e pós-atendimento no mesmo painel.'],
            ['megaphone', 'Horários vagos preenchidos', 'Anúncios no Google e no Instagram com o resultado medido.']] },
    { id: 'estetica', marca: 'Seu espaço de estética', nome: 'Estética e beleza', ic: 'sparkles', sel: 'Estética / beleza', em: 'no seu espaço de estética',
      chat: [['c', 'Quanto tempo leva a limpeza de pele? Tem horário amanhã?'],
             ['ia', 'Oi, Bia! Leva cerca de 1 hora. Amanhã tenho 10h ou 15h. Quer que eu já reserve?'],
             ['c', 'Às 15h.'],
             ['ia', 'Reservado. Depois do atendimento eu te aviso quando for a hora da próxima sessão.']],
      faz: [['calendar-check', 'Agenda que se preenche', 'A IA tira dúvidas, passa os horários e reserva pelo WhatsApp.'],
            ['repeat', 'Pacotes e retornos', 'Controle das sessões e aviso quando é hora de voltar.'],
            ['star', 'Avaliações no Google', 'Pedido de avaliação automático depois de cada atendimento.'],
            ['heart-handshake', 'Cliente sumida volta', 'Campanhas para quem não aparece há um tempo.']] },
    { id: 'eventos', marca: 'Seu buffet', nome: 'Eventos e buffets', ic: 'party-popper', sel: 'Eventos / casa de festas', em: 'no seu espaço de eventos',
      chat: [['c', 'Vocês têm data livre em 14 de março para 120 pessoas?'],
             ['ia', 'Temos sim! Para 120 convidados indico o salão principal. Posso te mandar o orçamento e marcar uma visita no sábado?'],
             ['c', 'Pode mandar.'],
             ['ia', 'Enviado. A visita ficou para sábado às 10h e a data está pré-reservada por 48 horas.']],
      faz: [['file-text', 'Orçamento na hora', 'O pedido chega, o orçamento sai e o sistema acompanha até a resposta.'],
            ['calendar-days', 'Datas e visitas sem conflito', 'Pré-reservas e visitas no calendário, com lembrete para o cliente.'],
            ['wallet', 'Contrato e parcelas', 'Assinatura, parcelas e cobrança no automático.'],
            ['megaphone', 'Data livre vira anúncio', 'Campanhas para preencher os fins de semana vazios.']] },
    { id: 'contabilidade', marca: 'Seu escritório', nome: 'Contabilidade', ic: 'calculator', sel: 'Contabilidade', em: 'no seu escritório de contabilidade',
      chat: [['c', 'A guia do DAS desse mês já saiu?'],
             ['ia', 'Saiu sim, Marcos. Vence dia 20 e o PDF está aqui. Quer que eu te lembre dois dias antes?'],
             ['c', 'Quero.'],
             ['ia', 'Combinado. A sua certidão negativa vence no mês que vem e a renovação já está pedida.']],
      faz: [['folder-open', 'Painel para cada cliente', 'Guias, certidões e documentos organizados por empresa.'],
            ['bell-ring', 'Avisos de vencimento', 'O cliente recebe a guia e o lembrete sem ninguém precisar mandar.'],
            ['inbox', 'Documentos no lugar certo', 'O que chega por WhatsApp e e-mail vai para a pasta do cliente.'],
            ['trending-up', 'Novos clientes', 'Site e anúncios trazendo empresas da sua região.']] },
    { id: 'advocacia', marca: 'Seu escritório', nome: 'Advocacia', ic: 'scale', sel: 'Advocacia', em: 'no seu escritório de advocacia',
      chat: [['c', 'Teve alguma novidade no meu processo?'],
             ['ia', 'Teve, Paulo: foi marcada audiência para 12/11 às 14h. O Dr. Rafael explica os próximos passos. Quer marcar uma ligação com ele?'],
             ['c', 'Quero, amanhã de manhã.'],
             ['ia', 'Ligação marcada para amanhã às 10h. O lembrete chega por aqui.']],
      faz: [['briefcase', 'Processos e prazos no painel', 'Andamentos, audiências e prazos de cada cliente num lugar só.'],
            ['message-circle', 'Cliente informado sem ligar', 'A IA passa o andamento e marca a conversa com o advogado.'],
            ['list-checks', 'Triagem de casos novos', 'As perguntas certas antes da primeira consulta.'],
            ['shield-check', 'Marketing dentro da OAB', 'Presença no Google e conteúdo respeitando o Código de Ética.']] },
    { id: 'imobiliaria', marca: 'Sua imobiliária', nome: 'Imobiliárias', ic: 'house', sel: 'Imobiliária', em: 'na sua imobiliária',
      chat: [['c', 'O apartamento de 2 quartos no Indaiá ainda está disponível?'],
             ['ia', 'Está sim! São 68 m² com vaga coberta. Posso marcar uma visita amanhã às 10h ou às 16h?'],
             ['c', '16h.'],
             ['ia', 'Visita marcada com o corretor Lucas. Te mando a localização e um lembrete uma hora antes.']],
      faz: [['zap', 'Contato respondido na hora', 'Quem chega pelos portais e pelo Instagram é atendido em segundos.'],
            ['calendar-check', 'Visitas na agenda dos corretores', 'Sem conflito de horário e com lembrete para o cliente.'],
            ['kanban', 'Funil por imóvel', 'Quem visitou, quem fez proposta e quem precisa de retorno.'],
            ['repeat', 'Retorno no momento certo', 'Imóveis novos enviados para quem procura aquele perfil.']] },
    { id: 'loja', marca: 'Sua loja', nome: 'Lojas e comércio', ic: 'store', sel: 'Comércio / loja', em: 'na sua loja',
      chat: [['c', 'Tem esse tênis no 39? Vocês entregam?'],
             ['ia', 'Tem sim, no preto e no branco, e entregamos hoje na sua região. Quer o link para pagar por Pix?'],
             ['c', 'O preto, por favor.'],
             ['ia', 'Link enviado. Assim que o pagamento cair eu te aviso e o pedido já sai para entrega.']],
      faz: [['message-circle', 'Vende pelo WhatsApp', 'A IA responde estoque, preço e entrega e envia o link de pagamento.'],
            ['credit-card', 'Pagamento confirmado sozinho', 'Pix e cartão conferidos sem ninguém olhar o extrato.'],
            ['package', 'Pedido acompanhado', 'Separação e entrega com aviso para o cliente.'],
            ['rotate-ccw', 'Cliente que volta', 'Ofertas para quem já comprou, no tempo certo.']] },
    { id: 'fotografia', marca: 'Seu estúdio', nome: 'Fotografia e vídeo', ic: 'camera', sel: 'Serviços', em: 'no seu estúdio',
      chat: [['c', 'Quanto fica um ensaio de família em dezembro?'],
             ['ia', 'Oi, Ana! Temos três pacotes de ensaio de família. Te mando os valores e o portfólio e já vejo as datas livres?'],
             ['c', 'Pode mandar.'],
             ['ia', 'Enviado. Os dias 7 e 14 estão livres; ao reservar, o contrato e o sinal vão por aqui mesmo.']],
      faz: [['file-signature', 'Orçamento e contrato', 'Proposta, contrato e sinal sem troca infinita de mensagens.'],
            ['calendar-days', 'Agenda de ensaios', 'Datas, locais e lembretes para você e para o cliente.'],
            ['images', 'Entregas no prazo', 'Cada projeto com prazo e entrega acompanhados no painel.'],
            ['user-plus', 'Clientes pelo Instagram', 'Quem chega pelo direct é atendido e entra no funil.']] },
    { id: 'servicos', marca: 'Sua academia', nome: 'Academias e serviços', ic: 'dumbbell', sel: 'Serviços', em: 'no seu negócio',
      chat: [['c', 'Como funciona a aula experimental?'],
             ['ia', 'É gratuita e dura 50 minutos. Tenho amanhã às 7h ou às 19h. Reservo para você?'],
             ['c', 'Às 19h.'],
             ['ia', 'Reservado! Depois da aula eu te mando os planos para você começar ainda nesta semana.']],
      faz: [['calendar-check', 'Aula experimental agendada', 'A IA atende, tira dúvidas e reserva o horário.'],
            ['credit-card', 'Mensalidade recorrente', 'Cobrança automática no cartão ou no Pix, com aviso de atraso.'],
            ['user-x', 'Alerta de quem parou', 'Aviso sobre quem sumiu antes que cancele.'],
            ['trophy', 'Renovação de planos', 'Lembrete e oferta na hora de renovar.']] },
    { id: 'agencia', marca: 'Sua empresa', nome: 'Infoprodutos e agências', ic: 'rocket', sel: 'Infoproduto / agência', em: 'no seu negócio digital',
      chat: [['c', 'Quero saber mais sobre a mentoria.'],
             ['ia', 'Claro, Felipe! Para te indicar o melhor formato: você já vende online ou está começando?'],
             ['c', 'Já vendo, quero escalar.'],
             ['ia', 'Então a turma avançada combina com você. Marquei uma conversa com o time amanhã às 11h; o link chega por aqui.']],
      faz: [['list-checks', 'Lead qualificado', 'As perguntas certas antes da call: só chega quem tem perfil.'],
            ['calendar-check', 'Calls na agenda', 'O lead escolhe o horário e recebe o lembrete.'],
            ['credit-card', 'Checkout e recorrência', 'Pagamento, parcelas e acesso liberados no automático.'],
            ['bar-chart-3', 'Números de cada campanha', 'De onde vem cada venda, do anúncio ao pagamento.']] },
    { id: 'outro', marca: 'Sua empresa', nome: 'Outro negócio', ic: 'plus', sel: 'outro', em: 'no seu negócio',
      chat: [['c', 'Oi! Queria saber como funciona e quanto custa.'],
             ['ia', 'Oi! Te explico em poucas linhas e, se fizer sentido, já deixo um horário reservado. Qual dia fica bom para você?'],
             ['c', 'Amanhã à tarde.'],
             ['ia', 'Marcado para amanhã às 15h. A confirmação e o lembrete chegam por aqui.']],
      faz: [['message-circle', 'Atendimento no WhatsApp 24h', 'A IA responde, qualifica e agenda do jeito do seu negócio.'],
            ['kanban', 'Funil de vendas', 'Cada contato no lugar certo, do primeiro "oi" ao fechamento.'],
            ['wallet', 'Cobrança e financeiro', 'Pagamentos confirmados e lembretes no automático.'],
            ['bar-chart-3', 'Relatórios claros', 'Quanto entrou, de onde veio e o que fazer a seguir.']] }
  ];

  var lista = raiz.querySelector('.nx-nichos');
  var palco = raiz.querySelector('.nx-palco');
  var calmo = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var atual = null, rodada = 0, visto = false, outroTxt = '';

  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var icones = function () { if (window.lucide && window.lucide.createIcons) window.lucide.createIcons(); };

  lista.innerHTML = NICHOS.map(function (n, i) {
    return '<button type="button" class="nx-nicho" role="tab" id="nx-tab-' + n.id + '" aria-controls="nx-palco" aria-selected="' + (i === 0) + '" tabindex="' + (i === 0 ? 0 : -1) + '" data-id="' + n.id + '">' +
      '<span class="nx-nicho-ic"><i data-lucide="' + n.ic + '"></i></span><span>' + esc(n.nome) + '</span></button>';
  }).join('');

  var maiuscula = function (t) { return t.charAt(0).toUpperCase() + t.slice(1); };
  function marcaDe(n) { return n.id === 'outro' && outroTxt ? maiuscula(outroTxt) : n.marca; }
  function titulo(n) { return n.id === 'outro' ? (outroTxt ? maiuscula(outroTxt) : 'Seu negócio') : n.nome; }

  function desenhar(n) {
    var minha = ++rodada;
    atual = n;
    var cab = '<div class="nx-cab"><span class="nx-cab-ic"><i data-lucide="' + n.ic + '"></i></span>' +
      '<div class="nx-cab-txt"><small>Como fica ' + esc(n.em) + '</small><b class="nx-titulo">' + esc(titulo(n)) + '</b></div>' +
      '<span class="nx-tag">conversa de exemplo</span></div>';
    var outro = n.id === 'outro'
      ? '<label class="nx-outro"><span>Qual é o seu negócio?</span><input type="text" maxlength="60" placeholder="Ex.: pet shop, escola de idiomas, oficina" value="' + esc(outroTxt) + '"></label>' : '';
    var faz = '<ul class="nx-faz">' + n.faz.map(function (f) {
      return '<li><span class="nx-faz-ic"><i data-lucide="' + f[0] + '"></i></span><div><b>' + esc(f[1]) + '</b><p>' + esc(f[2]) + '</p></div></li>';
    }).join('') + '</ul>';
    palco.innerHTML = cab + outro +
      '<div class="nx-grade">' +
        '<div class="nx-chat" aria-label="Conversa de exemplo no WhatsApp">' +
          '<div class="nx-chat-cab"><span class="nx-av"><i data-lucide="' + n.ic + '"></i></span><div><b>' + esc(marcaDe(n)) + '</b><small><i></i>online · atendido pela IA</small></div></div>' +
          '<div class="nx-msgs"></div>' +
        '</div>' +
        '<div class="nx-lado"><p class="nx-lado-tit">O que roda sozinho</p>' + faz + '</div>' +
      '</div>' +
      '<div class="nx-pe"><p>Quer ver isso montado ' + esc(n.em) + '? No diagnóstico gratuito (30 minutos, por Google Meet) mostramos o que dá para automatizar.</p>' +
        '<a href="#agendar" class="btn btn-primary nx-cta">Agendar diagnóstico gratuito</a></div>';
    palco.setAttribute('aria-labelledby', 'nx-tab-' + n.id);
    palco.classList.remove('nx-troca'); void palco.offsetWidth; if (!calmo) palco.classList.add('nx-troca');
    icones();

    var campo = palco.querySelector('.nx-outro input');
    if (campo) campo.addEventListener('input', function () {
      outroTxt = campo.value.trim();
      palco.querySelector('.nx-titulo').textContent = titulo(n);
      palco.querySelector('.nx-chat-cab b').textContent = marcaDe(n);
    });
    if (visto) conversar(n, minha);
  }

  // as mensagens chegam uma a uma; a IA "digita" antes de responder
  function conversar(n, minha) {
    var caixa = palco.querySelector('.nx-msgs');
    if (!caixa) return;
    caixa.innerHTML = '';
    var bolha = function (m) {
      var el = document.createElement('div');
      el.className = 'nx-b ' + (m[0] === 'ia' ? 'ia' : 'c');
      el.innerHTML = (m[0] === 'ia' ? '<em>IA</em>' : '') + esc(m[1]);
      caixa.appendChild(el);
    };
    if (calmo) { n.chat.forEach(bolha); return; }
    var i = 0;
    var proxima = function () {
      if (minha !== rodada || i >= n.chat.length) return;
      var m = n.chat[i++];
      if (m[0] === 'ia') {
        var dig = document.createElement('div');
        dig.className = 'nx-digitando'; dig.setAttribute('aria-hidden', 'true'); dig.innerHTML = '<i></i><i></i><i></i>';
        caixa.appendChild(dig);
        setTimeout(function () { if (minha !== rodada) return; dig.remove(); bolha(m); setTimeout(proxima, 700); }, 1100);
      } else { bolha(m); setTimeout(proxima, 650); }
    };
    setTimeout(proxima, 350);
  }

  function escolher(id, foco) {
    var n = NICHOS.filter(function (x) { return x.id === id; })[0];
    if (!n || n === atual) return;
    lista.querySelectorAll('.nx-nicho').forEach(function (b) {
      var on = b.getAttribute('data-id') === id;
      b.setAttribute('aria-selected', on); b.tabIndex = on ? 0 : -1;
      if (on && foco) b.focus();
      if (on && lista.scrollWidth > lista.clientWidth) b.scrollIntoView({ block: 'nearest', inline: 'center', behavior: calmo ? 'auto' : 'smooth' });
    });
    desenhar(n);
  }

  lista.addEventListener('click', function (e) { var b = e.target.closest('.nx-nicho'); if (b) escolher(b.getAttribute('data-id')); });
  lista.addEventListener('keydown', function (e) {
    var tabs = Array.prototype.slice.call(lista.querySelectorAll('.nx-nicho'));
    var i = tabs.indexOf(document.activeElement); if (i < 0) return;
    var j = { ArrowDown: i + 1, ArrowRight: i + 1, ArrowUp: i - 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 }[e.key];
    if (j === undefined) return;
    e.preventDefault();
    j = (j + tabs.length) % tabs.length;
    escolher(tabs[j].getAttribute('data-id'), true);
  });

  // o botão leva ao agendamento com o nicho já escolhido no formulário
  palco.addEventListener('click', function (e) {
    if (!e.target.closest('.nx-cta') || !atual) return;
    var form = document.querySelector('#agenda form');
    var sel = form && form.querySelector('[name="nicho_sel"]');
    if (!sel) return;
    sel.value = atual.sel;
    sel.dispatchEvent(new Event('change', { bubbles: true }));
    var outro = form.querySelector('[name="nicho_outro"]');
    if (atual.id === 'outro' && outro && outroTxt) outro.value = outroTxt;
    setTimeout(function () { var nome = form.querySelector('[name="nome"]'); if (nome) nome.focus({ preventScroll: true }); }, 700);
  });

  desenhar(NICHOS[0]);
  if ('IntersectionObserver' in window) {
    var olho = new IntersectionObserver(function (entradas) {
      if (entradas.some(function (x) { return x.isIntersecting; })) { visto = true; olho.disconnect(); conversar(atual, rodada); }
    }, { threshold: 0.35 });
    olho.observe(palco);
  } else { visto = true; conversar(atual, rodada); }
})();
