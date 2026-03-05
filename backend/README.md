# Backend API (Laravel)

Production backend untuk portfolio + CMS admin.

## Setup
1. `composer install`
2. `copy .env.example .env`
3. `php artisan key:generate`
4. `php artisan migrate --seed`
5. `php artisan serve --host=127.0.0.1 --port=8000`

## Auth
- Laravel Sanctum token-based auth.
- Admin endpoints require `auth:sanctum` + `admin` middleware.

## Seeded admin
- `admin@portfolio.local` / `Admin!2026Strong` (default local/testing fallback)

## API groups
- `/api/auth/*`
- `/api/public/*`
- `/api/admin/*`

## Hardening
- Rate limiting: `auth-login`, `auth-user`, `public-api`, `lead-submit`, `admin-api`.
- Standard JSON error responses for API routes.
- CORS origins configurable via `CORS_ALLOWED_ORIGINS` in `.env`.

## Verify
- `php artisan route:list --path=api`
- `php artisan test`

## Operational scripts
- Deploy routine (Windows):
  - `powershell -ExecutionPolicy Bypass -File ../scripts/deploy-backend.ps1`
  - First bootstrap only: `powershell -ExecutionPolicy Bypass -File ../scripts/deploy-backend.ps1 -Bootstrap`
  - Baseline seed is opt-in: `powershell -ExecutionPolicy Bypass -File ../scripts/deploy-backend.ps1 -SeedBaseline`
- Production cutover check:
  - `powershell -ExecutionPolicy Bypass -File ../scripts/cutover-check.ps1 -ApiBase "https://faiznute.site" -FrontendOrigin "https://faiznute.site"`
- Local major verification:
  - `powershell -ExecutionPolicy Bypass -File ../scripts/local-major-check.ps1`

## Server templates
- Nginx + systemd templates available in `../deploy/`
- Optional bootstrap helper (Ubuntu): `../deploy/server-bootstrap.sh` (default same-origin `/api/*`, legacy API subdomain hanya jika `ENABLE_LEGACY_API_SUBDOMAIN=true`)
