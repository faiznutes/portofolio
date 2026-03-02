@extends('layouts.admin', ['title' => 'Admin Leads', 'active' => 'leads'])

@section('content')
  <div class="admin-top"><h1>Leads</h1><div class="toolbar"><x-button variant="secondary">Status</x-button><x-button variant="secondary">Export</x-button></div></div>
  <article class="card panel"><div class="table-wrap"><table><thead><tr><th>Nama</th><th>Phone</th><th>Minat</th><th>Status</th></tr></thead><tbody><tr><td>Dina</td><td>08xxxx</td><td>Landing Page</td><td><span class="status new">NEW</span></td></tr></tbody></table></div></article>
@endsection
