<!doctype html>
<html lang="id">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{{ $title ?? 'Faiznute - Web Creator' }}</title>
    <link rel="stylesheet" href="/frontend/assets/styles.css" />
  </head>
  <body>
    <x-navbar :active="$active ?? 'home'" />

    <main class="container">
      @yield('content')
    </main>

    <x-footer />

    <div class="sticky-wa"><a class="btn btn-primary" href="/contact">WhatsApp Sekarang</a></div>
    <script src="/frontend/assets/app.js"></script>
  </body>
</html>
