@extends('layouts.admin', ['title' => 'Admin Dashboard - Faiznute', 'active' => 'dashboard'])

@section('content')
  <div class="admin-top"><h1>Dashboard</h1><x-button>+ Tambah Work</x-button></div>
  <section class="stats">
    <article class="card panel"><strong>9</strong><p>Total Works</p></article>
    <article class="card panel"><strong>6</strong><p>Services Aktif</p></article>
    <article class="card panel"><strong>14</strong><p>Leads Bulan Ini</p></article>
    <article class="card panel"><strong>3</strong><p>Banner Live</p></article>
  </section>
  <section class="card panel" style="margin-top:1rem">
    <h3>Lead Terbaru</h3>
    <div class="table-wrap">
      <table>
        <thead><tr><th>Nama</th><th>Service</th><th>Status</th></tr></thead>
        <tbody><tr><td>Rina</td><td>Landing Page</td><td><span class="status new">NEW</span></td></tr></tbody>
      </table>
    </div>
  </section>
@endsection
