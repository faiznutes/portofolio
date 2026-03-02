param(
  [int]$Port = 8010
)

$ErrorActionPreference = "Stop"
$root = Resolve-Path "$PSScriptRoot/.."
$backend = Resolve-Path "$root/backend"
$ApiBase = "http://127.0.0.1:$Port"

Write-Host "[1/6] Prepare database (migrate + seed)..." -ForegroundColor Cyan
Push-Location $backend
php artisan migrate
php artisan db:seed
Pop-Location

Write-Host "[2/6] Start temporary backend server..." -ForegroundColor Cyan
$server = Start-Process php -ArgumentList "artisan serve --host=127.0.0.1 --port=$Port" -WorkingDirectory $backend -PassThru -WindowStyle Hidden

try {
  Start-Sleep -Seconds 3

  Write-Host "[3/6] Run smoke E2E..." -ForegroundColor Cyan
  & "$root/scripts/smoke-e2e.ps1" -ApiBase $ApiBase

  Write-Host "[4/6] Run backend test suite..." -ForegroundColor Cyan
  Push-Location $backend
  php artisan test
  Pop-Location

  Write-Host "[5/6] Quick route checks..." -ForegroundColor Cyan
  Push-Location $backend
  php artisan route:list --path=api/public/health
  php artisan route:list --path=api/admin/works
  Pop-Location

  Write-Host "[6/6] Local major verification completed." -ForegroundColor Green
}
finally {
  if ($null -ne $server -and -not $server.HasExited) {
    Stop-Process -Id $server.Id -Force
  }
}
