$sourceFile = 'C:\Users\fikan\.gemini\antigravity\brain\833654e3-8b1d-40b9-a0a0-42c903af2922\.system_generated\steps\155\content.md'
$text = Get-Content -Raw -Path $sourceFile
$pattern = 'https?://artbar\.com\.pl/wp-content/uploads/[^\s"''<>]+\.(?:jpg|jpeg|png|webp)'
$matches = [regex]::Matches($text, $pattern) | ForEach-Object { $_.Value } | Sort-Object -Unique

Write-Host "Found $($matches.Count) unique image URLs:"
$matches | ForEach-Object { Write-Host $_ }
