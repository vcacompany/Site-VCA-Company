/* =====================================================================
   "Por dentro do sistema" — vitrine animada + demonstração interativa.
   Tudo é fictício (nomes, valores, conversas). Nada é enviado a lugar nenhum.
   ===================================================================== */
(function () {
  'use strict';
  var reduz = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var brl = function (n) { return 'R$ ' + Number(n).toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 }); };
  var icones = function () { if (window.lucide && window.lucide.createIcons) window.lucide.createIcons(); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var CORES_AV = ['#C9A24D', '#3B82F6', '#10B981', '#8B5CF6', '#F43F5E', '#0EA5E9', '#F59E0B', '#14B8A6'];
  var ini = function (n) { return n.split(' ').map(function (p) { return p[0]; }).slice(0, 2).join('').toUpperCase(); };
  var av = function (n, i) { return '<span class="sd-av" style="--av:' + CORES_AV[(i || n.length) % CORES_AV.length] + '">' + ini(n) + '</span>'; };

  /* contagem dos números (desacelera no fim) */
  function contar(el) {
    var alvo = Number(el.getAttribute('data-n')) || 0, fmt = el.getAttribute('data-f') || 'int', suf = el.getAttribute('data-s') || '';
    var mostra = function (v) { el.textContent = (fmt === 'brl' ? brl(v) : Math.round(v).toLocaleString('pt-BR')) + suf; };
    if (reduz) { mostra(alvo); return; }
    var t0 = null, dur = 1100;
    var passo = function (t) { if (t0 === null) t0 = t; var p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 4); mostra(alvo * e); if (p < 1) requestAnimationFrame(passo); };
    requestAnimationFrame(passo);
  }

  /* ================== DEMONSTRAÇÃO INTERATIVA ================== */
  var app = $('#sdApp');
  if (app) montarApp();

  function montarApp() {
    var win = app.closest('.sd-window');
    var views = {
      inicio: vInicio, conversas: vConversas, funil: vFunil, agenda: vAgenda, financeiro: vFinanceiro, automacoes: vAutomacoes
    };
    var main = $('.sd-main', app);
    var atual = null;

    function abrir(nome) {
      if (nome === atual) return;
      atual = nome;
      $$('.sd-nav', app).forEach(function (b) { b.setAttribute('aria-selected', String(b.dataset.view === nome)); });
      fecharDrawer();
      $$('.sd-view', main).forEach(function (v) { v.hidden = true; v.classList.remove('sd-enter'); });
      var v = $('.sd-view[data-view="' + nome + '"]', main);
      if (!v) { v = document.createElement('div'); v.className = 'sd-view'; v.dataset.view = nome; main.insertBefore(v, $('.sd-drawer', main)); views[nome](v); icones(); }
      v.hidden = false; void v.offsetWidth; if (!reduz) v.classList.add('sd-enter');
      $$('[data-n]', v).forEach(contar);
    }
    $$('.sd-nav', app).forEach(function (b) { b.addEventListener('click', function () { abrir(b.dataset.view); }); });

    /* cor da marca (white label) */
    $$('.sd-swatch', win).forEach(function (s) {
      s.addEventListener('click', function () {
        $$('.sd-swatch', win).forEach(function (o) { o.setAttribute('aria-pressed', String(o === s)); });
        win.style.setProperty('--sd-accent', s.dataset.c);
      });
    });

    /* painel lateral de detalhes */
    var drawer = $('.sd-drawer', main);
    function abrirDrawer(html) { drawer.innerHTML = '<button class="sd-drawer-x" aria-label="Fechar"><i data-lucide="x"></i></button>' + html; icones(); drawer.classList.add('open'); $('.sd-drawer-x', drawer).onclick = fecharDrawer; }
    function fecharDrawer() { if (drawer) drawer.classList.remove('open'); }
    main.addEventListener('keydown', function (e) { if (e.key === 'Escape') fecharDrawer(); });

    /* ---------- Início ---------- */
    function vInicio(v) {
      var sem = [['Seg', 42], ['Ter', 58], ['Qua', 51], ['Qui', 74], ['Sex', 66], ['Sáb', 31], ['Dom', 22]];
      var mx = 80;
      v.innerHTML =
        '<div class="sd-head"><h3 class="sd-h">Bom dia, Mariana 👋<small>Resumo da semana · Studio Aurora</small></h3>' +
        '<div class="sd-seg" role="group" aria-label="Período"><button aria-pressed="false">Hoje</button><button aria-pressed="true">7 dias</button><button aria-pressed="false">30 dias</button></div></div>' +
        '<div class="sd-kpis sd-stagger">' +
        kpi('users', 'Novos leads', 344, 'int', '', '+18%') + kpi('message-circle', 'Atendidos pela IA', 1208, 'int', '', '+32%') +
        kpi('calendar-check', 'Reuniões marcadas', 57, 'int', '', '+9%') + kpi('wallet', 'Faturamento', 48290, 'brl', '', '+12%') +
        '</div>' +
        '<div class="sd-grid2 sd-stagger"><div class="sd-card"><p class="sd-card-t">Leads por dia <span>passe o mouse</span></p><div class="sd-bars">' +
        sem.map(function (d, i) { return '<div class="sd-bar-col" title="' + d[1] + ' leads"><i style="--h:' + Math.round(d[1] / mx * 100) + '%"' + (i > 4 ? ' class="lo"' : '') + '></i><span>' + d[0] + '</span></div>'; }).join('') +
        '</div></div><div class="sd-card"><p class="sd-card-t">Acontecendo agora</p><div class="sd-feed">' +
        feed('bot', 'IA respondeu <b>Rafael Costa</b> em 4s', 'há 2 min') + feed('kanban', '<b>Juliana Prado</b> foi para “Proposta”', 'há 9 min') +
        feed('calendar', 'Reunião com <b>Pedro Nogueira</b> às 15h', 'há 21 min') + feed('badge-check', 'Pagamento de <b>R$ 1.890</b> confirmado', 'há 34 min') +
        '</div></div></div>';
      $$('.sd-seg button', v).forEach(function (b, i) {
        b.addEventListener('click', function () {
          $$('.sd-seg button', v).forEach(function (o) { o.setAttribute('aria-pressed', String(o === b)); });
          var fator = [0.16, 1, 4.1][i];
          var base = [344, 1208, 57, 48290];
          $$('.sd-kpi strong', v).forEach(function (s, k) { s.setAttribute('data-n', Math.round(base[k] * fator)); contar(s); });
        });
      });
    }
    function kpi(ic, t, n, f, s, up) { return '<div class="sd-card sd-kpi"><small><i data-lucide="' + ic + '"></i>' + t + '</small><strong data-n="' + n + '" data-f="' + f + '" data-s="' + s + '">0</strong><span class="sd-up">↑ ' + up + ' vs semana passada</span></div>'; }
    function feed(ic, t, q) { return '<div class="sd-feed-item"><span class="sd-ic"><i data-lucide="' + ic + '"></i></span><div>' + t + '<small>' + q + '</small></div></div>'; }

    /* ---------- Conversas ---------- */
    var CONVS = [
      { n: 'Rafael Costa', u: 2, t: 'agora', tag: ['info', 'Novo lead'], m: [['in', 'Oi! Vi o perfil de vocês no Instagram, como funciona o plano mensal?'], ['out', 'Olá, Rafael! 😊 O plano mensal inclui acompanhamento completo. Posso te mostrar os horários livres para uma avaliação?', 1]] },
      { n: 'Juliana Prado', u: 0, t: '5 min', tag: ['gold', 'Proposta'], m: [['in', 'Recebi a proposta, consigo parcelar?'], ['out', 'Consegue sim, Juliana! Em até 6x sem juros. Quer que eu gere o link de pagamento?', 1], ['in', 'Quero sim!']] },
      { n: 'Pedro Nogueira', u: 1, t: '12 min', tag: ['ok', 'Agendado'], m: [['in', 'Pode confirmar minha reunião de amanhã?'], ['out', 'Confirmado, Pedro! Amanhã às 15h. Te mando um lembrete 1h antes. ✅', 1]] },
      { n: 'Camila Ribeiro', u: 0, t: '1 h', tag: ['wait', 'Aguardando'], m: [['in', 'Vocês atendem aos sábados?'], ['out', 'Atendemos sim, das 8h às 12h! Quer agendar um horário?', 1]] },
      { n: 'Lucas Ferraz', u: 0, t: 'ontem', tag: ['ok', 'Cliente'], m: [['in', 'Obrigado pelo atendimento, foi ótimo!'], ['out', 'Nós que agradecemos, Lucas! 💛', 0]] }
    ];
    var RESPOSTAS = [
      'Perfeito! Já registrei aqui no seu cadastro. Posso te ajudar com mais alguma coisa?',
      'Ótima pergunta! Tenho horários livres amanhã às 10h e às 14h. Qual fica melhor?',
      'Combinado! Acabei de te mover para “Qualificado” no funil e avisei a equipe. 🙌',
      'Claro! Vou te enviar o link com todos os detalhes agora mesmo.'
    ];
    function vConversas(v) {
      v.innerHTML = '<div class="sd-chat"><div class="sd-chat-list"><h4>Conversas <span>5 abertas</span></h4>' +
        CONVS.map(function (c, i) {
          return '<button class="sd-conv" data-i="' + i + '" aria-selected="' + (i === 0) + '">' + av(c.n, i) + '<div><b>' + c.n + '<em>' + c.t + '</em></b><p>' + esc(c.m[c.m.length - 1][1]) + '</p></div>' + (c.u ? '<span class="sd-unread">' + c.u + '</span>' : '') + '</button>';
        }).join('') + '</div><div class="sd-chat-panel"><div class="sd-chat-top"></div><div class="sd-msgs" aria-live="polite"></div>' +
        '<form class="sd-compose"><input type="text" placeholder="Escreva como se fosse o cliente…" aria-label="Mensagem de teste" maxlength="160"><button class="sd-btn" type="submit"><i data-lucide="send"></i><span>Enviar</span></button></form></div></div>';
      var sel = 0, r = 0;
      var mostrar = function (i) {
        sel = i; var c = CONVS[i];
        $$('.sd-conv', v).forEach(function (b) { b.setAttribute('aria-selected', String(+b.dataset.i === i)); });
        var u = $('.sd-conv[data-i="' + i + '"] .sd-unread', v); if (u) u.remove();
        $('.sd-chat-top', v).innerHTML = av(c.n, i) + '<div><b>' + c.n + '</b><small>● online · WhatsApp</small></div><span class="sd-chip ' + c.tag[0] + '">' + c.tag[1] + '</span>';
        $('.sd-msgs', v).innerHTML = c.m.map(msg).join('');
      };
      $$('.sd-conv', v).forEach(function (b) { b.addEventListener('click', function () { mostrar(+b.dataset.i); }); });
      $('.sd-compose', v).addEventListener('submit', function (e) {
        e.preventDefault();
        var inp = $('input', this), txt = inp.value.trim(); if (!txt) return; inp.value = '';
        var box = $('.sd-msgs', v), c = CONVS[sel];
        c.m.push(['in', txt]); box.insertAdjacentHTML('beforeend', msg(['in', txt])); box.scrollTop = box.scrollHeight;
        box.insertAdjacentHTML('beforeend', '<div class="sd-typing"><i></i><i></i><i></i></div>'); box.scrollTop = box.scrollHeight;
        setTimeout(function () {
          var t = $('.sd-typing', box); if (t) t.remove();
          var resp = ['out', RESPOSTAS[r++ % RESPOSTAS.length], 1];
          c.m.push(resp); box.insertAdjacentHTML('beforeend', msg(resp)); box.scrollTop = box.scrollHeight;
          var p = $('.sd-conv[data-i="' + sel + '"] p', v); if (p) p.textContent = resp[1];
        }, 1300);
      });
      mostrar(0);
    }
    function msg(m) { return '<div class="sd-msg ' + m[0] + '">' + (m[2] ? '<span class="sd-ia">✦ RESPONDIDO PELA IA</span>' : '') + esc(m[1]) + '<small>' + (m[0] === 'out' ? '✓✓ ' : '') + 'agora</small></div>'; }

    /* ---------- Funil (kanban arrastável) ---------- */
    var COLS = [['novo', 'Novo lead', '#3B82F6'], ['qualif', 'Qualificado', '#8B5CF6'], ['prop', 'Proposta', '#F59E0B'], ['fech', 'Fechado', '#10B981']];
    var DEALS = [
      ['Rafael Costa', 'Plano mensal', 890, 'novo', 'Instagram'], ['Bianca Torres', 'Avaliação', 450, 'novo', 'Google'], ['Diego Martins', 'Pacote anual', 6800, 'novo', 'Indicação'],
      ['Juliana Prado', 'Pacote trimestral', 2400, 'qualif', 'WhatsApp'], ['André Lima', 'Consultoria', 3200, 'qualif', 'Site'],
      ['Pedro Nogueira', 'Projeto completo', 12500, 'prop', 'Indicação'], ['Camila Ribeiro', 'Plano mensal', 890, 'prop', 'Instagram'],
      ['Lucas Ferraz', 'Pacote anual', 7200, 'fech', 'Google'], ['Helena Duarte', 'Avaliação', 450, 'fech', 'WhatsApp']
    ];
    function vFunil(v) {
      v.innerHTML = '<div class="sd-head"><h3 class="sd-h">Funil de vendas<small>Arraste os cards entre as etapas · clique para ver detalhes</small></h3>' +
        '<button class="sd-btn ghost" type="button" data-novo><i data-lucide="plus"></i>Novo negócio</button></div>' +
        '<div class="sd-board">' + COLS.map(function (c) {
          return '<div class="sd-col" data-col="' + c[0] + '"><div class="sd-col-h"><i style="--dot:' + c[2] + '"></i>' + c[1] + '<em></em></div><div class="sd-col-sum"></div></div>';
        }).join('') + '</div>';
      DEALS.forEach(function (d, i) { $('.sd-col[data-col="' + d[3] + '"]', v).appendChild(cardDeal(d, i)); });
      totais(v);
      $('[data-novo]', v).addEventListener('click', function () {
        var nomes = ['Sofia Almeida', 'Gabriel Rocha', 'Larissa Mendes', 'Mateus Pires'];
        var d = [nomes[(DEALS.length) % nomes.length], 'Plano mensal', 890, 'novo', 'Site']; DEALS.push(d);
        var el = cardDeal(d, DEALS.length - 1); var col = $('.sd-col[data-col="novo"]', v);
        col.insertBefore(el, col.children[2] || null); el.classList.add('sd-pop'); totais(v);
      });
      arrastar(v);
    }
    function cardDeal(d, i) {
      var el = document.createElement('div'); el.className = 'sd-deal'; el.tabIndex = 0; el.dataset.i = i;
      el.innerHTML = '<div class="sd-deal-top">' + av(d[0], i) + '<div><b>' + d[0] + '</b><small>' + d[1] + '</small></div></div>' +
        '<div class="sd-deal-foot"><span class="sd-chip ' + (d[4] === 'Indicação' ? 'gold' : 'info') + '">' + d[4] + '</span><strong>' + brl(d[2]) + '</strong></div>';
      el.setAttribute('aria-label', d[0] + ', ' + brl(d[2]));
      return el;
    }
    function totais(v) {
      $$('.sd-col', v).forEach(function (col) {
        var cs = $$('.sd-deal', col); var soma = cs.reduce(function (s, c) { return s + DEALS[+c.dataset.i][2]; }, 0);
        $('.sd-col-h em', col).textContent = cs.length; $('.sd-col-sum', col).textContent = brl(soma) + ' em negociação';
      });
    }
    function arrastar(v) {
      var arr = null;
      v.addEventListener('pointerdown', function (e) {
        var card = e.target.closest('.sd-deal'); if (!card || e.button !== 0) return;
        arr = { card: card, x: e.clientX, y: e.clientY, mov: false, ghost: null, alvo: null, dx: 0, dy: 0 };
        card.setPointerCapture(e.pointerId);
      });
      v.addEventListener('pointermove', function (e) {
        if (!arr) return;
        if (!arr.mov) {
          if (Math.abs(e.clientX - arr.x) + Math.abs(e.clientY - arr.y) < 6) return;
          arr.mov = true; var r = arr.card.getBoundingClientRect(); arr.dx = arr.x - r.left; arr.dy = arr.y - r.top;
          arr.ghost = arr.card.cloneNode(true); arr.ghost.classList.add('sd-drag-ghost'); arr.ghost.style.width = r.width + 'px';
          document.body.appendChild(arr.ghost); arr.card.classList.add('sd-ghost-src');
        }
        arr.ghost.style.left = (e.clientX - arr.dx) + 'px'; arr.ghost.style.top = (e.clientY - arr.dy) + 'px';
        arr.ghost.style.visibility = 'hidden'; var sob = document.elementFromPoint(e.clientX, e.clientY); arr.ghost.style.visibility = '';
        var col = sob && sob.closest && sob.closest('.sd-col');
        if (col !== arr.alvo) { if (arr.alvo) arr.alvo.classList.remove('sd-over'); arr.alvo = col && v.contains(col) ? col : null; if (arr.alvo) arr.alvo.classList.add('sd-over'); }
      });
      var fim = function () {
        if (!arr) return; var a = arr; arr = null;
        if (!a.mov) { detalhe(+a.card.dataset.i); return; }
        a.ghost.remove(); a.card.classList.remove('sd-ghost-src');
        if (a.alvo) {
          a.alvo.classList.remove('sd-over'); a.alvo.appendChild(a.card); DEALS[+a.card.dataset.i][3] = a.alvo.dataset.col;
          if (!reduz) { a.card.classList.remove('sd-pop'); void a.card.offsetWidth; a.card.classList.add('sd-pop'); }
          totais(v);
        }
      };
      v.addEventListener('pointerup', fim); v.addEventListener('pointercancel', fim);
      v.addEventListener('keydown', function (e) { var c = e.target.closest && e.target.closest('.sd-deal'); if (c && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); detalhe(+c.dataset.i); } });
    }
    function detalhe(i) {
      var d = DEALS[i], etapa = COLS.filter(function (c) { return c[0] === d[3]; })[0];
      abrirDrawer('<div style="display:flex;gap:.7rem;align-items:center;margin-top:.2rem">' + av(d[0], i) + '<div><b style="font-size:14px">' + d[0] + '</b><br><span class="sd-chip" style="background:' + etapa[2] + '22;color:' + etapa[2] + '">' + etapa[1] + '</span></div></div>' +
        '<dl class="sd-dl"><dt>Interesse</dt><dd>' + d[1] + '</dd><dt>Valor</dt><dd>' + brl(d[2]) + '</dd><dt>Origem</dt><dd>' + d[4] + '</dd><dt>Responsável</dt><dd>Mariana A.</dd><dt>Telefone</dt><dd>(11) 9••••-••' + (10 + i) + '</dd></dl>' +
        '<p class="sd-card-t" style="margin-bottom:.4rem">Histórico</p><div class="sd-timeline"><div>Lead entrou pelo ' + d[4] + '<small>há 3 dias</small></div><div>IA qualificou e marcou como “quente”<small>há 3 dias</small></div><div>Reunião de apresentação feita<small>ontem</small></div><div>Movido para ' + etapa[1] + '<small>agora</small></div></div>' +
        '<div style="display:flex;gap:.5rem;margin-top:1.1rem"><button class="sd-btn" type="button"><i data-lucide="message-circle"></i>WhatsApp</button><button class="sd-btn ghost" type="button"><i data-lucide="calendar-plus"></i>Agendar</button></div>');
    }

    /* ---------- Agenda ---------- */
    var EVS = [
      [0, 9, 1, 'Avaliação — Bianca Torres', '#3B82F6'], [0, 14, 1.5, 'Apresentação — Diego M.', '#C9A24D'],
      [1, 10, 1, 'Retorno — Juliana Prado', '#10B981'], [1, 16, 1, 'Reunião de equipe', '#8B5CF6'],
      [2, 8.5, 1, 'Café com parceiro', '#F59E0B'], [2, 15, 1, 'Reunião — Pedro Nogueira', '#C9A24D'],
      [3, 11, 1.5, 'Onboarding — Lucas F.', '#10B981'], [4, 9, 1, 'Avaliação — Camila R.', '#3B82F6'], [4, 13.5, 1, 'Fechamento do mês', '#F43F5E']
    ];
    function vAgenda(v) {
      var dias = [['Seg', 14], ['Ter', 15], ['Qua', 16], ['Qui', 17], ['Sex', 18]], hoje = 2;
      v.innerHTML = '<div class="sd-head"><h3 class="sd-h">Agenda da semana<small>Clique num horário vazio para marcar · clique num evento para ver</small></h3>' +
        '<div class="sd-seg"><button aria-pressed="false">Dia</button><button aria-pressed="true">Semana</button><button aria-pressed="false">Mês</button></div></div>' +
        '<div class="sd-cal"><div class="sd-cal-h"></div>' + dias.map(function (d, i) { return '<div class="sd-cal-h' + (i === hoje ? ' today' : '') + (i > 2 ? ' sd-hide-m' : '') + '">' + d[0] + '<b>' + d[1] + '</b></div>'; }).join('') +
        '<div class="sd-cal-times">' + [8, 9, 10, 11, 12, 13, 14, 15, 16, 17].map(function (h) { return '<span>' + h + 'h</span>'; }).join('') + '</div>' +
        dias.map(function (d, i) { return '<div class="sd-cal-day' + (i > 2 ? ' sd-hide-m' : '') + '" data-d="' + i + '">' + (i === hoje ? '<div class="sd-now" style="top:' + (46 * 3.4) + 'px"></div>' : '') + '</div>'; }).join('') + '</div>';
      EVS.forEach(function (e) { pintarEv(v, e); });
      $$('.sd-cal-day', v).forEach(function (col) {
        col.addEventListener('click', function (ev) {
          if (ev.target.closest('.sd-ev')) return;
          var r = col.getBoundingClientRect(); var h = 8 + Math.floor((ev.clientY - r.top) / 46 * 2) / 2;
          var novo = [+col.dataset.d, Math.min(17, h), 1, 'Nova reunião (exemplo)', getComputedStyle(win).getPropertyValue('--sd-accent').trim() || '#C9A24D'];
          EVS.push(novo); pintarEv(v, novo);
        });
      });
    }
    function pintarEv(v, e) {
      var col = $('.sd-cal-day[data-d="' + e[0] + '"]', v); if (!col) return;
      var b = document.createElement('button'); b.type = 'button'; b.className = 'sd-ev';
      b.style.cssText = 'top:' + ((e[1] - 8) * 46 + 2) + 'px;height:' + (e[2] * 46 - 4) + 'px;--evc:' + e[4] + ';--evb:' + e[4] + '22';
      var hh = function (x) { return Math.floor(x) + ':' + (x % 1 ? '30' : '00'); };
      b.innerHTML = '<b>' + esc(e[3]) + '</b><span>' + hh(e[1]) + ' – ' + hh(e[1] + e[2]) + '</span>';
      b.addEventListener('click', function () {
        abrirDrawer('<b style="font-size:15px;display:block;margin:.2rem 2.2rem .3rem 0">' + esc(e[3]) + '</b><span class="sd-chip gold">' + ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'][e[0]] + ' · ' + hh(e[1]) + '</span>' +
          '<dl class="sd-dl"><dt>Duração</dt><dd>' + (e[2] * 60) + ' min</dd><dt>Local</dt><dd>Google Meet</dd><dt>Lembrete</dt><dd>WhatsApp 1h antes</dd><dt>Criado por</dt><dd>Agente de IA</dd></dl>' +
          '<div class="sd-timeline"><div>IA ofereceu 3 horários ao cliente<small>ontem, 18:42</small></div><div>Cliente escolheu este horário<small>ontem, 18:44</small></div><div>Convite enviado e confirmado<small>ontem, 18:45</small></div></div>');
      });
      col.appendChild(b);
    }

    /* ---------- Financeiro ---------- */
    var TX = [
      ['Lucas Ferraz', 'Pacote anual', 7200, 'ok', 'Recebido', '14 out'], ['Helena Duarte', 'Avaliação', 450, 'ok', 'Recebido', '14 out'],
      ['Juliana Prado', 'Pacote trimestral · 1/6', 400, 'wait', 'Pendente', '18 out'], ['Fornecedor Alfa', 'Materiais', -1260, 'ok', 'Pago', '12 out'],
      ['Pedro Nogueira', 'Projeto completo · sinal', 3750, 'wait', 'Pendente', '20 out'], ['Camila Ribeiro', 'Plano mensal', 890, 'bad', 'Atrasado', '05 out'],
      ['Aluguel', 'Despesa fixa', -3200, 'ok', 'Pago', '10 out']
    ];
    function vFinanceiro(v) {
      var meses = [['Mai', 31, 18], ['Jun', 35, 19], ['Jul', 33, 21], ['Ago', 41, 22], ['Set', 44, 23], ['Out', 48, 24]];
      v.innerHTML = '<div class="sd-head"><h3 class="sd-h">Financeiro<small>Outubro · atualizado automaticamente a cada pagamento</small></h3>' +
        '<div class="sd-seg" role="group" aria-label="Filtro"><button aria-pressed="true" data-f="todos">Todos</button><button aria-pressed="false" data-f="ok">Recebidos</button><button aria-pressed="false" data-f="wait">Pendentes</button><button aria-pressed="false" data-f="bad">Atrasados</button></div></div>' +
        '<div class="sd-fin-kpis sd-stagger"><div class="sd-card sd-kpi"><small><i data-lucide="arrow-down-left"></i>Receitas</small><strong data-n="48290" data-f="brl">0</strong><span class="sd-up">↑ 9% vs setembro</span></div>' +
        '<div class="sd-card sd-kpi"><small><i data-lucide="arrow-up-right"></i>Despesas</small><strong data-n="23940" data-f="brl">0</strong><span class="sd-up" style="color:var(--sd-muted)">dentro do previsto</span></div>' +
        '<div class="sd-card sd-kpi"><small><i data-lucide="piggy-bank"></i>Saldo</small><strong data-n="24350" data-f="brl">0</strong><span class="sd-up">↑ 14% vs setembro</span></div></div>' +
        '<div class="sd-grid2"><div class="sd-card"><p class="sd-card-t">Receitas x despesas <span class="sd-legend"><span><i style="background:var(--sd-accent)"></i>Receita</span><span><i style="background:var(--color-white-10)"></i>Despesa</span></span></p>' +
        '<div class="sd-bars duo">' + meses.map(function (m) { return '<div class="sd-bar-col" title="' + m[0] + ': R$ ' + m[1] + 'k / R$ ' + m[2] + 'k"><div><i style="--h:' + Math.round(m[1] / 50 * 100) + '%"></i><i class="lo" style="--h:' + Math.round(m[2] / 50 * 100) + '%"></i></div><span>' + m[0] + '</span></div>'; }).join('') +
        '</div></div><div class="sd-card"><p class="sd-card-t">Lançamentos</p><div class="sd-tx"></div></div></div>';
      var lista = function (f) {
        $('.sd-tx', v).innerHTML = TX.filter(function (t) { return f === 'todos' || t[3] === f; }).map(function (t, i) {
          return '<div class="sd-tx-row" style="animation-delay:' + (i * 0.04) + 's"><div><b>' + t[0] + '</b><small>' + t[1] + ' · ' + t[5] + '</small></div><span class="sd-chip ' + t[3] + '">' + t[4] + '</span><strong class="' + (t[2] < 0 ? 'neg' : '') + '">' + (t[2] < 0 ? '− ' : '') + brl(Math.abs(t[2])) + '</strong></div>';
        }).join('') || '<div class="sd-tx-row"><small>Nada por aqui.</small></div>';
      };
      $$('.sd-seg button', v).forEach(function (b) { b.addEventListener('click', function () { $$('.sd-seg button', v).forEach(function (o) { o.setAttribute('aria-pressed', String(o === b)); }); lista(b.dataset.f); }); });
      lista('todos');
    }

    /* ---------- Automações ---------- */
    function vAutomacoes(v) {
      var node = function (ic, b, s, cb, cc, extra) { return '<div class="sd-node" style="--icb:' + cb + ';--icc:' + cc + '"><span class="sd-ic"><i data-lucide="' + ic + '"></i></span><div><b>' + b + '</b><small>' + s + '</small></div>' + (extra || '<span class="sd-ok"><i data-lucide="check-circle-2"></i></span>') + '</div>'; };
      v.innerHTML = '<div class="sd-head"><h3 class="sd-h">Automação: novo lead no WhatsApp<small>Tudo isso roda sozinho, 24h por dia</small></h3>' +
        '<div style="display:flex;gap:.5rem;align-items:center"><span class="sd-chip ok">● Ativa</span><button class="sd-btn" type="button" data-testar><i data-lucide="play"></i>Testar fluxo</button></div></div>' +
        '<div class="sd-flow-wrap"><div class="sd-flow">' +
        node('message-circle', 'Quando chegar mensagem nova', 'Gatilho · WhatsApp', 'rgba(16,185,129,.12)', '#10B981') + '<div class="sd-link"></div>' +
        node('bot', 'Agente de IA responde', 'Entende áudio, texto e imagem', 'var(--sd-accent-soft)', 'var(--sd-accent)') + '<div class="sd-link"></div>' +
        node('git-branch', 'Lead está qualificado?', 'Condição definida pela IA', 'rgba(139,92,246,.12)', '#8B5CF6') + '<div class="sd-link"></div>' +
        '<div class="sd-branch">' + node('kanban', 'Mover para “Qualificado”', 'Funil de vendas', 'rgba(59,130,246,.12)', '#3B82F6') + node('calendar-plus', 'Agendar e lembrar', 'Agenda + aviso 1h antes', 'rgba(245,158,11,.12)', '#F59E0B') + '</div>' +
        '</div><div><p class="sd-card-t">Execução</p><div class="sd-log" aria-live="polite"><div>Clique em “Testar fluxo” para ver a automação rodando.</div></div></div></div>';
      var rodando = false;
      $('[data-testar]', v).addEventListener('click', function () {
        if (rodando) return; rodando = true;
        var nodes = $$('.sd-node', v), links = $$('.sd-link', v), log = $('.sd-log', v);
        nodes.forEach(function (n) { n.classList.remove('run', 'done'); }); links.forEach(function (l) { l.classList.remove('lit'); });
        log.innerHTML = '';
        var linhas = [['acc', '→ Mensagem recebida de Bianca Torres: “Quanto custa a avaliação?”'], ['', '✦ IA respondeu em 3,8s com valores e horários'], ['', '✦ IA classificou o lead como qualificado (alta intenção)'], ['ok', '✓ Card movido para “Qualificado” no funil'], ['ok', '✓ Reunião marcada: quinta, 10h · lembrete agendado']];
        var passos = [0, 1, 2, [3, 4]], k = 0;
        var tick = function () {
          if (k >= passos.length) { rodando = false; return; }
          var alvo = [].concat(passos[k]);
          if (k > 0 && links[k - 1]) links[k - 1].classList.add('lit');
          alvo.forEach(function (ix) { nodes[ix].classList.add('run'); });
          setTimeout(function () {
            alvo.forEach(function (ix) { nodes[ix].classList.remove('run'); nodes[ix].classList.add('done'); });
            (k < 3 ? [linhas[k]] : [linhas[3], linhas[4]]).forEach(function (l) { log.insertAdjacentHTML('beforeend', '<div class="' + l[0] + '">' + esc(l[1]) + '</div>'); });
            k++; setTimeout(tick, reduz ? 0 : 250);
          }, reduz ? 0 : 750);
        };
        tick();
      });
    }

    abrir('inicio');
  }

  /* ================== VITRINE ANIMADA ================== */
  var show = $('#sdShow');
  if (show) montarVitrine();

  function montarVitrine() {
    var slides = $$('.sd-slide', show), pips = $$('.sd-pip', show), DUR = 6500;
    var i = 0, timer = null, visivel = false, pausado = false, inicioCena = 0, resta = DUR;
    show.style.setProperty('--dur', DUR + 'ms');
    function ir(n, manual) {
      var antes = slides[i];
      i = (n + slides.length) % slides.length;
      slides.forEach(function (s, k) { s.classList.remove('is-active', 'is-leaving'); s.setAttribute('aria-hidden', String(k !== i)); });
      if (antes !== slides[i]) { antes.classList.add('is-leaving'); setTimeout(function () { antes.classList.remove('is-leaving'); }, 400); }
      void slides[i].offsetWidth; slides[i].classList.add('is-active');
      $$('[data-n]', slides[i]).forEach(function (el) { el.textContent = el.getAttribute('data-f') === 'brl' ? brl(0) : '0'; setTimeout(function () { contar(el); }, Number(el.getAttribute('data-delay') || 0)); });
      pips.forEach(function (p, k) { p.setAttribute('aria-current', String(k === i)); var s = p.firstElementChild; if (s) { s.style.animation = 'none'; void s.offsetWidth; s.style.animation = ''; } });
      resta = DUR; agendar();
    }
    function agendar() { clearTimeout(timer); inicioCena = Date.now(); if (visivel && !pausado && !reduz) timer = setTimeout(function () { ir(i + 1); }, resta); }
    // pausa ao passar o mouse/focar e continua de onde parou (a barrinha de progresso pausa junto)
    function pausar() { if (pausado) return; pausado = true; show.classList.add('paused'); clearTimeout(timer); resta = Math.max(400, resta - (Date.now() - inicioCena)); }
    function seguir() { if (!pausado) return; pausado = false; show.classList.remove('paused'); agendar(); }
    $('[data-prev]', show).addEventListener('click', function () { ir(i - 1, true); });
    $('[data-next]', show).addEventListener('click', function () { ir(i + 1, true); });
    pips.forEach(function (p, k) { p.addEventListener('click', function () { ir(k, true); }); });
    show.addEventListener('mouseenter', pausar);
    show.addEventListener('mouseleave', seguir);
    show.addEventListener('focusin', pausar);
    show.addEventListener('focusout', function (e) { if (!show.contains(e.relatedTarget)) seguir(); });
    // só roda quando a vitrine está na tela (não gasta nada fora dela) e recomeça a cena ao voltar
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (en) {
        var v = en[0].isIntersecting;
        if (v && !visivel) { visivel = true; ir(i); } else if (!v) { visivel = false; clearTimeout(timer); }
      }, { threshold: 0.35 }).observe(show);
    } else { visivel = true; ir(0); }
  }
})();
