# ----------------------------------------------------------------------------
# Knowledge Map AI - one-click local private start
# ----------------------------------------------------------------------------
# Run from anywhere:
#   powershell -NoProfile -ExecutionPolicy Bypass -File scripts\local\start-knowledge-map-private.ps1
#
# What it does (idempotent, safe to re-run):
#   1. cd into the project root.
#   2. Verify C:\Drive-semantic\context-packs\index.json exists.
#   3. Ensure apps\web\.env.local contains NEXT_PUBLIC_ENABLE_CONTEXT_PACKS=true.
#   4. Ensure apps\web\public\context-packs is a junction to
#      C:\Drive-semantic\context-packs. Creates the junction if missing.
#      Does NOT replace an existing real directory or junction.
#   5. cd into apps\web and run "npm run dev".
#
# What it does NOT do:
#   - Never copies anything out of C:\Drive-semantic.
#   - Never touches Public Demo Mode source files or .gitignore.
#   - Never commits or pushes .env.local (which stays gitignored).
# ----------------------------------------------------------------------------

$ErrorActionPreference = 'Stop'

$ProjectRoot    = 'C:\ClaudeMVP\knowledge-map-ai'
$DriveSemantic  = 'C:\Drive-semantic\context-packs'
$IndexJson      = Join-Path $DriveSemantic 'index.json'
$WebDir         = Join-Path $ProjectRoot 'apps\web'
$EnvLocal       = Join-Path $WebDir '.env.local'
$PublicJunction = Join-Path $WebDir 'public\context-packs'
$RequiredEnvLine = 'NEXT_PUBLIC_ENABLE_CONTEXT_PACKS=true'

function Write-Step($msg) { Write-Host ("  -> " + $msg) -ForegroundColor Cyan }
function Write-Ok  ($msg) { Write-Host ("  OK " + $msg) -ForegroundColor Green }
function Write-Warn2($msg){ Write-Host ("  !  " + $msg) -ForegroundColor Yellow }
function Write-Fail($msg) { Write-Host ("  X  " + $msg) -ForegroundColor Red }

Write-Host ""
Write-Host "Knowledge Map AI Local Private Mode starting..." -ForegroundColor White
Write-Host ("Context Pack source: " + $DriveSemantic) -ForegroundColor White
Write-Host "Local mode: enabled" -ForegroundColor White
Write-Host ""

# 1. Project root ------------------------------------------------------------
Write-Step ("cd " + $ProjectRoot)
if (-not (Test-Path $ProjectRoot)) {
    Write-Fail ("Project root not found: " + $ProjectRoot)
    exit 1
}
Set-Location $ProjectRoot
Write-Ok ("in " + $ProjectRoot)

# 2. Drive-semantic index ----------------------------------------------------
Write-Step ("verify " + $IndexJson)
if (-not (Test-Path $IndexJson)) {
    Write-Fail ("Context Pack index not found: " + $IndexJson)
    Write-Host "       Generate one from Semantic OS first, then re-run." -ForegroundColor Yellow
    exit 1
}
Write-Ok "index.json present"

# 3. .env.local --------------------------------------------------------------
Write-Step ("ensure " + $EnvLocal + " contains " + $RequiredEnvLine)
if (-not (Test-Path $EnvLocal)) {
    Set-Content -Path $EnvLocal -Value $RequiredEnvLine -Encoding ASCII
    Write-Ok ("created " + $EnvLocal)
} else {
    $hasLine = $false
    foreach ($line in (Get-Content $EnvLocal)) {
        if ($line -match '^\s*NEXT_PUBLIC_ENABLE_CONTEXT_PACKS\s*=\s*true\s*$') {
            $hasLine = $true
            break
        }
    }
    if ($hasLine) {
        Write-Ok "flag already set"
    } else {
        Add-Content -Path $EnvLocal -Value $RequiredEnvLine
        Write-Ok ("appended " + $RequiredEnvLine)
    }
}

# 4. Junction ----------------------------------------------------------------
Write-Step ("verify junction " + $PublicJunction)
if (Test-Path $PublicJunction) {
    $item = Get-Item $PublicJunction -Force
    $isReparse = ($item.Attributes -band [IO.FileAttributes]::ReparsePoint) -ne 0
    if ($isReparse) {
        Write-Ok "junction already exists"
    } else {
        Write-Warn2 ($PublicJunction + " exists as a real directory - not replacing it.")
        Write-Warn2 "If you need to point it at C:\Drive-semantic, back it up and"
        Write-Warn2 "remove it manually, then re-run this script. See docs/setup/..."
    }
} else {
    Write-Step ("mklink /J " + $PublicJunction + " " + $DriveSemantic)
    $mklinkArgs = '/c mklink /J "' + $PublicJunction + '" "' + $DriveSemantic + '"'
    Start-Process -FilePath 'cmd.exe' -ArgumentList $mklinkArgs -Wait -NoNewWindow | Out-Null
    if (Test-Path $PublicJunction) {
        Write-Ok "junction created"
    } else {
        Write-Fail "mklink failed - junction was not created"
        exit 1
    }
}

# 5. Start dev server --------------------------------------------------------
Write-Step ("cd " + $WebDir)
Set-Location $WebDir
Write-Ok ("in " + $WebDir)

Write-Host ""
Write-Host "Starting Next.js dev server (npm run dev)..." -ForegroundColor White
Write-Host "Open http://localhost:3000 once it is ready." -ForegroundColor White
Write-Host ""

npm run dev
