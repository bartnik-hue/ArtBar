# Art Bar Solutions – Konfigurator 3D: Pełna Analiza Techniczna

## Lokalizacja

- **Oryginał:** `D:\PRACA\ARTBAR\KONFIGURATOR ARTBAR\`
- **Kopia w projekcie:** `D:\PRACA\ARTBAR\ARTBAR NEW WEB\KONFIGURATOR ARTBAR\`

---

## Stos Technologiczny

| Technologia | Wersja/Opis |
|-------------|-------------|
| **Three.js** | Lokalny, z ES Modules Import Map |
| **OrbitControls** | Three.js addons |
| **GLTFLoader** | Three.js addons – ładowanie modeli .glb |
| **Vanilla JS** | ES Modules (type="module") |
| **Node.js** | `server.js` – lokalny serwer HTTP |
| **Stability AI** | Cloud API (opcjonalny klucz BYOK) |
| **ComfyUI** | Lokalne API 8000/8188 (opcjonalne) |
| **AUTOMATIC1111** | Lokalne WebUI 7860 (opcjonalne) |

**Uruchomienie:** `node server.js` → http://localhost:3050/

---

## Architektura Modułów JS

```
js/
├── app.js              (83 KB) – Główna klasa ArtbarApp, pętla renderowania, UI
├── BarBuilder.js       (43 KB) – Wstawianie/usuwanie/łączenie modułów barowych
├── BrandingManager.js  (33 KB) – Zarządzanie grafika front-paneli (panorama+logo)
├── LedManager.js       (13 KB) – System podświetlenia LED
├── ModelRegistry.js    (33 KB) – Rejestr i ładowanie modeli GLB + kalibracja
├── AiTextureService.js (36 KB) – Generator tekstur AI (ComfyUI/Stability/A1111)
├── FridgeGenerator.js  (15 KB) – Proceduralny generator modelu lodówki
└── CalibrationTool.js  (23 KB) – Narzędzie admin kalibracji offsetów modeli
```

---

## Modele 3D (GLTF/GLB)

```
MODELE/
├── BarModel.glb   (5.1 MB)  – Moduł prosty baru 1.5m
├── regal.glb      (12.9 MB) – Regał zaplecza 1.5m
└── rog.glb        (5.1 MB)  – Narożnik 90°
```

**Uwaga:** Lodówki są generowane proceduralnie przez `FridgeGenerator.js` (brak pliku .glb).

### Wymiary modułów (skala 1 jednostka = 1 metr):

| Model | Typ | Szerokość | Plik |
|-------|-----|-----------|------|
| BAR_STRAIGHT | Bar prosty | 1.500 m | BarModel.glb |
| BAR_CORNER_RIGHT | Narożnik prawy 90° | 0.950 m | rog.glb |
| BAR_CORNER_LEFT | Narożnik lewy 90° | 0.950 m | rog.glb (mirrored) |
| BAR_CORNER_RIGHT_OUT | Narożnik zewnętrzny prawy | 1.500 m | rog.glb |
| BAR_CORNER_LEFT_OUT | Narożnik zewnętrzny lewy | 1.500 m | rog.glb |
| BACK_SHELF | Regał zaplecza | 1.500 m | regal.glb |
| BACK_FRIDGE | Lodówka 2-drzwiowa | 1.000 m | FridgeGenerator |
| BACK_FRIDGE_SLIM | Lodówka 1-drzwiowa | 0.500 m | FridgeGenerator |

**Plik Blender:** `modele.blend` (37.6 MB) – oryginalne modele

---

## Funkcjonalności Konfiguratora

### Panel Główny – Pasek Dolny (Dodaj moduł)
- **Bar Prosty** – moduł 1.5m
- **Róg** – narożnik 90° (auto-dopasowanie lewy/prawy)
- **Regał** – regał zaplecza
- **Lodówka 2D** – dwudrzwiowa (1.0m)
- **Lodówka 1D** – jednodrzwiowa (0.5m)

### Widoki Kamery
- **Widok 3D** – perspektywiczny (kamera orbitalna)
- **Rzut z góry** – Top-down
- **Widok Ortho** – aksonometryczny pod kątem

### Menu Górne (Toolbar)
| Przycisk | Funkcja |
|----------|---------|
| **Gotowe Układy** | 4 presety: Prosty, L-Shape, Podkowa U, Wyspa 360° |
| **Branding / Grafika** | Panel zarządzania grafiką frontów |
| **Ustawienia LED** | Kolor, jasność i styl podświetlenia |
| **Ustawienia Sceny** | Tło, oświetlenie, posadzka |
| **Kalibracja** | Admin tool (ukryty) |
| **Podsumowanie** | Zestawienie elementów + druk/eksport spec |
| **Zapisz Układ** | Eksport do JSON |
| **Wczytaj Układ** | Import z JSON |
| **Pomoc** | Instrukcja obsługi |
| **Wyczyść** | Reset sceny |

### Menu Kontekstowe (PPM)
Kliknięcie PPM na siatce → popup wyboru modułu do wstawienia w miejscu kursora.

### Radial Menu (nad wybranym elementem)
- **↻ Obróć** – obrót o 90° (klawisz R)
- **✥ Przesuń** – przesuń pojedynczy moduł
- **⊞ Cały moduł** – przesuń cały połączony ciąg
- **✕ Usuń** – usuń (klawisz Del)

---

## System Połączeń (Snap Sockets)

- **Złote kropki połączeń** – wyświetlane przy zaznaczeniu modułu
- Kolor: `#FACB7D` (identyczny z branding firmy)
- Automatyczne snap/magnetyczne przyciąganie modułów
- Złota ramka selekcji pod zaznaczonym modułem

