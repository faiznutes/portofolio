(function () {
  if (window.__frontendHardeningInit) return;
  window.__frontendHardeningInit = true;

  function hasHttpOrigin() {
    return /^https?:\/\//i.test(window.location.origin || '');
  }

  function absoluteCurrentUrl() {
    var path = window.location.pathname || '/';
    return hasHttpOrigin() ? window.location.origin + path : path;
  }

  function assetPrefix() {
    return (window.location.pathname || '').indexOf('/admin/') !== -1 ? '../' : '';
  }

  function ensureCanonical() {
    var existing = document.querySelector('link[rel="canonical"]');
    var canonical = existing || document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    canonical.setAttribute('href', absoluteCurrentUrl());
    if (!existing) document.head.appendChild(canonical);
  }

  function ensureMeta(name, content) {
    var existing = document.querySelector('meta[name="' + name + '"]');
    if (!existing) {
      existing = document.createElement('meta');
      existing.setAttribute('name', name);
      document.head.appendChild(existing);
    }
    existing.setAttribute('content', content);
  }

  function ensureLink(rel, href) {
    var existing = document.querySelector('link[rel="' + rel + '"]');
    if (!existing) {
      existing = document.createElement('link');
      existing.setAttribute('rel', rel);
      document.head.appendChild(existing);
    }
    existing.setAttribute('href', href);
  }

  function ensureOgUrl() {
    var existing = document.querySelector('meta[property="og:url"]');
    if (!existing) {
      existing = document.createElement('meta');
      existing.setAttribute('property', 'og:url');
      document.head.appendChild(existing);
    }
    existing.setAttribute('content', absoluteCurrentUrl());
  }

  function ensureLang() {
    if (!document.documentElement.getAttribute('lang')) {
      document.documentElement.setAttribute('lang', 'id');
    }
  }

  function ensureBrandAssets() {
    ensureMeta('theme-color', '#137fec');
    ensureLink('icon', assetPrefix() + 'favicon.svg');
    ensureLink('manifest', assetPrefix() + 'site.webmanifest');
    ensureLink('apple-touch-icon', assetPrefix() + 'favicon.svg');
  }

  function hardenExternalLinks() {
    document.querySelectorAll('a[target="_blank"]').forEach(function (a) {
      var rel = (a.getAttribute('rel') || '').toLowerCase();
      if (!rel.includes('noopener')) a.setAttribute('rel', 'noopener noreferrer');
    });
  }

  function addAriaForIconButtons() {
    document.querySelectorAll('button, a').forEach(function (el) {
      if (el.getAttribute('aria-label')) return;
      var text = (el.textContent || '').replace(/\s+/g, ' ').trim();
      var hasOnlyIcon = text === '';
      if (!hasOnlyIcon) return;
      var icon = el.querySelector('.material-symbols-outlined');
      if (!icon) return;
      var iconText = (icon.textContent || '').replace(/\s+/g, ' ').trim();
      if (!iconText) return;
      el.setAttribute('aria-label', iconText);
      if (!el.getAttribute('title')) el.setAttribute('title', iconText);
    });
  }

  function optimizeImages() {
    document.querySelectorAll('img').forEach(function (img, idx) {
      if (!img.getAttribute('decoding')) img.setAttribute('decoding', 'async');
      if (!img.getAttribute('loading')) {
        img.setAttribute('loading', idx < 2 ? 'eager' : 'lazy');
      }
    });
  }

  function ensureButtonTypes() {
    document.querySelectorAll('button').forEach(function (btn) {
      if (btn.getAttribute('type')) return;
      var form = btn.closest('form');
      if (!form) {
        btn.setAttribute('type', 'button');
        return;
      }
      var txt = (btn.textContent || '').toLowerCase();
      var submitLike = txt.includes('kirim') || txt.includes('submit') || txt.includes('save') || txt.includes('simpan');
      btn.setAttribute('type', submitLike ? 'submit' : 'button');
    });
  }

  ensureCanonical();
  ensureOgUrl();
  ensureLang();
  ensureBrandAssets();
  hardenExternalLinks();
  addAriaForIconButtons();
  optimizeImages();
  ensureButtonTypes();
})();
