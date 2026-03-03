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
    if (value.indexOf('/') === 0) return value;
    return value;
  }

  var projectUrlBySlug = {
    'bangalexzz-mie-ayam-landing': '/landing-pages/resto-mie-ayam-landing.html',
    'bangalexzz-nasi-campur-landing': '/landing-pages/facebook-social-handling-demo.html',
    'bangalexzz-dimsum-modern-landing': '/landing-pages/snack-dimsum-modern.html',
    'bangalexzz-dimsum-playful-landing': '/landing-pages/snack-dimsum-playful.html',
    'bangalexzz-dimsum-luxury-landing': '/landing-pages/snack-dimsum-luxury.html',
    'property-agent-classic': '/landing-pages/property-agent-classic.html',
    'property-agent-eco-living': '/landing-pages/property-agent-eco-living.html',
    'property-agent-urban': '/landing-pages/property-agent-urban.html',
    'property-agent-terpercaya': '/landing-pages/property-agent-terpercaya.html'
  };

  var coverImageBySlug = {
    'bangalexzz-dimsum-modern-landing': 'assets/images/real-event.jpg',
    'bangalexzz-dimsum-playful-landing': 'assets/images/real-coffee.jpg',
    'bangalexzz-dimsum-luxury-landing': 'assets/images/real-property.jpg',
    'bangalexzz-nasi-campur-landing': 'assets/images/real-social.jpg'
  };

  function getWorkImage(work) {
    var slug = work && work.slug ? String(work.slug) : '';
    if (slug && coverImageBySlug[slug]) return coverImageBySlug[slug];
    return (work && work.cover_image) ? work.cover_image : 'assets/images/legacy/banner/banner1.jpg';
  }

  function getWorkPrimaryUrl(work) {
    var slug = work && work.slug ? String(work.slug) : '';
    if (slug && projectUrlBySlug[slug]) {
      return normalizeInternalUrl(projectUrlBySlug[slug]);
    }
    if (work && work.project_url) {
      return normalizeInternalUrl(work.project_url);
    }
    return 'work-detail.html?slug=' + encodeURIComponent((work && work.slug) ? work.slug : 'work');
  }

  function onImageErrorFallback(image) {
    if (!image || image.dataset.fallbackApplied === '1') return;
    image.dataset.fallbackApplied = '1';
    image.src = 'assets/images/legacy/banner/banner1.jpg';
  }

  async function loadWorksPage() {
    var grid = document.querySelector('[data-works-grid]');
    if (!grid) return;

    var notice = document.querySelector('[data-works-notice]');
    grid.innerHTML = '<p class="text-sm text-slate-500">Memuat karya...</p>';
    if (notice) notice.textContent = '';

    try {
      var response = await fetch(api.url('api/public/works'));
      if (!response.ok) throw new Error('Failed to load works');

      var payload = await response.json();
      var works = payload && payload.data ? payload.data : [];

      if (!works.length) {
        grid.innerHTML = '<p class="text-sm text-slate-500">Belum ada karya yang dipublish.</p>';
        if (notice) {
          notice.textContent = '';
        }
        return;
      }

      grid.innerHTML = works.map(function (work) {
        var image = getWorkImage(work);
        var title = escapeHtml(work.title || 'Untitled Work');
        var category = escapeHtml(getWorkCategory(work));
        var primaryUrl = escapeHtml(getWorkPrimaryUrl(work));
        var detailUrl = 'work-detail.html?slug=' + encodeURIComponent(work.slug || 'work');
        var primaryLabel = work.project_url ? 'Lihat demo' : 'Lihat detail';

        return '<article class="overflow-hidden rounded-2xl border border-slate-200 bg-white">'
          + '<a href="' + primaryUrl + '">'
          + '<img src="' + escapeHtml(image) + '" alt="' + title + '" class="aspect-[4/3] w-full object-cover" loading="lazy" onerror="this.onerror=null;this.src=\'assets/images/legacy/banner/banner1.jpg\'" />'
          + '</a>'
          + '<div class="p-5">'
          + '<p class="text-xs font-bold uppercase text-primary">' + category + '</p>'
          + '<h3 class="mt-1 text-lg font-bold">' + title + '</h3>'
          + '<div class="mt-3 flex items-center gap-4">'
          + '<a class="inline-block text-sm font-bold text-primary" href="' + primaryUrl + '">' + primaryLabel + '</a>'
          + '<a class="inline-block text-sm font-semibold text-slate-500" href="' + escapeHtml(detailUrl) + '">Detail</a>'
          + '</div>'
          + '</div>'
          + '</article>';
      }).join('');

      if (notice) {
        notice.textContent = '';
      }
    } catch (error) {
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
        var worksResponse = await fetch(api.url('api/public/works'));
        if (!worksResponse.ok) throw new Error('Failed to load works');
        var worksPayload = await worksResponse.json();
        var works = worksPayload && worksPayload.data ? worksPayload.data : [];
        if (!works.length) return;
        slug = works[0].slug;
      }

      var detailResponse = await fetch(api.url('api/public/works/' + encodeURIComponent(slug)));
      if (!detailResponse.ok) throw new Error('Failed to load work detail');

      var detailPayload = await detailResponse.json();
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
        if (projectUrl && projectUrl.indexOf('work-detail.html') !== 0) {
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
              return '<a href="' + src + '" target="_blank" rel="noreferrer" class="rounded-xl border border-slate-200 bg-white p-4 text-sm font-semibold hover:border-primary hover:text-primary">' + title + '</a>';
            }
            return '<a href="' + src + '" target="_blank" rel="noreferrer" class="overflow-hidden rounded-xl border border-slate-200 bg-white">'
              + '<img src="' + src + '" alt="' + title + '" class="aspect-[16/10] w-full object-cover" loading="lazy" onerror="this.onerror=null;this.src=\'assets/images/legacy/banner/banner1.jpg\'" />'
              + '<p class="p-3 text-sm font-semibold">' + title + '</p>'
              + '</a>';
          }).join('');
        } else {
          galleryEl.innerHTML = '<p class="text-sm text-slate-500">Gallery belum tersedia untuk project ini.</p>';
        }
      }
    } catch (error) {
      if (titleEl) titleEl.textContent = 'Project tidak ditemukan atau gagal dimuat.';
      if (contentEl) contentEl.textContent = 'Silakan kembali ke halaman karya dan pilih project lain.';
    }
  }

  async function loadServicesPage() {
    var section = document.querySelector('[data-services-grid]');
    if (!section) return;
    section.innerHTML = '<p class="text-sm text-slate-500">Memuat layanan...</p>';

    try {
      var response = await fetch(api.url('api/public/services'));
      if (!response.ok) throw new Error('Failed');
      var payload = await response.json();
      var services = payload && payload.data ? payload.data : [];
      if (!services.length) {
        section.innerHTML = '<p class="text-sm text-slate-500">Belum ada layanan aktif.</p>';
        return;
      }

      section.innerHTML = services.map(function (service) {
        return '<article class="rounded-2xl border border-slate-200 bg-white p-7">'
          + '<h3 class="text-xl font-bold">' + escapeHtml(service.title) + '</h3>'
          + '<p class="mt-2 text-sm text-slate-600">' + escapeHtml(service.summary || 'Layanan profesional untuk kebutuhan bisnis Anda.') + '</p>'
          + '<p class="mt-4 text-sm font-semibold text-primary">' + escapeHtml(service.price || 'Konsultasi harga') + '</p>'
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
      var response = await fetch(api.url('api/public/cv-items'));
      if (!response.ok) throw new Error('Failed');
      var payload = await response.json();
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
      if (featured) {
        var worksResponse = await fetch(api.url('api/public/works'));
        if (worksResponse.ok) {
          var worksPayload = await worksResponse.json();
          var works = (worksPayload && worksPayload.data ? worksPayload.data : []).slice(0, 3);
          if (works.length) {
            featured.innerHTML = works.map(function (work) {
              var image = work.cover_image || 'assets/images/legacy/banner/banner1.jpg';
              return '<article class="overflow-hidden rounded-2xl border border-slate-200 bg-white">'
                + '<img src="' + escapeHtml(image) + '" alt="' + escapeHtml(work.title) + '" class="aspect-[4/3] w-full object-cover" />'
                + '<div class="p-5"><h3 class="font-bold">' + escapeHtml(work.title) + '</h3><p class="mt-2 text-sm text-slate-600">' + escapeHtml(work.excerpt || 'Project portfolio terbaru') + '</p></div>'
                + '</article>';
            }).join('');
          }
        }
      }

      if (testimonials) {
        var testResponse = await fetch(api.url('api/public/testimonials'));
        if (testResponse.ok) {
          var testPayload = await testResponse.json();
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
      }
    } catch (error) {
      if (featured) featured.innerHTML = '<p class="text-sm text-amber-700">Gagal memuat project unggulan.</p>';
      if (testimonials) testimonials.innerHTML = '<p class="text-sm text-amber-700">Gagal memuat testimoni.</p>';
    }
  }

  async function loadGlobalSettings() {
    try {
      var response = await fetch(api.url('api/public/settings'));
      if (!response.ok) throw new Error('Failed');
      var payload = await response.json();
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
      var response = await fetch(api.url('api/public/banners'));
      if (!response.ok) throw new Error('Failed');
      var payload = await response.json();
      var banner = payload && payload.data && payload.data.length ? payload.data[0] : null;
      if (!banner) return;

      applyText('[data-global-cta-title]', banner.title);
      applyText('[data-global-cta-subtitle]', banner.subtitle);
      applyText('[data-global-cta-label]', banner.cta_label);
      applyLink('[data-global-cta-link]', banner.cta_url);

      var image = document.querySelector('[data-global-cta-image]');
      if (image && banner.image) {
        image.src = banner.image;
      }
    } catch (error) {
      // Keep existing CTA from HTML when banner API fails.
    }
  }

  loadWorksPage();
  loadWorkDetailPage();
  loadServicesPage();
  loadCvPage();
  loadHomePage();
  loadGlobalSettings();
  loadGlobalCta();
})();
