# Deployment Files (faiznute.site)

This folder contains ready-to-use production templates.

## Nginx
- `deploy/nginx/faiznute.site.conf` -> frontend static host + proxy same-origin `/api/*` dan `/sanctum/*`
- `deploy/nginx/api.faiznute.site.conf` -> optional dedicated API subdomain template (legacy option)
- `deploy/docker/apache-backend.conf` -> Apache vhost untuk backend container runtime

Suggested server paths:
- Frontend root: `/var/www/faiznute.site/frontend`
- Backend root: `/var/www/faiznute.site/backend`

Install steps (Ubuntu):
1. Copy nginx files to `/etc/nginx/sites-available/`
2. Symlink to `/etc/nginx/sites-enabled/`
3. `sudo nginx -t && sudo systemctl reload nginx`

## SSL (Let's Encrypt)
```bash
sudo certbot --nginx -d faiznute.site -d www.faiznute.site
```

## Systemd workers
- `deploy/systemd/laravel-queue.service`
- `deploy/systemd/laravel-scheduler.service`
- `deploy/systemd/laravel-scheduler.timer`

Install steps:
1. Copy files to `/etc/systemd/system/`
2. `sudo systemctl daemon-reload`
3. `sudo systemctl enable --now laravel-queue.service`
4. `sudo systemctl enable --now laravel-scheduler.timer`

## Docker backend runtime
- Backend container sekarang memakai Apache (`php:8.4-apache`) dengan `DocumentRoot=/var/www/html/public`.
- Startup container memakai entrypoint `deploy/docker/backend-entrypoint.sh` untuk memastikan:
  - `.env` tersedia,
  - database sqlite file siap,
  - migrasi otomatis (jika `RUN_MIGRATIONS=true`).
- Build context Docker dibatasi lewat `.dockerignore` (exclude `node_modules`, `legacy-portfolio-source`, dan `frontend/assets/images/legacy`) agar image build lebih ringan dan konsisten.

## Security headers
- Frontend nginx template menambahkan CSP, HSTS, Referrer-Policy, dan Permissions-Policy.
- Backend API templates (nginx/apache) menambahkan CSP restrictive + HSTS untuk hardening default.
