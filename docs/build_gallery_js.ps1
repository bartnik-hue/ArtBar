$photos = Get-Content -Raw -Path 'D:\PRACA\ARTBAR\ARTBAR NEW WEB\docs\realizacje_photos.json' | ConvertFrom-Json

$galleryItems = @()
$counter = 1

foreach ($url in $photos) {
    $category = "Wszystkie"
    $title = "Realizacja ArtBar"

    if ($url -match "2024\.12\.31") {
        $category = "Sylwester"
        $title = "Sylwester - Produkcja Stref Barowych"
    } elseif ($url -match "OczkiHalloween") {
        $category = "Halloween"
        $title = "Halloween Oczki - Scenografia i Bary"
    } elseif ($url -match "ArtBar02\.03") {
        $category = "Klubowe"
        $title = "Art Bar Event - Strefa Barowa i Obsluga"
    } elseif ($url -match "Pandora") {
        $category = "Scenografia"
        $title = "Pandora Two Worlds - Instalacja Barowa"
    }

    $galleryItems += [PSCustomObject]@{
        id = $counter
        url = $url
        title = "$title #$counter"
        category = $category
    }
    $counter++
}

$jsContent = "const REALIZACJE_GALLERY = " + ($galleryItems | ConvertTo-Json -Depth 3) + ";"
$jsContent | Set-Content -Path 'D:\PRACA\ARTBAR\ARTBAR NEW WEB\assets\gallery-data.js' -Encoding UTF8

Write-Host "Gotowe! Wygenerowano $($galleryItems.Count) zdjec w assets/gallery-data.js"