---

## System Brandingu (BrandingManager)

### Tło Frontów (Panorama)
- **Ciągły pas** – grafika rozciąga się na całym ciągu barów w jednej linii
- **Powtarzaj moduł** – każdy moduł ma własną kopię grafiki
- **Długość grafiki** – suwak: ile barów (1-10) na jeden pełny wzór

### Gotowe wzory grafik (`grafiki/`)
| Plik | Nazwa |
|------|-------|
| `graffitilike.jpg` | Graffiti Art |
| `kamienieszlachetne.jpg` | Kamienie Szlachetne |
| `kwiaty2.jpg` | Kwiaty Botaniczne |
| `kwiaty3.jpg` | Kwiaty Egzotyczne |
| `palmy.jpg` | Palmy Tropikalne |
| `turku.jpg` | Turkus & Złoto |
| `zloto.jpg` | Złota Elegancja |

### Własna grafika
- Wgranie JPG/PNG przez drag&drop lub input
- Formaty: JPG, PNG

### Generator AI (AiTextureService)
Obsługuje 4 backendy:
1. **ComfyUI** – lokalne (port 8000/8188, auto-detect)
2. **Stability AI Cloud** – SDXL / SD 3.5 (klucz API BYOK)
3. **AUTOMATIC1111** – lokalne WebUI (port 7860)
4. **Demo** – proceduralny fallback bez AI

**Style predefiniowane AI:**
- Marmur & Onyks
- Art Deco & Złoto
- Egzotyczna Botanika
- Płynny Akryl & Agat
- Loft & Miedź
- *(i więcej – 5+ presetów)*

**Opcje generowania:**
- Wzór bezszwowy (seamless tile toggle)
- Format: 1 moduł (1216×768), HD (1536×960), podwójny, potrójny, kwadrat
- Historia wygenerowanych grafik
- Pobierz wygenerowaną grafikę do pliku

### Logotyp/Branding
- Wgranie własnego logo (PNG/JPG/SVG z przezroczystością)
- Suwaki: skala %, szerokość (0.20–1.45m), wysokość (0.10–0.75m), pozycja Y (0.25–0.85m)
- Auto-proporcje
- Blokada AR

---

## System LED (LedManager)

- Włącz/wyłącz LED główny toggle
- Kolor LED (paleta: Złoty Artbar, Ciepły Biały, Neon Blue i inne)
- Własny kolor (color picker)
- Jasność LED (suwak)
- Realistyczne odbicia na posadzce
- Gdy wyłączony: Przezroczysty lub Czarny profil

