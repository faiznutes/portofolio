@extends('layouts.public', ['title' => 'Layanan - Faiznute', 'active' => 'services'])

@section('content')
  <section class="section stack-lg">
    <div class="stack-sm"><x-badge text="Services" /><h1>Pilihan layanan Faiznute</h1></div>
    <div class="grid-3">
      <article class="card panel stack-sm"><h3>Landing Page</h3><p>Mulai Rp2.5jt, 5-10 hari.</p></article>
      <article class="card panel stack-sm"><h3>Company Profile</h3><p>Mulai Rp4.5jt, 10-14 hari.</p></article>
      <article class="card panel stack-sm"><h3>Toko Online</h3><p>Mulai Rp7jt, 14-21 hari.</p></article>
    </div>
    <article class="card panel stack-md">
      <h2>Butuh paket custom?</h2>
      <p>Kita bisa gabungkan website + desain + video.</p>
      <x-button href="/contact">Diskusi Paket Custom</x-button>
    </article>
  </section>
@endsection
