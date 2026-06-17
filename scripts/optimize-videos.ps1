# Optimiza los videos scroll-scrubbed para carga rápida + scrub fluido.
#
# Requiere ffmpeg en el PATH:  winget install Gyan.FFmpeg
# Uso:                         pwsh ./scripts/optimize-videos.ps1
#
# Qué hace, y POR QUÉ importa para video controlado por scroll:
#   -g 8 -keyint_min 8 -sc_threshold 0  -> keyframe cada 8 frames. El navegador
#        decodifica desde el keyframe más cercano al hacer seek; keyframes densos
#        = saltos baratos = scrub fluido (sobre todo en GPU móvil). Para scrub
#        "mantequilla" usa -g 1 (todo keyframes) a costa de +tamaño.
#   scale (cap al lado más largo) -> menos pixeles que decodificar y archivo más
#        liviano. Móvil 720px basta para un fondo object-cover; desktop 1280px.
#   -movflags +faststart -> moov al inicio: empieza a reproducir/seek sin bajar todo.
#   -an -> los <video> van muted; quitar audio ahorra peso.
#   -pix_fmt yuv420p + profile main -> compatibilidad universal (iOS/Android).

$ErrorActionPreference = "Stop"

if (-not (Get-Command ffmpeg -ErrorAction SilentlyContinue)) {
    Write-Error "ffmpeg no encontrado. Instálalo: winget install Gyan.FFmpeg"
}

# Carpetas con videos scroll-scrubbed a optimizar.
$videoDirs = @(
    (Join-Path $PSScriptRoot "..\src\features\02-Juliaca\assets\videos"),
    (Join-Path $PSScriptRoot "..\src\features\05-Capachica\Capachica")
)

# Cap del lado más largo, preservando aspecto y dimensiones pares (requisito h264).
function Get-ScaleFilter([int]$max) {
    "scale='if(gt(iw,ih),min($max,iw),-2)':'if(gt(iw,ih),-2,min($max,ih))'"
}

foreach ($videoDir in $videoDirs) {
    if (-not (Test-Path $videoDir)) { continue }
    $outDir    = Join-Path $videoDir "optimized"
    $posterDir = Join-Path $videoDir "posters"
    New-Item -ItemType Directory -Force -Path $outDir, $posterDir | Out-Null

    Write-Host "=== $videoDir ==="

    Get-ChildItem -Path $videoDir -Filter *.mp4 | ForEach-Object {
        $in   = $_.FullName
        $name = $_.BaseName
        # Móvil: Juliaca usa "_mob_", Capachica usa "_cel_".
        $isMobile = $name -match "_mob_|_cel_"
        $maxSide  = if ($isMobile) { 720 } else { 1280 }
        $crf      = if ($isMobile) { 30 }  else { 28 }
        $out      = Join-Path $outDir ($name + ".mp4")
        $poster   = Join-Path $posterDir ($name + ".webp")

        Write-Host "→ $name  (max ${maxSide}px, crf $crf)"

        & ffmpeg -y -i $in `
            -an `
            -vf (Get-ScaleFilter $maxSide) `
            -c:v libx264 -profile:v main -pix_fmt yuv420p `
            -crf $crf -preset slow `
            -g 8 -keyint_min 8 -sc_threshold 0 `
            -movflags +faststart `
            $out

        # Poster (primer frame) para matar la pantalla negra mientras carga.
        & ffmpeg -y -i $in -frames:v 1 -vf (Get-ScaleFilter $maxSide) -q:v 80 $poster
    }
}

Write-Host ""
Write-Host "Listo. Revisa peso/calidad en cada subcarpeta 'optimized/' y, si OK, reemplaza los originales."
Write-Host "Posters en cada 'posters/' (Juliaca: prop poster en <VideoSection>; Capachica: fondo del 1er clip)."
