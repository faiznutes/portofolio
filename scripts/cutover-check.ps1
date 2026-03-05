param(
  [string]$ApiBase = "https://faiznute.site",
  [string]$FrontendOrigin = "https://faiznute.site",
  [string]$AdminEmail = "",
  [string]$AdminPassword = "",
  [string]$BackendEnvPath = "$PSScriptRoot/../backend/.env"
)

$ErrorActionPreference = "Stop"

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

function Assert-True($Condition, $Message) {
  if (-not $Condition) {
    throw $Message
  }
}

function Normalize-Origin {
  param([string]$Url)
  try {
    $uri = [Uri]$Url
    return $uri.GetLeftPart([System.UriPartial]::Authority).TrimEnd("/")
  }
  catch {
    return $Url.TrimEnd("/")
  }
}

$apiOrigin = Normalize-Origin -Url $ApiBase
$frontendOriginNormalized = Normalize-Origin -Url $FrontendOrigin
$isSameOrigin = $apiOrigin -eq $frontendOriginNormalized

Write-Host "[1/6] Check public health..."
$health = Invoke-WebRequest -Method Get -Uri "$ApiBase/api/public/health" -Headers @{ Origin = $FrontendOrigin }
Assert-True ($health.StatusCode -eq 200) "Health endpoint failed"
if (-not $isSameOrigin) {
  Assert-True ($health.Headers['Access-Control-Allow-Origin'] -eq $FrontendOrigin) "CORS origin mismatch for health endpoint"
}

Write-Host "[2/6] Check auth login..."
$loginBody = @{ email = $AdminEmail; password = $AdminPassword } | ConvertTo-Json
$login = Invoke-RestMethod -Method Post -Uri "$ApiBase/api/auth/login" -ContentType "application/json" -Body $loginBody
$token = $login.data.token
Assert-True ($null -ne $token -and $token.Length -gt 10) "Auth token not returned"

$headers = @{ Authorization = "Bearer $token"; Origin = $FrontendOrigin }

Write-Host "[3/6] Check admin protected route..."
$adminCategories = Invoke-WebRequest -Method Get -Uri "$ApiBase/api/admin/categories" -Headers $headers
Assert-True ($adminCategories.StatusCode -eq 200) "Admin categories endpoint failed"

Write-Host "[4/6] Check public works route..."
$publicWorks = Invoke-WebRequest -Method Get -Uri "$ApiBase/api/public/works" -Headers @{ Origin = $FrontendOrigin }
Assert-True ($publicWorks.StatusCode -eq 200) "Public works endpoint failed"

Write-Host "[5/6] Check logout..."
$logout = Invoke-WebRequest -Method Post -Uri "$ApiBase/api/auth/logout" -Headers $headers
Assert-True ($logout.StatusCode -eq 200) "Logout failed"

Write-Host "[6/6] Cutover check passed." -ForegroundColor Green
