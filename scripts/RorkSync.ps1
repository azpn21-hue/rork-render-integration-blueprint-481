# RorkSync.ps1
param(
  [string]$BaseUrl = "https://optima-ai-gateway.onrender.com",
  [string]$Auth = "change-me-strong-secret",
  [string]$OutDir = "Z:\\RorkBackup",
  [int]$KeepDays = 30
)

$ErrorActionPreference = "Stop"

function Ensure-Dir($p) {
  if (-not (Test-Path $p)) { New-Item -ItemType Directory -Path $p | Out-Null }
}

Ensure-Dir $OutDir
$log = Join-Path $OutDir "sync.log"
$stamp = (Get-Date).ToString("yyyy-MM-dd_HH-mm-ss")

$targets = @(
  @{ name = "hive";    url = "$BaseUrl/export/hive?auth=$Auth" },
  @{ name = "trust";   url = "$BaseUrl/export/trust?auth=$Auth" },
  @{ name = "circles"; url = "$BaseUrl/export/circles?auth=$Auth" }
)

"[$stamp] Starting Rork sync from $BaseUrl" | Out-File -FilePath $log -Append -Encoding UTF8

foreach ($t in $targets) {
  try {
    $outFile = Join-Path $OutDir ("$($t.name)-$stamp.json")
    $resp = Invoke-WebRequest -Uri $t.url -Method GET -UseBasicParsing -TimeoutSec 60
    if ($resp.StatusCode -ge 200 -and $resp.StatusCode -lt 300) {
      $resp.Content | Out-File -FilePath $outFile -Encoding UTF8
      "[$stamp] Saved $($t.name) to $outFile" | Out-File -FilePath $log -Append -Encoding UTF8
    } else {
      "[$stamp] ERROR $($t.name) status=$($resp.StatusCode)" | Out-File -FilePath $log -Append -Encoding UTF8
    }
  } catch {
    "[$stamp] ERROR $($t.name) $($_.Exception.Message)" | Out-File -FilePath $log -Append -Encoding UTF8
  }
}

# Prune old files
Get-ChildItem -Path $OutDir -Filter *.json | Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-$KeepDays) } | Remove-Item -Force -ErrorAction SilentlyContinue
"[$stamp] Prune complete (older than $KeepDays days)" | Out-File -FilePath $log -Append -Encoding UTF8
