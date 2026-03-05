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

  function toAbsoluteUrl(value) {
    var raw = String(value || '').trim();
    if (!raw) return '';
    if (/^https?:\/\//i.test(raw)) return raw;
    if (!hasHttpOrigin()) return raw;
    try {
      return new URL(raw, window.location.origin).toString();
    } catch (error) {
      return raw;
    }
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
    if (!content) return;
    var existing = document.querySelector('meta[name="' + name + '"]');
    if (!existing) {
      existing = document.createElement('meta');
      existing.setAttribute('name', name);
      document.head.appendChild(existing);
    }
    existing.setAttribute('content', content);
  }

  function ensurePropertyMeta(property, content) {
    if (!content) return;
    var existing = document.querySelector('meta[property="' + property + '"]');
    if (!existing) {
      existing = document.createElement('meta');
      existing.setAttribute('property', property);
      document.head.appendChild(existing);
    }
    existing.setAttribute('content', content);
  }

  function ensureLink(rel, href) {
    if (!href) return;
    var existing = document.querySelector('link[rel="' + rel + '"]');
    if (!existing) {
      existing = document.createElement('link');
      existing.setAttribute('rel', rel);
      document.head.appendChild(existing);
    }
    existing.setAttribute('href', href);
  }

  function ensureOgUrl() {
    ensurePropertyMeta('og:url', absoluteCurrentUrl());
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

  function ensureSeoDefaults() {
    var title = String(document.title || '').trim();
    var descriptionMeta = document.querySelector('meta[name="description"]');
    var description = descriptionMeta ? String(descriptionMeta.getAttribute('content') || '').trim() : '';
    if (!description) {
      var p = document.querySelector('main p');
      description = p ? String((p.textContent || '').trim()) : '';
      if (description.length > 160) {
        description = description.slice(0, 157).trimEnd() + '...';
      }
      ensureMeta('description', description);
    }

    ensurePropertyMeta('og:type', 'website');
    ensurePropertyMeta('og:title', title || 'Faiznute');
    ensurePropertyMeta('og:description', description);
    ensureMeta('twitter:card', 'summary_large_image');
    ensureMeta('twitter:title', title || 'Faiznute');
    ensureMeta('twitter:description', description);

    var existingOgImage = document.querySelector('meta[property="og:image"]');
    var ogImage = existingOgImage ? String(existingOgImage.getAttribute('content') || '').trim() : '';
    if (!ogImage) {
      var firstImage = document.querySelector('main img, header img');
      ogImage = firstImage ? String(firstImage.getAttribute('src') || '').trim() : '';
    }

    ogImage = toAbsoluteUrl(ogImage);
    if (ogImage) {
      ensurePropertyMeta('og:image', ogImage);
      ensureMeta('twitter:image', ogImage);
    }
  }

  function ensureStructuredData() {
    var pathname = String(window.location.pathname || '/');
    if (pathname.indexOf('/admin/') === 0) return;
    if (!hasHttpOrigin()) return;

    var title = String(document.title || 'Faiznute').trim();
    var descriptionMeta = document.querySelector('meta[name="description"]');
    var description = descriptionMeta ? String(descriptionMeta.getAttribute('content') || '').trim() : '';
    var pageUrl = absoluteCurrentUrl();

    if (!document.querySelector('script[data-seo-schema="webpage"]')) {
      var webPageSchema = {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: title,
        description: description,
        url: pageUrl,
        inLanguage: String(document.documentElement.getAttribute('lang') || 'id'),
      };

      var webPageNode = document.createElement('script');
      webPageNode.type = 'application/ld+json';
      webPageNode.setAttribute('data-seo-schema', 'webpage');
      webPageNode.textContent = JSON.stringify(webPageSchema);
      document.head.appendChild(webPageNode);
    }

    var segments = pathname
      .split('/')
      .filter(function (part) { return String(part || '').trim() !== ''; });

    if (!segments.length || document.querySelector('script[data-seo-schema="breadcrumbs"]')) return;

    var itemList = [{
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: window.location.origin + '/',
    }];

    var currentPath = '';
    segments.forEach(function (segment, idx) {
      currentPath += '/' + segment;
      itemList.push({
        '@type': 'ListItem',
        position: idx + 2,
        name: decodeURIComponent(segment).replace(/[-_]+/g, ' '),
        item: window.location.origin + currentPath,
      });
    });

    var breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: itemList,
    };

    var breadcrumbNode = document.createElement('script');
    breadcrumbNode.type = 'application/ld+json';
    breadcrumbNode.setAttribute('data-seo-schema', 'breadcrumbs');
    breadcrumbNode.textContent = JSON.stringify(breadcrumbSchema);
    document.head.appendChild(breadcrumbNode);
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

  function enhanceGridFlexLayouts() {
    var main = document.querySelector('main');
    if (!main) return;

    main.querySelectorAll(':scope > section').forEach(function (section) {
      var firstContainer = section.querySelector(':scope > div[class*="max-w"]');
      if (firstContainer) {
        firstContainer.classList.add('fx-stack');
      }

      section.querySelectorAll('article, .rounded-2xl.border, .rounded-3xl.border, .rounded-xl.border').forEach(function (card) {
        card.classList.add('fx-card');
      });
    });
  }

  function setupScrollProgress() {
    if (document.querySelector('[data-scroll-progress]')) return;
    var progress = document.createElement('div');
    progress.setAttribute('data-scroll-progress', '1');
    progress.className = 'scroll-progress';
    progress.innerHTML = '<span></span>';
    document.body.appendChild(progress);

    var bar = progress.querySelector('span');
    function update() {
      if (!bar) return;
      var scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
      var docHeight = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      var ratio = Math.max(0, Math.min(1, scrollTop / docHeight));
      bar.style.transform = 'scaleX(' + ratio + ')';
    }

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
  }

  function setupRevealOnScroll() {
    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var candidates = [];
    var main = document.querySelector('main');
    if (!main) return;

    main.querySelectorAll(':scope > section').forEach(function (section) {
      var targets = section.querySelectorAll('h1, h2, h3, p, .grid > *, .flex > *, article, .fx-card, li');
      targets.forEach(function (node, idx) {
        if (!node.classList.contains('fx-reveal')) {
          node.classList.add('fx-reveal');
        }
        node.style.setProperty('--fx-delay', String((idx % 6) * 55) + 'ms');
        candidates.push(node);
      });
    });

    if (!candidates.length) return;

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      candidates.forEach(function (node) {
        node.classList.add('fx-in');
      });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('fx-in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    candidates.forEach(function (node) {
      observer.observe(node);
    });
  }

  ensureCanonical();
  ensureOgUrl();
  ensureLang();
  ensureBrandAssets();
  ensureSeoDefaults();
  ensureStructuredData();
  hardenExternalLinks();
  addAriaForIconButtons();
  optimizeImages();
  ensureButtonTypes();
  enhanceGridFlexLayouts();
  setupScrollProgress();
  setupRevealOnScroll();
})();
