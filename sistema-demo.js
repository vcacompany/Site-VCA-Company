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
    /* dois painéis, como nos sistemas reais: o administrativo (gestão completa da empresa) e o do cliente
       (o portal que cada cliente da VCA usa no dia a dia). O menu lateral é montado conforme o modo. */
    var MODOS = {
      admin: {
        nome: 'Studio Aurora', sub: 'Painel administrativo', url: 'app.suaempresa.com.br/admin', ini: 'SA', user: ['Mariana Alves', 'Administradora'],
        itens: [['inicio', 'Início', 'layout-dashboard'], ['conversas', 'Conversas', 'message-circle', 3], ['funil', 'Negócios', 'kanban'],
          ['agenda', 'Calendário', 'calendar-days'], ['atividades', 'Atividades', 'check-circle-2', 5], ['metas', 'Metas', 'target'],
          ['relatorios', 'Relatórios', 'bar-chart-3'], ['financeiro', 'Financeiro', 'wallet'], ['anotacoes', 'Anotações', 'notebook-pen'],
          ['automacoes', 'Automações', 'workflow'], ['equipe', 'Equipe', 'users']]
      },
      cliente: {
        nome: 'Clínica Bem Viver', sub: 'Painel do cliente', url: 'bemviver.suaempresa.com.br/portal', ini: 'BV', user: ['Dra. Helena Prado', 'Proprietária'],
        itens: [['c_geral', 'Visão geral', 'layout-dashboard'], ['c_agenda', 'Agenda', 'calendar-days'], ['conversas', 'WhatsApp / IA', 'message-circle', 2],
          ['funil', 'CRM / Funil', 'target'], ['c_clientes', 'Clientes', 'contact'], ['c_docs', 'Documentos', 'file-text'],
          ['financeiro', 'Financeiro', 'wallet'], ['c_plano', 'Meu plano', 'credit-card']]
      }
    };
    var views = {
      inicio: vInicio, conversas: vConversas, funil: vFunil, agenda: vAgenda, financeiro: vFinanceiro, automacoes: vAutomacoes,
      atividades: vAtividades, metas: vMetas, relatorios: vRelatorios, anotacoes: vAnotacoes, equipe: vEquipe,
      c_geral: vCliGeral, c_agenda: vCliAgenda, c_clientes: vCliClientes, c_docs: vCliDocs, c_plano: vCliPlano
    };
    var main = $('.sd-main', app), side = $('.sd-side', app);
    var atual = null, modo = 'admin';

    function montarMenu() {
      var m = MODOS[modo];
      side.innerHTML = '<div class="sd-logo"><b>' + m.ini + '</b><span>' + m.nome + '<small>' + m.sub + '</small></span></div>' +
        m.itens.map(function (it) {
          return '<button class="sd-nav" role="tab" data-view="' + it[0] + '" aria-selected="false"><i data-lucide="' + it[2] + '"></i><span>' + it[1] + '</span>' + (it[3] ? '<em class="sd-pill">' + it[3] + '</em>' : '') + '</button>';
        }).join('') +
        '<div class="sd-side-foot">' + av(m.user[0], 1) + '<div>' + m.user[0] + '<small>' + m.user[1] + '</small></div></div>';
      $$('.sd-nav', side).forEach(function (b) { b.addEventListener('click', function () { abrir(b.dataset.view); }); });
      var url = $('.sd-url', win); if (url) url.textContent = m.url;
      icones();
    }
    function trocarModo(novo) {
      if (novo === modo) return;
      modo = novo; atual = null;
      $$('.sd-mode button').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.modo === modo)); });
      $$('.sd-view', main).forEach(function (v) { v.remove(); });   // cada painel começa do zero
      montarMenu(); abrir(MODOS[modo].itens[0][0]);
    }

    function abrir(nome) {
      if (nome === atual) return;
      atual = nome;
      $$('.sd-nav', app).forEach(function (b) { b.setAttribute('aria-selected', String(b.dataset.view === nome)); });
      fecharDrawer();
      $$('.sd-view', main).forEach(function (v) { v.hidden = true; v.classList.remove('sd-enter'); });
      var v = $('.sd-view[data-view="' + nome + '"]', main);
      if (!v) { v = document.createElement('div'); v.className = 'sd-view'; v.dataset.view = nome; main.insertBefore(v, $('.sd-drawer', main)); views[nome](v); icones(); }
      v.hidden = false; v.scrollTop = 0; void v.offsetWidth; if (!reduz) v.classList.add('sd-enter');
      $$('[data-n]', v).forEach(contar);
    }
    $$('.sd-mode button').forEach(function (b) { b.addEventListener('click', function () { trocarModo(b.dataset.modo); }); });

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
      v.classList.add("sd-flush");
      v.innerHTML = '<div class="sd-chat"><div class="sd-chat-list"><h4>Conversas <span>5 abertas</span></h4>' +
        CONVS.map(function (c, i) {
          return '<button class="sd-conv" data-i="' + i + '" aria-selected="' + (i === 0) + '">' + av(c.n, i) + '<div><b>' + c.n + '<em>' + c.t + '</em></b><p>' + esc(c.m[c.m.length - 1][1]) + '</p></div>' + (c.u ? '<span class="sd-unread">' + c.u + '</span>' : '') + '</button>';
        }).join('') + '</div><div class="sd-chat-panel"><div class="sd-chat-top"></div><div class="sd-msgs" aria-live="polite"></div>' +
        '<form class="sd-compose"><input type="text" placeholder="Escreva como se fosse o cliente…" aria-label="Mensagem de teste" maxlength="160"><button class="sd-btn" type="submit"><i data-lucide="send"></i><span>Enviar</span></button></form></div></div>';
      var sel = 0, r = 0, ocupado = false;
      var mostrar = function (i) {
        if (ocupado) return;
        sel = i; var c = CONVS[i];
        $$('.sd-conv', v).forEach(function (b) { b.setAttribute('aria-selected', String(+b.dataset.i === i)); });
        var u = $('.sd-conv[data-i="' + i + '"] .sd-unread', v); if (u) u.remove();
        $('.sd-chat-top', v).innerHTML = av(c.n, i) + '<div><b>' + c.n + '</b><small>● online · WhatsApp</small></div><span class="sd-chip ' + c.tag[0] + '">' + c.tag[1] + '</span>';
        var box = $('.sd-msgs', v); box.innerHTML = c.m.map(msg).join(''); box.scrollTop = box.scrollHeight;
      };
      $$('.sd-conv', v).forEach(function (b) { b.addEventListener('click', function () { mostrar(+b.dataset.i); }); });
      $('.sd-compose', v).addEventListener('submit', function (e) {
        e.preventDefault();
        var inp = $('input', this), txt = inp.value.trim(); if (!txt || ocupado) return; inp.value = ''; ocupado = true;
        var box = $('.sd-msgs', v), c = CONVS[sel];
        c.m.push(['in', txt]); box.insertAdjacentHTML('beforeend', msg(['in', txt])); box.scrollTop = box.scrollHeight;
        box.insertAdjacentHTML('beforeend', '<div class="sd-typing"><i></i><i></i><i></i></div>'); box.scrollTop = box.scrollHeight;
        setTimeout(function () {
          var t = $('.sd-typing', box); if (t) t.remove();
          var resp = ['out', RESPOSTAS[r++ % RESPOSTAS.length], 1];
          c.m.push(resp); box.insertAdjacentHTML('beforeend', msg(resp)); box.scrollTop = box.scrollHeight;
          var p = $('.sd-conv[data-i="' + sel + '"] p', v); if (p) p.textContent = resp[1];
          ocupado = false;
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

    /* ================= PAINEL ADMINISTRATIVO (telas extras) ================= */
    /* ---------- Atividades ---------- */
    var TAREFAS = [
      ['Ligar para Pedro Nogueira (proposta)', 'Hoje', 'alta', 'Mariana Alves', false],
      ['Enviar contrato para Juliana Prado', 'Hoje', 'alta', 'Rafael Lima', false],
      ['Revisar respostas da IA no WhatsApp', 'Hoje', 'media', 'Mariana Alves', true],
      ['Follow-up com Bianca Torres', 'Amanhã', 'media', 'Carla Souza', false],
      ['Preparar relatório do mês', 'Sex', 'baixa', 'Rafael Lima', false],
      ['Confirmar reunião de equipe', 'Atrasada', 'alta', 'Carla Souza', false]
    ];
    function vAtividades(v) {
      var prio = { alta: ['bad', 'Alta'], media: ['wait', 'Média'], baixa: ['info', 'Baixa'] };
      v.innerHTML = '<div class="sd-head"><h3 class="sd-h">Atividades<small>Marque como feita · crie uma nova no campo abaixo</small></h3>' +
        '<div class="sd-seg" role="group" aria-label="Filtro"><button aria-pressed="true" data-f="todas">Todas</button><button aria-pressed="false" data-f="Hoje">Hoje</button><button aria-pressed="false" data-f="Atrasada">Atrasadas</button><button aria-pressed="false" data-f="feitas">Feitas</button></div></div>' +
        '<div class="sd-card" style="margin-bottom:.8rem"><div class="sd-prog-h"><b>Progresso de hoje</b><span class="sd-prog-n"></span></div><div class="sd-prog"><i></i></div></div>' +
        '<div class="sd-card" style="padding:.4rem .9rem"><div class="sd-tasks"></div>' +
        '<form class="sd-add"><i data-lucide="plus"></i><input type="text" maxlength="80" placeholder="Nova atividade… (Enter para salvar)" aria-label="Nova atividade"></form></div>';
      var filtro = 'todas';
      var pintar = function () {
        var lista = TAREFAS.map(function (t, i) { return [t, i]; }).filter(function (x) { var t = x[0]; return filtro === 'todas' || (filtro === 'feitas' ? t[4] : (!t[4] && t[1] === filtro)); });
        $('.sd-tasks', v).innerHTML = lista.map(function (x) {
          var t = x[0], i = x[1];
          return '<div class="sd-task' + (t[4] ? ' done' : '') + '"><button class="sd-check" type="button" data-i="' + i + '" role="checkbox" aria-checked="' + t[4] + '" aria-label="Concluir: ' + esc(t[0]) + '"><i data-lucide="check"></i></button>' +
            '<div class="sd-task-t"><b>' + esc(t[0]) + '</b><small>' + (t[1] === 'Atrasada' ? '<span style="color:#E5484D">Atrasada</span>' : t[1]) + ' · ' + t[3] + '</small></div><span class="sd-chip ' + prio[t[2]][0] + '">' + prio[t[2]][1] + '</span></div>';
        }).join('') || '<p class="sd-empty">Nada por aqui 🎉</p>';
        var hoje = TAREFAS.filter(function (t) { return t[1] === 'Hoje'; }), feitas = hoje.filter(function (t) { return t[4]; }).length;
        $('.sd-prog-n', v).textContent = feitas + ' de ' + hoje.length;
        $('.sd-prog i', v).style.transform = 'scaleX(' + (hoje.length ? feitas / hoje.length : 0) + ')';
        icones();
      };
      v.addEventListener('click', function (e) {
        var c = e.target.closest('.sd-check'); if (c) { var t = TAREFAS[+c.dataset.i]; t[4] = !t[4]; pintar(); return; }
        var f = e.target.closest('.sd-seg button'); if (f) { filtro = f.dataset.f; $$('.sd-seg button', v).forEach(function (o) { o.setAttribute('aria-pressed', String(o === f)); }); pintar(); }
      });
      $('.sd-add', v).addEventListener('submit', function (e) {
        e.preventDefault(); var inp = $('input', this), t = inp.value.trim(); if (!t) return;
        TAREFAS.unshift([t, 'Hoje', 'media', 'Mariana Alves', false]); inp.value = ''; filtro = 'todas';
        $$('.sd-seg button', v).forEach(function (o) { o.setAttribute('aria-pressed', String(o.dataset.f === 'todas')); }); pintar();
      });
      pintar();
    }

    /* ---------- Metas ---------- */
    function vMetas(v) {
      var metas = [
        ['Faturamento de outubro', 48290, 60000, 'brl', 'wallet'], ['Novos clientes', 41, 50, 'int', 'user-plus'],
        ['Reuniões realizadas', 57, 60, 'int', 'calendar-check'], ['Tempo médio de resposta', 4, 5, 'seg', 'timer']
      ];
      var fmt = function (n, f) { return f === 'brl' ? brl(n) : f === 'seg' ? n + 's' : n.toLocaleString('pt-BR'); };
      v.innerHTML = '<div class="sd-head"><h3 class="sd-h">Metas do mês<small>Atualizadas sozinhas com os dados do sistema</small></h3><span class="sd-chip gold">Outubro</span></div>' +
        '<div class="sd-metas sd-stagger">' + metas.map(function (m) {
          var p = Math.min(100, Math.round(m[1] / m[2] * 100)); var r = 34, c = 2 * Math.PI * r;
          return '<div class="sd-card sd-meta"><div class="sd-ring"><svg viewBox="0 0 80 80"><circle cx="40" cy="40" r="' + r + '" class="bg"/><circle cx="40" cy="40" r="' + r + '" class="fg" style="--c:' + c.toFixed(1) + ';--o:' + (c * (1 - p / 100)).toFixed(1) + '"/></svg><b>' + p + '%</b></div>' +
            '<div><small><i data-lucide="' + m[4] + '"></i>' + m[0] + '</small><strong>' + fmt(m[1], m[3]) + '</strong><span>meta: ' + fmt(m[2], m[3]) + '</span></div></div>';
        }).join('') + '</div>' +
        '<div class="sd-card" style="margin-top:.8rem"><p class="sd-card-t">Ranking da equipe <span>vendas fechadas no mês</span></p>' +
        [['Mariana Alves', 16, '#C9A24D'], ['Rafael Lima', 13, '#3B82F6'], ['Carla Souza', 12, '#10B981']].map(function (p, i) {
          return '<div class="sd-rank">' + av(p[0], i) + '<b>' + p[0] + '</b><div class="sd-prog"><i style="transform:scaleX(' + (p[1] / 16) + ');background:' + p[2] + '"></i></div><strong>' + p[1] + '</strong></div>';
        }).join('') + '</div>';
    }

    /* ---------- Relatórios ---------- */
    function vRelatorios(v) {
      var funil = [['Leads', 344, '#3B82F6'], ['Qualificados', 186, '#8B5CF6'], ['Propostas', 74, '#F59E0B'], ['Fechados', 41, '#10B981']];
      var origens = [['Instagram', 38, '#E1306C'], ['WhatsApp', 27, '#10B981'], ['Google', 19, '#3B82F6'], ['Indicação', 16, '#C9A24D']];
      var acc = 0, conic = origens.map(function (o) { var s = acc; acc += o[1]; return o[2] + ' ' + s + '% ' + acc + '%'; }).join(',');
      v.innerHTML = '<div class="sd-head"><h3 class="sd-h">Relatório geral<small>Últimos 30 dias · gerado automaticamente</small></h3><button class="sd-btn ghost" type="button" data-pdf><i data-lucide="download"></i>Exportar PDF</button></div>' +
        '<div class="sd-grid2"><div class="sd-card"><p class="sd-card-t">Funil de conversão <span>taxa final: 11,9%</span></p><div class="sd-funnel">' +
        funil.map(function (f, i) { return '<div class="sd-funnel-row"><span>' + f[0] + '</span><div><i style="width:' + Math.round(f[1] / 344 * 100) + '%;background:' + f[2] + ';animation-delay:' + (i * 0.1) + 's"></i></div><b>' + f[1] + '</b></div>'; }).join('') +
        '</div></div><div class="sd-card"><p class="sd-card-t">De onde vêm os clientes</p><div class="sd-donut-wrap"><div class="sd-donut" style="background:conic-gradient(' + conic + ')"><span><b>344</b>leads</span></div><div class="sd-donut-leg">' +
        origens.map(function (o) { return '<div><i style="background:' + o[2] + '"></i>' + o[0] + '<b>' + o[1] + '%</b></div>'; }).join('') + '</div></div></div></div>' +
        '<div class="sd-kpis sd-stagger" style="margin-top:.8rem">' + kpi('clock', 'Resposta média', 4, 'int', 's', '-62%') + kpi('repeat', 'Clientes que voltaram', 63, 'int', '%', '+7%') + kpi('user-x', 'Faltas na agenda', 4, 'int', '%', '-11%') + kpi('ticket', 'Ticket médio', 1178, 'brl', '', '+5%') + '</div>';
      $('[data-pdf]', v).addEventListener('click', function () { this.innerHTML = '<i data-lucide="check"></i>Relatório pronto'; icones(); });
    }

    /* ---------- Anotações ---------- */
    var NOTAS = [
      ['Roteiro de atendimento', 'Sempre perguntar como o cliente conheceu a empresa e registrar no CRM.\nOferecer horário em até 48h.'],
      ['Ideias de campanha de novembro', 'Pacote de fim de ano com 10% para quem fechar até dia 30.\nPost com depoimentos.'],
      ['Reunião de equipe — pauta', '1. Metas de outubro\n2. Novas respostas da IA\n3. Escala de sábado']
    ];
    function vAnotacoes(v) {
      v.classList.add('sd-flush');
      v.innerHTML = '<div class="sd-notes"><div class="sd-notes-list"><button class="sd-btn" type="button" data-nova style="width:100%;justify-content:center"><i data-lucide="plus"></i>Nova nota</button><div class="sd-notes-items"></div></div>' +
        '<div class="sd-note-ed"><input class="sd-note-tt" aria-label="Título da nota" maxlength="60"><textarea class="sd-note-tx" aria-label="Texto da nota"></textarea><small class="sd-note-st">Salvo automaticamente</small></div></div>';
      var sel = 0;
      var lista = function () {
        $('.sd-notes-items', v).innerHTML = NOTAS.map(function (n, i) { return '<button class="sd-note-it" type="button" data-i="' + i + '" aria-selected="' + (i === sel) + '"><b>' + esc(n[0] || 'Sem título') + '</b><small>' + esc(n[1].split('\n')[0] || '…') + '</small></button>'; }).join('');
      };
      var abrirN = function (i) { sel = i; $('.sd-note-tt', v).value = NOTAS[i][0]; $('.sd-note-tx', v).value = NOTAS[i][1]; lista(); };
      v.addEventListener('click', function (e) { var b = e.target.closest('.sd-note-it'); if (b) abrirN(+b.dataset.i); if (e.target.closest('[data-nova]')) { NOTAS.unshift(['', '']); abrirN(0); $('.sd-note-tt', v).focus(); } });
      var salvar = function () { NOTAS[sel] = [$('.sd-note-tt', v).value, $('.sd-note-tx', v).value]; lista(); var st = $('.sd-note-st', v); st.textContent = 'Salvando…'; clearTimeout(st._t); st._t = setTimeout(function () { st.textContent = 'Salvo automaticamente ✓'; }, 500); };
      $('.sd-note-tt', v).addEventListener('input', salvar); $('.sd-note-tx', v).addEventListener('input', salvar);
      abrirN(0);
    }

    /* ---------- Equipe ---------- */
    function vEquipe(v) {
      var eq = [['Mariana Alves', 'Administradora', 'online', 128, '34%', 22], ['Rafael Lima', 'Comercial', 'online', 96, '29%', 17], ['Carla Souza', 'Atendimento', 'ausente', 141, '21%', 25], ['Agente de IA', 'Atendimento 24h', 'online', 1208, '—', 0]];
      v.innerHTML = '<div class="sd-head"><h3 class="sd-h">Equipe<small>Quem está online e como cada um está indo no mês</small></h3><button class="sd-btn ghost" type="button" data-conv><i data-lucide="user-plus"></i>Convidar</button></div>' +
        '<div class="sd-card" style="padding:.3rem .9rem"><div class="sd-team sd-team-h"><span>Pessoa</span><span>Atendimentos</span><span>Conversão</span><span>Tarefas feitas</span></div>' +
        eq.map(function (p, i) {
          var ia = p[0] === 'Agente de IA';
          return '<div class="sd-team"><div class="sd-team-p">' + (ia ? '<span class="sd-av" style="--av:var(--sd-accent)">✦</span>' : av(p[0], i)) + '<div><b>' + p[0] + '</b><small><i class="sd-dot ' + (p[2] === 'online' ? 'on' : '') + '"></i>' + p[1] + '</small></div></div><span>' + p[3].toLocaleString('pt-BR') + '</span><span>' + p[4] + '</span><span>' + (ia ? '<span class="sd-chip gold">24h ativo</span>' : p[5]) + '</span></div>';
        }).join('') + '</div>';
      $('[data-conv]', v).addEventListener('click', function () { this.innerHTML = '<i data-lucide="check"></i>Convite enviado'; icones(); });
    }

    /* ================= PAINEL DO CLIENTE (portal) ================= */
    /* ---------- Visão geral ---------- */
    function vCliGeral(v) {
      v.innerHTML = '<div class="sd-head"><h3 class="sd-h">Olá, Dra. Helena 👋<small>Clínica Bem Viver · hoje, quarta-feira</small></h3><span class="sd-chip ok">● IA atendendo agora</span></div>' +
        '<div class="sd-kpis sd-stagger">' + kpi('calendar-check', 'Consultas hoje', 14, 'int', '', '+3') + kpi('user-check', 'Comparecimento', 92, 'int', '%', '+6%') +
        kpi('message-circle', 'Conversas da IA', 86, 'int', '', '+21%') + kpi('wallet', 'Faturamento do mês', 63480, 'brl', '', '+15%') + '</div>' +
        '<div class="sd-grid2 sd-stagger"><div class="sd-card"><p class="sd-card-t">Próximos atendimentos <span>hoje</span></p>' +
        [['09:00', 'Mariana Alves', 'Avaliação', 'ok', 'Confirmado'], ['10:30', 'Bruno Ferreira', 'Retorno', 'wait', 'Aguardando'], ['14:00', 'Camila Rocha', 'Limpeza de pele', 'ok', 'Confirmado'], ['15:30', 'Ana Paula Santos', 'Drenagem', 'info', 'Reagendado']].map(function (a, i) {
          return '<div class="sd-appt"><span class="sd-appt-h">' + a[0] + '</span>' + av(a[1], i) + '<div><b>' + a[1] + '</b><small>' + a[2] + '</small></div><span class="sd-chip ' + a[3] + '">' + a[4] + '</span></div>';
        }).join('') + '</div><div class="sd-card"><p class="sd-card-t">O que a IA fez por você hoje</p><div class="sd-feed">' +
        feed('bot', 'Respondeu <b>23 conversas</b> no WhatsApp', 'tempo médio: 4s') + feed('calendar-plus', 'Marcou <b>5 consultas</b> novas', 'sem conflito de horário') +
        feed('bell-ring', 'Enviou <b>14 lembretes</b> de consulta', 'faltas caíram 38%') + feed('star', 'Pediu avaliação a <b>8 pacientes</b>', '6 avaliações 5★') + '</div></div></div>';
    }

    /* ---------- Agenda do dia ---------- */
    var CONSULTAS = [
      ['08:00', 'Larissa Souza', 'Consulta inicial', 'Dra. Paula', 'Confirmado'], ['09:00', 'Mariana Alves', 'Avaliação', 'Dra. Helena', 'Confirmado'],
      ['10:30', 'Bruno Ferreira', 'Retorno', 'Dr. Marcos', 'Aguardando'], ['11:30', 'Renato Oliveira', 'Fisioterapia', 'Dr. Marcos', 'Confirmado'],
      ['14:00', 'Camila Rocha', 'Limpeza de pele', 'Dra. Paula', 'Confirmado'], ['15:30', 'Ana Paula Santos', 'Drenagem linfática', 'Dra. Sofia', 'Reagendado'],
      ['17:00', 'Patrícia Gomes', 'Harmonização', 'Dra. Helena', 'Aguardando']
    ];
    function vCliAgenda(v) {
      var cls = { 'Confirmado': 'ok', 'Aguardando': 'wait', 'Reagendado': 'info', 'Compareceu': 'gold', 'Faltou': 'bad' };
      v.innerHTML = '<div class="sd-head"><h3 class="sd-h">Agenda de hoje<small>Toque no status para atualizar · a IA confirma pelo WhatsApp</small></h3>' +
        '<div class="sd-seg" role="group" aria-label="Profissional"><button aria-pressed="true" data-p="">Todos</button><button aria-pressed="false" data-p="Dra. Helena">Dra. Helena</button><button aria-pressed="false" data-p="Dr. Marcos">Dr. Marcos</button><button aria-pressed="false" data-p="Dra. Paula">Dra. Paula</button></div></div>' +
        '<div class="sd-card" style="padding:.3rem .9rem"><div class="sd-day"></div></div>';
      var pro = '';
      var pintar = function () {
        $('.sd-day', v).innerHTML = CONSULTAS.map(function (c, i) { return [c, i]; }).filter(function (x) { return !pro || x[0][3] === pro; }).map(function (x) {
          var c = x[0], i = x[1];
          return '<div class="sd-appt"><span class="sd-appt-h">' + c[0] + '</span>' + av(c[1], i) + '<div><b>' + c[1] + '</b><small>' + c[2] + ' · ' + c[3] + '</small></div>' +
            '<button class="sd-chip ' + cls[c[4]] + ' sd-st" type="button" data-i="' + i + '" title="Mudar status">' + c[4] + ' ▾</button></div>';
        }).join('');
      };
      var ordem = ['Confirmado', 'Compareceu', 'Faltou', 'Reagendado', 'Aguardando'];
      v.addEventListener('click', function (e) {
        var s = e.target.closest('.sd-st'); if (s) { var c = CONSULTAS[+s.dataset.i]; c[4] = ordem[(ordem.indexOf(c[4]) + 1) % ordem.length]; pintar(); return; }
        var f = e.target.closest('.sd-seg button'); if (f) { pro = f.dataset.p; $$('.sd-seg button', v).forEach(function (o) { o.setAttribute('aria-pressed', String(o === f)); }); pintar(); }
      });
      pintar();
    }

    /* ---------- Clientes ---------- */
    var PACIENTES = [
      ['Mariana Alves', '(11) 9••••-4456', 'Harmonização facial', '12 out', 7, 'Instagram'], ['Bruno Ferreira', '(11) 9••••-1180', 'Avaliação estética', '10 out', 2, 'Google'],
      ['Camila Rocha', '(11) 9••••-7732', 'Limpeza de pele', '08 out', 11, 'Indicação'], ['Fernanda Lima', '(11) 9••••-2241', 'Botox', '02 out', 4, 'Site'],
      ['Renato Oliveira', '(11) 9••••-7755', 'Fisioterapia', '29 set', 9, 'Indicação'], ['Patrícia Gomes', '(11) 9••••-8821', 'Harmonização facial', '25 set', 3, 'Google'],
      ['Larissa Souza', '(11) 9••••-4419', 'Consulta inicial', 'hoje', 1, 'Instagram']
    ];
    function vCliClientes(v) {
      v.innerHTML = '<div class="sd-head"><h3 class="sd-h">Clientes<small>' + PACIENTES.length + ' cadastrados · clique para ver o histórico</small></h3>' +
        '<label class="sd-search"><i data-lucide="search"></i><input type="search" placeholder="Buscar por nome ou serviço" aria-label="Buscar cliente"></label></div>' +
        '<div class="sd-card" style="padding:.3rem .9rem"><div class="sd-team sd-team-h sd-cli"><span>Cliente</span><span>Último serviço</span><span>Visitas</span><span>Origem</span></div><div class="sd-cli-list"></div></div>';
      var pintar = function (q) {
        q = (q || '').toLowerCase();
        $('.sd-cli-list', v).innerHTML = PACIENTES.map(function (p, i) { return [p, i]; }).filter(function (x) { return !q || (x[0][0] + ' ' + x[0][2]).toLowerCase().indexOf(q) >= 0; }).map(function (x) {
          var p = x[0], i = x[1];
          return '<button class="sd-team sd-cli sd-row-btn" type="button" data-i="' + i + '"><div class="sd-team-p">' + av(p[0], i) + '<div><b>' + p[0] + '</b><small>' + p[1] + '</small></div></div><span>' + p[2] + '<small>' + p[3] + '</small></span><span>' + p[4] + '</span><span><span class="sd-chip info">' + p[5] + '</span></span></button>';
        }).join('') || '<p class="sd-empty">Ninguém encontrado.</p>';
      };
      $('input', v).addEventListener('input', function () { pintar(this.value); });
      v.addEventListener('click', function (e) {
        var b = e.target.closest('.sd-row-btn'); if (!b) return; var p = PACIENTES[+b.dataset.i];
        abrirDrawer('<div style="display:flex;gap:.7rem;align-items:center;margin-top:.2rem">' + av(p[0], +b.dataset.i) + '<div><b style="font-size:14px">' + p[0] + '</b><br><small style="color:var(--sd-muted)">' + p[1] + '</small></div></div>' +
          '<dl class="sd-dl"><dt>Visitas</dt><dd>' + p[4] + '</dd><dt>Último serviço</dt><dd>' + p[2] + '</dd><dt>Origem</dt><dd>' + p[5] + '</dd><dt>Gasto total</dt><dd>' + brl(p[4] * 420) + '</dd></dl>' +
          '<p class="sd-card-t" style="margin-bottom:.4rem">Histórico</p><div class="sd-timeline"><div>' + p[2] + '<small>' + p[3] + ' · pago no Pix</small></div><div>Lembrete enviado pela IA<small>1 dia antes</small></div><div>Primeiro contato pelo ' + p[5] + '<small>há 6 meses</small></div></div>' +
          '<div style="display:flex;gap:.5rem;margin-top:1.1rem"><button class="sd-btn" type="button"><i data-lucide="message-circle"></i>WhatsApp</button><button class="sd-btn ghost" type="button"><i data-lucide="calendar-plus"></i>Agendar</button></div>');
      });
      pintar('');
    }

    /* ---------- Documentos ---------- */
    var DOCS = [
      ['Contrato de prestação de serviço.pdf', 'Enviado por você', '12 out', 'ok', 'Validado'], ['Nota fiscal — setembro.pdf', 'Gerado pelo sistema', '05 out', 'ok', 'Disponível'],
      ['Alvará de funcionamento 2026.pdf', 'Vence em 20 dias', '01 out', 'wait', 'Vence em breve'], ['Comprovante — Fornecedor Alfa.jpg', 'Recebido pelo WhatsApp', '28 set', 'info', 'Em análise'],
      ['Certidão negativa de débitos.pdf', 'Emitida automaticamente', '20 set', 'ok', 'Válida']
    ];
    function vCliDocs(v) {
      v.innerHTML = '<div class="sd-head"><h3 class="sd-h">Documentos<small>Tudo num lugar só · o sistema avisa antes de vencer</small></h3></div>' +
        '<button class="sd-drop" type="button"><i data-lucide="upload-cloud"></i><b>Arraste um arquivo aqui ou clique para enviar</b><small>PDF, imagem ou planilha · demonstração</small></button>' +
        '<div class="sd-card" style="padding:.3rem .9rem;margin-top:.8rem"><div class="sd-docs"></div></div>';
      var pintar = function () {
        $('.sd-docs', v).innerHTML = DOCS.map(function (d) {
          var ext = d[0].split('.').pop();
          return '<div class="sd-doc"><span class="sd-ext">' + ext.toUpperCase() + '</span><div><b>' + esc(d[0]) + '</b><small>' + d[1] + ' · ' + d[2] + '</small></div><span class="sd-chip ' + d[3] + '">' + d[4] + '</span></div>';
        }).join('');
      };
      $('.sd-drop', v).addEventListener('click', function () {
        var n = ['Extrato bancário — outubro.pdf', 'Contrato social.pdf', 'Foto do comprovante.jpg'][DOCS.length % 3];
        DOCS.unshift([n, 'Enviado agora', 'hoje', 'info', 'Em análise']); pintar();
        var b = this; b.classList.add('ok'); setTimeout(function () { b.classList.remove('ok'); }, 900);
      });
      pintar();
    }

    /* ---------- Meu plano ---------- */
    function vCliPlano(v) {
      v.innerHTML = '<div class="sd-head"><h3 class="sd-h">Meu plano<small>Sua assinatura com a VCA</small></h3><span class="sd-chip ok">● Em dia</span></div>' +
        '<div class="sd-grid2"><div class="sd-card sd-plan"><span class="sd-chip gold">Plano Completo</span><strong>R$ 890<small>/mês</small></strong>' +
        '<ul><li><i data-lucide="check"></i>Sistema e CRM sob medida</li><li><i data-lucide="check"></i>Agente de IA no WhatsApp 24h</li><li><i data-lucide="check"></i>Automações e integrações</li><li><i data-lucide="check"></i>Suporte e melhorias todo mês</li></ul>' +
        '<div class="sd-plan-next"><span>Próximo vencimento</span><b>10 de novembro</b></div><button class="sd-btn" type="button" data-pagar style="width:100%;justify-content:center"><i data-lucide="qr-code"></i>Pagar com Pix</button></div>' +
        '<div class="sd-card"><p class="sd-card-t">Histórico de pagamentos</p><div class="sd-tx">' +
        [['Outubro', '10 out', 'ok', 'Pago'], ['Setembro', '10 set', 'ok', 'Pago'], ['Agosto', '10 ago', 'ok', 'Pago'], ['Julho', '10 jul', 'ok', 'Pago']].map(function (p) {
          return '<div class="sd-tx-row"><div><b>Mensalidade · ' + p[0] + '</b><small>Pix · ' + p[1] + '</small></div><span class="sd-chip ' + p[2] + '">' + p[3] + '</span><strong>' + brl(890) + '</strong></div>';
        }).join('') + '</div></div></div>';
      $('[data-pagar]', v).addEventListener('click', function () { this.innerHTML = '<i data-lucide="check"></i>Pix copiado (demonstração)'; icones(); });
    }

    montarMenu();
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
    // passa sozinha; pausa só com foco de teclado ou aba escondida e continua de onde parou
    function pausar() { if (pausado) return; pausado = true; show.classList.add('paused'); clearTimeout(timer); resta = Math.max(400, resta - (Date.now() - inicioCena)); }
    function seguir() { if (!pausado) return; pausado = false; show.classList.remove('paused'); agendar(); }
    $('[data-prev]', show).addEventListener('click', function () { ir(i - 1, true); });
    $('[data-next]', show).addEventListener('click', function () { ir(i + 1, true); });
    pips.forEach(function (p, k) { p.addEventListener('click', function () { ir(k, true); }); });
    var ultimoToque = 0;   // foco que veio de clique/toque não pausa; só navegação por teclado (Tab)
    show.addEventListener('pointerdown', function () { ultimoToque = Date.now(); if (pausado) seguir(); }, true);
    show.addEventListener('focusin', function () { if (Date.now() - ultimoToque > 600) pausar(); });
    show.addEventListener('focusout', function (e) { if (!show.contains(e.relatedTarget)) seguir(); });
    document.addEventListener('visibilitychange', function () { if (document.hidden) pausar(); else seguir(); });
    // só roda quando a vitrine está na tela (não gasta nada fora dela) e recomeça a cena ao voltar
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (en) {
        var v = en[0].isIntersecting;
        if (v && !visivel) { visivel = true; ir(i); } else if (!v) { visivel = false; clearTimeout(timer); }
      }, { threshold: 0.35 }).observe(show);
    } else { visivel = true; ir(0); }
  }
})();
