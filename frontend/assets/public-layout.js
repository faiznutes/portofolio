(function () {
  function ensureMeta(name, content) {
    var existing = document.querySelector('meta[name="' + name + '"]');
    if (existing) {
      existing.setAttribute('content', content);
      return;
    }
    var m = document.createElement('meta');
    m.setAttribute('name', name);
    m.setAttribute('content', content);
    document.head.appendChild(m);
  }

  var host = String(window.location.hostname || '').toLowerCase();
  if (host === 'faiznute.site' || host === 'www.faiznute.site') {
    ensureMeta('portfolio-api-base', 'https://faiznute.site');
  }

  function ensureAsset(tag, key, attrs) {
    if (document.querySelector('[data-shared-asset="' + key + '"]')) return;
    var el = document.createElement(tag);
    el.setAttribute('data-shared-asset', key);
    Object.keys(attrs).forEach(function (k) { el.setAttribute(k, attrs[k]); });
    document.head.appendChild(el);
  }

  function registerServiceWorker() {
    if (!('serviceWorker' in navigator)) return;
    var isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (window.location.protocol !== 'https:' && !isLocalhost) return;
    navigator.serviceWorker.register('/sw.js').catch(function () {
      // Ignore registration error to avoid blocking page UX.
    });
  }

  ensureAsset('link', 'popup-css', { rel: 'stylesheet', href: 'assets/action-popup.css' });
  ensureAsset('link', 'public-shared-css', { rel: 'stylesheet', href: 'assets/public-shared.css' });
  ensureAsset('link', 'public-polish-css', { rel: 'stylesheet', href: 'assets/public-polish.css' });
  ensureAsset('script', 'popup-js', { src: 'assets/action-popup.js' });
  ensureAsset('script', 'hardening-js', { src: 'assets/frontend-hardening.js' });

  var active = document.body.getAttribute('data-page') || '';
  var headerTarget = document.getElementById('app-header');
  var footerTarget = document.getElementById('app-footer');

  function navClass(key) {
    return key === active
      ? 'text-primary font-bold'
      : 'text-slate-700 hover:text-primary';
  }

  function mobileNavClass(key) {
    return key === active
      ? 'text-primary bg-primary/10 font-bold'
      : 'text-slate-700 hover:bg-slate-100';
  }

  function ariaCurrent(key) {
    return key === active ? ' aria-current="page"' : '';
  }

  if (headerTarget) {
    headerTarget.innerHTML =
      '<a href="#main-content" class="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[60] focus:rounded focus:bg-white focus:px-3 focus:py-2 focus:text-sm focus:font-bold">Skip to content</a>' +
      '<header class="fixed inset-x-0 top-0 z-50 border-b border-slate-200 bg-bg-light/90 backdrop-blur-md">' +
      '  <div class="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-10">' +
      '    <a href="/" class="text-xl font-extrabold tracking-tight">FAIZNUTE</a>' +
      '    <nav class="hidden items-center gap-8 text-sm font-semibold lg:flex">' +
      '      <a class="' + navClass('home') + '" href="/"' + ariaCurrent('home') + '>Home</a>' +
      '      <a class="' + navClass('works') + '" href="/works"' + ariaCurrent('works') + '>Karya</a>' +
      '      <a class="' + navClass('services') + '" href="/services"' + ariaCurrent('services') + '>Layanan</a>' +
      '      <a class="' + navClass('insights') + '" href="/insights"' + ariaCurrent('insights') + '>Insights</a>' +
      '      <a class="' + navClass('cv') + '" href="/cv"' + ariaCurrent('cv') + '>CV</a>' +
      '      <a class="' + navClass('contact') + '" href="/contact"' + ariaCurrent('contact') + '>Kontak</a>' +
      '    </nav>' +
      '    <div class="hidden lg:block">' +
      '      <a href="/contact" class="rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white">Konsultasi</a>' +
      '    </div>' +
      '    <button id="mobile-menu-btn" class="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white p-2 text-slate-700 lg:hidden" aria-expanded="false" aria-controls="mobile-menu" aria-label="Toggle menu">' +
      '      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>' +
      '    </button>' +
      '  </div>' +
      '  <div id="mobile-menu" class="hidden border-t border-slate-200 bg-white px-6 py-4 lg:hidden">' +
      '    <nav class="flex flex-col gap-1 text-sm font-semibold">' +
      '      <a class="rounded-lg px-3 py-2 ' + mobileNavClass('home') + '" href="/"' + ariaCurrent('home') + '>Home</a>' +
      '      <a class="rounded-lg px-3 py-2 ' + mobileNavClass('works') + '" href="/works"' + ariaCurrent('works') + '>Karya</a>' +
      '      <a class="rounded-lg px-3 py-2 ' + mobileNavClass('services') + '" href="/services"' + ariaCurrent('services') + '>Layanan</a>' +
      '      <a class="rounded-lg px-3 py-2 ' + mobileNavClass('insights') + '" href="/insights"' + ariaCurrent('insights') + '>Insights</a>' +
      '      <a class="rounded-lg px-3 py-2 ' + mobileNavClass('cv') + '" href="/cv"' + ariaCurrent('cv') + '>CV</a>' +
      '      <a class="rounded-lg px-3 py-2 ' + mobileNavClass('contact') + '" href="/contact"' + ariaCurrent('contact') + '>Kontak</a>' +
      '      <a href="/contact" class="mt-2 rounded-xl bg-primary px-4 py-2.5 text-center text-sm font-bold text-white">Konsultasi</a>' +
      '    </nav>' +
      '  </div>' +
      '</header>';
    if (!document.getElementById('mobile-menu-backdrop')) {
      var overlay = document.createElement('div');
      overlay.id = 'mobile-menu-backdrop';
      overlay.className = 'mobile-menu-backdrop';
      document.body.appendChild(overlay);
    }
    document.body.style.paddingTop = '80px';

    var btn = document.getElementById('mobile-menu-btn');
    var menu = document.getElementById('mobile-menu');
    var backdrop = document.getElementById('mobile-menu-backdrop');
    var main = document.querySelector('main');
    if (main && !main.id) main.id = 'main-content';

    function useDimBackdrop() {
      return window.matchMedia('(max-width: 640px)').matches;
    }

    function setOpen(open) {
      if (!menu || !btn) return;
      menu.classList.toggle('hidden', !open);
      btn.setAttribute('aria-expanded', String(open));
      if (backdrop) {
        backdrop.classList.toggle('open', open && useDimBackdrop());
      }
      document.body.classList.toggle('lock-scroll', open && useDimBackdrop());
    }

    if (btn && menu) {
      btn.addEventListener('click', function () {
        var isOpen = !menu.classList.contains('hidden');
        setOpen(!isOpen);
      });
      menu.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
          setOpen(false);
        });
      });
      if (backdrop) {
        backdrop.addEventListener('click', function () {
          setOpen(false);
        });
      }
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') setOpen(false);
      });
      window.addEventListener('resize', function () {
        if (!menu.classList.contains('hidden')) {
          setOpen(true);
        }
      });
    }
  }

  if (footerTarget) {
    footerTarget.innerHTML =
      '<footer class="border-t border-slate-200 bg-white px-6 py-6 lg:px-10">' +
      '  <div class="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-sm text-slate-500 md:flex-row">' +
      '    <p>© 2026 Faiznute. All rights reserved.</p>' +
      '    <div class="flex gap-6"><a href="/contact" class="hover:text-primary">Contact</a><a href="/cv" class="hover:text-primary">About</a><a href="/insights" class="hover:text-primary">Insights</a><a href="/site-map" class="hover:text-primary">Sitemap</a></div>' +
      '  </div>' +
      '</footer>';
    var mainEl = document.querySelector('main');
    if (mainEl) {
      mainEl.style.minHeight = 'calc(100vh - 156px)';
    }
  }

  registerServiceWorker();
})();
