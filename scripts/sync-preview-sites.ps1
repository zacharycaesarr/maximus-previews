# Sync source previews into Netlify publish folders.
# Run from repo root: .\scripts\sync-preview-sites.ps1

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
$cloud = Join-Path $root "previews\greenville-tobacco-vape"
$ind = Join-Path $cloud "industrial"
$sites = Join-Path $root "sites"

# Keep industrial self-contained
New-Item -ItemType Directory -Force -Path (Join-Path $ind "assets") | Out-Null
robocopy (Join-Path $cloud "assets") (Join-Path $ind "assets") /E /NFL /NDL /NJH /NJS /nc /ns /np | Out-Null
if ($LASTEXITCODE -ge 8) { throw "Failed copying assets into industrial ($LASTEXITCODE)" }

New-Item -ItemType Directory -Force -Path (Join-Path $sites "greenville-preview1"), (Join-Path $sites "greenville-preview2") | Out-Null
robocopy $cloud (Join-Path $sites "greenville-preview1") /E /XD industrial /NFL /NDL /NJH /NJS /nc /ns /np | Out-Null
if ($LASTEXITCODE -ge 8) { throw "Failed syncing preview1 ($LASTEXITCODE)" }
robocopy $ind (Join-Path $sites "greenville-preview2") /E /NFL /NDL /NJH /NJS /nc /ns /np | Out-Null
if ($LASTEXITCODE -ge 8) { throw "Failed syncing preview2 ($LASTEXITCODE)" }

Write-Host "Synced:"
Write-Host "  sites\greenville-preview1  -> deploy as greenville-preview1.netlify.app"
Write-Host "  sites\greenville-preview2  -> deploy as greenville-preview2.netlify.app"
