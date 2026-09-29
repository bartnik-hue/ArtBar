# Art Bar Solutions – Nowa Strona: Wymagania i Kierunki

## Cel Projektu

Przygotowanie nowoczesnej, przeprojektowanej strony internetowej dla firmy Art Bar Solutions,
zachowującej elegancję i styl obecnej marki, wzbogaconej o **konfigurator barów 3D**.

---

## Kluczowe Elementy Nowej Strony

### 1. Konfigurator Barów 3D
- Już istniejący moduł (gotowy) do zintegrowania
- Umożliwia klientom:
  - Układanie modułowych barów, regałów, lodówek w przestrzeni 3D
  - Konfigurację własnego baru
  - Generowanie grafik/wizualizacji
- **Wymaga:** Dedykowanej sekcji/podstrony z konfiguratorem

### 2. Nowoczesny Wygląd
- Czerpiemy z najnowszych trendów web designu (2025/2026)
- Zachowujemy elegancję i premium charakter marki
- Utrzymujemy obecną kolorystykę: ciemna baza + złoty akcent

### 3. Zachowanie Dotychczasowego Stylu
- Paleta kolorów: #FACB7D (gold) + #1A1A1A (dark) → ZACHOWAĆ
- Fonty: Melodrama (nagłówki) + Montserrat (body) → ZACHOWAĆ
- Klimat: premium event services, elegancki, ciemny → ZACHOWAĆ

---

## Trendy Web Designu do Wykorzystania (2025/2026)

### Layout i Struktura
- [ ] Bento grid layouts (nieregularne siatki)
- [ ] Full-width hero z video lub animowanym tłem
- [ ] Horizontal scrolling sections
- [ ] Sticky elements i floating UI elements
- [ ] Scroll-driven animations (CSS scroll-timeline)

### Typografia
- [ ] Bardzo duże nagłówki display (już mamy Melodrama)
- [ ] Typograficzne kontrasty – mix serif + sans
- [ ] Animowany tekst (kinetic typography)
- [ ] Text masking / clipping effects

### Animacje i Interakcje
- [ ] Smooth page transitions
- [ ] Cursor customization
- [ ] Parallax z depth layers
- [ ] Micro-interactions na przyciskach
- [ ] Loading screen / intro animation
- [ ] Scroll-triggered reveals

### UX/Funkcjonalność
- [ ] Dark/light mode toggle (opcja)
- [ ] Floating contact button / WhatsApp
- [ ] Progressive image loading
- [ ] Lazy loading video
- [ ] Mega menu z podglądem produktów

---

## Planowana Struktura Nowej Strony

```
/ (Home)
├── Hero – Wideo / animowane tło + headline
├── Konfigurator 3D (NOWE) – promo sekcja + CTA
├── Trzy Filary: art | bar | SOLUTIONS
├── Realizacje (galeria) 
├── Klienci (marquee logos)
├── CTA "Skontaktuj się"
└── Footer

/konfigurator/  (NOWA PODSTRONA)
└── Wbudowany konfigurator 3D barów

/oferta/
├── #art
├── #bar
└── #solutions

/realizacje/
/aktualnosci/
/kontakt/
```

---

## Stack Technologiczny – Propozycje

### Opcja A: WordPress + Headless / Nowoczesny Builder
- WordPress jako CMS (backend)
- Bricks Builder lub Elementor Pro (zaawansowany)
- Three.js / Babylon.js dla konfiguratora 3D

### Opcja B: Next.js / Astro (Static/SSR)
- Next.js lub Astro jako framework
- Headless CMS (Sanity, Contentful lub WP Headless)
- Three.js / React Three Fiber dla konfiguratora

### Opcja C: Zachowanie WordPress + nowy motyw
- Nowy custom Bricks Child Theme lub pełny custom motyw
- GSAP dla animacji
- Three.js embed dla konfiguratora

**Rekomendacja:** Opcja do omówienia z klientem. Jeśli konfigurator 3D jest już napisany w Three.js/WebGL, preferowana Opcja B lub C.

---

## Konfigurator – Pytania Techniczne

Do wyjaśnienia z klientem:
1. W jakiej technologii jest napisany konfigurator? (Three.js? Babylon.js? WebGL? Unity WebGL?)
2. Jak jest hostowany? (iframe? npm package? standalone app?)
3. Jakie dane wyjściowe generuje? (PNG? PDF? JSON konfiguracji?)
4. Czy wymaga backendu / bazy danych do zapisywania konfiguracji?
5. Czy klientów ma być logowanie / konto do zapisywania projektów?

---

## Elementy do Zachowania z Obecnej Strony

| Element | Status |
|---------|--------|
| Kolorystyka (gold + dark) | ✅ Zachować |
| Fonty (Melodrama + Montserrat) | ✅ Zachować |
| Treści wszystkich sekcji | ✅ Zachować + rozszerzyć |
| Loga klientów | ✅ Zachować |
| Zdjęcia realizacji | ✅ Zachować + uzupełnić |
| Struktura oferty (art/bar/solutions) | ✅ Zachować |
| Formularz kontaktowy | ✅ Zachować |
| Dane kontaktowe | ✅ Zachować |
| Wideo na hero | ✅ Rozważyć |
| Social media links | ✅ Zachować |
| ArtPOS jako produkt | ✅ Wyeksponować |

---

## Nowe Elementy do Dodania

| Element | Priorytet |
|---------|-----------|
| Konfigurator 3D | 🔴 Krytyczny |
| Dedykowana strona konfiguratora | 🔴 Krytyczny |
| Nowoczesne animacje scroll | 🟡 Wysoki |
| Promo konfiguratora na homepage | 🔴 Krytyczny |
| Galeria 3D wizualizacji (output z konfiguratora) | 🟡 Wysoki |
| Ulepszony mobile UX | 🟡 Wysoki |
| Szybszy czas ładowania | 🟡 Wysoki |
| SEO ulepszone | 🟢 Średni |

---

## Inspiracje Wizualne (Sugestie)

Style stron eventowych do obejrzenia jako inspiracje:
- Agencje kreatywne z ciemnym tłem + złote/miedziane akcenty
- Strony luxury event services
- Portale architektury wnętrz z 3D configurators
- Strony premium bar/restaurant equipment

---

## Notatki Robocze

- Obecna strona to WordPress z Bricks Builder
- Animacje: GSAP + ScrollTrigger (NextBricks plugin)
- Konfigurator 3D jest już gotowy – do zintegrowania
- Nowa strona ma być nowoczesna, ale elegancka
- Zachowujemy dotychczasowy styl (gold + dark)
- Priorytet: konfigurator barów jako wyróżnik firmy

---

*Dokument roboczy – aktualizować w trakcie projektu*  
*Wygenerowany: 2026-09-23*
