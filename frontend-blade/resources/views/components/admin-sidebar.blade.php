@props(['active' => 'dashboard'])

<aside class="sidebar">
  <a class="brand" href="/admin"><span class="brand-mark">FN</span>Admin CMS</a>
  <nav class="menu">
    <a class="{{ $active === 'dashboard' ? 'active' : '' }}" href="/admin">Dashboard</a>
    <a class="{{ $active === 'works' ? 'active' : '' }}" href="/admin/works">Works</a>
    <a class="{{ $active === 'categories' ? 'active' : '' }}" href="/admin/categories">Categories</a>
    <a class="{{ $active === 'tags' ? 'active' : '' }}" href="/admin/tags">Tags</a>
    <a class="{{ $active === 'highlights' ? 'active' : '' }}" href="/admin/highlights">Highlights</a>
    <a class="{{ $active === 'banners' ? 'active' : '' }}" href="/admin/banners">Banners</a>
    <a class="{{ $active === 'services' ? 'active' : '' }}" href="/admin/services">Services</a>
    <a class="{{ $active === 'testimonials' ? 'active' : '' }}" href="/admin/testimonials">Testimonials</a>
    <a class="{{ $active === 'cv' ? 'active' : '' }}" href="/admin/cv">CV</a>
    <a class="{{ $active === 'leads' ? 'active' : '' }}" href="/admin/leads">Leads</a>
    <a class="{{ $active === 'settings' ? 'active' : '' }}" href="/admin/settings">Settings</a>
  </nav>
</aside>
