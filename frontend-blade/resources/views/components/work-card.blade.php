@props(['title', 'summary', 'href' => '/works/sample', 'tags' => []])

<article class="card work-card">
  <div class="thumb"></div>
  <h3>{{ $title }}</h3>
  <p>{{ $summary }}</p>
  @if (count($tags))
    <div class="pill-row">
      @foreach ($tags as $tag)
        <span class="pill">{{ $tag }}</span>
      @endforeach
    </div>
  @endif
  <a class="btn btn-secondary" href="{{ $href }}">Lihat Detail</a>
</article>
