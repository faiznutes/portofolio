(function () {
  if (window.__adminUxInit) return;
  window.__adminUxInit = true;

  if (window.location.pathname.indexOf('/admin/') === -1) return;

  function wrapTables() {
    document.querySelectorAll('table').forEach(function (table) {
      if (table.closest('.admin-table-scroll')) return;
      var wrap = document.createElement('div');
      wrap.className = 'admin-table-scroll';
      table.parentNode.insertBefore(wrap, table);
      wrap.appendChild(table);
    });
  }

  function normalizeHeaders() {
    var heading = document.querySelector('main h1');
    if (heading) heading.classList.add('admin-page-title');
    document.querySelectorAll('main section, main article').forEach(function (el) {
      if (!el.classList.contains('admin-block')) el.classList.add('admin-block');
    });
  }

  function focusSearch() {
    var search = document.querySelector('input[type="search"], input[placeholder*="Cari"], input[placeholder*="Search"], input[class*="search"]');
    if (search) {
      search.focus();
      search.select && search.select();
    }
  }

  function initShortcuts() {
    var combo = '';
    var resetTimer = null;

    function resetCombo() {
      combo = '';
      if (resetTimer) {
        clearTimeout(resetTimer);
        resetTimer = null;
      }
    }

    function go(path) {
      window.location.href = path;
    }

    document.addEventListener('keydown', function (e) {
      var tag = (e.target.tagName || '').toLowerCase();
      var isTyping = tag === 'input' || tag === 'textarea' || e.target.isContentEditable;

      if (!isTyping && e.key === '/') {
        e.preventDefault();
        focusSearch();
        return;
      }

      if (isTyping) return;

      var k = (e.key || '').toLowerCase();
      if (!k || k.length !== 1) return;

      combo += k;
      if (combo.length > 2) combo = combo.slice(-2);

      if (resetTimer) clearTimeout(resetTimer);
      resetTimer = setTimeout(resetCombo, 700);

      if (combo === 'gd') {
        go('dashboard.html');
      } else if (combo === 'gw') {
        go('works.html');
      } else if (combo === 'gs') {
        go('settings.html');
      } else if (combo === 'gl') {
        go('leads.html');
      } else if (combo === 'gt') {
        go('tags.html');
      }
    });
  }

  wrapTables();
  normalizeHeaders();
  initShortcuts();
})();
