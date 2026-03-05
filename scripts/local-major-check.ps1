param(
  [int]$Port = 8010,
  [string]$AdminEmail = "",
  [string]$AdminPassword = ""
)

$ErrorActionPreference = "Stop"
$root = Resolve-Path "$PSScriptRoot/.."
$backend = Resolve-Path "$root/backend"
$ApiBase = "http://127.0.0.1:$Port"
$BackendEnvPath = "$backend/.env"

function Get-EnvFileValue {
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

if ([string]::IsNullOrWhiteSpace($AdminEmail)) {
  $AdminEmail = $env:SEED_ADMIN_EMAIL
}
if ([string]::IsNullOrWhiteSpace($AdminEmail)) {
  $AdminEmail = Get-EnvFileValue -Path $BackendEnvPath -Key "SEED_ADMIN_EMAIL"
}
if ([string]::IsNullOrWhiteSpace($AdminEmail)) {
  $AdminEmail = "admin@portfolio.local"
}

if ([string]::IsNullOrWhiteSpace($AdminPassword)) {
  $AdminPassword = $env:SEED_ADMIN_PASSWORD
}
if ([string]::IsNullOrWhiteSpace($AdminPassword)) {
  $AdminPassword = Get-EnvFileValue -Path $BackendEnvPath -Key "SEED_ADMIN_PASSWORD"
}
if ([string]::IsNullOrWhiteSpace($AdminPassword)) {
  $AdminPassword = "Admin!2026Strong"
}

Write-Host "[1/7] Prepare database (migrate + seed)..." -ForegroundColor Cyan
Push-Location $backend
php artisan migrate
php artisan db:seed
Pop-Location

Write-Host "[2/7] Start temporary backend server..." -ForegroundColor Cyan
$server = Start-Process php -ArgumentList "artisan serve --host=127.0.0.1 --port=$Port" -WorkingDirectory $backend -PassThru -WindowStyle Hidden

try {
  Start-Sleep -Seconds 3

  Write-Host "[3/7] Run smoke E2E..." -ForegroundColor Cyan
  & "$root/scripts/smoke-e2e.ps1" -ApiBase $ApiBase -AdminEmail $AdminEmail -AdminPassword $AdminPassword -BackendEnvPath $BackendEnvPath

  Write-Host "[4/7] Run cutover check (same-origin)..." -ForegroundColor Cyan
  & "$root/scripts/cutover-check.ps1" -ApiBase $ApiBase -FrontendOrigin $ApiBase -AdminEmail $AdminEmail -AdminPassword $AdminPassword -BackendEnvPath $BackendEnvPath

  Write-Host "[5/7] Run backend test suite..." -ForegroundColor Cyan
  Push-Location $backend
  php artisan test
  Pop-Location

  Write-Host "[6/7] Quick route checks..." -ForegroundColor Cyan
  Push-Location $backend
  php artisan route:list --path=api/public/health
  php artisan route:list --path=api/admin/works
  Pop-Location

  Write-Host "[7/7] Local major verification completed." -ForegroundColor Green
}
finally {
  if ($null -ne $server -and -not $server.HasExited) {
    Stop-Process -Id $server.Id -Force
  }
}
