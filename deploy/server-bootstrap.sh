#!/usr/bin/env bash
set -euo pipefail

PROJECT_ROOT="/var/www/faiznute.site"
FRONTEND_ROOT="$PROJECT_ROOT/frontend"
BACKEND_ROOT="$PROJECT_ROOT/backend"

echo "[1/8] Copy nginx site configs"
sudo cp deploy/nginx/faiznute.site.conf /etc/nginx/sites-available/faiznute.site.conf
sudo cp deploy/nginx/api.faiznute.site.conf /etc/nginx/sites-available/api.faiznute.site.conf

echo "[2/8] Enable nginx sites"
sudo ln -sf /etc/nginx/sites-available/faiznute.site.conf /etc/nginx/sites-enabled/faiznute.site.conf
sudo ln -sf /etc/nginx/sites-available/api.faiznute.site.conf /etc/nginx/sites-enabled/api.faiznute.site.conf

echo "[3/8] Validate nginx"
sudo nginx -t

echo "[4/8] Reload nginx"
sudo systemctl reload nginx

echo "[5/8] Install systemd services"
sudo cp deploy/systemd/laravel-queue.service /etc/systemd/system/laravel-queue.service
sudo cp deploy/systemd/laravel-scheduler.service /etc/systemd/system/laravel-scheduler.service
sudo cp deploy/systemd/laravel-scheduler.timer /etc/systemd/system/laravel-scheduler.timer

echo "[6/8] Reload systemd"
sudo systemctl daemon-reload

echo "[7/8] Enable workers"
sudo systemctl enable --now laravel-queue.service
sudo systemctl enable --now laravel-scheduler.timer

echo "[8/8] Done"
echo "Frontend root: $FRONTEND_ROOT"
echo "Backend root: $BACKEND_ROOT"
