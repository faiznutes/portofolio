@props(['variant' => 'primary', 'href' => null, 'type' => 'button'])

@if ($href)
  <a href="{{ $href }}" {{ $attributes->merge(['class' => 'btn '.($variant === 'secondary' ? 'btn-secondary' : 'btn-primary')]) }}>
    {{ $slot }}
  </a>
@else
  <button type="{{ $type }}" {{ $attributes->merge(['class' => 'btn '.($variant === 'secondary' ? 'btn-secondary' : 'btn-primary')]) }}>
    {{ $slot }}
  </button>
@endif
