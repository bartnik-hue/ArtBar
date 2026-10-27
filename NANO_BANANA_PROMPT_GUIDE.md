# Przewodnik Promptowania: Nano Banana / Nano Banana Pro (Google)
## Dedykowany System Promptów dla ArtBar Solutions

> **Cel dokumentu:** Kompletna baza wiedzy i zbiór gotowych promptów do generowania luksusowych grafik 3D/produktowych dla 6 działów ekosystemu ArtBar Solutions przy użyciu architektury **Google Nano Banana / Nano Banana Pro**.

---

## 1. Filozofia i Architektura Modelu Nano Banana Pro

Modele **Nano Banana** i **Nano Banana Pro** (oparte na zaawansowanej architekturze wizualnej Google Gemini) różnią się diametralnie od starszych silników typu Stable Diffusion 1.5/SDXL:

1. **Język naturalny zamiast "zupy tagów"**:
   - ❌ *Nie pisz:* `gold bar, 3d render, octane render, masterpiece, 8k, highly detailed, trending on artstation`
   - ✅ *Pisz pełnymi zdaniami w formie briefu artystycznego:* `A luxury modular event bar counter crafted from brushed black obsidian stone and accented with satin gold trim, illuminated from beneath by warm amber lighting.`
2. **"Edit, Don't Re-roll" (Wieloturowa konwersacyjna edycja)**:
   - Jeśli wygenerowana grafika jest bliska ideału, nie pisz nowego promptu od zera. Odpowiedz modelowi poleceniem edycji:
     *„Keep the exact bar geometry and black background, but make the gold metallic edges emit a subtle warm glow and add delicate dry-ice smoke at the bottom.”*
3. **Precyzyjna typografia i napisy**:
   - Model potrafi renderować czytelne napisy. Wystarczy umieścić je w cudzysłowie: `with the word "ARTBAR" etched into the brushed gold plate in a minimalist serif font`.
4. **Pozytywne formułowanie założeń**:
   - Zamiast pisać `no people, no background clutter, no blur`, napisz: `isolated on a seamless deep obsidian black background with negative space for UI overlays`.

---

## 2. Złoty Szablon Promptu (The 5-Part Framework)

Każdy prompt do Nano Banana Pro budujemy wg 5-częściowej struktury:

$$\text{[Temat i Forma]} + \text{[Otoczenie i Kompozycja]} + \text{[Oświetlenie i Atmosfera]} + \text{[Materiały i Detale]} + \text{[Kamera i Format]}$$

1. **Temat i Forma (Subject & Action):** Co jest głównym bohaterem grafiki? Jaka jest dynamika lub kompozycja bryły?
2. **Otoczenie (Setting / Backdrop):** Czyste studio, izolowane czarne tło (`#030303`), subtelna mgiełka, brak zbędnych elementów.
3. **Oświetlenie (Lighting & Mood):** Studyjne światło krawędziowe (*rim light*), akcenty w ciepłym złocie (`#FACB7D`), miękkie cienie, luminescencja.
4. **Materiały i Wykończenie (Materiality):** Szczotkowane złoto (*satin brushed gold*), matowy czarny kompozyt, polerowany chrom, kryształowe szkło, mroźny lód.
5. **Kamera i Kadr (Camera & Constraints):** Rzut aksonometryczny lub perspektywa 3/4, płytka głębia ostrości (*shallow depth of field*), kadr kwadratowy `1:1` lub panoramiczny `16:9`.

---

## 3. DNA Wizualne ArtBar Solutions (Brand Guidelines dla AI)

Do każdego promptu wplatamy słowa kluczowe spójne z identyfikacją marki ArtBar:
- **Dominujące kolory:** Głęboka czerń aksamitna (`deep obsidian black #030303`), szampańskie/ciepłe złoto (`warm champagne gold #FACB7D`, `burnished brass`).
- **Styl estetyczny:** *High-end luxury event hospitality, premium architectural design, sculptural minimalism, clean 3D studio render.*
- **Światło:** *Cinematic rim lighting, golden caustics, soft volumetric ambient glow.*
- **Izolacja:** *Clean cutout / dark background suitable for transparent UI overlay.*

---

## 4. Gotowe Prompty dla 6 Działów ArtBar Solutions

### Dział 1: ART (Kreacja Wizualna i Scenografia)
> **Zastosowanie:** Hero-grafika dla działu Art (reprezentuje: projekty koncepcyjne, branding, neony, scenografię, światło architektoniczne).

```text
A luxurious 3D abstract artistic concept sculpture representing event scenography and visual identity. The centerpiece is an elegant, sweeping architectural ribbon made of fluid brushed champagne gold (#FACB7D), gracefully intertwining with floating geometric glass prisms that split soft light into subtle golden reflections. Suspended fine geometric wireframe lines suggest blueprint design and spatial creativity. Set against a pure, deep obsidian black background (#030303). Dramatic cinematic rim lighting, volumetric warm gold glow, ultra-clean commercial studio 3D render, perfectly centered, isolated with ample negative space around the edges, 4K resolution, 1:1 aspect ratio.
```

---

### Dział 2: BAR (Modułowa Infrastruktura Barowa)
> **Zastosowanie:** Hero-grafika dla działu Bar (reprezentuje: modułowe bary proste i narożne, zaplecza z regałami LED, sprzęt barmański, estetykę lounge).

```text
A premium commercial product hero shot of a modern modular event bar counter. The bar features a minimalist matte black faceted facade bordered with illuminated warm gold channels (#FACB7D) and a polished black marble countertop. In the background, an ergonomic back-bar shelving unit with sleek warm LED strip lighting gently illuminates premium liquor bottles and crystal glassware. Crisp studio lighting highlighting the metallic bevels and textures. Clean seamless obsidian black studio backdrop, slight dynamic 3/4 perspective, architectural luxury exhibition style, razor-sharp focus, isolated subject, 4K resolution, 1:1 aspect ratio.
```

