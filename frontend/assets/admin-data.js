(function () {
  if (window.__adminDataInit) return;
  window.__adminDataInit = true;

  var auth = window.AdminAuth;
  if (!auth) return;

  function slugify(text) {
    return String(text || '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function appRoot() {
    var main = document.querySelector('main.admin-content-root') || document.querySelector('main');
    if (!main) return null;

    var root = main.querySelector('[data-admin-live-root]');
    if (root) return root;

    root = document.createElement('section');
    root.setAttribute('data-admin-live-root', 'true');
    root.className = 'p-4 lg:p-8';

    var children = Array.prototype.slice.call(main.children);
    children.forEach(function (child) {
      if (child.classList && child.classList.contains('admin-live-banner')) return;
      child.style.display = 'none';
    });

    main.appendChild(root);
    return root;
  }

  function setRoot(html) {
    var root = appRoot();
    if (!root) return null;
    root.innerHTML = html;
    return root;
  }

  var initialRoot = appRoot();
  if (initialRoot) {
    initialRoot.innerHTML = '<div class="rounded-xl border border-slate-200 bg-white p-5 text-sm font-semibold text-slate-600">Memuat dashboard admin...</div>';
  }

  async function api(path, options) {
    var response = await auth.request(path, options || {});
    if (response.status === 401) {
      auth.setToken('');
      window.location.href = 'login.html';
      throw new Error('Unauthorized');
    }
    if (response.status === 403) {
      throw new Error('Forbidden');
    }
    if (!response.ok) {
      throw new Error('Request failed');
    }
    return response.json();
  }

  function pathPage() {
    return window.location.pathname.split('/').pop() || 'dashboard.html';
  }

  function finishPreload() {
    document.body.classList.remove('admin-preload');
  }

  function ensureFormModal() {
    var existing = document.getElementById('admin-form-modal');
    if (existing) return existing;

    var modal = document.createElement('div');
    modal.id = 'admin-form-modal';
    modal.style.cssText = 'position:fixed;inset:0;background:rgba(15,23,42,0.55);display:none;align-items:center;justify-content:center;z-index:2000;padding:16px;';
    modal.innerHTML = ''
      + '<div style="width:min(560px,100%);max-height:90vh;overflow:auto;background:#fff;border-radius:14px;border:1px solid #e2e8f0;padding:16px;">'
      + '<div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:10px;">'
      + '<h3 id="admin-form-modal-title" style="margin:0;font-size:18px;font-weight:800;color:#0f172a;"></h3>'
      + '<button type="button" data-close-modal style="border:1px solid #cbd5e1;background:#fff;border-radius:8px;padding:6px 10px;cursor:pointer;">Close</button>'
      + '</div>'
      + '<form id="admin-form-modal-form" style="display:grid;gap:12px;">'
      + '<div id="admin-form-modal-fields" style="display:grid;gap:12px;"></div>'
      + '<div style="display:flex;justify-content:flex-end;gap:8px;">'
      + '<button type="button" data-close-modal style="border:1px solid #cbd5e1;background:#fff;border-radius:8px;padding:8px 12px;cursor:pointer;">Cancel</button>'
      + '<button type="submit" style="border:0;background:#137fec;color:#fff;border-radius:8px;padding:8px 14px;font-weight:700;cursor:pointer;">Save</button>'
      + '</div>'
      + '</form>'
      + '</div>';

    document.body.appendChild(modal);
    modal.addEventListener('click', function (event) {
      if (event.target === modal) {
        modal.style.display = 'none';
      }
    });
    modal.querySelectorAll('[data-close-modal]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        modal.style.display = 'none';
      });
    });

    return modal;
  }

  function openFormModal(config) {
    var modal = ensureFormModal();
    var title = modal.querySelector('#admin-form-modal-title');
    var fieldsWrap = modal.querySelector('#admin-form-modal-fields');
    var form = modal.querySelector('#admin-form-modal-form');

    title.textContent = config.title;
    fieldsWrap.innerHTML = '';

    config.fields.forEach(function (field) {
      var row = document.createElement('label');
      row.style.cssText = 'display:grid;gap:6px;font-size:13px;font-weight:700;color:#334155;';
      row.innerHTML = '<span>' + escapeHtml(field.label) + '</span>';

      var input;
      if (field.type === 'textarea') {
        input = document.createElement('textarea');
        input.rows = field.rows || 4;
      } else if (field.type === 'select') {
        input = document.createElement('select');
        (field.options || []).forEach(function (opt) {
          var option = document.createElement('option');
          option.value = opt.value;
          option.textContent = opt.label;
          input.appendChild(option);
        });
      } else if (field.type === 'checkbox') {
        input = document.createElement('input');
        input.type = 'checkbox';
      } else {
        input = document.createElement('input');
        input.type = field.type || 'text';
      }

      input.name = field.name;
      input.style.cssText = 'border:1px solid #cbd5e1;border-radius:8px;padding:9px 10px;font-size:14px;';
      if (field.type === 'checkbox') {
        input.style.cssText = 'width:18px;height:18px;';
      }
      if (field.required) input.required = true;

      var value = config.initial && Object.prototype.hasOwnProperty.call(config.initial, field.name)
        ? config.initial[field.name]
        : field.defaultValue;

      if (field.type === 'checkbox') {
        input.checked = Boolean(value);
      } else if (value !== undefined && value !== null) {
        input.value = value;
      }

      row.appendChild(input);
      fieldsWrap.appendChild(row);
    });

    return new Promise(function (resolve) {
      var handled = false;
      function closeWith(value) {
        if (handled) return;
        handled = true;
        modal.style.display = 'none';
        form.removeEventListener('submit', onSubmit);
        resolve(value);
      }

      function onSubmit(event) {
        event.preventDefault();
        var values = {};
        config.fields.forEach(function (field) {
          var input = form.elements[field.name];
          if (!input) return;
          if (field.type === 'checkbox') {
            values[field.name] = Boolean(input.checked);
          } else if (field.type === 'number') {
            values[field.name] = input.value === '' ? null : Number(input.value);
          } else {
            values[field.name] = input.value;
          }
        });
        closeWith(values);
      }

      form.addEventListener('submit', onSubmit);
      modal.style.display = 'flex';
      var first = form.querySelector('input:not([type="checkbox"]), textarea, select');
      if (first) first.focus();

      modal.querySelectorAll('[data-close-modal]').forEach(function (btn) {
        btn.onclick = function () {
          closeWith(null);
        };
      });
    });
  }

  async function renderDashboard() {
    var data = await Promise.all([
      api('api/admin/stats'),
      api('api/admin/leads?paginate=1&per_page=5&page=1')
    ]);

    var stats = data[0].data || {};
    var leads = data[1].data || [];
    var recentLeads = leads.slice(0, 5);

    setRoot(
      '<div class="space-y-6">'
      + '<div><h1 class="text-3xl font-black">Admin Dashboard</h1><p class="text-sm text-slate-500 mt-1">Connected to live backend API.</p></div>'
      + '<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">'
      + '<article class="rounded-xl border border-slate-200 bg-white p-5"><p class="text-xs uppercase text-slate-500">Works</p><p class="mt-2 text-3xl font-black">' + Number(stats.works || 0) + '</p></article>'
      + '<article class="rounded-xl border border-slate-200 bg-white p-5"><p class="text-xs uppercase text-slate-500">Categories</p><p class="mt-2 text-3xl font-black">' + Number(stats.categories || 0) + '</p></article>'
      + '<article class="rounded-xl border border-slate-200 bg-white p-5"><p class="text-xs uppercase text-slate-500">Tags</p><p class="mt-2 text-3xl font-black">' + Number(stats.tags || 0) + '</p></article>'
      + '<article class="rounded-xl border border-slate-200 bg-white p-5"><p class="text-xs uppercase text-slate-500">Leads</p><p class="mt-2 text-3xl font-black">' + Number(stats.leads || 0) + '</p></article>'
      + '</div>'
      + '<section class="rounded-xl border border-slate-200 bg-white p-5">'
      + '<h2 class="text-lg font-bold">Recent Leads</h2>'
      + '<div class="mt-4 overflow-x-auto">'
      + '<table class="w-full text-sm"><thead><tr class="text-left text-slate-500"><th class="py-2">Name</th><th>Email</th><th>Status</th></tr></thead><tbody>'
      + (recentLeads.length ? recentLeads.map(function (lead) {
        return '<tr class="border-t border-slate-100"><td class="py-2">' + escapeHtml(lead.name) + '</td><td>' + escapeHtml(lead.email) + '</td><td>' + escapeHtml(lead.status) + '</td></tr>';
      }).join('') : '<tr><td colspan="3" class="py-3 text-slate-500">No leads yet.</td></tr>')
      + '</tbody></table></div></section></div>'
    );
  }

  async function renderCrudPage(config) {
    var payload = await api(config.path);
    var items = payload.data || [];

    var root = setRoot(
      '<div class="space-y-6">'
      + '<div class="flex flex-wrap items-center justify-between gap-3">'
      + '<div><h1 class="text-3xl font-black">' + escapeHtml(config.title) + '</h1><p class="text-sm text-slate-500 mt-1">Live data from backend API.</p></div>'
      + (config.allowCreate === false
        ? ''
        : '<button data-no-popup="true" data-admin-create class="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white">' + escapeHtml(config.createLabel || 'Create') + '</button>')
      + '</div>'
      + '<div class="overflow-x-auto rounded-xl border border-slate-200 bg-white">'
      + '<table class="w-full text-sm"><thead><tr class="bg-slate-50 text-left text-slate-500">'
      + config.columns.map(function (col) { return '<th class="px-4 py-3">' + escapeHtml(col.label) + '</th>'; }).join('')
      + '<th class="px-4 py-3 text-right">Actions</th></tr></thead><tbody data-admin-rows></tbody></table>'
      + '</div></div>'
    );

    var rows = root.querySelector('[data-admin-rows]');
    rows.innerHTML = items.length ? items.map(function (item) {
      var cells = config.columns.map(function (col) {
        return '<td class="px-4 py-3 border-t border-slate-100">' + escapeHtml(col.value(item)) + '</td>';
      }).join('');
      return '<tr data-id="' + item.id + '">' + cells
        + '<td class="px-4 py-3 border-t border-slate-100 text-right">'
        + '<button data-no-popup="true" data-admin-edit="' + item.id + '" class="mr-2 rounded border border-slate-300 px-3 py-1.5">Edit</button>'
        + '<button data-no-popup="true" data-admin-delete="' + item.id + '" class="rounded border border-red-200 px-3 py-1.5 text-red-600">Delete</button>'
        + '</td></tr>';
    }).join('') : '<tr><td colspan="99" class="px-4 py-6 text-center text-slate-500">No data</td></tr>';

    async function reload() {
      await renderCrudPage(config);
    }

    var createBtn = root.querySelector('[data-admin-create]');
    if (createBtn) {
      createBtn.addEventListener('click', async function () {
        await config.create();
        await reload();
      });
    }

    rows.addEventListener('click', async function (event) {
      var editBtn = event.target.closest('[data-admin-edit]');
      if (editBtn) {
        await config.edit(Number(editBtn.getAttribute('data-admin-edit')), items);
        await reload();
      }
      var deleteBtn = event.target.closest('[data-admin-delete]');
      if (deleteBtn) {
        await config.remove(Number(deleteBtn.getAttribute('data-admin-delete')));
        await reload();
      }
    });
  }

  async function renderWorks() {
    var categoriesPayload = await api('api/admin/categories');
    var categories = categoriesPayload.data || [];

    await renderCrudPage({
      title: 'Works',
      path: 'api/admin/works',
      columns: [
        { label: 'Title', value: function (w) { return w.title; } },
        { label: 'Category', value: function (w) { return w.category ? w.category.name : '-'; } },
        { label: 'Status', value: function (w) { return w.is_published ? 'published' : 'draft'; } }
      ],
      create: async function () {
        var formData = await openFormModal({
          title: 'Create Work',
          fields: [
            { name: 'title', label: 'Title', required: true },
            { name: 'category_id', label: 'Category', type: 'select', options: [{ label: 'No Category', value: '' }].concat(categories.map(function (c) { return { label: c.name, value: String(c.id) }; })) },
            { name: 'is_published', label: 'Publish now', type: 'checkbox', defaultValue: true }
          ]
        });
        if (!formData || !formData.title) return;
        await api('api/admin/works', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: formData.title,
            slug: slugify(formData.title),
            category_id: formData.category_id ? Number(formData.category_id) : null,
            is_published: Boolean(formData.is_published),
            published_at: formData.is_published ? new Date().toISOString() : null
          })
        });
      },
      edit: async function (id, items) {
        var item = items.find(function (x) { return x.id === id; });
        if (!item) return;
        var formData = await openFormModal({
          title: 'Edit Work',
          initial: {
            title: item.title,
            category_id: item.category_id ? String(item.category_id) : '',
            is_published: Boolean(item.is_published)
          },
          fields: [
            { name: 'title', label: 'Title', required: true },
            { name: 'category_id', label: 'Category', type: 'select', options: [{ label: 'No Category', value: '' }].concat(categories.map(function (c) { return { label: c.name, value: String(c.id) }; })) },
            { name: 'is_published', label: 'Published', type: 'checkbox' }
          ]
        });
        if (!formData || !formData.title) return;
        await api('api/admin/works/' + id, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: formData.title,
            slug: slugify(formData.title),
            category_id: formData.category_id ? Number(formData.category_id) : null,
            is_published: Boolean(formData.is_published),
            published_at: formData.is_published ? (item.published_at || new Date().toISOString()) : null
          })
        });
      },
      remove: async function (id) {
        if (!window.confirm('Delete work #' + id + '?')) return;
        await api('api/admin/works/' + id, { method: 'DELETE' });
      }
    });
  }

  async function renderCategories() {
    await renderCrudPage({
      title: 'Categories',
      path: 'api/admin/categories',
      columns: [
        { label: 'Name', value: function (x) { return x.name; } },
        { label: 'Slug', value: function (x) { return x.slug; } },
        { label: 'Status', value: function (x) { return x.is_active ? 'active' : 'inactive'; } }
      ],
      create: async function () {
        var formData = await openFormModal({
          title: 'Create Category',
          fields: [
            { name: 'name', label: 'Name', required: true },
            { name: 'is_active', label: 'Active', type: 'checkbox', defaultValue: true }
          ]
        });
        if (!formData || !formData.name) return;
        await api('api/admin/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: formData.name, slug: slugify(formData.name), is_active: Boolean(formData.is_active) })
        });
      },
      edit: async function (id, items) {
        var item = items.find(function (x) { return x.id === id; });
        if (!item) return;
        var formData = await openFormModal({
          title: 'Edit Category',
          initial: { name: item.name, is_active: Boolean(item.is_active) },
          fields: [
            { name: 'name', label: 'Name', required: true },
            { name: 'is_active', label: 'Active', type: 'checkbox' }
          ]
        });
        if (!formData || !formData.name) return;
        await api('api/admin/categories/' + id, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: formData.name, slug: slugify(formData.name), is_active: Boolean(formData.is_active) })
        });
      },
      remove: async function (id) {
        if (!window.confirm('Delete category #' + id + '?')) return;
        await api('api/admin/categories/' + id, { method: 'DELETE' });
      }
    });
  }

  async function renderTags() {
    await renderCrudPage({
      title: 'Tags',
      path: 'api/admin/tags',
      columns: [
        { label: 'Name', value: function (x) { return x.name; } },
        { label: 'Slug', value: function (x) { return x.slug; } },
        { label: 'Color', value: function (x) { return x.color || '-'; } }
      ],
      create: async function () {
        var formData = await openFormModal({
          title: 'Create Tag',
          fields: [
            { name: 'name', label: 'Name', required: true },
            { name: 'color', label: 'Color (optional)', defaultValue: '#137fec' },
            { name: 'is_active', label: 'Active', type: 'checkbox', defaultValue: true }
          ]
        });
        if (!formData || !formData.name) return;
        await api('api/admin/tags', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: formData.name, slug: slugify(formData.name), color: formData.color || null, is_active: Boolean(formData.is_active) })
        });
      },
      edit: async function (id, items) {
        var item = items.find(function (x) { return x.id === id; });
        if (!item) return;
        var formData = await openFormModal({
          title: 'Edit Tag',
          initial: { name: item.name, color: item.color || '', is_active: Boolean(item.is_active) },
          fields: [
            { name: 'name', label: 'Name', required: true },
            { name: 'color', label: 'Color (optional)' },
            { name: 'is_active', label: 'Active', type: 'checkbox' }
          ]
        });
        if (!formData || !formData.name) return;
        await api('api/admin/tags/' + id, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: formData.name, slug: slugify(formData.name), color: formData.color || null, is_active: Boolean(formData.is_active) })
        });
      },
      remove: async function (id) {
        if (!window.confirm('Delete tag #' + id + '?')) return;
        await api('api/admin/tags/' + id, { method: 'DELETE' });
      }
    });
  }

  async function renderLeads() {
    await renderCrudPage({
      title: 'Leads',
      path: 'api/admin/leads',
      columns: [
        { label: 'Name', value: function (x) { return x.name; } },
        { label: 'Email', value: function (x) { return x.email; } },
        { label: 'Status', value: function (x) { return x.status; } },
        { label: 'Phone', value: function (x) { return x.phone || '-'; } }
      ],
      allowCreate: false,
      edit: async function (id, items) {
        var item = items.find(function (x) { return x.id === id; });
        if (!item) return;
        var formData = await openFormModal({
          title: 'Update Lead Status',
          initial: { status: item.status },
          fields: [
            {
              name: 'status',
              label: 'Status',
              type: 'select',
              options: [
                { value: 'new', label: 'new' },
                { value: 'read', label: 'read' },
                { value: 'replied', label: 'replied' },
                { value: 'archived', label: 'archived' }
              ]
            }
          ]
        });
        if (!formData || !formData.status) return;
        await api('api/admin/leads/' + id, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: formData.status })
        });
      },
      remove: async function (id) {
        if (!window.confirm('Delete lead #' + id + '?')) return;
        await api('api/admin/leads/' + id, { method: 'DELETE' });
      }
    });
  }

  async function renderSettings() {
    await renderCrudPage({
      title: 'Settings',
      path: 'api/admin/settings',
      columns: [
        { label: 'Group', value: function (x) { return x.group; } },
        { label: 'Key', value: function (x) { return x.key; } },
        { label: 'Value', value: function (x) { return x.value || ''; } }
      ],
      create: async function () {
        var formData = await openFormModal({
          title: 'Create Setting',
          initial: { group: 'general', type: 'string' },
          fields: [
            { name: 'group', label: 'Group', required: true },
            { name: 'key', label: 'Key', required: true },
            { name: 'value', label: 'Value', type: 'textarea' },
            { name: 'type', label: 'Type', required: true }
          ]
        });
        if (!formData || !formData.key) return;
        await api('api/admin/settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key: formData.key, value: formData.value || '', group: formData.group || 'general', type: formData.type || 'string' })
        });
      },
      edit: async function (id, items) {
        var item = items.find(function (x) { return x.id === id; });
        if (!item) return;
        var formData = await openFormModal({
          title: 'Edit Setting',
          initial: { group: item.group, key: item.key, value: item.value || '', type: item.type || 'string' },
          fields: [
            { name: 'group', label: 'Group', required: true },
            { name: 'key', label: 'Key', required: true },
            { name: 'value', label: 'Value', type: 'textarea' },
            { name: 'type', label: 'Type', required: true }
          ]
        });
        if (!formData) return;
        await api('api/admin/settings/' + id, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ group: formData.group, key: formData.key, value: formData.value, type: formData.type })
        });
      },
      remove: async function (id) {
        if (!window.confirm('Delete setting #' + id + '?')) return;
        await api('api/admin/settings/' + id, { method: 'DELETE' });
      }
    });
  }

  async function renderSimpleNamedEntity(config) {
    await renderCrudPage({
      title: config.title,
      path: config.path,
      columns: config.columns,
      create: async function () {
        var formData = await openFormModal({
          title: config.createTitle || ('Create ' + config.title),
          fields: (config.createFields || [
            { name: 'name', label: 'Name', required: true }
          ])
        });
        if (!formData) return;
        var name = formData.name || formData.title;
        if (!name) return;
        var payload = {
          title: name,
          name: name,
          slug: slugify(name),
          is_active: true
        };
        if (config.extraCreate) {
          payload = Object.assign(payload, config.extraCreate(name, formData));
        }
        await api(config.path, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      },
      edit: async function (id, items) {
        var item = items.find(function (x) { return x.id === id; });
        if (!item) return;
        var formData = await openFormModal({
          title: config.editTitle || ('Edit ' + config.title),
          initial: config.mapInitial ? config.mapInitial(item) : { name: item.title || item.name || '' },
          fields: (config.editFields || config.createFields || [
            { name: 'name', label: 'Name', required: true }
          ])
        });
        if (!formData) return;
        var value = formData.name || formData.title;
        if (!value) return;
        var payload = {
          title: value,
          name: value,
          slug: slugify(value)
        };
        if (config.extraEdit) {
          payload = Object.assign(payload, config.extraEdit(value, item, formData));
        }
        await api(config.path + '/' + id, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      },
      remove: async function (id) {
        if (!window.confirm('Delete item #' + id + '?')) return;
        await api(config.path + '/' + id, { method: 'DELETE' });
      }
    });
  }

  async function renderServices() {
    return renderSimpleNamedEntity({
      title: 'Services',
      path: 'api/admin/services',
      columns: [
        { label: 'Title', value: function (x) { return x.title; } },
        { label: 'Slug', value: function (x) { return x.slug; } },
        { label: 'Price', value: function (x) { return x.price || '-'; } }
      ],
      createFields: [
        { name: 'name', label: 'Title', required: true },
        { name: 'price', label: 'Price label' },
        { name: 'summary', label: 'Summary', type: 'textarea' }
      ],
      editFields: [
        { name: 'name', label: 'Title', required: true },
        { name: 'price', label: 'Price label' },
        { name: 'summary', label: 'Summary', type: 'textarea' }
      ],
      mapInitial: function (item) {
        return { name: item.title || '', price: item.price || '', summary: item.summary || '' };
      },
      extraCreate: function (_name, formData) {
        return { price: formData.price || '', summary: formData.summary || '' };
      },
      extraEdit: function (value, _item, formData) {
        return { title: value, slug: slugify(value), price: formData.price || '', summary: formData.summary || '' };
      }
    });
  }

  async function renderTestimonials() {
    return renderSimpleNamedEntity({
      title: 'Testimonials',
      path: 'api/admin/testimonials',
      columns: [
        { label: 'Name', value: function (x) { return x.name; } },
        { label: 'Role', value: function (x) { return x.role || '-'; } },
        { label: 'Quote', value: function (x) { return (x.quote || '').slice(0, 80); } }
      ],
      createFields: [
        { name: 'name', label: 'Client name', required: true },
        { name: 'role', label: 'Role', defaultValue: 'Client' },
        { name: 'quote', label: 'Quote', type: 'textarea', required: true },
        { name: 'rating', label: 'Rating', type: 'number', defaultValue: 5 }
      ],
      editFields: [
        { name: 'name', label: 'Client name', required: true },
        { name: 'role', label: 'Role' },
        { name: 'quote', label: 'Quote', type: 'textarea', required: true },
        { name: 'rating', label: 'Rating', type: 'number' }
      ],
      mapInitial: function (item) {
        return { name: item.name, role: item.role || 'Client', quote: item.quote || '', rating: item.rating || 5 };
      },
      extraCreate: function (name, formData) {
        return { name: name, quote: formData.quote || 'Great collaboration.', role: formData.role || 'Client', rating: formData.rating || 5 };
      },
      extraEdit: function (value, item, formData) {
        return { name: value, role: formData.role || item.role || 'Client', quote: formData.quote || item.quote || 'Great collaboration.', rating: formData.rating || item.rating || 5 };
      }
    });
  }

  async function renderCvItems() {
    return renderSimpleNamedEntity({
      title: 'CV Items',
      path: 'api/admin/cv-items',
      columns: [
        { label: 'Section', value: function (x) { return x.section; } },
        { label: 'Title', value: function (x) { return x.title; } },
        { label: 'Period', value: function (x) { return x.period || '-'; } }
      ],
      createFields: [
        { name: 'name', label: 'Title', required: true },
        { name: 'section', label: 'Section', type: 'select', options: [{ value: 'experience', label: 'experience' }, { value: 'skill', label: 'skill' }] },
        { name: 'period', label: 'Period' },
        { name: 'description', label: 'Description', type: 'textarea' }
      ],
      editFields: [
        { name: 'name', label: 'Title', required: true },
        { name: 'section', label: 'Section', type: 'select', options: [{ value: 'experience', label: 'experience' }, { value: 'skill', label: 'skill' }] },
        { name: 'period', label: 'Period' },
        { name: 'description', label: 'Description', type: 'textarea' }
      ],
      mapInitial: function (item) {
        return { name: item.title || '', section: item.section || 'experience', period: item.period || '', description: item.description || '' };
      },
      extraCreate: function (title, formData) {
        return { section: formData.section || 'experience', title: title, period: formData.period || '', description: formData.description || '' };
      },
      extraEdit: function (title, item, formData) {
        return { section: formData.section || item.section || 'experience', title: title, period: formData.period || item.period || '', description: formData.description || item.description || '' };
      }
    });
  }

  async function renderHighlights() {
    return renderSimpleNamedEntity({
      title: 'Highlights',
      path: 'api/admin/highlights',
      columns: [
        { label: 'Title', value: function (x) { return x.title; } },
        { label: 'Subtitle', value: function (x) { return x.subtitle || '-'; } },
        { label: 'CTA', value: function (x) { return x.cta_label || '-'; } }
      ],
      extraCreate: function (title) {
        return { title: title, subtitle: '', cta_label: 'Learn More' };
      },
      extraEdit: function (title, item) {
        return { title: title, subtitle: item.subtitle || '', cta_label: item.cta_label || '' };
      }
    });
  }

  async function renderBanners() {
    return renderSimpleNamedEntity({
      title: 'Banners',
      path: 'api/admin/banners',
      columns: [
        { label: 'Title', value: function (x) { return x.title; } },
        { label: 'Subtitle', value: function (x) { return x.subtitle || '-'; } },
        { label: 'CTA', value: function (x) { return x.cta_label || '-'; } }
      ],
      extraCreate: function (title) {
        return { title: title, subtitle: '', cta_label: 'Contact', cta_url: 'contact.html' };
      },
      extraEdit: function (title, item) {
        return { title: title, subtitle: item.subtitle || '', cta_label: item.cta_label || 'Contact', cta_url: item.cta_url || 'contact.html' };
      }
    });
  }

  function renderPlaceholder(title, message) {
    setRoot(
      '<div class="rounded-xl border border-slate-200 bg-white p-6">'
      + '<h1 class="text-3xl font-black">' + escapeHtml(title) + '</h1>'
      + '<p class="mt-2 text-sm text-slate-500">' + escapeHtml(message) + '</p>'
      + '</div>'
    );
  }

  auth.ready.then(function (user) {
    if (!user) {
      finishPreload();
      return;
    }
    var page = pathPage();
    var task;

    if (page === 'dashboard.html') task = renderDashboard();
    else if (page === 'works.html') task = renderWorks();
    else if (page === 'categories.html') task = renderCategories();
    else if (page === 'tags.html') task = renderTags();
    else if (page === 'leads.html') task = renderLeads();
    else if (page === 'settings.html') task = renderSettings();

    else if (page === 'services.html') task = renderServices();
    else if (page === 'testimonials.html') task = renderTestimonials();
    else if (page === 'cv.html') task = renderCvItems();
    else if (page === 'highlights.html') task = renderHighlights();
    else if (page === 'banners.html') task = renderBanners();
    else task = renderPlaceholder('Module', 'No live renderer assigned for this page yet.');

    return Promise.resolve(task).finally(finishPreload);
  }).catch(function () {
    finishPreload();
  });
})();
