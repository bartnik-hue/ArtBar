# Art Bar Solutions – Struktura Strony

## Mapa Stron (Sitemap)

```
artbar.com.pl/
├── / (Home)
├── /aktualnosci/      (Blog / Aktualności)
├── /oferta/
│   ├── #art           (Kreacja wizualna)
│   ├── #bar           (Infrastruktura barowa)
│   └── #solutions     (Kompleksowe rozwiązania)
├── /realizacje/       (Portfolio)
├── /kontakt/
└── /polityka-prywatnosci/
```

---

## Nawigacja Główna

```
Home | Aktualności | Oferta ▾ | Realizacje | Kontakt
                    ├── art
                    ├── bar
                    └── SOLUTIONS
```

---

## Anatomia Strony Głównej

### 1. Header (Sticky)
- Logo (SVG) po lewej
- Menu główne (desktop) po prawej
- Numer telefonu (+48 880 626 783) po prawej
- Hamburger menu (mobile) – offcanvas z prawej

### 2. Hero Section (100dvh)
- Wideo w tle (YouTube autoplay/mute)
- Gradient overlay (ciemny góra i dół)
- H1: "Kompleksowa obsługa i produkcja stref barowych"
- Opis firmy
- Dwa przyciski: "Napisz do nas" + "Nasze realizacje"
- Paski klientów (marquee): "Zaufali nam:"
- Animacja scroll-down (strzałki)

### 3. Aktualności (Home)
- Tytuł: "Aktualności"
- Strzałki slider
- Lista artykułów (slider 2 per page)
  - Zdjęcie kwadratowe
  - Kategoria + data
  - Tytuł
  - Link "czytaj więcej"

### 4. Oferta (Home – cards)
- 4 karty oferty (hover reveal)
- Każda karta: pełne zdjęcie + gradient + tytuł + strzałka

### 5. CTA Section
- Tle: zdjęcie z parallax + overlay 94%
- Dwie kolumny:
  - Lewa: tekst + bullet points + przycisk
  - Prawa: siatka 4 zdjęć (rotacja 12deg)

### 6. Galeria Klientów (Logo-11)
- Nagłówek sekcji
- Dwie rzędy logo klientów (cover images)

### 7. Footer
- Logo
- Opis firmy
- Polityka prywatności link
- Menu: Oferta (art/bar/SOLUTIONS)
- Menu: Na skróty (główna nawigacja)
- Menu: Social media (Facebook/Instagram/YouTube)
- Copyright bar

---

## Anatomia Strony Oferty

### 1. Header (jak wszędzie)

### 2. Hero Oferty
- H3: "Oferta"
- Podtytuł: "Poznaj całą ofertę art bar SOLUTIONS"
- Dwa przyciski PDF: Kompleksowa oferta + ArtPOS

### 3. Sekcja „art" (kotwica: #art)
- Ciemne tło
- Slider zdjęć (lewa strona)
- H2 "art" + H3 "Kreacja wizualna i artystyczna wydarzenia"
- Opis
- Lista 9 usług (karty)

### 4. Sekcja „bar" (kotwica: #bar)
- Ciemniejsze tło (secondary-d-2)
- Slider zdjęć (prawa strona – layout odwrócony)
- H2 "bar" + H3 "Infrastruktura stref barowych"
- Opis
- Lista 5 usług (karty)

### 5. Sekcja „SOLUTIONS" (kotwica: #solutions)
- Slider zdjęć (lewa strona)
- H2 "SOLUTIONS" + H3 "Kompleksowe rozwiązania dla stref barowych"
- Lista 8 usług (karty)
- Przycisk PDF na dole

---

## Anatomia Strony Kontakt

### 1. Header

### 2. Hero Kontaktu
- Tło: zdjęcie `2024.12.31-Art-Bar-89.jpg`
- H3: "Kontakt"

### 3. Formularz kontaktowy
- Dwie kolumny: info (lewo) + formularz (prawo)
- Info: "Napisz do nas" + opis + adres + telefon + email
- Formularz Fluent Forms: imię, firma, email, telefon, wiadomość, RODO

---

## Typowe Elementy UI

### Karty artykułów (aktualności)
```
[zdjęcie kwadratowe] | [kategoria | data]
                     | [tytuł H]
                     | [czytaj więcej ↗]
```

### Karty oferty (slider)
```
[pełne zdjęcie z gradientem]
[          TYTUŁ            ]
[                      → ]
```

### Karty usług (offer-content)
```
[H3 - Nazwa usługi]
[opis usługi...]
```

---

## Elementy Nawigacji

### Desktop Menu
- Linki: white → gold (hover)
- Submenu: ciemne tło `rgba(0,0,0,0.76)`
- Aktywny link: `var(--primary)` = gold

### Mobile Offcanvas Menu
- Wysuwane z prawej
- Szerokość: 50% (tablet), 70% (mobile), 100% (small mobile)
- Tło: `var(--secondary-d-4)` = `#080808`
- Linki H3 z animacją swap
- Kontakt w stopce menu (email, tel, adres)

---

## Interakcje i Animacje

| Element | Animacja |
|---------|----------|
| Nagłówki | Unfold reveal (linie wjeżdżają z lewej) |
| Menu offcanvas | Slide z prawej (GSAP, 0.5s, power2.out) |
| Logo w menu | Swap title (hover) |
| Przyciski | Mask reveal (fill effect) |
| Zdjęcia w offer | Scale 1.1 + link reveal (translateX) |
| Hero | ScrollTrigger – chowanie strzałek po 200px |
| Loga klientów | Infinite marquee horizontal scroll |
| Slidery | Splide.js – fade, autoplay 2s |
| Header | Glassmorphism przy scroll |

---

*Dokument wygenerowany: 2026-09-23*
