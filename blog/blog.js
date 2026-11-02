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
