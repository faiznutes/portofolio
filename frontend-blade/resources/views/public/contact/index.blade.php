@extends('layouts.public', ['title' => 'Kontak - Faiznute', 'active' => 'contact'])

@section('content')
  <section class="section two-col">
    <article class="card contact-form stack-md">
      <x-badge text="Lead Form" />
      <h1>Mari bahas project kamu</h1>
      <p>Saya balas maksimal 1x24 jam kerja.</p>
      <div class="field"><label>Nama</label><input type="text" placeholder="Nama lengkap" /></div>
      <div class="field"><label>No. WhatsApp</label><input type="text" placeholder="08xxxxxxxxxx" /></div>
      <div class="field"><label>Email</label><input type="email" placeholder="opsional" /></div>
      <div class="field"><label>Pesan</label><textarea rows="5" placeholder="Ceritakan kebutuhan"></textarea></div>
      <x-button type="submit">Kirim Pesan</x-button>
    </article>
    <aside class="card panel stack-md"><h3>Kontak Cepat</h3><p>Lanjut diskusi via WhatsApp untuk respon paling cepat.</p><x-button href="#">Chat WhatsApp</x-button></aside>
  </section>
@endsection
