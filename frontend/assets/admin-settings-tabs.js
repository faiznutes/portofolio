(function () {
  if (window.__adminSettingsTabsInit) return;
  window.__adminSettingsTabsInit = true;

  if (window.location.pathname.indexOf('/admin/settings.html') === -1) return;

  var tabs = Array.prototype.slice.call(document.querySelectorAll('[data-settings-tab]'));
  var panels = Array.prototype.slice.call(document.querySelectorAll('[data-tab-panel]'));
  if (!tabs.length || !panels.length) return;

  var tabList = tabs[0].parentElement;
  if (tabList) tabList.setAttribute('role', 'tablist');
  tabs.forEach(function (tab, idx) {
    tab.setAttribute('role', 'tab');
    tab.setAttribute('tabindex', idx === 0 ? '0' : '-1');
  });

  function activeKeyFromHash(hash) {
    var key = (hash || '#general').replace('#', '').trim();
    if (!key) key = 'general';
    return key;
  }

  function activateByKey(key) {
    tabs.forEach(function (tab) {
      var target = (tab.getAttribute('data-target') || '#general').replace('#', '');
      var active = target === key;
      tab.classList.toggle('border-primary', active);
      tab.classList.toggle('text-primary', active);
      tab.classList.toggle('border-transparent', !active);
      tab.classList.toggle('text-slate-500', !active);
      tab.setAttribute('aria-selected', String(active));
      tab.setAttribute('tabindex', active ? '0' : '-1');
    });

    panels.forEach(function (panel) {
      var panelKey = panel.getAttribute('data-tab-panel');
      var visible = panelKey === key;
      panel.style.display = visible ? '' : 'none';
      panel.setAttribute('aria-hidden', String(!visible));
    });
  }

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var targetHash = tab.getAttribute('data-target') || '#general';
      var key = activeKeyFromHash(targetHash);
      history.replaceState(null, '', '#' + key);
      activateByKey(key);
      var section = document.getElementById(key);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });

    tab.addEventListener('keydown', function (e) {
      var idx = tabs.indexOf(tab);
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        var next = tabs[(idx + 1) % tabs.length];
        var nextKey = activeKeyFromHash(next.getAttribute('data-target'));
        next.focus();
        history.replaceState(null, '', '#' + nextKey);
        activateByKey(nextKey);
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        var prev = tabs[(idx - 1 + tabs.length) % tabs.length];
        var prevKey = activeKeyFromHash(prev.getAttribute('data-target'));
        prev.focus();
        history.replaceState(null, '', '#' + prevKey);
        activateByKey(prevKey);
      }
    });
  });

  activateByKey(activeKeyFromHash(window.location.hash));
})();
