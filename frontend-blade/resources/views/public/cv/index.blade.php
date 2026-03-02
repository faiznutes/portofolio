@extends('layouts.public', ['title' => 'CV - Faiznute', 'active' => 'cv'])

@section('content')
  <section class="section stack-lg">
    <div class="stack-sm"><x-badge text="About" /><h1>Muhamad Faiz A</h1><p>Web Creator dengan kemampuan design dan video editing.</p></div>
    <div class="grid-3">
      <article class="card panel"><h3>Experience</h3><p>Freelance Web Creator (2022-sekarang)</p></article>
      <article class="card panel"><h3>Education</h3><p>Siap diisi data final pendidikan.</p></article>
      <article class="card panel"><h3>Contact</h3><p>Surabaya | 085155043133 | faiznute07@gmail.com</p></article>
    </div>
    <article class="card panel"><h3>Skills & Tools</h3><div class="pill-row"><span class="pill">Laravel</span><span class="pill">Tailwind</span><span class="pill">Figma</span><span class="pill">Premiere</span></div></article>
  </section>
@endsection
