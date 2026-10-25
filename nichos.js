/* =====================================================================
   "Para qualquer negócio": a pessoa escolhe o nicho e lê como o sistema
   VCA funciona nele (o caminho do cliente em 4 passos) e com quais
   ferramentas ele se conecta. O botão leva ao agendamento do diagnóstico
   já com o nicho escolhido no formulário.
   ===================================================================== */
(function () {
  var raiz = document.querySelector('[data-nx]');
  if (!raiz) return;

  // ferramentas que o sistema conecta
  var CONEXOES = {
    whatsapp:   ['message-circle', 'WhatsApp', 'Atendimento, lembretes e avisos saindo do número da empresa.'],
    meta:       ['megaphone', 'Instagram e Facebook', 'Anúncios do Meta com o resultado no painel e publicação de conteúdo.'],
    googleads:  ['search', 'Google Ads e Analytics', 'De onde vem cada cliente e quanto custou cada um.'],
    agenda:     ['calendar', 'Google Agenda', 'Compromissos sincronizados com a agenda de cada pessoa da equipe.'],
    meet:       ['video', 'Google Meet', 'Reunião criada com o link na hora em que é marcada.'],
    gmail:      ['mail', 'Gmail', 'E-mails, guias e documentos enviados com a conta da empresa.'],
    drive:      ['folder', 'Google Drive', 'Arquivos e documentos organizados na pasta de cada cliente.'],
    planilhas:  ['sheet', 'Planilhas Google', 'Importa e exporta dados quando você precisar.'],
    pagamentos: ['credit-card', 'Pix, boleto e cartão', 'Cobranças com baixa automática quando o cliente paga.'],
    site:       ['globe', 'Site e formulários', 'Quem preenche o formulário entra direto no funil.']
  };
  var TODAS = Object.keys(CONEXOES);

  var NICHOS = [
    { id: 'clinica', nome: 'Clínicas e consultórios', ic: 'stethoscope', sel: 'Clínica / consultório', em: 'na sua clínica',
      passos: [['user-plus', 'O paciente chega', 'Google, Instagram, site ou indicação: todo contato entra no painel com a origem marcada.'],
               ['calendar-check', 'Consulta agendada', 'Marcada direto na agenda de cada profissional, sincronizada com o Google Agenda.'],
               ['bell-ring', 'Lembrete e acompanhamento', 'Confirmação na véspera, histórico do paciente e retornos no mesmo lugar.'],
               ['wallet', 'Pagamento e números', 'Pix, cartão ou boleto com baixa automática, e relatório de faturamento, faltas e retornos.']],
      usa: ['whatsapp', 'agenda', 'pagamentos', 'meta'] },
    { id: 'estetica', nome: 'Estética e beleza', ic: 'sparkles', sel: 'Estética / beleza', em: 'no seu espaço de estética',
      passos: [['user-plus', 'A cliente chega', 'Instagram, Google e indicação caem no mesmo funil, sem perder ninguém.'],
               ['calendar-check', 'Horário reservado', 'Agenda por profissional e por sala, com lembrete antes do atendimento.'],
               ['repeat', 'Pacotes e sessões', 'Controle do que já foi usado e aviso quando é hora de voltar.'],
               ['star', 'Pagamento e avaliação', 'Cobrança automática e pedido de avaliação no Google depois do atendimento.']],
      usa: ['meta', 'whatsapp', 'agenda', 'pagamentos'] },
    { id: 'eventos', nome: 'Eventos e buffets', ic: 'party-popper', sel: 'Eventos / casa de festas', em: 'no seu espaço de eventos',
      passos: [['user-plus', 'O pedido chega', 'Site, Instagram e WhatsApp viram oportunidades com data e número de convidados.'],
               ['file-text', 'Orçamento e visita', 'Orçamento enviado na hora e visita marcada sem conflito de datas.'],
               ['file-check', 'Contrato e parcelas', 'Contrato, sinal e parcelas com lembrete de pagamento automático.'],
               ['bar-chart-3', 'Datas e resultados', 'Calendário de eventos, datas livres para anunciar e quanto cada canal trouxe.']],
      usa: ['whatsapp', 'pagamentos', 'agenda', 'meta'] },
    { id: 'contabilidade', nome: 'Contabilidade', ic: 'calculator', sel: 'Contabilidade', em: 'no seu escritório de contabilidade',
      passos: [['folder-open', 'Um painel por cliente', 'Empresas, obrigações e documentos organizados por cliente.'],
               ['bell-ring', 'Guias e vencimentos', 'Guias e avisos de vencimento enviados por e-mail e WhatsApp no automático.'],
               ['shield-check', 'Certidões em dia', 'Validade de cada certidão acompanhada, com alerta antes de vencer.'],
               ['inbox', 'Documentos recebidos', 'O que o cliente manda vai para a pasta certa no Google Drive.']],
      usa: ['gmail', 'drive', 'whatsapp', 'planilhas'] },
    { id: 'advocacia', nome: 'Advocacia', ic: 'scale', sel: 'Advocacia', em: 'no seu escritório de advocacia',
      passos: [['user-plus', 'O caso chega', 'Contato do site, do Google e de indicação, com triagem antes da primeira consulta.'],
               ['briefcase', 'Processos e prazos', 'Andamentos, audiências e prazos de cada cliente num painel só.'],
               ['message-circle', 'Cliente informado', 'Atualizações por e-mail e WhatsApp sem o cliente precisar ligar.'],
               ['wallet', 'Honorários', 'Parcelas e cobranças com baixa automática e o relatório do escritório.']],
      usa: ['gmail', 'agenda', 'drive', 'whatsapp'] },
    { id: 'imobiliaria', nome: 'Imobiliárias', ic: 'house', sel: 'Imobiliária', em: 'na sua imobiliária',
      passos: [['zap', 'O contato chega', 'Site, Instagram, anúncios e WhatsApp entram no funil na hora, com o imóvel de interesse.'],
               ['calendar-check', 'Visita marcada', 'Agenda dos corretores sem conflito, com lembrete para o cliente.'],
               ['kanban', 'Proposta e negociação', 'Funil por imóvel: quem visitou, quem fez proposta e quem precisa de retorno.'],
               ['bar-chart-3', 'Resultados', 'De onde vem cada cliente e quanto cada corretor fechou.']],
      usa: ['whatsapp', 'meta', 'agenda', 'googleads'] },
    { id: 'loja', nome: 'Lojas e comércio', ic: 'store', sel: 'Comércio / loja', em: 'na sua loja',
      passos: [['user-plus', 'O cliente chega', 'Instagram, Google e anúncios trazem o cliente para o atendimento da loja.'],
               ['shopping-bag', 'Venda e pagamento', 'Link de pagamento por Pix ou cartão, com confirmação automática.'],
               ['package', 'Pedido acompanhado', 'Separação e entrega com aviso para o cliente em cada etapa.'],
               ['rotate-ccw', 'Cliente que volta', 'Lista de clientes e ofertas para quem já comprou, no tempo certo.']],
      usa: ['pagamentos', 'whatsapp', 'meta', 'planilhas'] },
    { id: 'fotografia', nome: 'Fotografia e vídeo', ic: 'camera', sel: 'Serviços', em: 'no seu estúdio',
      passos: [['user-plus', 'O cliente chega', 'Instagram, site e indicação viram orçamentos no funil.'],
               ['file-check', 'Proposta e contrato', 'Pacotes, contrato e sinal enviados sem troca infinita de mensagens.'],
               ['calendar-days', 'Ensaios na agenda', 'Datas, locais e lembretes para você e para o cliente.'],
               ['images', 'Entrega no prazo', 'Cada projeto com prazo acompanhado e os arquivos no Google Drive.']],
      usa: ['meta', 'pagamentos', 'agenda', 'drive'] },
    { id: 'servicos', nome: 'Academias e serviços', ic: 'dumbbell', sel: 'Serviços', em: 'no seu negócio',
      passos: [['user-plus', 'O aluno chega', 'Instagram, Google e indicação, com a aula experimental já agendada.'],
               ['credit-card', 'Plano e mensalidade', 'Cobrança recorrente no cartão ou no Pix, com aviso de atraso.'],
               ['user-x', 'Quem parou de vir', 'Alerta sobre quem sumiu antes que cancele.'],
               ['bar-chart-3', 'Números do mês', 'Alunos ativos, renovações e faturamento sempre atualizados.']],
      usa: ['pagamentos', 'whatsapp', 'meta', 'agenda'] },
    { id: 'agencia', nome: 'Infoprodutos e agências', ic: 'rocket', sel: 'Infoproduto / agência', em: 'no seu negócio digital',
      passos: [['user-plus', 'O lead chega', 'Anúncios, site e redes sociais, com a origem de cada contato registrada.'],
               ['list-checks', 'Qualificação e call', 'As perguntas certas antes da call e o horário marcado com link do Meet.'],
               ['credit-card', 'Venda e acesso', 'Checkout, parcelas e recorrência com confirmação automática.'],
               ['bar-chart-3', 'Retorno de cada campanha', 'Do anúncio ao pagamento: quanto cada campanha trouxe.']],
      usa: ['meta', 'googleads', 'pagamentos', 'meet'] },
    { id: 'outro', nome: 'Outro negócio', ic: 'plus', sel: 'outro', em: 'no seu negócio',
      passos: [['user-plus', 'O cliente chega', 'De qualquer canal (site, redes, anúncios ou WhatsApp), com a origem marcada.'],
               ['kanban', 'Atendimento e funil', 'Cada contato no lugar certo, do primeiro contato ao fechamento.'],
               ['calendar-check', 'Agenda e tarefas', 'Compromissos, lembretes e tarefas da equipe no mesmo painel.'],
               ['wallet', 'Cobrança e relatórios', 'Pagamentos confirmados no automático e relatórios claros do mês.']],
      usa: ['whatsapp', 'agenda', 'pagamentos', 'gmail'] }
  ];

  var lista = raiz.querySelector('.nx-nichos');
  var palco = raiz.querySelector('.nx-palco');
  var calmo = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var atual = null, vista = 'como', outroTxt = '';

  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var icones = function () { if (window.lucide && window.lucide.createIcons) window.lucide.createIcons(); };
  var maiuscula = function (t) { return t.charAt(0).toUpperCase() + t.slice(1); };
  var titulo = function (n) { return n.id === 'outro' ? (outroTxt ? maiuscula(outroTxt) : 'Seu negócio') : n.nome; };

  lista.innerHTML = NICHOS.map(function (n, i) {
    return '<button type="button" class="nx-nicho" role="tab" id="nx-tab-' + n.id + '" aria-controls="nx-palco" aria-selected="' + (i === 0) + '" tabindex="' + (i === 0 ? 0 : -1) + '" data-id="' + n.id + '">' +
      '<span class="nx-nicho-ic"><i data-lucide="' + n.ic + '"></i></span><span>' + esc(n.nome) + '</span></button>';
  }).join('');

  function conteudo(n) {
    if (vista === 'conexoes') {
      var ordem = n.usa.concat(TODAS.filter(function (k) { return n.usa.indexOf(k) < 0; }));
      return '<p class="nx-intro">O sistema conversa com as ferramentas que você já usa. O que acontece nelas aparece no painel, sem copiar e colar.</p>' +
        '<ul class="nx-con">' + ordem.map(function (k) {
          var c = CONEXOES[k], destaque = n.usa.indexOf(k) >= 0;
          return '<li class="' + (destaque ? 'destaque' : '') + '"><span class="nx-con-ic"><i data-lucide="' + c[0] + '"></i></span><div><b>' + esc(c[1]) + '</b>' +
            (destaque ? '<em>muito usada ' + esc(n.em) + '</em>' : '') + '<p>' + esc(c[2]) + '</p></div></li>';
        }).join('') +
        '<li class="nx-con-mais"><span class="nx-con-ic"><i data-lucide="plug"></i></span><div><b>E o que você já usa</b><p>Se a sua ferramenta tem integração, a gente conecta ao seu sistema.</p></div></li>' +
        '</ul>';
    }
    return '<p class="nx-intro">O caminho do cliente, do primeiro contato ao pagamento, num painel com a marca da sua empresa.</p>' +
      '<ol class="nx-passos">' + n.passos.map(function (p, i) {
        return '<li><div class="nx-passo-cab"><span class="nx-passo-ic"><i data-lucide="' + p[0] + '"></i></span><span class="nx-passo-n">' + String(i + 1).padStart(2, '0') + '</span></div>' +
          '<b>' + esc(p[1]) + '</b><p>' + esc(p[2]) + '</p></li>';
      }).join('') + '</ol>';
  }

  function desenhar(n, animar) {
    atual = n;
    var abas = [['como', 'Como funciona'], ['conexoes', 'Conexões']];
    palco.innerHTML =
      '<div class="nx-cab"><span class="nx-cab-ic"><i data-lucide="' + n.ic + '"></i></span>' +
        '<div class="nx-cab-txt"><small>Como funciona ' + esc(n.em) + '</small><b class="nx-titulo">' + esc(titulo(n)) + '</b></div></div>' +
      (n.id === 'outro' ? '<label class="nx-outro"><span>Qual é o seu negócio?</span><input type="text" maxlength="60" placeholder="Ex.: pet shop, escola de idiomas, oficina" value="' + esc(outroTxt) + '"></label>' : '') +
      '<div class="nx-abas" role="tablist" aria-label="O que ver">' + abas.map(function (a) {
        return '<button type="button" role="tab" data-vista="' + a[0] + '" aria-selected="' + (vista === a[0]) + '" tabindex="' + (vista === a[0] ? 0 : -1) + '">' + a[1] + '</button>';
      }).join('') + '</div>' +
      '<div class="nx-conteudo">' + conteudo(n) + '</div>' +
      '<div class="nx-pe"><p>Quer conhecer o sistema por dentro? No diagnóstico gratuito (30 minutos, por Google Meet) mostramos o sistema montado ' + esc(n.em) + ' e o que dá para automatizar.</p>' +
        '<a href="#agendar" class="btn btn-primary nx-cta">Agendar diagnóstico gratuito</a></div>';
    palco.setAttribute('aria-labelledby', 'nx-tab-' + n.id);
    if (animar && !calmo) { palco.classList.remove('nx-troca'); void palco.offsetWidth; palco.classList.add('nx-troca'); }
    icones();
    var campo = palco.querySelector('.nx-outro input');
    if (campo) campo.addEventListener('input', function () { outroTxt = campo.value.trim(); palco.querySelector('.nx-titulo').textContent = titulo(n); });
  }

  function trocarVista(v, foco) {
    if (v === vista) return;
    vista = v;
    palco.querySelectorAll('.nx-abas button').forEach(function (b) {
      var on = b.getAttribute('data-vista') === v;
      b.setAttribute('aria-selected', on); b.tabIndex = on ? 0 : -1;
      if (on && foco) b.focus();
    });
    var c = palco.querySelector('.nx-conteudo');
    c.innerHTML = conteudo(atual);
    if (!calmo) { c.classList.remove('nx-troca'); void c.offsetWidth; c.classList.add('nx-troca'); }
    icones();
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
    desenhar(n, true);
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

  palco.addEventListener('click', function (e) {
    var aba = e.target.closest('.nx-abas button');
    if (aba) { trocarVista(aba.getAttribute('data-vista')); return; }
    // o botão leva ao agendamento com o nicho já escolhido no formulário
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
  palco.addEventListener('keydown', function (e) {
    if (!e.target.closest('.nx-abas') || (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight')) return;
    e.preventDefault();
    trocarVista(vista === 'como' ? 'conexoes' : 'como', true);
  });

  desenhar(NICHOS[0], false);
})();
