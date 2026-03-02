(function () {
  if (window.__uxActionPopupInit) return;
  window.__uxActionPopupInit = true;

  function normalize(s) {
    return (s || '').toLowerCase().replace(/\s+/g, ' ').trim();
  }

  function detectAction(el) {
    var explicit = el.getAttribute('data-popup-action');
    if (explicit) return normalize(explicit);

    var text = normalize(el.textContent || '');
    var icon = '';
    var iconEl = el.querySelector('.material-symbols-outlined');
    if (iconEl) icon = normalize(iconEl.textContent || '');
    var raw = text + ' ' + icon;

    if (raw.includes('delete') || raw.includes('remove') || raw.includes('hapus')) return 'delete';
    if (raw.includes('edit') || raw.includes('ubah')) return 'edit';
    if (raw.includes('add') || raw.includes('new') || raw.includes('tambah') || raw.includes('create')) return 'add';
    if (raw.includes('save') || raw.includes('simpan') || raw.includes('approve') || raw.includes('change') || raw.includes('manage')) return 'update';
    if (raw.includes('view') || raw.includes('detail')) return 'view';
    return '';
  }

  function inferAction(el) {
    var text = normalize(el.textContent || '');
    var icon = '';
    var iconEl = el.querySelector('.material-symbols-outlined');
    if (iconEl) icon = normalize(iconEl.textContent || '');
    var raw = text + ' ' + icon;

    if (raw.includes('delete') || raw.includes('remove') || raw.includes('hapus')) return 'delete';
    if (raw.includes('edit') || raw.includes('ubah')) return 'edit';
    if (raw.includes('add') || raw.includes('new') || raw.includes('tambah') || raw.includes('create')) return 'add';
    if (raw.includes('save') || raw.includes('simpan') || raw.includes('approve') || raw.includes('change') || raw.includes('manage')) return 'update';
    if (raw.includes('view') || raw.includes('detail')) return 'view';
    return '';
  }

  function isNavigationControl(el) {
    var txt = normalize(el.textContent || '');
    if (txt === 'previous' || txt === 'next') return true;
    if (txt === '1' || txt === '2' || txt === '3' || txt === '4' || txt === '5') return true;
    if (txt.includes('all entries') || txt.includes('pending') || txt.includes('published')) return true;
    if (txt.includes('all messages') || txt === 'new' || txt === 'read' || txt === 'replied') return true;
    if (txt.includes('active (') || txt.includes('drafts (') || txt === 'archived') return true;
    if (txt.includes('general information') || txt.includes('seo') || txt.includes('profile') || txt.includes('security')) return true;
    if (txt.includes('usage analytics') || txt.includes('categories')) return true;
    return false;
  }

  function bootstrapDeterministicActionTags() {
    var triggers = document.querySelectorAll('button, a');
    triggers.forEach(function (el) {
      if (el.hasAttribute('data-popup-action') || el.hasAttribute('data-no-popup')) return;

      if (isNavigationControl(el)) {
        el.setAttribute('data-no-popup', 'true');
        return;
      }

      if (el.tagName === 'A') {
        var href = (el.getAttribute('href') || '').trim();
        if (href && href !== '#' && !el.hasAttribute('data-popup-action')) {
          el.setAttribute('data-no-popup', 'true');
          return;
        }
      }

      var action = inferAction(el);
      if (action) {
        el.setAttribute('data-popup-action', action);
      }
    });
  }

  function shouldIgnore(el) {
    if (!el) return true;
    if (el.closest('#ux-action-modal')) return true;
    if (el.hasAttribute('data-no-popup')) return true;
    if (el.id === 'mobile-menu-btn' || el.id === 'admin-menu-btn') return true;
    if (el.classList.contains('ux-modal-close')) return true;
    if (el.tagName === 'A') {
      var href = (el.getAttribute('href') || '').trim();
      if (href && href !== '#' && !el.hasAttribute('data-popup-action')) return true;
    }
    return false;
  }

  function pageContextName() {
    var p = window.location.pathname.toLowerCase();
    if (p.includes('/admin/works')) return 'Works';
    if (p.includes('/admin/categories')) return 'Categories';
    if (p.includes('/admin/tags')) return 'Tags';
    if (p.includes('/admin/highlights')) return 'Highlights';
    if (p.includes('/admin/banners')) return 'Banners';
    if (p.includes('/admin/services')) return 'Services';
    if (p.includes('/admin/testimonials')) return 'Testimonials';
    if (p.includes('/admin/cv')) return 'CV';
    if (p.includes('/admin/leads')) return 'Leads';
    if (p.includes('/admin/settings')) return 'Settings';
    if (p.includes('/admin/')) return 'Dashboard';
    if (p.includes('/works')) return 'Karya';
    if (p.includes('/services')) return 'Layanan';
    if (p.includes('/cv')) return 'CV';
    if (p.includes('/contact')) return 'Kontak';
    return 'Halaman';
  }

  function detectEntity(trigger) {
    if (trigger.hasAttribute('data-popup-entity')) {
      return trigger.getAttribute('data-popup-entity');
    }
    var row = trigger.closest('tr');
    if (row) {
      var firstCell = row.querySelector('td');
      if (firstCell) {
        var cellText = normalize(firstCell.textContent || '');
        if (cellText) return cellText;
      }
    }
    var card = trigger.closest('article, .card');
    if (card) {
      var title = card.querySelector('h1, h2, h3, h4');
      if (title) {
        var t = normalize(title.textContent || '');
        if (t) return t;
      }
    }
    return '';
  }

  function modalCopy(action, label, context, entity) {
    var target = entity || label;
    var ctx = context ? ' pada modul ' + context : '';
    if (action === 'delete') {
      return {
        action: 'hapus',
        title: 'Konfirmasi Hapus',
        body: 'Aksi penghapusan untuk "' + target + '" dipicu' + ctx + '. Pastikan data ini memang ingin dihapus permanen.',
        danger: true,
        ok: 'Hapus',
        cancel: 'Batal'
      };
    }
    if (action === 'edit') {
      return {
        action: 'edit',
        title: 'Edit Data',
        body: 'Aksi edit untuk "' + target + '" dipicu' + ctx + '. Integrasikan endpoint update agar perubahan tersimpan.',
        danger: false,
        ok: 'Lanjut',
        cancel: 'Tutup'
      };
    }
    if (action === 'update') {
      return {
        action: 'simpan',
        title: 'Konfirmasi Perubahan',
        body: 'Aksi perubahan untuk "' + target + '" dipicu' + ctx + '. Integrasikan endpoint update agar perubahan valid tersimpan.',
        danger: false,
        ok: 'Lanjut',
        cancel: 'Tutup'
      };
    }
    if (action === 'view') {
      return {
        action: 'lihat',
        title: 'Detail Data',
        body: 'Aksi melihat detail untuk "' + target + '" dipicu' + ctx + '. Hubungkan ke halaman/detail modal sesuai flow final.',
        danger: false,
        ok: 'Lanjut',
        cancel: 'Tutup'
      };
    }
    return {
      action: 'tambah',
      title: 'Tambah Data',
      body: 'Aksi tambah untuk "' + target + '" dipicu' + ctx + '. Hubungkan ke endpoint create untuk menyimpan data baru.',
      danger: false,
      ok: 'Lanjut',
      cancel: 'Tutup'
    };
  }

  function ensureModal() {
    var existing = document.getElementById('ux-action-modal');
    if (existing) return existing;

    var wrap = document.createElement('div');
    wrap.id = 'ux-action-modal';
    wrap.className = 'ux-modal-backdrop';
    wrap.innerHTML =
      '<div class="ux-modal" role="dialog" aria-modal="true" aria-labelledby="ux-modal-title">' +
      '<div class="ux-modal-head"><h3 id="ux-modal-title" class="ux-modal-title"></h3><button class="ux-modal-close" type="button" aria-label="Close">x</button></div>' +
      '<div class="ux-modal-body" id="ux-modal-body"></div>' +
      '<div class="ux-modal-actions">' +
      '<button class="ux-btn ux-btn-secondary" type="button" data-role="cancel">Tutup</button>' +
      '<button class="ux-btn ux-btn-primary" type="button" data-role="ok">Lanjut</button>' +
      '</div>' +
      '</div>';

    document.body.appendChild(wrap);
    return wrap;
  }

  function ensureToastWrap() {
    var existing = document.getElementById('ux-toast-wrap');
    if (existing) return existing;
    var wrap = document.createElement('div');
    wrap.id = 'ux-toast-wrap';
    wrap.className = 'ux-toast-wrap';
    document.body.appendChild(wrap);
    return wrap;
  }

  var modal = ensureModal();
  var toastWrap = ensureToastWrap();
  var titleEl = modal.querySelector('#ux-modal-title');
  var bodyEl = modal.querySelector('#ux-modal-body');
  var okBtn = modal.querySelector('[data-role="ok"]');
  var cancelBtn = modal.querySelector('[data-role="cancel"]');
  var closeBtn = modal.querySelector('.ux-modal-close');
  var activeAction = '';
  var previousFocus = null;

  function focusablesInModal() {
    return Array.prototype.slice.call(
      modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
    ).filter(function (el) { return !el.disabled && el.offsetParent !== null; });
  }

  function showToast(message) {
    if (!toastWrap) return;
    var toast = document.createElement('div');
    toast.className = 'ux-toast success';
    toast.textContent = message;
    toastWrap.appendChild(toast);
    setTimeout(function () {
      toast.remove();
    }, 2200);
  }

  function closeModal() {
    modal.classList.remove('open');
    if (previousFocus && typeof previousFocus.focus === 'function') {
      previousFocus.focus();
    }
  }

  function openModal(data) {
    previousFocus = document.activeElement;
    activeAction = data.action || '';
    titleEl.textContent = data.title;
    bodyEl.textContent = data.body;
    okBtn.textContent = data.ok;
    cancelBtn.textContent = data.cancel;
    okBtn.classList.toggle('ux-btn-danger', !!data.danger);
    okBtn.classList.toggle('ux-btn-primary', !data.danger);
    modal.classList.add('open');
    setTimeout(function () {
      var focusables = focusablesInModal();
      if (focusables.length) focusables[0].focus();
    }, 0);
  }

  closeBtn.addEventListener('click', closeModal);
  cancelBtn.addEventListener('click', closeModal);
  okBtn.addEventListener('click', function () {
    closeModal();
    if (activeAction) showToast('Aksi ' + activeAction + ' diproses.');
  });
  modal.addEventListener('click', function (e) {
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', function (e) {
    if (!modal.classList.contains('open')) return;
    if (e.key === 'Escape') {
      closeModal();
      return;
    }
    if (e.key === 'Tab') {
      var f = focusablesInModal();
      if (!f.length) return;
      var first = f[0];
      var last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  bootstrapDeterministicActionTags();

  document.addEventListener('click', function (e) {
    var trigger = e.target.closest('button, a');
    if (!trigger) return;
    if (shouldIgnore(trigger)) return;
    if (trigger.tagName === 'BUTTON' && trigger.disabled) return;

    var action = detectAction(trigger);
    if (!action) return;

    var label = normalize(trigger.textContent || '') || action;
    var context = pageContextName();
    var entity = detectEntity(trigger);
    var copy = modalCopy(action, label, context, entity);
    e.preventDefault();
    openModal(copy);
  });
})();
