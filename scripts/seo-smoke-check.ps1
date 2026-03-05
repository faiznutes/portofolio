param(
  [string]$BaseUrl = "https://faiznute.site"
)

$ErrorActionPreference = "Stop"

$pages = @(
  "/",
  "/works",
  "/services",
  "/cv",
  "/contact",
  "/site-map",
  "/insights",
  "/portofolio-web-dev-umkm",
  "/jasa-video-editor-umkm",
  "/jasa-editor-konten-sosmed",
  "/jasa-graphic-designer-umkm",
  "/landing-page-umkm-conversion",
  "/jasa-video-editor-surabaya",
  "/jasa-web-dev-surabaya"
)

function Get-TagContent {
  param(
    [string]$Html,
    [string]$Pattern
  )

  $m = [regex]::Match($Html, $Pattern, [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
  if ($m.Success -and $m.Groups.Count -gt 1) {
    return $m.Groups[1].Value.Trim()
  }
  return ""
}

Write-Output "SEO smoke check: $BaseUrl"
Write-Output ""

foreach ($path in $pages) {
  $url = "$BaseUrl$path"
  $resp = Invoke-WebRequest -Uri $url -UseBasicParsing
  $html = [string]$resp.Content

  $title = Get-TagContent -Html $html -Pattern '<title>(.*?)</title>'
  $description = Get-TagContent -Html $html -Pattern '<meta\s+name="description"\s+content="([^"]+)"'
  $canonical = Get-TagContent -Html $html -Pattern '<link\s+rel="canonical"\s+href="([^"]+)"'
  $robots = Get-TagContent -Html $html -Pattern '<meta\s+name="robots"\s+content="([^"]+)"'
  $h1 = Get-TagContent -Html $html -Pattern '<h1[^>]*>(.*?)</h1>'

  Write-Output "[$path] status=$($resp.StatusCode)"
  Write-Output "  title      : $title"
  Write-Output "  description: $description"
  Write-Output "  canonical  : $canonical"
  Write-Output "  robots     : $robots"
  Write-Output "  h1         : $h1"
  Write-Output ""
}

$robotsTxt = Invoke-WebRequest -Uri "$BaseUrl/robots.txt" -UseBasicParsing
$sitemap = Invoke-WebRequest -Uri "$BaseUrl/sitemap.xml" -UseBasicParsing

Write-Output "[robots.txt] status=$($robotsTxt.StatusCode)"
Write-Output "[sitemap.xml] status=$($sitemap.StatusCode)"
