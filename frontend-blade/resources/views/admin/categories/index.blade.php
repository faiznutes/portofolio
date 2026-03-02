@extends('layouts.admin', ['title' => 'Admin Categories', 'active' => 'categories'])

@section('content')
  <div class="admin-top"><h1>Categories</h1><x-button>+ Tambah Category</x-button></div>
  <article class="card panel"><div class="table-wrap"><table><thead><tr><th>Nama</th><th>Slug</th></tr></thead><tbody><tr><td>Web</td><td>web</td></tr><tr><td>Design</td><td>design</td></tr><tr><td>Video</td><td>video</td></tr></tbody></table></div></article>
@endsection
