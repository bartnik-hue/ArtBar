# Art Bar Solutions – Design System

## Paleta Kolorów (CSS Custom Properties)

### Kolory główne

| Nazwa zmiennej | Wartość | Opis |
|----------------|---------|------|
| `--primary` | `#FACB7D` | Kolor akcentu – złocisty/bursztynowy |
| `--secondary` | `#1A1A1A` | Ciemny – prawie czarny |
| `--tertiary` | `#1B1B1B` | Bardzo ciemny szary |

### Kolor Primary (Gold/Amber) – Odcienie

| Zmienna | Wartość | Przejrzystość |
|---------|---------|---------------|
| `--primary-5` | `#facb7d0d` | 5% |
| `--primary-10` | `#facb7d1a` | 10% |
| `--primary-20` | `#facb7d33` | 20% |
| `--primary-30` | `#facb7d4d` | 30% |
| `--primary-40` | `#facb7d66` | 40% |
| `--primary-50` | `#facb7d80` | 50% |
| `--primary-60` | `#facb7d99` | 60% |
| `--primary-70` | `#facb7db3` | 70% |
| `--primary-80` | `#facb7dcc` | 80% |
| `--primary-90` | `#facb7de6` | 90% |
| `--primary-d-1` | `#c39f65` | Ciemniejszy 1 |
| `--primary-d-2` | `#8c734a` | Ciemniejszy 2 |
| `--primary-d-3` | `#5c4c33` | Ciemniejszy 3 |
| `--primary-d-4` | `#30281d` | Ciemniejszy 4 |
| `--primary-l-1` | `#fdd596` | Jaśniejszy 1 |
| `--primary-l-2` | `#ffe0b3` | Jaśniejszy 2 |
| `--primary-l-3` | `#ffebcc` | Jaśniejszy 3 |
| `--primary-l-4` | `#fff5e6` | Jaśniejszy 4 (prawie biały) |

### Kolor Secondary (Dark) – Odcienie

| Zmienna | Wartość |
|---------|---------|
| `--secondary-d-1` | `#171717` |
| `--secondary-d-2` | `#121212` |
| `--secondary-d-3` | `#0d0d0d` |
| `--secondary-d-4` | `#080808` |
| `--secondary-l-1` | `#404040` |
| `--secondary-l-2` | `#6b6b6b` |
| `--secondary-l-3` | `#999999` |
| `--secondary-l-4` | `#cccccc` |

### Kolory tła i tekstu

| Zmienna | Wartość | Opis |
|---------|---------|------|
| `--bg-body` | `hsla(0,0%,100%,1)` | Białe tło strony |
| `--bg-surface` | `#1B1B1B` | Ciemna powierzchnia (offcanvas menu) |
| `--text-body` | `#1A1A1A` | Główny kolor tekstu |
| `--text-title` | `#191001` | Kolor tytułów (ciemna brązowa czerń) |
| `--text-light` | `hsla(37,93%,96%,1)` | Jasny tekst na ciemnym tle |
| `--dark` | `#282828` | Ciemny kolor pomocniczy |

---

## Typografia

### Kroje pisma

| Font | Zastosowanie |
|------|-------------|
| **Melodrama** | Nagłówki H1–H6 (font-weight: 400 domyślnie, 600 w hero) |
| **Melodrama-Variable** | Alternatywna wersja zmienna |
| **Montserrat** | Tekst główny body |
| **TTKnickerbockers-Grotesk** | Dodatkowy krój |

### Skala tekstów (responsywna – fluid typography)

| Zmienna | Rozmiar (clamp) |
|---------|----------------|
| `--text-xs` | `clamp(0.97rem, 0.02vw + 0.97rem, 1.01rem)` |
| `--text-s` | `clamp(1.17rem, 0.10vw + 1.13rem, 1.35rem)` |
| `--text-m` | `clamp(1.40rem, 0.22vw + 1.33rem, 1.80rem)` |
| `--text-l` | `clamp(1.68rem, 0.40vw + 1.55rem, 2.40rem)` |
| `--text-xl` | `clamp(2.02rem, 0.66vw + 1.80rem, 3.20rem)` |
| `--text-2xl` | `clamp(2.42rem, 1.04vw + 2.09rem, 4.26rem)` |
| `--text-3xl` | `clamp(2.90rem, 1.56vw + 2.40rem, 5.68rem)` |
| `--text-4xl` | `clamp(3.48rem, 2.30vw + 2.75rem, 7.58rem)` |

### Zasady typograficzne
- `h1, h2, h3, h4, h5, h6` → font-family: "Melodrama", font-weight: 400
- `body` → font-family: "Montserrat", font-size: `var(--text-m)`
- Nagłówki hero: `font-weight: 600`, `text-transform: uppercase`, `line-height: 1`
- Główne nagłówki sekcji (`.main-heading`): font-size `var(--text-4xl)`, `text-wrap: nowrap`

---

## Przestrzeń (Spacing)

| Zmienna | Wartość (clamp) |
|---------|----------------|
| `--space-4xs` | `clamp(0.52rem, ...)` |
| `--space-3xs` | `clamp(0.66rem, ...)` |
| `--space-2xs` | `clamp(0.82rem, ...)` |
| `--space-xs` | `clamp(1.02rem, ...)` |
| `--space-s` | `clamp(1.28rem, ...)` |
| `--space-m` | `clamp(1.60rem, ...)` |
| `--space-l` | `clamp(2.00rem, ...)` |
| `--space-xl` | `clamp(2.50rem, ...)` |
| `--space-2xl` | `clamp(3.13rem, ...)` |
| `--space-3xl` | `clamp(3.91rem, ...)` |
| `--space-4xl` | `clamp(4.88rem, ...)` |

