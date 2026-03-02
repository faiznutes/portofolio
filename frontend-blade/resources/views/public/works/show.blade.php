@extends('layouts.public', ['title' => 'Detail Karya - Faiznute', 'active' => 'works'])

@section('content')
  <section class="section two-col">
    <article class="card panel stack-md">
      <x-badge text="Case Study" />
      <h1>Website Catering Event Surabaya</h1>
      <div class="thumb"></div>
      <h3>Problem</h3>
      <p>Inquiry rendah walau traffic tinggi.</p>
      <h3>Process</h3>
      <p>Penyederhanaan alur informasi dan CTA.</p>
      <h3>Result</h3>
      <p>Booking naik 2.3x dalam 6 minggu.</p>
    </article>
    <aside class="card panel stack-md">
      <h3>Ringkasan Proyek</h3>
      <div class="pill-row"><span class="pill">Web</span><span class="pill">Figma</span><span class="pill">Laravel</span></div>
      <x-button href="/contact">Saya Mau Hasil Serupa</x-button>
    </aside>
  </section>
@endsection
