(function () {
  if (window.__publicContentInit) return;
  window.__publicContentInit = true;

  var api = window.PORTFOLIO_API;
  if (!api) return;

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function getWorkCategory(work) {
    if (work && work.category && work.category.name) return work.category.name;
    return 'General';
  }

  function applyText(selector, value) {
    if (!value) return;
    var el = document.querySelector(selector);
    if (!el) return;
    el.textContent = value;
  }

  function applyLink(selector, href) {
    if (!href) return;
    var el = document.querySelector(selector);
    if (!el) return;
    el.setAttribute('href', href);
  }

  function normalizeInternalUrl(url) {
    var value = String(url || '').trim();
    if (!value) return '';
    if (/^https?:\/\//i.test(value)) return value;
    value = value.replace(/\.html(?=($|[?#]))/i, '');
    if (value.indexOf('/') === 0) return value;
    return '/' + value;
  }

  var WORK_OVERRIDES = {
    'bangalexzz-mie-ayam-landing': {
      type: 'internal',
      url: '/landing-pages/resto-mie-ayam-landing',
      thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDMGbltDQ7JTYTw6iNMaSkPK-lmG39CLpKrsKA0LjLm5eWEPEspWVxYX_KUAchZ4LHK2mNH-x7BcVtFL4EBKHkz5DEYemPJh8w-YAw-lkd1x-Cg5s8eOKmpFSFmj3idqQapr6Qact-HwOfw0M5oQQ6capd9foLFcTTriOnBXK2JYqfeYnT2S4BgswpjwE2MO0mCylbu3b29ZmWhVmql1e_WPQQtSE9sHakMfFgGczszBLKX5CTcir1l2YZqn7GcYJr2vt4-56hzMOc'
    },
    'bangalexzz-nasi-campur-landing': {
      type: 'internal',
      url: '/landing-pages/resto-nasi-campur-landing',
      thumbnail: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?w=1200&h=800&auto=format&fit=crop',
      summary: 'Landing page Nasi Campur dengan visual menu, opsi custom, dan CTA pemesanan cepat.'
    },
    'bangalexzz-dimsum-modern-landing': { type: 'internal', url: '/landing-pages/snack-dimsum-modern', thumbnail: 'assets/images/dimsum-spread.png' },
    'bangalexzz-dimsum-playful-landing': { type: 'internal', url: '/landing-pages/snack-dimsum-playful', thumbnail: 'assets/images/dimsum-hero.png' },
    'bangalexzz-dimsum-luxury-landing': { type: 'internal', url: '/landing-pages/snack-dimsum-luxury', thumbnail: 'assets/images/dimsum-xlb.png' },
    'property-agent-classic': { type: 'internal', url: '/landing-pages/property-agent-classic', thumbnail: 'assets/images/real-property.jpg' },
    'property-agent-eco-living': { type: 'internal', url: '/landing-pages/property-agent-eco-living', thumbnail: 'assets/images/real-property.jpg' },
    'property-agent-urban': { type: 'internal', url: '/landing-pages/property-agent-urban', thumbnail: 'assets/images/real-property.jpg' },
    'property-agent-terpercaya': { type: 'internal', url: '/landing-pages/property-agent-terpercaya', thumbnail: 'assets/images/real-property.jpg' }
  };

  var DEFAULT_IMAGE = 'assets/images/banner-karya.webp';
  var FALLBACK_WORKS = [
    {
      slug: 'bangalexzz-mie-ayam-landing',
      title: 'Bangalexzz Mie Ayam Landing Page',
      excerpt: 'Landing page F&B modern dengan struktur conversion-friendly.',
      cover_image: 'assets/images/real-catering.jpg',
      project_url: '/landing-pages/resto-mie-ayam-landing.html',
      category: { name: 'Landing Page' }
    },
    {
      slug: 'bangalexzz-nasi-campur-landing',
      title: 'Bangalexzz Nasi Campur Landing Page',
      excerpt: 'Landing page Nasi Campur dengan visual menu, opsi custom, dan CTA pemesanan cepat.',
      cover_image: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?w=1200&h=800&auto=format&fit=crop',
      project_url: '/landing-pages/resto-nasi-campur-landing.html',
      category: { name: 'Landing Page' }
    },
    {
      slug: 'bangalexzz-dimsum-modern-landing',
      title: 'Bangalexzz Dimsum Modern Landing Page',
      excerpt: 'Landing page dimsum modern dengan visual premium.',
      cover_image: 'assets/images/dimsum-spread.png',
      project_url: '/landing-pages/snack-dimsum-modern.html',
      category: { name: 'Landing Page' }
    },
    {
      slug: 'bangalexzz-dimsum-playful-landing',
      title: 'Bangalexzz Dimsum Playful Landing Page',
      excerpt: 'Landing page playful dengan tone cerah dan interaktif.',
      cover_image: 'assets/images/dimsum-hero.png',
      project_url: '/landing-pages/snack-dimsum-playful.html',
      category: { name: 'Landing Page' }
    },
    {
      slug: 'property-agent-classic',
      title: 'Agent Properti - Solusi Properti Terpercaya',
      excerpt: 'Landing page properti corporate untuk lead konsultasi.',
      cover_image: 'assets/images/real-property.jpg',
      project_url: '/landing-pages/property-agent-classic.html',
      category: { name: 'Landing Page' }
    },
    {
      slug: 'property-agent-urban',
      title: 'Urban Properti - Investasi Cerdas Jakarta',
      excerpt: 'Landing page fokus trust, ROI, dan CTA cepat.',
      cover_image: 'assets/images/real-property.jpg',
      project_url: '/landing-pages/property-agent-urban.html',
      category: { name: 'Landing Page' }
    }
  ];

  function getFallbackWorks() {
    return FALLBACK_WORKS.map(function (item) {
      return Object.assign({}, item, {
        category: Object.assign({}, item.category || { name: 'General' })
      });
    });
  }

  function getInitials(text) {
    return String(text || '')
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map(function (part) { return part.charAt(0).toUpperCase(); })
      .join('') || 'WK';
  }

  function generatedThumbnail(work) {
    var title = String((work && work.title) || 'Project');
    var initials = getInitials(title);
    var slug = String((work && work.slug) || 'work');
    var hash = 0;
    for (var i = 0; i < slug.length; i += 1) hash = ((hash << 5) - hash) + slug.charCodeAt(i);
    var hue = Math.abs(hash) % 360;
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1200" viewBox="0 0 1600 1200">'
      + '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">'
      + '<stop offset="0%" stop-color="hsl(' + hue + ',72%,52%)" />'
      + '<stop offset="100%" stop-color="hsl(' + ((hue + 38) % 360) + ',78%,40%)" />'
      + '</linearGradient></defs>'
      + '<rect width="1600" height="1200" fill="url(#g)" />'
      + '<text x="50%" y="52%" dominant-baseline="middle" text-anchor="middle" fill="white" font-size="320" font-family="Manrope,Arial,sans-serif" font-weight="800">' + initials + '</text>'
      + '</svg>';
    return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
  }

  function isExternalUrl(url) {
    var value = String(url || '').trim();
    if (!/^https?:\/\//i.test(value)) return false;
    try {
      return new URL(value).origin !== window.location.origin;
    } catch (error) {
      return true;
    }
  }

  function getWorkOverride(work) {
    var slug = work && work.slug ? String(work.slug) : '';
    return slug && WORK_OVERRIDES[slug] ? WORK_OVERRIDES[slug] : {};
  }

  function getWorkNavigation(work) {
    var override = getWorkOverride(work);
    var rawUrl = override.url || (work && work.project_url ? work.project_url : '');
    var href = normalizeInternalUrl(rawUrl);
    var type = override.type || (isExternalUrl(href) ? 'external' : 'internal');

    if (!href) {
      href = '/work-detail?slug=' + encodeURIComponent((work && work.slug) ? work.slug : 'work');
      type = 'internal';
    }

    return {
      href: href,
      type: type,
      opensNewTab: type === 'external'
    };
  }

  function isLandingProject(work) {
    var nav = getWorkNavigation(work);
    return nav.href.indexOf('/work-detail') === -1;
  }

  function bindWorkImageFallback(grid) {
    var images = grid.querySelectorAll('img[data-thumb-fallback]');
    images.forEach(function (image) {
      image.addEventListener('error', function () {
        if (image.dataset.fallbackApplied === '1') return;
        image.dataset.fallbackApplied = '1';
        image.src = image.dataset.thumbFallback || DEFAULT_IMAGE;
      });
    });
  }

  async function fetchJsonWithFallback(path) {
    var cleanPath = String(path || '').replace(/^\/+/, '');
    var candidates = [];
    var primaryUrl = api.url(cleanPath);
    if (primaryUrl) candidates.push(primaryUrl);

    var origin = String(window.location.origin || '').replace(/\/+$/, '');
    if (origin && origin !== 'null') {
      candidates.push(origin + '/' + cleanPath);
    }

    var seen = {};
    var uniqueCandidates = candidates.filter(function (item) {
      if (!item || seen[item]) return false;
      seen[item] = true;
      return true;
    });

    var lastError = null;
    for (var i = 0; i < uniqueCandidates.length; i += 1) {
      try {
        var response = await fetch(uniqueCandidates[i]);
        if (!response.ok) throw new Error('HTTP ' + response.status);
        return await response.json();
      } catch (error) {
        lastError = error;
      }
    }

    throw (lastError || new Error('No available server'));
  }

  function renderWorkCards(grid, works) {
    grid.innerHTML = works.map(function (work) {
      var image = getWorkImage(work);
      var title = escapeHtml(work.title || 'Untitled Work');
      var category = escapeHtml(getWorkCategory(work));
      var summary = escapeHtml(getWorkSummary(work));
      var nav = getWorkNavigation(work);
      var href = escapeHtml(nav.href);
      var fallbackImage = generatedThumbnail(work);
      var target = nav.opensNewTab ? ' target="_blank" rel="noopener noreferrer"' : '';
      var routeLabel = nav.type === 'external' ? 'External' : 'Internal';

      return '<article class="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">'
        + '<a class="block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary" href="' + href + '"' + target + ' aria-label="View Project ' + title + '">'
        + '<img src="' + escapeHtml(image) + '" data-thumb-fallback="' + escapeHtml(fallbackImage) + '" alt="Thumbnail ' + title + '" class="aspect-[16/9] w-full object-cover" loading="lazy" decoding="async" />'
        + '<div class="p-5">'
        + '<div class="flex items-center justify-between gap-3">'
        + '<p class="text-xs font-bold uppercase tracking-wide text-primary">' + category + '</p>'
        + '<span class="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-500">' + routeLabel + '</span>'
        + '</div>'
        + '<h3 class="mt-2 text-lg font-extrabold">' + title + '</h3>'
        + '<p class="mt-2 text-sm text-slate-600">' + summary + '</p>'
        + '<span class="mt-4 inline-flex items-center text-sm font-bold text-primary">View Project</span>'
        + '</div>'
        + '</a>'
        + '</article>';
    }).join('');

    bindWorkImageFallback(grid);
  }

  function getWorkImage(work) {
    var override = getWorkOverride(work);
    if (override.thumbnail) return override.thumbnail;
    return (work && work.cover_image) ? work.cover_image : DEFAULT_IMAGE;
  }

  function getWorkSummary(work) {
    var override = getWorkOverride(work);
    if (override.summary) return String(override.summary);
    return String((work && work.excerpt) || 'Buka project untuk melihat implementasi lengkap.');
  }

  function normalizeWhatsAppNumber(phone) {
    var digits = String(phone || '').replace(/[^\d+]/g, '');
    if (!digits) return '6285155043133';
    if (digits.indexOf('+') === 0) digits = digits.slice(1);
    if (digits.indexOf('0') === 0) return '62' + digits.slice(1);
    if (digits.indexOf('62') === 0) return digits;
    return digits;
  }

  function parsePriceRank(priceText) {
    var numbers = String(priceText || '').replace(/[^\d]/g, '');
    if (!numbers) return Number.MAX_SAFE_INTEGER;
    return Number(numbers);
  }

  function buildWaOrderLink(phone, packageLabel, serviceTitle) {
    var wa = normalizeWhatsAppNumber(phone);
    var message = 'Halo, saya ingin membeli layanan ' + packageLabel + ' (' + String(serviceTitle || 'Layanan') + ') apakah tersedia?';
    return 'https://wa.me/' + encodeURIComponent(wa) + '?text=' + encodeURIComponent(message);
  }

  function getServiceBullets(service) {
    var title = String((service && service.title) || '').toLowerCase();
    var summary = String((service && service.summary) || '').toLowerCase();
    if (title.indexOf('starter') !== -1 || title.indexOf('promo') !== -1) {
      return ['Siap live lebih cepat', 'Struktur CTA langsung jelas', 'Cocok untuk campaign awal'];
    }
    if (title.indexOf('landing') !== -1) {
      return ['Fokus conversion flow', 'Section trust dan benefit', 'Form lead siap pakai'];
    }
    if (title.indexOf('social') !== -1 || summary.indexOf('feed') !== -1) {
      return ['Visual feed konsisten', 'Template promo siap publish', 'Mendukung awareness campaign'];
    }
    if (title.indexOf('company profile') !== -1) {
      return ['Perkuat kredibilitas brand', 'Informasi bisnis terstruktur', 'Siap presentasi ke calon klien'];
    }
    if (title.indexOf('video') !== -1) {
      return ['Storyline campaign lebih kuat', 'Format siap multi-platform', 'Editing profesional terarah'];
    }
    if (title.indexOf('full funnel') !== -1) {
      return ['Strategi konten end-to-end', 'Website dan visual terintegrasi', 'Arahkan traffic menjadi lead'];
    }
    return ['Scope layanan jelas', 'Eksekusi profesional', 'Didesain untuk hasil bisnis'];
  }

  function getWorkPrimaryUrl(work) {
    return getWorkNavigation(work).href;
  }

  function onImageErrorFallback(image) {
    if (!image || image.dataset.fallbackApplied === '1') return;
    image.dataset.fallbackApplied = '1';
    image.src = DEFAULT_IMAGE;
  }

  async function loadWorksPage() {
    var grid = document.querySelector('[data-works-grid]');
    if (!grid) return;

    var notice = document.querySelector('[data-works-notice]');
    grid.innerHTML = '<p class="text-sm text-slate-500">Memuat karya...</p>';
    if (notice) notice.textContent = '';

    try {
      var payload = await fetchJsonWithFallback('api/public/works');
      var works = payload && payload.data ? payload.data : [];
      works = works.filter(isLandingProject);

      if (!works.length) {
        var emptyFallback = getFallbackWorks().filter(isLandingProject);
        if (emptyFallback.length) {
          renderWorkCards(grid, emptyFallback);
          if (notice) {
            notice.textContent = 'Data karya live belum tersedia. Menampilkan karya cadangan.';
          }
          return;
        }

        grid.innerHTML = '<p class="text-sm text-slate-500">Belum ada karya yang dipublish.</p>';
        if (notice) {
          notice.textContent = '';
        }
        return;
      }

      renderWorkCards(grid, works);

      if (notice) {
        notice.textContent = '';
      }
    } catch (error) {
      var fallbackWorks = getFallbackWorks();
      fallbackWorks = fallbackWorks.filter(isLandingProject);
      if (fallbackWorks.length) {
        renderWorkCards(grid, fallbackWorks);
        if (notice) notice.textContent = 'Server belum tersedia. Menampilkan karya lokal sementara.';
        return;
      }

      grid.innerHTML = '<p class="text-sm text-amber-700">Gagal memuat karya dari server.</p>';
      if (notice) notice.textContent = '';
    }
  }

  async function loadWorkDetailPage() {
    var titleEl = document.querySelector('[data-work-title]');
    if (!titleEl) return;

    var typeEl = document.querySelector('[data-work-type]');
    var imageEl = document.querySelector('[data-work-image]');
    var contentEl = document.querySelector('[data-work-content]');
    var tagsEl = document.querySelector('[data-work-tags]');
    var liveLink = document.querySelector('[data-work-live-link]');
    var galleryEl = document.querySelector('[data-work-gallery]');

    var params = new URLSearchParams(window.location.search);
    var slug = params.get('slug');

    try {
      if (!slug) {
        var worksPayload = await fetchJsonWithFallback('api/public/works');
        var works = worksPayload && worksPayload.data ? worksPayload.data : [];
        if (!works.length) return;
        slug = works[0].slug;
      }

      var detailPayload = await fetchJsonWithFallback('api/public/works/' + encodeURIComponent(slug));
      var work = detailPayload && detailPayload.data ? detailPayload.data : null;
      if (!work) return;

      var categoryName = getWorkCategory(work);
      titleEl.textContent = work.title || titleEl.textContent;
      if (typeEl) typeEl.textContent = categoryName;
      if (imageEl) {
        imageEl.src = getWorkImage(work);
        imageEl.alt = work.title || imageEl.alt;
        imageEl.onerror = function () {
          onImageErrorFallback(imageEl);
        };
      }
      if (contentEl && work.content) {
        contentEl.textContent = work.content;
      } else if (contentEl && work.excerpt) {
        contentEl.textContent = work.excerpt;
      }

      if (tagsEl) {
        var chips = [];
        chips.push('<span class="rounded-full bg-slate-100 px-3 py-1.5">Kategori: ' + escapeHtml(categoryName) + '</span>');
        var tools = work.tools_json || [];
        if (!tools.length) {
          tools = (work.tags || []).map(function (tag) { return tag.name; });
        }
        tools.forEach(function (tool) {
          chips.push('<span class="rounded-full bg-slate-100 px-3 py-1.5">Tools: ' + escapeHtml(tool) + '</span>');
        });
        tagsEl.innerHTML = chips.join('');
      }

      if (liveLink) {
        var projectUrl = getWorkPrimaryUrl(work);
        if (projectUrl && projectUrl.indexOf('/work-detail') !== 0) {
          liveLink.href = projectUrl;
          liveLink.classList.remove('hidden');
        } else {
          liveLink.classList.add('hidden');
        }
      }

      if (galleryEl) {
        var galleryItems = work.gallery_json || [];
        galleryEl.innerHTML = '';
        if (galleryItems.length) {
          galleryEl.innerHTML = galleryItems.map(function (item) {
            var title = escapeHtml(item.title || 'Gallery Item');
            var src = escapeHtml(item.src || '#');
            if (item.type === 'link') {
              return '<a href="' + src + '" target="_blank" rel="noopener noreferrer" class="rounded-xl border border-slate-200 bg-white p-4 text-sm font-semibold hover:border-primary hover:text-primary">' + title + '</a>';
            }
            return '<a href="' + src + '" target="_blank" rel="noopener noreferrer" class="overflow-hidden rounded-xl border border-slate-200 bg-white">'
              + '<img src="' + src + '" alt="' + title + '" class="aspect-[16/10] w-full object-cover" loading="lazy" onerror="this.onerror=null;this.src=\'' + DEFAULT_IMAGE + '\'" />'
              + '<p class="p-3 text-sm font-semibold">' + title + '</p>'
              + '</a>';
          }).join('');
        } else {
          galleryEl.innerHTML = '<p class="text-sm text-slate-500">Gallery belum tersedia untuk project ini.</p>';
        }
      }
    } catch (error) {
      var fallbackItems = getFallbackWorks();
      var fallbackWork = null;
      if (slug) {
        fallbackWork = fallbackItems.find(function (item) {
          return String(item.slug) === String(slug);
        }) || null;
      }
      if (!fallbackWork && fallbackItems.length) {
        fallbackWork = fallbackItems[0];
      }

      if (fallbackWork) {
        var fallbackCategory = getWorkCategory(fallbackWork);
        if (titleEl) titleEl.textContent = fallbackWork.title || titleEl.textContent;
        if (typeEl) typeEl.textContent = fallbackCategory;
        if (imageEl) {
          imageEl.src = getWorkImage(fallbackWork);
          imageEl.alt = fallbackWork.title || imageEl.alt;
        }
        if (contentEl) {
          contentEl.textContent = fallbackWork.content || fallbackWork.excerpt || 'Detail project tersedia saat server aktif kembali.';
        }
        if (tagsEl) {
          tagsEl.innerHTML = '<span class="rounded-full bg-slate-100 px-3 py-1.5">Kategori: ' + escapeHtml(fallbackCategory) + '</span>';
        }
        if (liveLink) {
          var fallbackUrl = getWorkPrimaryUrl(fallbackWork);
          if (fallbackUrl) {
            liveLink.href = fallbackUrl;
            liveLink.classList.remove('hidden');
          }
        }
        if (galleryEl) {
          galleryEl.innerHTML = '<p class="text-sm text-slate-500">Gallery lengkap akan tampil saat koneksi server tersedia.</p>';
        }
        return;
      }

      if (titleEl) titleEl.textContent = 'Project tidak ditemukan atau gagal dimuat.';
      if (contentEl) contentEl.textContent = 'Silakan kembali ke halaman karya dan pilih project lain.';
    }
  }

  async function loadServicesPage() {
    var section = document.querySelector('[data-services-grid]');
    if (!section) return;
    section.innerHTML = '<p class="text-sm text-slate-500">Memuat layanan...</p>';

    try {
      var responses = await Promise.all([
        fetchJsonWithFallback('api/public/services'),
        fetchJsonWithFallback('api/public/settings').catch(function () { return { data: {} }; })
      ]);

      var payload = responses[0] || { data: [] };
      var settingsPayload = responses[1] || { data: {} };
      var services = payload && payload.data ? payload.data : [];
      var contact = settingsPayload && settingsPayload.data && settingsPayload.data.contact ? settingsPayload.data.contact : {};
      var waPhone = contact.contact_phone || '6285155043133';

      if (!services.length) {
        section.innerHTML = '<p class="text-sm text-slate-500">Belum ada layanan aktif.</p>';
        return;
      }

      services = services.slice().sort(function (a, b) {
        return parsePriceRank(a.price) - parsePriceRank(b.price);
      });

      var bestValueIndex = Math.floor((services.length - 1) / 2);

      section.innerHTML = services.map(function (service, index) {
        var packageLabel = 'Paket Promo ' + (index + 1);
        var badge = '';
        if (index === 0) badge = 'Paling Hemat';
        if (index === bestValueIndex) badge = 'Best Value';
        var orderLink = buildWaOrderLink(waPhone, packageLabel, service.title + ' - ' + String(service.price || 'Konsultasi harga'));
        var bullets = getServiceBullets(service);
        return '<article class="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">'
          + '<div class="flex flex-wrap items-center gap-2">'
          + '<p class="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-primary">' + packageLabel + '</p>'
          + (badge ? '<span class="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-amber-700">' + badge + '</span>' : '')
          + '</div>'
          + '<h3 class="mt-3 text-xl font-bold">' + escapeHtml(service.title) + '</h3>'
          + '<p class="mt-2 text-sm text-slate-600">' + escapeHtml(service.summary || 'Layanan profesional untuk kebutuhan bisnis Anda.') + '</p>'
          + '<p class="mt-4 text-base font-extrabold text-primary">' + escapeHtml(service.price || 'Konsultasi harga') + '</p>'
          + '<ul class="mt-4 space-y-1 text-sm text-slate-600">'
          + bullets.map(function (item) { return '<li>• ' + escapeHtml(item) + '</li>'; }).join('')
          + '</ul>'
          + '<a href="' + orderLink + '" target="_blank" rel="noopener noreferrer" class="mt-5 inline-flex rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white hover:bg-sky-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">Order layanan ini</a>'
          + '</article>';
      }).join('');
    } catch (error) {
      section.innerHTML = '<p class="text-sm text-amber-700">Gagal memuat layanan dari server.</p>';
    }
  }

  async function loadCvPage() {
    var list = document.querySelector('[data-cv-experience]');
    var skillList = document.querySelector('[data-cv-skills]');
    if (!list && !skillList) return;
    if (list) list.innerHTML = '<p class="text-sm text-slate-500">Memuat pengalaman...</p>';
    if (skillList) skillList.innerHTML = '<p class="text-sm text-slate-500">Memuat skill...</p>';

    try {
      var payload = await fetchJsonWithFallback('api/public/cv-items');
      var items = payload && payload.data ? payload.data : [];
      if (!items.length) {
        if (list) list.innerHTML = '<p class="text-sm text-slate-500">Belum ada data pengalaman.</p>';
        if (skillList) skillList.innerHTML = '<p class="text-sm text-slate-500">Belum ada data skill.</p>';
        return;
      }

      var experiences = items.filter(function (x) { return x.section === 'experience'; });
      var skills = items.filter(function (x) { return x.section === 'skill'; });

      if (list && experiences.length) {
        list.innerHTML = experiences.map(function (item) {
          var period = item.period ? ' (' + escapeHtml(item.period) + ')' : '';
          return '<div><p class="font-bold">' + escapeHtml(item.title) + period + '</p><p class="text-slate-600">' + escapeHtml(item.description || '') + '</p></div>';
        }).join('');
      }

      if (skillList && skills.length) {
        skillList.innerHTML = skills.map(function (item) {
          return '<span class="rounded-lg bg-slate-100 px-3 py-1.5">' + escapeHtml(item.title) + '</span>';
        }).join('');
      }
    } catch (error) {
      if (list) list.innerHTML = '<p class="text-sm text-amber-700">Gagal memuat data CV.</p>';
      if (skillList) skillList.innerHTML = '';
    }
  }

  async function loadHomePage() {
    var featured = document.querySelector('[data-home-featured-works]');
    var testimonials = document.querySelector('[data-home-testimonials]');
    if (!featured && !testimonials) return;
    if (featured) featured.innerHTML = '<p class="text-sm text-slate-500">Memuat project unggulan...</p>';
    if (testimonials) testimonials.innerHTML = '<p class="text-sm text-slate-500">Memuat testimoni...</p>';

    try {
      var requests = [];
      if (featured) requests.push(fetchJsonWithFallback('api/public/works')); else requests.push(Promise.resolve(null));
      if (testimonials) requests.push(fetchJsonWithFallback('api/public/testimonials')); else requests.push(Promise.resolve(null));

      var responses = await Promise.all(requests);
      var worksPayload = responses[0];
      var testPayload = responses[1];

      if (featured) {
        var allWorks = (worksPayload && worksPayload.data ? worksPayload.data : []);
        var featuredWorks = allWorks.filter(function (work) {
          return !!work.is_featured;
        });
        var works = (featuredWorks.length ? featuredWorks : allWorks).slice(0, 3);
        if (works.length) {
          featured.innerHTML = works.map(function (work) {
            var image = getWorkImage(work);
            return '<article class="overflow-hidden rounded-2xl border border-slate-200 bg-white">'
              + '<img src="' + escapeHtml(image) + '" alt="' + escapeHtml(work.title) + '" class="aspect-[4/3] w-full object-cover" />'
              + '<div class="p-5"><h3 class="font-bold">' + escapeHtml(work.title) + '</h3><p class="mt-2 text-sm text-slate-600">' + escapeHtml(work.excerpt || 'Project portfolio terbaru') + '</p></div>'
              + '</article>';
          }).join('');
        }
      }

      if (testimonials) {
        var testItems = (testPayload && testPayload.data ? testPayload.data : []).slice(0, 3);
        if (testItems.length) {
          testimonials.innerHTML = testItems.map(function (item) {
            return '<article class="rounded-2xl border border-slate-200 bg-white p-6">'
              + '<p class="text-sm text-slate-700">"' + escapeHtml(item.quote) + '"</p>'
              + '<p class="mt-3 text-xs font-bold text-primary">' + escapeHtml(item.name) + '</p>'
              + '</article>';
          }).join('');
        }
      }
    } catch (error) {
      if (featured) {
        var fallbackWorks = getFallbackWorks().slice(0, 3);
        if (fallbackWorks.length) {
          featured.innerHTML = fallbackWorks.map(function (work) {
            var image = getWorkImage(work);
            return '<article class="overflow-hidden rounded-2xl border border-slate-200 bg-white">'
              + '<img src="' + escapeHtml(image) + '" alt="' + escapeHtml(work.title) + '" class="aspect-[4/3] w-full object-cover" />'
              + '<div class="p-5"><h3 class="font-bold">' + escapeHtml(work.title) + '</h3><p class="mt-2 text-sm text-slate-600">' + escapeHtml(work.excerpt || 'Project portfolio terbaru') + '</p></div>'
              + '</article>';
          }).join('');
        } else {
          featured.innerHTML = '<p class="text-sm text-amber-700">Gagal memuat project unggulan.</p>';
        }
      }
      if (testimonials) testimonials.innerHTML = '<p class="text-sm text-amber-700">Gagal memuat testimoni.</p>';
    }
  }

  async function loadGlobalSettings() {
    try {
      var payload = await fetchJsonWithFallback('api/public/settings');
      var settings = payload && payload.data ? payload.data : {};
      var profile = settings.profile || {};
      var contact = settings.contact || {};
      var social = settings.social || {};

      applyText('[data-profile-name]', profile.profile_name);
      applyText('[data-profile-role]', profile.profile_role);
      applyText('[data-profile-bio]', profile.profile_bio);
      applyText('[data-contact-email]', contact.contact_email);
      applyText('[data-contact-phone]', contact.contact_phone);

      applyLink('[data-social-instagram]', social.social_instagram);
      applyLink('[data-social-tiktok]', social.social_tiktok);
      applyLink('[data-social-youtube]', social.social_youtube);
    } catch (error) {
      // Keep existing text from HTML when settings API fails.
    }
  }

  async function loadGlobalCta() {
    try {
      var payload = await fetchJsonWithFallback('api/public/banners');
      var banner = payload && payload.data && payload.data.length ? payload.data[0] : null;
      if (!banner) return;

      applyText('[data-global-cta-title]', banner.title);
      applyText('[data-global-cta-subtitle]', banner.subtitle);
      applyText('[data-global-cta-label]', banner.cta_label);
      applyLink('[data-global-cta-link]', banner.cta_url);

      // Keep per-page banner image from HTML to avoid cross-page banner overrides.
    } catch (error) {
      // Keep existing CTA from HTML when banner API fails.
    }
  }

  var page = (document.body && document.body.dataset && document.body.dataset.page)
    ? String(document.body.dataset.page)
    : '';

  if (page === 'works') loadWorksPage();
  if (page === 'work-detail') loadWorkDetailPage();
  if (page === 'services') loadServicesPage();
  if (page === 'cv') loadCvPage();
  if (page === 'home') loadHomePage();

  loadGlobalSettings();
  loadGlobalCta();
})();
