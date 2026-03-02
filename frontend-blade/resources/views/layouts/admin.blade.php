<!doctype html>
<html lang="id">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{{ $title ?? 'Admin CMS - Faiznute' }}</title>
    <link rel="stylesheet" href="/frontend/assets/styles.css" />
  </head>
  <body>
    <div class="admin-shell">
      <x-admin-sidebar :active="$active ?? 'dashboard'" />
      <main class="admin-main">
        @yield('content')
      </main>
    </div>
  </body>
</html>
