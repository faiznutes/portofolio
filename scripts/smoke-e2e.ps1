param(
  [string]$ApiBase = "http://127.0.0.1:8000",
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

Write-Host "[1/6] Check health..."
$health = $null
for ($i = 0; $i -lt 15; $i++) {
  try {
    $health = Invoke-RestMethod -Method Get -Uri "$ApiBase/api/public/health"
    break
  }
  catch {
    Start-Sleep -Seconds 1
  }
}
Assert-True ($null -ne $health) "Health endpoint failed"
Assert-True ($health.success -eq $true) "Health endpoint failed"

Write-Host "[2/6] Login admin..."
$loginBody = @{ email = $AdminEmail; password = $AdminPassword } | ConvertTo-Json
$login = Invoke-RestMethod -Method Post -Uri "$ApiBase/api/auth/login" -ContentType "application/json" -Body $loginBody
$token = $login.data.token
Assert-True ($null -ne $token -and $token.Length -gt 10) "Failed to get auth token"

$headers = @{ Authorization = "Bearer $token" }
$slug = "smoke-" + [DateTimeOffset]::UtcNow.ToUnixTimeSeconds()

Write-Host "[3/6] Create category..."
$catBody = @{ name = "Smoke Category"; slug = "smoke-category-$slug"; is_active = $true } | ConvertTo-Json
$category = Invoke-RestMethod -Method Post -Uri "$ApiBase/api/admin/categories" -Headers $headers -ContentType "application/json" -Body $catBody
$categoryId = $category.data.id
Assert-True ($categoryId -gt 0) "Failed to create category"

Write-Host "[4/6] Create published work..."
$workPayload = @{
  category_id = $categoryId
  title = "Smoke Work $slug"
  slug = $slug
  excerpt = "Smoke excerpt"
  content = "Smoke content"
  is_published = $true
  published_at = (Get-Date).ToUniversalTime().ToString("o")
  tools_json = @("HTML5", "Tailwind CSS")
  gallery_json = @(@{ type = "image"; title = "Smoke"; src = "https://example.com/smoke.jpg" })
} | ConvertTo-Json -Depth 6

Invoke-RestMethod -Method Post -Uri "$ApiBase/api/admin/works" -Headers $headers -ContentType "application/json" -Body $workPayload | Out-Null

Write-Host "[5/6] Verify public list + detail..."
$publicList = Invoke-RestMethod -Method Get -Uri "$ApiBase/api/public/works"
$found = $publicList.data | Where-Object { $_.slug -eq $slug }
Assert-True ($null -ne $found) "Public works list does not include created work"

$publicDetail = Invoke-RestMethod -Method Get -Uri "$ApiBase/api/public/works/$slug"
Assert-True ($publicDetail.data.tools_json.Count -ge 1) "Public detail tools_json missing"

Write-Host "[6/6] Logout..."
Invoke-RestMethod -Method Post -Uri "$ApiBase/api/auth/logout" -Headers $headers | Out-Null

Write-Host "Smoke E2E passed." -ForegroundColor Green