Sekcje domyślnie: `padding: var(--space-2xl) var(--space-m)`.

---

## Promienie zaokrąglenia (Radius)

| Zmienna | Wartość |
|---------|---------|
| `--radius-xs` | `clamp(0.4rem, ...)` |
| `--radius-s` | `clamp(0.6rem, ...)` |
| `--radius-m` | `clamp(1.0rem, ...)` |
| `--radius-l` | `clamp(1.6rem, ...)` |
| `--radius-xl` | `clamp(2.6rem, ...)` |
| `--radius-full` | `999rem` |

---

## Cienie

| Zmienna | Wartość |
|---------|---------|
| `--shadow-xs` | `0 1px 2px var(--shadow-primary)` |
| `--shadow-s` | `0 1.5px 3px var(--shadow-primary)` |
| `--shadow-m` | `0 2px 6px var(--shadow-primary)` |
| `--shadow-l` | `0 3px 12px var(--shadow-primary)` |
| `--shadow-xl` | `0 6px 48px var(--shadow-primary)` |

---

## Breakpointy (Responsywność)

| Breakpoint | Wartość |
|------------|---------|
| Duże tablety / małe desktop | ≤ 1399px |
| Tablety landscape | ≤ 1180px |
| Tablety | ≤ 768px |
| Duże mobile | ≤ 478px |

---

## Przyciski (Buttons)

### Primary Button (`.mask-btn-1`)
```css
background-color: var(--primary);         /* #FACB7D */
text-transform: uppercase;
font-weight: 600;
padding: var(--space-2xs) var(--space-s);
color: var(--primary-d-3);               /* #5c4c33 */
/* Hover: tło zmienia się na --primary-l-3 (#ffebcc) */
```

### Secondary Button (`.mask-btn-2`)
```css
background-color: var(--secondary-d-3);  /* #0d0d0d */
text-transform: uppercase;
font-weight: 600;
padding: var(--space-2xs) var(--space-s);
color: var(--bg-body);                   /* white */
/* Hover: tło zmienia się na --secondary-l-1 (#404040) */
```

Oba przyciski używają animacji mask/reveal (biblioteka bc-mask-button z NextBricks).

---

## Nawigacja

### Header
- Sticky header z efektem glassmorphism przy scrollowaniu:
  ```css
  background-color: rgb(10 10 10 / 90%);
  backdrop-filter: blur(4px);
  ```
- Logo zmniejsza się przy scrollowaniu: z `clamp(13rem, 5.769vw, 16rem)` do `60px`
- Kolor linków menu: `var(--text-light)` → `var(--primary)` (hover/aktywny)
- Telefon widoczny w nagłówku: `+48 880 626 783`

### Mobile Menu (Offcanvas)
- Wysuwane z prawej strony
- Tło: `var(--bg-surface)` = `#1B1B1B`
- Linki: duże nagłówki `h3` z animacją swap title
- Kolory mobilne: `var(--primary)` dla aktywnych/oferta submenu

---

## Hero Section

```css
background: full-height video (YouTube)
min-height: 768px;
height: 100dvh;
overlay: linear-gradient(
  #050505 50px,
  rgba(5,5,5,0.85),
  rgba(5,5,5,0.4),
  rgba(5,5,5,0.2),
  rgba(5,5,5,0),
  rgba(5,5,5,0.2),
  rgba(5,5,5,0.4),
  #050505
)
```

---

## Logo

| Plik | Format | Zastosowanie |
|------|--------|-------------|
| `ArtBar-Solutions_svg_6.svg` | SVG | Logo nagłówek + stopka |
| `ArtBar-Solutions_jpg_7.jpg` | JPG 2250×2250 | Schemat.org logo |
| `cropped-ArtBar-Solutions_jpg_10-32x32.jpg` | JPG 32×32 | Favicon 32px |
| `cropped-ArtBar-Solutions_jpg_10-192x192.jpg` | JPG 192×192 | Favicon 192px |
| `cropped-ArtBar-Solutions_jpg_10-180x180.jpg` | JPG 180×180 | Apple touch icon |
| `cropped-ArtBar-Solutions_jpg_10-270x270.jpg` | JPG 270×270 | MS Tile |

---

## Sekcja CTA (Home)

Background image: `2023.03.31-Pandora-Two-Worlds-45.jpg` (fixed parallax)
Overlay: `rgba(0,0,0,0.94)`
Layout: 2-kolumnowy grid (tekst + siatka zdjęć) 

---

## Animacje

- **Unfold Reveal** (bc-unfold-reveal): Tekst wjeżdżający linijkami z lewej
- **Swap Title** (bc-swap-title): Efekt zamiany tekstu w menu
- **Mask Button** (bc-mask-button): Animacja maski na przyciskach
- **Scroll Down Arrow**: Pulsujące strzałki w dół (pure CSS)
- **Logo Scroll**: Marquee od prawej do lewej (35s pętla)
- **Slider**: Splide.js (fade, autoplay 2s interval)
- **GSAP + ScrollTrigger**: Animacje na scroll

---

## Styl Obrazów

- Zdjęcia: cover + center
- Gradienty na offer cards: `linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0.3), var(--secondary-d-4))`
- Hover na offer: scale(1.1) na zdjęciu
- CTA grid: rotacja o 12deg, centered

---

*Dokument wygenerowany: 2026-09-23*
