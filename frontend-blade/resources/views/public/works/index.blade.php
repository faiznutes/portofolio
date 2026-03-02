@extends('layouts.public', ['title' => 'Karya - Faiznute', 'active' => 'works'])

@section('content')
  <section class="section">
    <div class="stack-sm">
      <x-badge text="Portfolio" />
      <h1>Koleksi Karya</h1>
    </div>
    <input id="searchWork" class="search" type="text" placeholder="Cari project, industri, atau hasil..." />
    <div class="filter-row">
      <button class="chip active" data-filter="all">Semua</button>
      <button class="chip" data-filter="web">Web</button>
      <button class="chip" data-filter="design">Design</button>
      <button class="chip" data-filter="video">Video</button>
    </div>
    <div class="grid-3">
      <article class="card work-card" data-work data-category="web"><div class="thumb"></div><h3>Website Klinik Gigi</h3><p>Leads naik 70%.</p><a class="btn btn-secondary" href="/works/sample">Lihat Detail</a></article>
      <article class="card work-card" data-work data-category="design"><div class="thumb"></div><h3>Branding Coffee Shop</h3><p>Visual lebih premium.</p><a class="btn btn-secondary" href="/works/sample">Lihat Detail</a></article>
      <article class="card work-card" data-work data-category="video"><div class="thumb"></div><h3>Video Ads Fashion</h3><p>CTR naik 1.8x.</p><a class="btn btn-secondary" href="/works/sample">Lihat Detail</a></article>
    </div>
  </section>
@endsection
