# Optimiza los videos scroll-scrubbed para carga rápida + scrub fluido.
#
# Requiere ffmpeg en el PATH:  winget install Gyan.FFmpeg
# Uso:                         pwsh ./scripts/optimize-videos.ps1
#
# Qué hace, y POR QUÉ importa para video controlado por scroll:
#   -g 12 -keyint_min 6 -sc_threshold 0 -> keyframe cada ~0.5s. El navegador
#        decodifica desde el keyframe más cercano al hacer seek; keyframes densos
#        = saltos baratos = scrub fluido y SIN salto negro (sobre todo en móvil).
#        Para scrub "mantequilla" usa -g 1 (todo keyframes) a costa de +tamaño.
#   scale por ALTURA -> los fondos son landscape pero se muestran fullscreen en
#        vertical con object-cover, así que la ALTURA manda (escala por alto y
#        recorta los lados). Capar el lado largo dejaba ~405px de alto = borroso
#        al estirar 6x en pantalla de teléfono. Móvil 720px de alto; desktop 1080.
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

# Cap por ALTURA, preservando aspecto y ancho par (requisito h264). No agranda
# si el origen ya es más bajo que el cap.
function Get-ScaleFilter([int]$maxH) {
    "scale=-2:'min($maxH,ih)'"
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
        $maxH     = if ($isMobile) { 720 } else { 1080 }
        $crf      = if ($isMobile) { 21 }  else { 23 }
        $out      = Join-Path $outDir ($name + ".mp4")
        $poster   = Join-Path $posterDir ($name + ".webp")

        Write-Host "→ $name  (alto ${maxH}px, crf $crf)"

        & ffmpeg -y -i $in `
            -an `
            -vf (Get-ScaleFilter $maxH) `
            -c:v libx264 -profile:v high -pix_fmt yuv420p `
            -crf $crf -preset slow `
            -g 12 -keyint_min 6 -sc_threshold 0 `
            -movflags +faststart `
            $out

        # Poster (primer frame) para matar la pantalla negra mientras carga.
        & ffmpeg -y -i $in -frames:v 1 -vf (Get-ScaleFilter $maxH) -q:v 80 $poster
    }
}

Write-Host ""
Write-Host "Listo. Revisa peso/calidad en cada subcarpeta 'optimized/' y, si OK, reemplaza los originales."
Write-Host "Posters en cada 'posters/' (Juliaca: prop poster en <VideoSection>; Capachica: fondo del 1er clip)."
