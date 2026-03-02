@extends('layouts.admin', ['title' => 'Admin CV', 'active' => 'cv'])

@section('content')
  <div class="admin-top"><h1>CV Sections</h1><x-button>+ Tambah Item</x-button></div>
  <article class="card panel"><p>Experience, Education, Skills, Tools, Certificates</p></article>
@endsection
