(function () {
  if (window.__worksBackButtonInit) return;
  window.__worksBackButtonInit = true;

  function fallbackToWorks() {
    window.location.href = '/works';
  }

  function canGoBackToWorks() {
    if (window.history.length <= 1) return false;
    var ref = String(document.referrer || '');
    if (!ref) return false;

    try {
      var url = new URL(ref);
      return url.origin === window.location.origin;
    } catch (error) {
      return false;
    }
  }

  function goBack() {
    if (canGoBackToWorks()) {
      window.history.back();
      return;
    }

    fallbackToWorks();
  }

  var button = document.createElement('button');
  button.type = 'button';
  button.className = 'fixed bottom-5 right-5 z-[1000] inline-flex items-center gap-2 rounded-full border border-white/40 bg-slate-900/90 px-4 py-2 text-sm font-bold text-white shadow-lg backdrop-blur transition hover:-translate-y-0.5 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-white/80';
  button.setAttribute('aria-label', 'Kembali ke Karya');
  button.textContent = 'Kembali ke Karya';
  button.addEventListener('click', goBack);

  document.body.appendChild(button);
})();
