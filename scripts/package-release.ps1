$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot
$distPath = Join-Path $projectRoot 'dist'
$archivePath = Join-Path $projectRoot 'DemandLab-cloudflare.zip'
if (-not (Test-Path -LiteralPath (Join-Path $distPath 'index.html'))) { throw 'Run npm run build first.' }
Compress-Archive -Path (Join-Path $distPath '*') -DestinationPath $archivePath -Force
Write-Output $archivePath
