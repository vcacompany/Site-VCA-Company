/* Páginas do blog: tema claro/escuro, barra do topo ao rolar, menu do celular e filtro por assunto.
   É o mesmo comportamento do script.js da página inicial, sem as animações que só existem lá. */
(function () {
    var raiz = document.documentElement;

    var meta = document.querySelector('meta[name="theme-color"]');
    var corDoTema = function () {
        if (meta) meta.setAttribute('content', raiz.getAttribute('data-theme') === 'light' ? '#F6F7F9' : '#0A0D13');
    };
    corDoTema();
    document.querySelectorAll('.theme-toggle').forEach(function (btn) {
        btn.addEventListener('click', function () {
            var claro = raiz.getAttribute('data-theme') === 'light';
            if (claro) raiz.removeAttribute('data-theme'); else raiz.setAttribute('data-theme', 'light');
            try { localStorage.setItem('vca-theme', claro ? 'dark' : 'light'); } catch (e) {}
            corDoTema();
        });
    });


    /* pontinhos dourados ligados por linhas no fundo (02/11, o João: "deixe o efeito em todas as páginas do site").
       O mesmo do script.js da página inicial: 35 pontos, o mouse empurra, o clique dá um pulso. Só no computador
       e sem animação para quem pediu menos movimento. */
    var tela = document.getElementById('particleCanvas');
    var semMovimento = false;
    try { semMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
    if (tela && window.innerWidth > 1024 && !semMovimento && tela.getContext) {
        var ctx = tela.getContext('2d');
        var mouse = { x: null, y: null, raio: 150 };
        var pulso = 0;
        var medir = function () { tela.width = window.innerWidth; tela.height = window.innerHeight; };
        var espera;
        window.addEventListener('resize', function () { clearTimeout(espera); espera = setTimeout(medir, 200); }, { passive: true });
        medir();
        window.addEventListener('mousemove', function (e) { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
        window.addEventListener('click', function () { pulso = 1; }, { passive: true });
        var pontos = [];
        for (var i = 0; i < 35; i++) {
            pontos.push({ x: Math.random() * tela.width, y: Math.random() * tela.height, r: Math.random() * 2 + 1.5, vx: (Math.random() - 0.5) * 0.8, vy: (Math.random() - 0.5) * 0.8 });
        }
        var quadro = function () {
            ctx.clearRect(0, 0, tela.width, tela.height);
            if (pulso > 0) pulso = Math.max(0, pulso - 0.05);
            var max = pulso ? 200 + pulso * 100 : 150;
            for (var a = 0; a < pontos.length; a++) {
                var p = pontos[a];
                p.x += p.vx; p.y += p.vy;
                if (p.x < 0 || p.x > tela.width) p.vx *= -1;
                if (p.y < 0 || p.y > tela.height) p.vy *= -1;
                if (mouse.x !== null) {
                    var mx = mouse.x - p.x, my = mouse.y - p.y, d2 = mx * mx + my * my;
                    if (d2 < mouse.raio * mouse.raio && d2 > 0) { var d = Math.sqrt(d2), f = (mouse.raio - d) / mouse.raio; p.x -= mx / d * f * 3; p.y -= my / d * f * 3; }
                }
                ctx.fillStyle = 'rgba(202, 158, 53, ' + (0.6 + pulso * 0.4) + ')';
                ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
                for (var b = a + 1; b < pontos.length; b++) {
                    var q = pontos[b], dx = p.x - q.x, dy = p.y - q.y, dd = dx * dx + dy * dy;
                    if (dd < max * max) {
                        ctx.strokeStyle = 'rgba(202, 158, 53, ' + ((1 - Math.sqrt(dd) / max) * (pulso ? 0.6 + pulso * 0.4 : 0.4)) + ')';
                        ctx.lineWidth = 0.8;
                        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(quadro);
        };
        quadro();
    } else if (tela) {
        tela.remove();
    }

    var barra = document.querySelector('.navbar');
    var rolou = function () { if (barra) barra.classList.toggle('navbar-scrolled', window.scrollY > 50); };
    window.addEventListener('scroll', rolou, { passive: true });
    rolou();

    var menu = document.getElementById('mobileMenu');
    var abre = function (sim) {
        if (!menu) return;
        menu.classList.toggle('active', sim);
        document.body.style.overflow = sim ? 'hidden' : '';
    };
    var botaoMenu = document.getElementById('menuToggle');
    var botaoFechar = document.getElementById('menuClose');
    if (botaoMenu) botaoMenu.addEventListener('click', function () { abre(true); });
    if (botaoFechar) botaoFechar.addEventListener('click', function () { abre(false); });
    document.querySelectorAll('.mobile-nav-link, .mobile-menu-links .btn').forEach(function (a) {
        a.addEventListener('click', function () { abre(false); });
    });

    // primeira página da visita: o agendamento na página inicial manda junto, para saber qual artigo ou nicho trouxe o diagnóstico
    try { if (!sessionStorage.getItem('vca_origem')) sessionStorage.setItem('vca_origem', location.pathname); } catch (e) {}
    // clique em qualquer botão do diagnóstico vira evento no rastreamento próprio (Tráfego → Site no painel)
    document.addEventListener('click', function (e) {
        var a = e.target.closest && e.target.closest('[data-cta="diagnostico"], a[href*="#agendar"]');
        if (a && window.vcaSite) window.vcaSite('clique_diagnostico', { pagina: location.pathname });
    });

    // páginas de nicho: o botão fixo do diagnóstico aparece no celular depois que a pessoa passa do topo
    var fixo = document.querySelector('.nicho-fixo');
    var heroi = document.querySelector('.nicho-hero');
    if (fixo && heroi) {
        var mostraFixo = function () { fixo.classList.toggle('visivel', heroi.getBoundingClientRect().bottom < 0); };
        window.addEventListener('scroll', mostraFixo, { passive: true });
        mostraFixo();
    }

    // filtro por assunto na lista do blog (sem JavaScript, todos os artigos continuam visíveis)
    var filtros = document.querySelectorAll('.blog-filtro');
    filtros.forEach(function (btn) {
        btn.addEventListener('click', function () {
            var cat = btn.getAttribute('data-filtro');
            filtros.forEach(function (b) { b.classList.toggle('is-active', b === btn); });
            document.querySelectorAll('.blog-grid-lista .blog-card').forEach(function (card) {
                card.hidden = !!cat && card.getAttribute('data-cat') !== cat;
            });
        });
    });
})();
