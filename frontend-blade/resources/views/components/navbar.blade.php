@props(['active' => 'home'])

<header class="topbar">
  <div class="container nav-wrap">
    <a class="brand" href="/"><span class="brand-mark">FN</span>Faiznute</a>
    <nav class="nav-links">
      <a class="nav-link {{ $active === 'home' ? 'active' : '' }}" href="/">Home</a>
      <a class="nav-link {{ $active === 'works' ? 'active' : '' }}" href="/works">Karya</a>
      <a class="nav-link {{ $active === 'services' ? 'active' : '' }}" href="/services">Layanan</a>
      <a class="nav-link {{ $active === 'cv' ? 'active' : '' }}" href="/cv">CV</a>
      <a class="nav-link {{ $active === 'contact' ? 'active' : '' }}" href="/contact">Kontak</a>
    </nav>
    <a class="btn btn-primary" href="/contact">Konsultasi</a>
  </div>
</header>
