@extends('layouts.public', ['title' => 'Faiznute - Web Creator', 'active' => 'home'])

@section('content')
  <section class="hero">
    <div class="hero-grid">
      <article class="card hero-card stack-lg">
        <x-badge text="Web Creator Surabaya" />
        <h1>Saya bantu bisnismu tampil profesional lewat website yang rapi dan siap jual.</h1>
        <p>Landing page, company profile, hingga toko online - dibuat cepat, clean, dan mudah dikelola.</p>
        <div class="cta-row">
          <x-button href="/contact">Konsultasi via WhatsApp</x-button>
          <x-button variant="secondary" href="/works">Lihat Karya</x-button>
        </div>
      </article>
      <article class="card hero-card stack-md">
        <h3>Kenapa pilih Faiznute?</h3>
        <p>Strategi yang jelas, desain elegan, dan eksekusi yang fokus konversi.</p>
        <div class="panel card"><div class="skeleton"></div><div class="skeleton" style="width: 80%"></div></div>
      </article>
    </div>
  </section>

  <section class="section">
    <x-section-heading badge="Featured Works" title="Karya yang membantu bisnis naik level" actionText="Semua Karya" actionHref="/works" />
    <div class="grid-3">
      <x-work-card title="Website Catering Event Surabaya" summary="Naikkan booking 2.3x dengan landing page yang jelas dan cepat." :tags="['Web', 'Laravel']" />
      <x-work-card title="Redesign Brand F&B Lokal" summary="Visual identity baru dengan style premium dan konsisten." :tags="['Design', 'Figma']" />
      <x-work-card title="Campaign Video Produk UMKM" summary="Konten pendek untuk IG dan TikTok dengan engagement lebih tinggi." :tags="['Video', 'Premiere']" />
    </div>
  </section>
@endsection