---

## Ustawienia Sceny

- **Kolor tła** – color picker (domyślnie `#121212`)
- **Mgła** – `FogExp2(0x121212, 0.035)`
- **Kąt słońca** – azymut (0–360°) i elewacja (0–85°)
- **Posadzka:**
  - Połysk/Chropowatość (0.05–1.0)
  - Metaliczność (0.0–0.8)
- **Oświetlenie:**
  - Ambient: białe 0.8
  - Directional Main: `#fffaed` 2.2, z cieniami 2048×2048
  - Gold Rim Light: `#FACB7D` 1.4 (kontury złoto)
  - Fill: `#d5e2f0` 0.8

---

## Rendering

```javascript
THREE.WebGLRenderer({
  antialias: true,
  powerPreference: 'high-performance'
})
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.1;
```

---

## Podsumowanie / Eksport

**Panel Podsumowanie pokazuje:**
- Ilość: modułów prostych, narożników, regałów, lodówek 2D i 1D
- Łączna długość frontu baru w metrach
- Przycisk: **Drukuj / Eksportuj Zestawienie** (print dialog)

**Zapis projektu:**
- JSON z pełnym opisem układu i parametrów
- Wczytanie projektu z pliku JSON

---

## Gotowe Presety Układów

| Preset | Ikona | Opis |
|--------|-------|------|
| `straight` | ━━━ | Układ Prosty (Długi) – Linia 6m baru + regały i lodówki |
| `l_shape` | ┗━━ | Litera L (Narożny) – kompaktowy narożnik |
| `horseshoe` | ⊔ | Podkowa (U) – bar z 3 stron z centralną wyspą |
| `island` | ◻ | Wyspa 360° – pełny kwadrat ze strefą w centrum |

---

## Server.js (Node.js)

- Port: **3050**
- Static file server dla HTML/CSS/JS/GLB/GLTF/PNG/JPG/SVG
- CORS: pełny (`Access-Control-Allow-Origin: *`)
- **Endpoint:** `GET /api/ai-status` – sprawdza dostępność klucza Stability AI
- **Endpoint:** `POST /api/generate-texture` – proxy do Stability AI API (z kluczem serwerowym)
  - Model: `stable-diffusion-xl-1024-v1-0`
  - Format: JSON z base64 image

---

## Integracja z Nową Stroną – Rekomendacje

### Sposób osadzenia
Konfigurator to **standalone SPA** (Single Page App):
- Może być osadzony jako `<iframe>` na dedykowanej podstronie `/konfigurator/`
- Lub zintegrowany bezpośrednio przez zamontowanie w routerze (jeśli Next.js)
- Wymaga uruchomionego Node.js serwera (lub przeniesienia na statyczny hosting)

### Pliki do skopiowania na serwer
```
index.html
server.js
css/style.css
js/*.js (8 plików)
libs/three/ (Three.js)
MODELE/*.glb (3 pliki GLB)
grafiki/*.jpg (7 plików)
```

### Wymagania serwera
- Node.js (dla server.js + AI proxy)
- Lub: statyczny hosting (Vercel/Netlify) – bez funkcji AI proxy po stronie serwera

### Integracja brandingowa z nową stroną
- Kolor `#FACB7D` → identyczny z primary strony ✅
- Motyw ciemny `#121212` → spójny ze stroną ✅
- Font: konfigurator używa CSS vars – można zsynchronizować z Montserrat

---

## Wideo Demonstracyjne

**YouTube:** https://www.youtube.com/watch?v=4kQQrfRCF_I  
Status pobierania: ⚠️ YouTube blokuje automatyczne pobieranie (wymaga zalogowanej sesji w przeglądarce)  
Do pobrania ręcznie: Otwórz URL w przeglądarce i użyj rozszerzenia lub pobierz przez yt-dlp z zalogowaną sesją YouTube.

---

*Dokument wygenerowany: 2026-09-23*
