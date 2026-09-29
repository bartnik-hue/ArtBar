$headers = @{'User-Agent' = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
$assets = @(
    'https://artbar.com.pl/wp-content/uploads/2025/02/ArtBar-Solutions_svg_6.svg',
    'https://artbar.com.pl/wp-content/uploads/2025/02/cropped-ArtBar-Solutions_jpg_10-32x32.jpg',
    'https://artbar.com.pl/wp-content/uploads/2025/02/cropped-ArtBar-Solutions_jpg_10-192x192.jpg',
    'https://artbar.com.pl/wp-content/uploads/2025/03/ArtBar-Solutions_jpg_7.jpg',
    'https://artbar.com.pl/wp-content/uploads/2025/03/wisloujscie.png',
    'https://artbar.com.pl/wp-content/uploads/2025/03/so-Hard.png',
    'https://artbar.com.pl/wp-content/uploads/2025/03/festivaland.png',
    'https://artbar.com.pl/wp-content/uploads/2025/03/summercontrast.png',
    'https://artbar.com.pl/wp-content/uploads/2025/03/malta.png',
    'https://artbar.com.pl/wp-content/uploads/2025/03/2024.12.31-Art-Bar-26-768x512.jpg',
    'https://artbar.com.pl/wp-content/uploads/2025/03/2024.12.31-Art-Bar-73-2.jpg',
    'https://artbar.com.pl/wp-content/uploads/2025/03/2024.12.31-Art-Bar-89.jpg',
    'https://artbar.com.pl/wp-content/uploads/2025/03/2024.12.31-Art-Bar-28-1.jpg',
    'https://artbar.com.pl/wp-content/uploads/2025/03/2024.12.31-Art-Bar-46-1.jpg',
    'https://artbar.com.pl/wp-content/uploads/2025/03/2023.03.31-Pandora-Two-Worlds-45.jpg'
)
New-Item -ItemType Directory -Force -Path 'D:\PRACA\ARTBAR\ARTBAR NEW WEB\assets\images' | Out-Null
New-Item -ItemType Directory -Force -Path 'D:\PRACA\ARTBAR\ARTBAR NEW WEB\assets\logos' | Out-Null

foreach ($url in $assets) {
    $filename = [System.IO.Path]::GetFileName($url)
    if ($filename -like 'ArtBar*' -or $filename -like 'cropped*') {
        $dest = "D:\PRACA\ARTBAR\ARTBAR NEW WEB\assets\logos\$filename"
    } else {
        $dest = "D:\PRACA\ARTBAR\ARTBAR NEW WEB\assets\images\$filename"
    }
    try {
        Invoke-WebRequest -Uri $url -OutFile $dest -Headers $headers -TimeoutSec 30
        Write-Host "Downloaded: $filename"
    } catch {
        Write-Host "Failed: $filename - $_"
    }
}
Write-Host 'Done!'
