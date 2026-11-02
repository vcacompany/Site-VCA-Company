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
