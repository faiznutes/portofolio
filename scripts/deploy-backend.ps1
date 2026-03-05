param(
  [string]$ProjectRoot = (Resolve-Path "$PSScriptRoot/../backend").Path,
  [switch]$SkipTests,
  [switch]$SeedBaseline,
  [switch]$Bootstrap
)

$ErrorActionPreference = "Stop"

function Get-EnvValue {
  param(
    [string]$Path,
    [string]$Key
  )

  if (-not (Test-Path $Path)) {
    return ""
  }

  $pattern = "^\s*" + [regex]::Escape($Key) + "\s*=\s*(.*)$"
  foreach ($line in Get-Content $Path) {
    if ($line -match $pattern) {
      return $Matches[1].Trim().Trim('"').Trim("'")
    }
  }

  return ""
}

Write-Host "Deploy backend from: $ProjectRoot" -ForegroundColor Cyan
Set-Location $ProjectRoot

if (-not (Test-Path ".env")) {
  if ($Bootstrap) {
    Write-Host "Bootstrap mode: .env not found, copying from .env.example..."
    Copy-Item ".env.example" ".env"
  } else {
    throw "Missing .env in backend project. Run once with -Bootstrap to initialize environment."
  }
}

Write-Host "[1/7] Install composer dependencies..."
composer install --no-dev --optimize-autoloader

Write-Host "[2/7] Ensure app key..."
$appKey = Get-EnvValue -Path ".env" -Key "APP_KEY"
if ([string]::IsNullOrWhiteSpace($appKey)) {
  if ($Bootstrap) {
    Write-Host "APP_KEY empty, generating key in bootstrap mode..."
    php artisan key:generate --force
  } else {
    throw "APP_KEY is empty. Refusing to generate key during standard deploy. Run once with -Bootstrap."
  }
} else {
  Write-Host "APP_KEY already set. Keep existing key."
}

Write-Host "[3/7] Run migrations..."
php artisan migrate --force

if ($SeedBaseline) {
  Write-Host "[4/7] Seed baseline data..."
  php artisan db:seed --force
} else {
  Write-Host "[4/7] Skip seeding (default). Use -SeedBaseline to run baseline seeder."
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