---

### Dział 3: PRODUKCJA (Własny Zakład Produkcyjny)
> **Zastosowanie:** Hero-grafika dla działu Produkcja (reprezentuje: park maszynowy, obróbkę stali i aluminium, stolarstwo, laser, customowe meble).

```text
A sophisticated 3D industrial craftsmanship composition celebrating high-precision manufacturing. Floating precision-engineered mechanical elements: interlocking bevel gears crafted from satin champagne gold, clean laser-cut brushed stainless steel sheets, and finely milled dark timber blocks arranged in an artistic suspended explosion diagram. A delicate golden laser line subtly traces the edge of a curved metal profile with tiny luminous sparks. Dark luxury industrial aesthetic, dramatic chiaroscuro side lighting casting elegant shadows on a seamless black environment, premium engineering showcase, 4K resolution, 1:1 aspect ratio.
```

---

### Dział 4: LOGISTYKA (Koordynacja, Transport, Magazyn)
> **Zastosowanie:** Hero-grafika dla działu Logistyka (reprezentuje: flotę chłodniczą, magazyny, dostawy Just-In-Time, monitoring GPS).

```text
A conceptual 3D visualization of luxury global logistics and Just-In-Time coordination. A sleek, minimalist aerodynamic transport container silhouette made of matte black alloy with glowing golden telemetry lines (#FACB7D). Surrounding the object are delicate orbital vector rings and subtle GPS coordinate pulses floating in zero gravity, symbolizing speed, route precision, and constant tracking. Seamless obsidian black background, kinetic forward energy, high-end automotive styling, crisp edge lighting, ultra-clean commercial render, 4K resolution, 1:1 aspect ratio.
```

---

### Dział 5: NAMIOTY (Zadaszone Strefy Plenerowe)
> **Zastosowanie:** Hero-grafika dla działu Namioty (reprezentuje: hale membranowe, namioty stretch, konstrukcje sferyczne, podłogi modułowe).

```text
An architectural 3D conceptual render of a high-end stretch canopy and event pavilion structure. Elegant double-curved tensioned fabric membranes stretched over satin gold structural support masts, creating dynamic geometric silhouettes. Warm amber architectural lighting glows from under the canopy, casting soft luminous gradients across the smooth fabric surface. Grounded on a rich dark modular parquet floor. Isolated on a deep night-sky black background, sophisticated outdoor hospitality concept, clean sculptural curves, photorealistic architectural model render, 4K resolution, 1:1 aspect ratio.
```

---

### Dział 6: FABRYKA LODU (Własna Fabryka Lodu Hoshizaki)
> **Zastosowanie:** Hero-grafika dla działu Fabryka Lodu (reprezentuje: krystaliczny lód Hoshizaki w kostkach, lód kruszony, rzeźby lodowe, chłodnictwo -18°C).

```text
A macro studio shot of an ultra-pure, crystal-clear Hoshizaki gourmet ice cube floating weightlessly. The ice has razor-sharp diamond-beveled edges and flawless transparency, with delicate light refractions and golden caustics shimmering through its frozen core. Subtle wisps of dry-ice vapor and microscopic cold mist swirl gently around the base. Resting over a reflective black polished obsidian surface with dark background. High-speed luxury beverage photography, crisp macro detail, cold blue-white internal reflections kissed by warm golden rim light (#FACB7D), 4K resolution, 1:1 aspect ratio.
```

---

## 5. Jak Wykorzystać Istniejące Rendery Barów (`grafikibarow`)

W katalogu `D:\PRACA\ARTBAR\artbar anim na strone\grafikibarow` znajdują się już gotowe, profesjonalne rendery z kanałem przezroczystości (RGBA):
1. **`sprawna_logistyka-bar/Image0000.png` do `0070.png`**:
   - 71 klatek sekwencji rotacyjnej modułu baru w wysokiej rozdzielczości (1620x1920) na przezroczystym tle!
   - Idealne do stworzenia interaktywnej mikropętli wideo / WebP lub efektu "obracania barem przy scrollu / najechaniu myszką" dla działu **BAR** lub **LOGISTYKA**.
2. **`sprawna_logistyka-regal`**:
   - Wysokiej jakości rendery podświetlanego regału barowego (2160x2160) z butelkami i złotym oświetleniem LED.
   - Gotowe do wdrożenia na kafelkach usług lub w nagłówku sekcji.
3. **`sprawna_logistyka-rog`**:
   - Render narożnika barowego (1920x1920) z przezroczystością.
4. **`alpha0003.png`**:
   - Render 4K (3840x2160) z kanałem alfa.

---

## 6. Szybkie Polecenia Korygujące (Follow-up Prompts)

Gdy grafika w Nano Banana Pro wymaga drobnego dopracowania, użyj tych szablonów:

- **Za dużo szczegółów / za mało luksusu:**
  > *"Simplify the composition. Remove minor clutter, make the primary object cleaner and more monumental. Enhance the contrast between deep black and satin gold accents."*
- **Tło nie jest idealnie czarne:**
  > *"Ensure the background is 100% solid seamless obsidian black (#030303) with zero floor seams or textures, allowing the object to float cleanly."*
- **Za zimne kolory:**
  > *"Shift the metallic tones from cold yellow to a warm, rich champagne gold (#FACB7D) and deepen the warm amber lighting tones."*
- **Dodanie lekkiego dymu / pary (np. dla Lodu / Baru):**
  > *"Add a very subtle, wispy dry-ice vapor swirling around the lower third of the object, fading gently into the black background."*
