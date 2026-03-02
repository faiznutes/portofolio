param(
  [string]$ProjectRoot = (Resolve-Path "$PSScriptRoot/../backend").Path,
  [switch]$SkipTests,
  [switch]$NoSeed
)

$ErrorActionPreference = "Stop"

Write-Host "Deploy backend from: $ProjectRoot" -ForegroundColor Cyan
Set-Location $ProjectRoot

Write-Host "[1/7] Install composer dependencies..."
composer install --no-dev --optimize-autoloader

Write-Host "[2/7] Ensure app key..."
php artisan key:generate --force

Write-Host "[3/7] Run migrations..."
php artisan migrate --force

if (-not $NoSeed) {
  Write-Host "[4/7] Seed baseline data..."
  php artisan db:seed --force
} else {
  Write-Host "[4/7] Skip seeding (--NoSeed)."
}

Write-Host "[5/7] Optimize config + routes..."
php artisan config:cache
php artisan route:cache

if (-not $SkipTests) {
  Write-Host "[6/7] Run test suite..."
  php artisan test
} else {
  Write-Host "[6/7] Skip tests (--SkipTests)."
}

Write-Host "[7/7] Deployment routine finished." -ForegroundColor Green
