@extends('layouts.admin', ['title' => 'Admin Highlights', 'active' => 'highlights'])

@section('content')
  <div class="admin-top"><h1>Highlights</h1><x-button>+ Tambah Highlight</x-button></div>
  <article class="card panel"><div class="table-wrap"><table><thead><tr><th>Title</th><th>Work</th><th>Status</th></tr></thead><tbody><tr><td>Open for Project</td><td>Website Catering</td><td><span class="status active">ACTIVE</span></td></tr></tbody></table></div></article>
@endsection
