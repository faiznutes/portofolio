@extends('layouts.admin', ['title' => 'Admin Settings', 'active' => 'settings'])

@section('content')
  <div class="admin-top"><h1>Site Settings</h1><x-button>Simpan</x-button></div>
  <article class="card panel stack-md">
    <div class="field"><label>Nomor WhatsApp</label><input value="085155043133" /></div>
    <div class="field"><label>Instagram</label><input value="https://instagram.com/faiznute" /></div>
    <div class="field"><label>TikTok</label><input value="https://tiktok.com/@faiznute" /></div>
    <div class="field"><label>Email</label><input value="faiznute07@gmail.com" /></div>
  </article>
@endsection
