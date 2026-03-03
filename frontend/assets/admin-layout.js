(function () {
  var isAdmin = window.location.pathname.indexOf('/admin/') !== -1;
  if (!isAdmin) return;
  var page = window.location.pathname.split('/').pop() || 'dashboard.html';
  var isLoginPage = page === 'login.html';

  function ensureAsset(tag, key, attrs) {
    if (document.querySelector('[data-shared-asset="' + key + '"]')) return;
    var el = document.createElement(tag);
    el.setAttribute('data-shared-asset', key);
    Object.keys(attrs).forEach(function (k) { el.setAttribute(k, attrs[k]); });
    document.head.appendChild(el);
  }

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

  ensureAsset('script', 'api-config-admin', { src: '../assets/api-config.js' });
  ensureAsset('script', 'admin-auth-js', { src: '../assets/admin-auth.js' });
  ensureAsset('link', 'admin-polish-css', { rel: 'stylesheet', href: '../assets/admin-polish.css' });
  if (!isLoginPage) {
    ensureAsset('link', 'popup-css-admin', { rel: 'stylesheet', href: '../assets/action-popup.css' });
    ensureAsset('script', 'popup-js-admin', { src: '../assets/action-popup.js' });
  }
  ensureAsset('script', 'hardening-js-admin', { src: '../assets/frontend-hardening.js' });
  ensureAsset('script', 'admin-ux-js', { src: '../assets/admin-ux.js' });
  ensureAsset('script', 'admin-settings-tabs-js', { src: '../assets/admin-settings-tabs.js' });
  ensureAsset('script', 'admin-tab-groups-js', { src: '../assets/admin-tab-groups.js' });
  ensureAsset('script', 'admin-data-js', { src: '../assets/admin-data.js' });
  ensureMeta('robots', 'noindex,nofollow');

  if (isLoginPage) {
    return;
  }

  document.body.classList.add('admin-unified-layout');
  var coreLinks = [
    ['dashboard.html', 'dashboard', 'Dashboard'],
    ['works.html', 'work', 'Works'],
    ['categories.html', 'category', 'Categories'],
    ['tags.html', 'sell', 'Tags'],
    ['highlights.html', 'star', 'Highlights'],
    ['banners.html', 'gallery_thumbnail', 'Banners'],
    ['services.html', 'design_services', 'Services'],
    ['testimonials.html', 'chat', 'Testimonials'],
    ['cv.html', 'description', 'CV'],
    ['leads.html', 'mark_email_unread', 'Leads']
  ];

  var settingsLinks = [
    ['settings.html', 'settings', 'Settings']
  ];

  document.querySelectorAll('header, aside').forEach(function (el) {
    el.style.display = 'none';
  });

  var main = document.querySelector('main');
  if (main) {
    main.classList.remove('ml-64');
    main.classList.add('admin-main-adjust');
    main.classList.add('admin-content-root');
    if (!main.querySelector('.admin-live-banner')) {
      var banner = document.createElement('div');
      banner.className = 'admin-live-banner';
      banner.innerHTML = '<strong>Live Mode:</strong> Admin panel menggunakan data API backend. Pastikan login sebagai admin.';
      main.insertBefore(banner, main.firstChild);
    }
  }

  var shell = document.createElement('div');
  shell.className = 'admin-shell-shared';
  shell.innerHTML =
    '<button id="admin-menu-btn" class="admin-mobile-menu-btn" aria-expanded="false" aria-controls="admin-sidebar" aria-label="Toggle admin menu">' +
    '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>' +
    '</button>' +
    '<div id="admin-backdrop" class="admin-backdrop"></div>' +
    '<aside id="admin-sidebar" class="admin-shared-sidebar">' +
    '<a class="admin-brand" href="dashboard.html"><span>FAIZNUTE CMS</span><small>Admin Panel</small></a>' +
    '<p class="admin-side-section">Dashboard</p>' +
    '<nav class="admin-side-links">' +
    coreLinks
      .map(function (item) {
        var cls = item[0] === page ? 'admin-side-link active' : 'admin-side-link';
        var current = item[0] === page ? ' aria-current="page"' : '';
        return '<a class="' + cls + '" href="' + item[0] + '"' + current + '><span class="material-symbols-outlined">' + item[1] + '</span><span>' + item[2] + '</span></a>';
      })
      .join('') +
    '</nav>' +
    '<p class="admin-side-section">System</p>' +
    '<nav class="admin-side-links">' +
    settingsLinks
      .map(function (item) {
        var active = page === 'settings.html';
        var cls = active ? 'admin-side-link active' : 'admin-side-link';
        var current = active ? ' aria-current="page"' : '';
        return '<a class="' + cls + '" href="' + item[0] + '"' + current + '><span class="material-symbols-outlined">' + item[1] + '</span><span>' + item[2] + '</span></a>';
      })
      .join('') +
    '</nav>' +
    '<div class="admin-shortcut-hint"><p>Shortcut: <b>/</b> search, <b>gd</b> dashboard, <b>gw</b> works, <b>gs</b> settings</p><button id="admin-logout-btn" class="admin-logout-inline" style="margin-top:8px;border:1px solid #cbd5e1;border-radius:8px;padding:6px 10px;font-size:12px;">Logout</button></div>' +
    '</aside>';

  document.body.insertBefore(shell, document.body.firstChild);
  document.body.classList.remove('admin-preload');

  var btn = document.getElementById('admin-menu-btn');
  var sidebar = document.getElementById('admin-sidebar');
  var backdrop = document.getElementById('admin-backdrop');

  function useDimBackdrop() {
    return window.matchMedia('(max-width: 640px)').matches;
  }

  function setOpen(open) {
    if (!btn || !sidebar || !backdrop) return;
    btn.setAttribute('aria-expanded', String(open));
    sidebar.classList.toggle('open', open);
    backdrop.classList.toggle('open', open && useDimBackdrop());
    document.body.classList.toggle('admin-lock-scroll', open && useDimBackdrop());
  }

  if (btn) {
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') !== 'true';
      setOpen(open);
    });
  }

  if (backdrop) {
    backdrop.addEventListener('click', function () {
      setOpen(false);
    });
  }

  if (sidebar) {
    sidebar.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        if (window.innerWidth < 1024) setOpen(false);
      });
    });
  }

  window.addEventListener('resize', function () {
    if (btn && btn.getAttribute('aria-expanded') === 'true' && window.innerWidth < 1024) {
      setOpen(true);
      return;
    }
    if (window.innerWidth >= 1024) {
      setOpen(false);
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setOpen(false);
  });

  var logoutBtn = document.getElementById('admin-logout-btn');
  if (logoutBtn && window.AdminAuth && typeof window.AdminAuth.logout === 'function') {
    logoutBtn.addEventListener('click', function () {
      window.AdminAuth.logout();
    });
  }
})();
