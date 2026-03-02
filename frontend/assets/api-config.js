(function () {
  if (window.__apiConfigReady) return;
  window.__apiConfigReady = true;

  var storageBase = window.localStorage.getItem('portfolio_api_base');
  var metaEl = document.querySelector('meta[name="portfolio-api-base"]');
  var metaBase = metaEl ? metaEl.getAttribute('content') : '';
  var host = String(window.location.hostname || '').toLowerCase();
  var isLocal = host === 'localhost' || host === '127.0.0.1';
  var defaultBase = isLocal ? 'http://127.0.0.1:8000' : window.location.origin;
  var base = storageBase || metaBase || defaultBase;

  function normalize(url) {
    return (url || '').replace(/\/+$/, '');
  }

  window.PORTFOLIO_API = {
    baseUrl: normalize(base),
    setBaseUrl: function (nextBaseUrl) {
      this.baseUrl = normalize(nextBaseUrl);
      window.localStorage.setItem('portfolio_api_base', this.baseUrl);
    },
    url: function (path) {
      var cleanPath = String(path || '').replace(/^\/+/, '');
      return this.baseUrl + '/' + cleanPath;
    }
  };
})();
