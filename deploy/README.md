# Deployment Files (faiznute.site)

This folder contains ready-to-use production templates.

## Nginx
- `deploy/nginx/faiznute.site.conf` -> frontend static host
- `deploy/nginx/api.faiznute.site.conf` -> Laravel API host

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
sudo certbot --nginx -d api.faiznute.site
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
