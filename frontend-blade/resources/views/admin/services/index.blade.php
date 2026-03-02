@extends('layouts.admin', ['title' => 'Admin Services', 'active' => 'services'])

@section('content')
  <div class="admin-top"><h1>Services</h1><x-button>+ Tambah Service</x-button></div>
  <article class="card panel"><div class="table-wrap"><table><thead><tr><th>Nama</th><th>Harga</th><th>Durasi</th></tr></thead><tbody><tr><td>Landing Page</td><td>Rp2.5jt</td><td>5-10 hari</td></tr></tbody></table></div></article>
@endsection
