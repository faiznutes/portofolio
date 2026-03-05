#!/bin/sh
set -eu

cd /var/www/html

if [ ! -f ".env" ]; then
  cp ".env.example" ".env"
fi

if [ -n "${DB_DATABASE:-}" ]; then
  DB_DIR="$(dirname "${DB_DATABASE}")"
  mkdir -p "${DB_DIR}"
  [ -f "${DB_DATABASE}" ] || touch "${DB_DATABASE}"
fi

chown -R www-data:www-data storage bootstrap/cache database || true
chmod -R 775 storage bootstrap/cache database || true

if [ "${RUN_MIGRATIONS:-true}" = "true" ]; then
  php artisan migrate --force
fi

exec "$@"
