(function () {
  if (window.__adminAuthInit) return;
  window.__adminAuthInit = true;

  var TOKEN_KEY = 'portfolio_admin_token';
  var api = window.PORTFOLIO_API;
  var pathname = window.location.pathname.toLowerCase();
  var inAdmin = pathname.indexOf('/admin/') !== -1;
  var isLoginPage = pathname.endsWith('/login.html');

  function token() {
    return window.localStorage.getItem(TOKEN_KEY) || '';
  }

  function setToken(value) {
    if (value) {
      window.localStorage.setItem(TOKEN_KEY, value);
      return;
    }
    window.localStorage.removeItem(TOKEN_KEY);
  }

  function loginUrl() {
    return 'login.html?next=' + encodeURIComponent(window.location.pathname + window.location.search);
  }

  function redirectLogin() {
    if (isLoginPage) return;
    window.location.href = loginUrl();
  }

  async function request(path, options) {
    if (!api) throw new Error('API config missing');

    var headers = Object.assign({ 'Accept': 'application/json' }, (options && options.headers) || {});
    var authToken = token();
    if (authToken) {
      headers.Authorization = 'Bearer ' + authToken;
    }

    var response = await fetch(api.url(path), Object.assign({}, options || {}, { headers: headers }));
    return response;
  }

  async function logout() {
    try {
      await request('api/auth/logout', { method: 'POST' });
    } catch (err) {
      // no-op
    }
    setToken('');
    window.location.href = 'login.html';
  }

  var authState = {
    user: null,
    ready: Promise.resolve(null),
    token: token,
    setToken: setToken,
    request: request,
    logout: logout
  };

  window.AdminAuth = authState;

  if (!inAdmin) return;

  if (!isLoginPage && !token()) {
    redirectLogin();
    return;
  }

  authState.ready = (async function () {
    if (isLoginPage) return null;

    var meResponse;
    try {
      meResponse = await request('api/auth/me');
    } catch (err) {
      redirectLogin();
      return null;
    }

    if (!meResponse.ok) {
      setToken('');
      redirectLogin();
      return null;
    }

    var mePayload = await meResponse.json();
    var user = mePayload && mePayload.data ? mePayload.data.user : null;
    authState.user = user;

    if (!user || !user.is_admin) {
      setToken('');
      window.location.href = 'login.html?error=admin-only';
      return null;
    }

    return user;
  })();

  if (!isLoginPage) return;

  var form = document.querySelector('[data-admin-login-form]');
  if (!form) return;

  var notice = form.querySelector('[data-login-notice]');
  var submitBtn = form.querySelector('button[type="submit"]');

  function setNotice(text, tone) {
    if (!notice) return;
    notice.textContent = text;
    notice.className = tone === 'error'
      ? 'text-sm font-semibold text-red-600'
      : tone === 'ok'
        ? 'text-sm font-semibold text-emerald-600'
        : 'text-sm font-semibold text-slate-500';
  }

  form.addEventListener('submit', async function (event) {
    event.preventDefault();
    if (!api) return;

    var emailInput = form.querySelector('[name="email"]');
    var passwordInput = form.querySelector('[name="password"]');
    var email = emailInput ? emailInput.value.trim() : '';
    var password = passwordInput ? passwordInput.value : '';

    submitBtn.disabled = true;
    submitBtn.textContent = 'Signing In...';
    setNotice('Memverifikasi akun admin...', 'info');

    try {
      var response = await fetch(api.url('api/auth/login'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email: email, password: password })
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      var payload = await response.json();
      var authToken = payload && payload.data ? payload.data.token : '';
      if (!authToken) {
        throw new Error('Token missing');
      }

      setToken(authToken);

      var meResponse = await request('api/auth/me');
      if (!meResponse.ok) {
        throw new Error('Profile check failed');
      }

      var mePayload = await meResponse.json();
      var user = mePayload && mePayload.data ? mePayload.data.user : null;
      if (!user || !user.is_admin) {
        setToken('');
        throw new Error('Admin only');
      }

      setNotice('Login berhasil. Mengalihkan ke dashboard...', 'ok');
      var next = new URLSearchParams(window.location.search).get('next');
      window.location.href = next || 'dashboard.html';
    } catch (err) {
      setToken('');
      setNotice('Login gagal atau akun bukan admin.', 'error');
      submitBtn.disabled = false;
      submitBtn.textContent = 'Login Admin';
    }
  });
})();
