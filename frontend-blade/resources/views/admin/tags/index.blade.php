@extends('layouts.admin', ['title' => 'Admin Tags', 'active' => 'tags'])

@section('content')
  <div class="admin-top"><h1>Tags</h1><x-button>+ Tambah Tag</x-button></div>
  <article class="card panel"><p>Laravel, Tailwind, Figma, Premiere, After Effects, SEO, UI/UX</p></article>
@endsection
