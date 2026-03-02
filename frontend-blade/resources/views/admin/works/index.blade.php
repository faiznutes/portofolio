@extends('layouts.admin', ['title' => 'Admin Works', 'active' => 'works'])

@section('content')
  <div class="admin-top"><h1>Works</h1><x-button>+ Tambah Work</x-button></div>
  <article class="card panel">
    <div class="toolbar"><input class="search" placeholder="Cari work" /><x-button variant="secondary">Filter</x-button></div>
    <div class="table-wrap"><table><thead><tr><th>Title</th><th>Kategori</th><th>Status</th></tr></thead><tbody><tr><td>Website Klinik Gigi</td><td>Web</td><td><span class="status active">ACTIVE</span></td></tr></tbody></table></div>
  </article>
@endsection
