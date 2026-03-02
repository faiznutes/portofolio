@props(['badge' => null, 'title' => '', 'actionText' => null, 'actionHref' => null])

<div class="section-head">
  <div class="stack-sm">
    @if ($badge)
      <span class="badge">{{ $badge }}</span>
    @endif
    <h2>{{ $title }}</h2>
  </div>
  @if ($actionText && $actionHref)
    <a class="btn btn-secondary" href="{{ $actionHref }}">{{ $actionText }}</a>
  @endif
</div>
