# Deployment Readiness (One-Pass)

## 1) Environment
- Set `APP_ENV=production`, `APP_DEBUG=false`.
- Set `APP_URL=https://api.faiznute.site`.
- Set `CORS_ALLOWED_ORIGINS=https://faiznute.site,https://www.faiznute.site`.
- Use real DB credentials and secure mail credentials.

## 2) Backend deploy
- Automated (recommended):
  - `powershell -ExecutionPolicy Bypass -File scripts/deploy-backend.ps1`
- Manual:
  - `composer install --no-dev --optimize-autoloader`
  - `php artisan key:generate` (first setup only)
  - `php artisan migrate --force`
  - `php artisan db:seed --force`
  - `php artisan config:cache && php artisan route:cache`

Nginx + worker templates:
- `deploy/nginx/faiznute.site.conf`
- `deploy/nginx/api.faiznute.site.conf`
- `deploy/systemd/laravel-queue.service`
- `deploy/systemd/laravel-scheduler.service`
- `deploy/systemd/laravel-scheduler.timer`

## 3) Frontend deploy
- Host static `frontend/` folder on CDN/static host.
- Configure API base via:
  - `localStorage` override, or
  - `<meta name="portfolio-api-base" content="https://api.domain.com">`

## 4) Security and API checks
- Verify `/api/admin/*` returns `401` without token.
- Verify non-admin token returns `403` on `/api/admin/*`.
- Verify `/api/public/*` responds with expected CORS headers.

## 5) Smoke test
- Run: `powershell -ExecutionPolicy Bypass -File scripts/smoke-e2e.ps1`
- Run production cutover check:
  - `powershell -ExecutionPolicy Bypass -File scripts/cutover-check.ps1 -ApiBase "https://api.yourdomain.com" -FrontendOrigin "https://yourdomain.com"`
- Run backend tests: `php artisan test`
- Local all-in-one major verify:
  - `powershell -ExecutionPolicy Bypass -File scripts/local-major-check.ps1`

## 7) Domain target
- Frontend: `https://faiznute.site`
- API: `https://api.faiznute.site`
- Cutover command:
  - `powershell -ExecutionPolicy Bypass -File scripts/cutover-check.ps1 -ApiBase "https://api.faiznute.site" -FrontendOrigin "https://faiznute.site"`

## 8) SSL
- `sudo certbot --nginx -d faiznute.site -d www.faiznute.site`
- `sudo certbot --nginx -d api.faiznute.site`

## 6) Operational checks
- Monitor logs for auth failures and 5xx spikes.
- Set backup/restore cadence for database.
- Keep seed admin credentials rotated after first production login.
