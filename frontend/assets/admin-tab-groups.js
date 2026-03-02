(function () {
  if (window.__adminTabGroupsInit) return;
  window.__adminTabGroupsInit = true;

  if (window.location.pathname.indexOf('/admin/') === -1) return;

  function setTabVisual(tabs, activeTab) {
    tabs.forEach(function (tab) {
      var active = tab === activeTab;
      tab.classList.toggle('border-primary', active);
      tab.classList.toggle('text-primary', active);
      tab.classList.toggle('border-transparent', !active);
      tab.classList.toggle('text-slate-500', !active);
      tab.setAttribute('aria-selected', String(active));
    });
  }

  function applyPanelMode(groupName, filter) {
    var panels = document.querySelectorAll('[data-tab-panel-group="' + groupName + '"]');
    if (!panels.length) return false;
    panels.forEach(function (p) {
      var panel = p.getAttribute('data-panel');
      p.style.display = panel === filter ? '' : 'none';
    });
    return true;
  }

  function ensureEmptyRow(contentEl, message) {
    var tbody = contentEl.tagName.toLowerCase() === 'tbody' ? contentEl : contentEl.querySelector('tbody');
    if (!tbody) return null;
    var existing = tbody.querySelector('.tab-empty-row');
    if (existing) return existing;
    var colCount = 1;
    var firstRow = tbody.querySelector('tr');
    if (firstRow) {
      var cells = firstRow.querySelectorAll('td, th');
      if (cells.length) colCount = cells.length;
    }
    var tr = document.createElement('tr');
    tr.className = 'tab-empty-row';
    tr.innerHTML = '<td colspan="' + colCount + '" style="padding:16px; text-align:center; color:#64748b; font-weight:600">' + message + '</td>';
    tbody.appendChild(tr);
    return tr;
  }

  function applyRowMode(groupName, filter) {
    var contentEl = document.querySelector('[data-tab-content="' + groupName + '"]');
    if (!contentEl) return false;
    var rows = contentEl.querySelectorAll('[data-tab-row]');
    var shown = 0;
    rows.forEach(function (row) {
      var rowState = (row.getAttribute('data-tab-row') || '').toLowerCase();
      var show = filter === 'all' || filter === rowState;
      row.style.display = show ? '' : 'none';
      if (show) shown++;
    });

    var empty = ensureEmptyRow(contentEl, 'Belum ada data untuk tab ini.');
    if (empty) empty.style.display = shown === 0 ? '' : 'none';
    return true;
  }

  function initGroup(group) {
    var groupName = group.getAttribute('data-admin-tab-group');
    var tabs = Array.prototype.slice.call(group.querySelectorAll('[data-admin-tab]'));
    if (!groupName || !tabs.length) return;

    group.setAttribute('role', 'tablist');
    tabs.forEach(function (tab, idx) {
      tab.setAttribute('role', 'tab');
      tab.setAttribute('tabindex', idx === 0 ? '0' : '-1');
    });

    function getFilterFromUrl() {
      var q = new URLSearchParams(window.location.search);
      return (q.get('tab_' + groupName) || '').toLowerCase();
    }

    function setFilterToUrl(filter) {
      var url = new URL(window.location.href);
      url.searchParams.set('tab_' + groupName, filter);
      history.replaceState(null, '', url.toString());
    }

    function activate(tab, writeUrl) {
      var filter = (tab.getAttribute('data-filter') || 'all').toLowerCase();
      setTabVisual(tabs, tab);
      tabs.forEach(function (t) { t.setAttribute('tabindex', t === tab ? '0' : '-1'); });
      var handledPanel = applyPanelMode(groupName, filter);
      if (!handledPanel) {
        applyRowMode(groupName, filter);
      }
      if (writeUrl) setFilterToUrl(filter);
    }

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        activate(tab, true);
      });
      tab.addEventListener('keydown', function (e) {
        var idx = tabs.indexOf(tab);
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          var next = tabs[(idx + 1) % tabs.length];
          next.focus();
          activate(next, true);
        }
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          var prev = tabs[(idx - 1 + tabs.length) % tabs.length];
          prev.focus();
          activate(prev, true);
        }
      });
    });

    var initial = getFilterFromUrl();
    var initialTab = tabs.find(function (t) {
      return (t.getAttribute('data-filter') || '').toLowerCase() === initial;
    }) || tabs[0];
    activate(initialTab, false);
  }

  document.querySelectorAll('[data-admin-tab-group]').forEach(initGroup);
})();
