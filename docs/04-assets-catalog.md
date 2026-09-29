# Art Bar Solutions – Zasoby Graficzne

## Logo

### Plik SVG (główny)
**URL:** `https://artbar.com.pl/wp-content/uploads/2025/02/ArtBar-Solutions_svg_6.svg`  
**Użycie:** Nagłówek strony, stopka  
**Kolor:** Biały (stosowany na ciemnym tle, z CSS filter)

### Logo JPG (dla schemat.org)
**URL:** `https://artbar.com.pl/wp-content/uploads/2025/03/ArtBar-Solutions_jpg_7.jpg`  
**Rozmiar:** 2250×2250 px

### Favikony
| URL | Rozmiar |
|-----|---------|
| `https://artbar.com.pl/wp-content/uploads/2025/02/cropped-ArtBar-Solutions_jpg_10-32x32.jpg` | 32×32 |
| `https://artbar.com.pl/wp-content/uploads/2025/02/cropped-ArtBar-Solutions_jpg_10-192x192.jpg` | 192×192 |
| `https://artbar.com.pl/wp-content/uploads/2025/02/cropped-ArtBar-Solutions_jpg_10-180x180.jpg` | 180×180 (Apple) |
| `https://artbar.com.pl/wp-content/uploads/2025/02/cropped-ArtBar-Solutions_jpg_10-270x270.jpg` | 270×270 (MS Tile) |

---

## Zdjęcia – Strona Główna

### OG Image / Główne zdjęcie
**URL:** `https://artbar.com.pl/wp-content/uploads/2025/03/2024.12.31-Art-Bar-26.jpg`  
**Rozmiar:** 2048×1365 px  
**Opis:** Produkcja stref barowych  
**Thumbnail:** `2024.12.31-Art-Bar-26-768x512.jpg`

### CTA Background (parallax)
**URL:** `https://artbar.com.pl/wp-content/uploads/2025/03/2023.03.31-Pandora-Two-Worlds-45.jpg`  
**Styl:** `background-attachment: fixed` (paralax)  
**Overlay:** `rgba(0,0,0,0.94)`

### Kontakt – hero tło
**URL:** `https://artbar.com.pl/wp-content/uploads/2025/02/2024.12.31-Art-Bar-89.jpg`

---

## Zdjęcia – Sekcja „art" (Kreacja wizualna)

| Plik | Rozmiar | Opis |
|------|---------|------|
| `2024.12.31-Art-Bar-28-1.jpg` | 2048×1365 | Sylwester Art Bar |
| `OczkiHalloween-106-of-592-3-scaled.jpg` | 1707×2560 | Halloween – Oczki |
| `2023.03.31-Pandora-Two-Worlds-34-2.jpg` | 1365×2048 | Pandora Two Worlds |
| `ArtBar02.03-45-z-462-1-scaled.jpg` | 2560×1707 | Art Bar impreza |

---

## Zdjęcia – Sekcja „bar" (Infrastruktura barowa)

| Plik | Rozmiar |
|------|---------|
| `2024.12.31-Art-Bar-73-2.jpg` | 2048×1365 |
| `2024.12.31-Art-Bar-108-2.jpg` | 2048×1365 |
| `2024.12.31-Art-Bar-133-2.jpg` | 1365×2048 |

---

## Zdjęcia – Sekcja „SOLUTIONS"

| Plik | Rozmiar |
|------|---------|
| `2024.12.31-Art-Bar-46-1.jpg` | 2048×1365 |
| `2024.12.31-Art-Bar-89.jpg` | 2048×1365 |
| `2024.12.31-Art-Bar-102-2.jpg` | 2048×1365 |

---

## Loga Partnerów / Klientów

| Firma | Plik | Rozmiar |
|-------|------|---------|
| Wisłoujście | `wisloujscie.png` | 246×54 |
| So Hard | `so-Hard.png` | 832×540 |
| Festivaland | `festivaland.png` | 727×101 |
| Summer Contrast | `summercontrast.png` | 872×102 |
| Malta | `malta.png` | 411×209 |

Wszystkie loga są wyświetlane w marquee (auto-scroll od prawej do lewej, 35s).

---

## Galeria „Zaufali nam" (logo-11)

Logo-11 to sekcja z galerią zdjęć klientów/realizacji w formacie cover 200px height, szerokość 200–300px (responsywna).

---

## Wideo

| Typ | URL |
|-----|-----|
| YouTube background | `https://www.youtube.com/watch?v=4kQQrfRCF_I` |

---

## Ikony

### Ikonsetki używane na stronie:
- **Font Awesome 6** (`fa-envelope`, `fa-phone`)
- **Ionicons** (`ion-ios-call`, `ion-ios-arrow-round-back`, `ion-ios-arrow-round-forward`)

### Ikona strzałki (SVG w menu)
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12" fill="none">
  <path d="M1.50002 4L6.00002 8L10.5 4" stroke-width="1.5" stroke="currentcolor"/>
</svg>
```

### Scroll Down Arrow
```css
/* Trzy kwadratowe elementy rotowane 45deg */
border-bottom: 2px solid white;
border-right: 2px solid white;
transform: rotate(45deg);
animation: animate 2s infinite;
```

---

## Pliki PDF

| Nazwa | URL |
|-------|-----|
| Oferta kompleksowa | `https://artbar.com.pl/wp-content/uploads/2025/12/artbar_solution_oferta_v5_compr.pdf` |
| Oferta ArtPOS | `https://artbar.com.pl/wp-content/uploads/2025/12/artbart_artpos_oferta_v3_compr.pdf` |

---

## Fonty Własne

Strona używa custom fontu Melodrama ładowanego z własnego serwera:
```html
<link id="ma-customfonts" href="//artbar.com.pl/wp-content/uploads/fonts/ma-customfonts.css" rel="stylesheet"/>
```

### Font stacks w CSS Variables (WordPress):
```css
--wp--preset--font-family--melodrama: "Melodrama";
--wp--preset--font-family--melodrama-variable: "Melodrama-Variable";
--wp--preset--font-family--montserrat: "Montserrat";
--wp--preset--font-family--ttknickerbockers-grotesk: "TTKnickerbockers-Grotesk";
```

---

## Styl Graficzny – Charakter Wizualny

### Ogólny klimat
- **Ciemny, elegancki, premium** – dominuje czerń i głęboki grafit
- **Złoty akcent** (#FACB7D) – ekskluzywność, bary, złotnictwo eventów
- **Zdjęcia pełnoformatowe** z ciemnymi gradientami
- **Duże, odważne nagłówki** (Melodrama – serif elegancki)
- **Nowoczesne animacje** (reveal, parallax, mask)

### Mood Board słowny
- Luksusowoość + funkcjonalność
- Premium event services
- Ciemne tło + złote detale
- Duże zdjęcia eventów
- Minimalistyczne, ale wyraziste

---

*Dokument wygenerowany: 2026-09-23*
