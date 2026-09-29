$sourceFile = 'C:\Users\fikan\.gemini\antigravity\brain\833654e3-8b1d-40b9-a0a0-42c903af2922\.system_generated\steps\155\content.md'
$text = Get-Content -Raw -Path $sourceFile
$pattern = 'https?://artbar\.com\.pl/wp-content/uploads/[^\s"''<>]+\.(?:jpg|jpeg|png|webp)'
$matches = [regex]::Matches($text, $pattern) | ForEach-Object { $_.Value } | Sort-Object -Unique

# Filtrujemy tylko wersje -scaled.jpg lub te o wysokiej rozdzielczości (odrzucamy miniaturki 32x32, 192x192, 768x512 itp. jeśli istnieje scaled)
$highRes = $matches | Where-Object { 
    $_ -notmatch 'cropped' -and 
    $_ -notmatch 'logo' -and 
    $_ -notmatch 'wisloujscie' -and 
    $_ -notmatch 'summercontrast' -and 
    $_ -notmatch 'festivaland' -and 
    $_ -notmatch 'malta' -and 
    $_ -notmatch 'so-Hard' -and
    ($_ -match '-scaled\.jpg' -or $_ -match '2024\.12\.31' -or $_ -match '2023\.03\.31' -or $_ -match 'ArtBar02\.03' -or $_ -match 'OczkiHalloween')
}

# Grupowanie i wybór najlepszego rozmiaru dla każdego unikalnego zdjęcia bazowego
$uniquePhotos = @{}
foreach ($url in $highRes) {
    # Wydobądź nazwę bazową bez wymiarów (-768x512, -1536x1024, -scaled itp.)
    $baseName = [System.IO.Path]::GetFileNameWithoutExtension($url) -replace '-(scaled|\d+x\d+)$', ''
    
    # Preferuj -scaled.jpg lub -1536x1024 lub -2048x1365
    if (-not $uniquePhotos.ContainsKey($baseName)) {
        $uniquePhotos[$baseName] = $url
    } else {
        if ($url -match '-scaled\.jpg') {
            $uniquePhotos[$baseName] = $url
        } elseif ($uniquePhotos[$baseName] -notmatch '-scaled\.jpg' -and ($url -match '-1536x' -or $url -match '-2048x')) {
            $uniquePhotos[$baseName] = $url
        }
    }
}

Write-Host "Znaleziono $($uniquePhotos.Count) unikalnych zdjęć z realizacji:"
$list = $uniquePhotos.Values | Sort-Object
$list | ForEach-Object { Write-Host $_ }

# Zapisz jako JSON do łatwego wstrzyknięcia do index.html
$json = $list | ConvertTo-Json
$json | Set-Content -Path 'D:\PRACA\ARTBAR\ARTBAR NEW WEB\docs\realizacje_photos.json'
