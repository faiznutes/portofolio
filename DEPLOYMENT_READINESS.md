# Deployment Readiness (One-Pass)

## 1) Environment
- Set `APP_ENV=production`, `APP_DEBUG=false`.
- Set `APP_URL=https://faiznute.site`.
- Set `CORS_ALLOWED_ORIGINS=https://faiznute.site,https://www.faiznute.site`.
- Use real DB credentials and secure mail credentials.

## 2) Backend deploy
- Automated (recommended):
  - `powershell -ExecutionPolicy Bypass -File scripts/deploy-backend.ps1`
  - First bootstrap only (initial environment setup):
    - `powershell -ExecutionPolicy Bypass -File scripts/deploy-backend.ps1 -Bootstrap`
  - Baseline seed opt-in (not default):
    - `powershell -ExecutionPolicy Bypass -File scripts/deploy-backend.ps1 -SeedBaseline`
- Manual:
  - `composer install --no-dev --optimize-autoloader`
  - `php artisan key:generate` (first setup only)
  - `php artisan migrate --force`
  - `php artisan db:seed --force` (only when baseline seed is explicitly needed)
  - `php artisan config:cache && php artisan route:cache`
- Container runtime:
  - Backend Docker runtime sekarang menggunakan Apache (`php:8.4-apache`) + `mod_rewrite`, bukan `php artisan serve`.
  - Entrypoint container menjalankan migrate otomatis saat start (`RUN_MIGRATIONS=true`).

Nginx + worker templates:
- `deploy/nginx/faiznute.site.conf`
- `deploy/nginx/api.faiznute.site.conf` (opsional legacy subdomain)
- `deploy/systemd/laravel-queue.service`
- `deploy/systemd/laravel-scheduler.service`
- `deploy/systemd/laravel-scheduler.timer`

## 3) Frontend deploy
- Host static `frontend/` folder on CDN/static host.
- Same-origin strategy: frontend calls API via `/api/*` on domain yang sama.
- Optional API base override (jika dibutuhkan):
  - `localStorage` override, atau
  - `<meta name="portfolio-api-base" content="https://yourdomain.com">`
- Frontend service worker aktif di `https://...` dan `localhost` untuk cache asset publik (`frontend/sw.js`).

## 4) Security and API checks
- Verify `/api/admin/*` returns `401` without token.
- Verify non-admin token returns `403` on `/api/admin/*`.
- Verify `/api/public/*` responds with expected CORS headers.

## 5) Smoke test
- Run: `powershell -ExecutionPolicy Bypass -File scripts/smoke-e2e.ps1`
- Run production cutover check:
  - `powershell -ExecutionPolicy Bypass -File scripts/cutover-check.ps1 -ApiBase "https://yourdomain.com" -FrontendOrigin "https://yourdomain.com"`
- Run backend tests: `php artisan test`
- Local all-in-one major verify:
  - `powershell -ExecutionPolicy Bypass -File scripts/local-major-check.ps1`

## 6) Domain target
- Frontend: `https://faiznute.site`
- API: `https://faiznute.site/api/*` (same-origin)
- Health endpoints:
  - `GET https://faiznute.site/api/public/health` (utama)
  - `GET https://faiznute.site/api/health` (alias monitoring)
- Cutover command:
  - `powershell -ExecutionPolicy Bypass -File scripts/cutover-check.ps1 -ApiBase "https://faiznute.site" -FrontendOrigin "https://faiznute.site"`

## 7) SSL
- `sudo certbot --nginx -d faiznute.site -d www.faiznute.site`

## 8) Operational checks
- Monitor logs for auth failures and 5xx spikes.
- Set backup/restore cadence for database.
- Keep seed admin credentials rotated after first production login.
- Verifikasi healthcheck container:
  - Frontend: `GET /`
  - Backend API: `GET /api/public/health` (atau alias `GET /api/health`)
- Verifikasi response header security:
  - Frontend: CSP + HSTS + Permissions-Policy aktif.
  - Backend API: CSP restrictive (`default-src 'none'`) + HSTS aktif.

## 9) Ops hardening backlog (next sprint)
- Optimasi aset gambar besar (resize/compress/WebP responsive) dan prebuild CSS untuk mengurangi ketergantungan runtime CDN.
