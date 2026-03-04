(function () {
  if (window.__frontendFormsInit) return;
  window.__frontendFormsInit = true;

  var form = document.querySelector('form[data-contact-form]');
  if (!form) return;

  var fields = {
    name: form.querySelector('[name="name"]'),
    email: form.querySelector('[name="email"]'),
    phone: form.querySelector('[name="phone"]'),
    message: form.querySelector('[name="message"]')
  };
  var submitBtn = form.querySelector('button[type="submit"]');
  var notice = form.querySelector('[data-form-notice]');
  var api = window.PORTFOLIO_API;

  function setError(input, msg) {
    if (!input) return false;
    var key = input.getAttribute('name');
    var err = form.querySelector('[data-error="' + key + '"]');
    input.classList.toggle('border-red-400', !!msg);
    input.setAttribute('aria-invalid', msg ? 'true' : 'false');
    if (err) err.textContent = msg || '';
    return !!msg;
  }

  function validate() {
    var hasError = false;
    hasError = setError(fields.name, (fields.name && fields.name.value.trim().length < 2) ? 'Nama minimal 2 karakter.' : '') || hasError;
    hasError = setError(fields.email, (fields.email && !/^\S+@\S+\.\S+$/.test(fields.email.value.trim())) ? 'Format email tidak valid.' : '') || hasError;
    hasError = setError(fields.phone, (fields.phone && !/^\+?[0-9\s-]{8,15}$/.test(fields.phone.value.trim())) ? 'Nomor telepon tidak valid.' : '') || hasError;
    hasError = setError(fields.message, (fields.message && fields.message.value.trim().length < 12) ? 'Pesan minimal 12 karakter.' : '') || hasError;
    return !hasError;
  }

  function setLoading(on) {
    if (!submitBtn) return;
    submitBtn.disabled = on;
    submitBtn.textContent = on ? 'Mengirim...' : 'Kirim Pesan';
  }

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    if (!validate()) {
      if (notice) {
        notice.textContent = 'Periksa kembali field yang masih error.';
        notice.className = 'text-sm font-semibold text-red-600';
      }
      return;
    }
    setLoading(true);
    try {
      if (!api) throw new Error('API config missing');

      var response = await fetch(api.url('api/public/leads'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: fields.name ? fields.name.value.trim() : '',
          email: fields.email ? fields.email.value.trim() : '',
          phone: fields.phone ? fields.phone.value.trim() : '',
          subject: fields.phone && fields.phone.value.trim() ? ('WhatsApp: ' + fields.phone.value.trim()) : null,
          message: fields.message ? fields.message.value.trim() : ''
        })
      });

      if (!response.ok) {
        throw new Error('Submit failed');
      }

      setLoading(false);
      if (notice) {
        notice.textContent = 'Pesan terkirim. Terima kasih, kami segera menghubungi Anda.';
        notice.className = 'text-sm font-semibold text-emerald-600';
      }

      form.reset();
    } catch (error) {
      setLoading(false);
      if (notice) {
        notice.textContent = 'Gagal mengirim pesan sekarang. Coba beberapa saat lagi.';
        notice.className = 'text-sm font-semibold text-amber-700';
      }
    }
  });
})();
