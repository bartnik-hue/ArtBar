# Wdrożenie Stylu Obsidian Gold — Strona Główna Art Bar Solutions

## Status Wdrożenia: UKOŃCZONE

Główna strona internetowa została przygotowana w wybranym stylu **Obsidian Gold** i zapisana w pliku:
`D:\PRACA\ARTBAR\ARTBAR NEW WEB\index.html`

---

## 1. Zrealizowane Elementy i Architektura

### A. Header / Nawigacja
- Sticky header z efektem **glassmorphism** (`backdrop-blur-md` na ciemnym tle).
- **Oficjalne logo wektorowe SVG powiększone dwukrotnie** (do 80px wysokości) z eleganckim złotym podświetleniem `filter drop-shadow`.
- Linki nawigacyjne do sekcji: *O nas*, *Oferta*, *Konfigurator 3D*, *Realizacje*, *Kontakt*.
- Bezpośredni link telefoniczny `+48 880 626 783` oraz przycisk CTA "Stwórz Bar 3D".
- W pełni responsywne menu mobilne.

### B. Hero Section z Wideo w Tle i Złotymi Efektami
- **Monumentalne logo ArtBar (powiększone 4-krotnie: do 440px)** umieszczone centralnie na szczycie sekcji Hero ze złotą poświatą `drop-shadow-[0_0_60px_rgba(250,203,125,0.65)]`.
- **Spójny motyw geometrycznego złotego kwadracika z logotypu**: zastosowany zamiast okrągłych kropek przed hasłem głównym, w menu przed *Konfiguratorem 3D*, na listach punktowych oferty oraz w stopce.
- Odtwarzanie w pętli materiału wideo `assets/video/artbar-hero.mp4` o **zwiększonej jasności i wyrazistości** (`opacity-60`, `brightness-105`), **z usuniętymi pierwszymi 2 sekundami** (film startuje od razu od sceny baru).
- **Animowane złote efekty świetlne**:
  - `golden-light-beam`: kinowy, płynnie poruszający się snop światła pod kątem 115°.
  - `golden-orb-1` & `golden-orb-2`: powolne, pływające złote soczewki świetlne (flary) pulsujące na filmiku.
  - Zbalansowana winieta i delikatny złoty *shimmer* gwarantujące doskonałą czytelność treści przy zachowaniu żywego tła wideo.
- Typografia display serif w stylu luksusowym (`Cinzel`) ze złotym gradientem.
- 4 kluczowe wskaźniki liczbowe (*480+ Eventów*, *12 Barów*, *100% Modułowości*, *Koncesja ABC & POS*).

### C. Zaufali Nam (Marquee Klientów)
- Płynnie przesuwający się pasek z logotypami festiwali i klientów:
  - Wisłoujście
  - Summer Contrast
  - So Hard
  - Festivaland
  - Malta Festival

### D. Sekcja Showcase Konfiguratora 3D (Lazy-Loading & Fasada)
- Zintegrowane studio 3D w luksusowej ramie z ciemnego obsydianu i złota.
- **Optymalizacja wydajności (Lazy-loading):** Silnik 3D nie ładuje się automatycznie przy starcie strony, oszczędzając transfer i czas pierwszego renderu.
- **Przyciemniona nakładka (fasada):** Złota siatka 3D, subtelne rozproszone światło i dwa dedykowane przyciski:
  1. **„Uruchom konfigurator”** – wczytuje silnik 3D bezpośrednio w ramce strony z eleganckim loaderem Obsidian Gold,
  2. **„Uruchom konfigurator pełnoekranowo w nowej karcie”** – otwiera najnowszą wersję repozytorium online (`https://bartnik-hue.github.io/Bar-konfigurator/`) w nowej karcie przeglądarki.
- 3 kluczowe filary konfiguratora wyjaśnione pod podglądem:
  1. Modułowe łączenie z milimetrową precyzją,
  2. Branding AI (Stable Diffusion / ComfyUI) i presety,
  3. Zestawienie sprzętu i eksport specyfikacji.

### E. ARTBAR & SOLUTIONS: Wyskakująca Ramka Modalna i Slideshow Realizacji
- Zgodnie ze strukturą oficjalnej oferty na `artbar.com.pl`, sekcja prezentuje 3 nierozerwalne filary:
  - **art** (Kreacja Wizualna i Scenografia) – 9 pełnych usług z opisami.
  - **bar** (Infrastruktura Stref Barowych) – 5 kluczowych rozwiązań modułowych.
  - **SOLUTIONS** (Systemy POS i Operacje) – 8 zaawansowanych modułów technologiczno-operacyjnych.
- **Wyskakująca ramka nad stroną (Overlay Modal):**
  - Kliknięcie w dowolną z trzech kart filarów na stronie głównej otwiera elegancką ramkę modalną wyskakującą nad treścią serwisu (`z-[100]`, backdrop blur, luksusowe okno Obsidian Gold).
  - Strona nie jest rozpychana pionowo, a użytkownik otrzymuje dedykowane, komfortowe środowisko do eksploracji oferty.
  - Wewnątrz ramki dostępne są zakładki do płynnego przełączania między kategoriami (`art`, `bar`, `SOLUTIONS`) bez konieczności zamykania okna.
  - Wygodne zamykanie: przycisk `[ × ]`, kliknięcie w tło lub klawisz `Escape`.
- **Dedykowany Slideshow fotek z galerii realizacji (obok listy usług w modalu):**
  - Automatyczny pokaz slajdów (autoplay co 5s z pauzą po najechaniu).
  - Płynne przełączanie slajdów (`←` / `→`), licznik kadru (`01 / 06`), tytuł i opis danej realizacji.
  - Pasek miniatur zdjęć dla aktywnej kategorii.
  - Przycisk pełnego ekranu (`⛶ Powiększ`) otwierający kadr bezpośrednio w Lightboxie 123 realizacji.
- Bezpośrednie przyciski do pobrania oficjalnych katalogów PDF (`artbar_solution_oferta_v5_compr.pdf` oraz `artbart_artpos_oferta_v3_compr.pdf`).

### F. Portfolio i Pełnoekranowa Galeria (123 zdjęcia)
- Zintegrowana baza 123 unikalnych zdjęć w wysokiej rozdzielczości ze strony `artbar.com.pl` (`assets/gallery-data.js`).
- Przycisk **„Zobacz Galerię (120+ zdjęć)”** oraz karta szybkiego wejścia w pełny ekran.
- Luksusowy **Lightbox Obsidian Gold**:
  - Płynne przeglądanie jedno po drugim całej kolekcji 123 zdjęć (strzałki ekranowe + klawiatura `←` / `→` + gesty swipe na smartfonach).
  - Pasek miniatur wszystkich zdjęć z automatycznym wyśrodkowaniem aktywnego kadru.
  - Licznik kadru (`001 / 123`), tytuł, kategoria oraz tryb pełnoekranowy (Fullscreen API).

### G. Kontakt i Formularz Kontaktowy
- Pełne dane spółki: `Art Bar Sp. z o.o.`, NIP: `952 22 53 153`, ul. Ogrodowa 48/54, Warszawa.
- Telefon i e-mail klikalne (`tel:` i `mailto:`).
- Luksusowy formularz kontaktowy z polami: Imię i Nazwisko, Firma, E-mail, Telefon, Rodzaj Wydarzenia & Liczba Gości, Wymagania specyficzne.

### H. Stopka (Footer)
- Oficjalne kanały Social Media (Facebook, Instagram, YouTube).
- Prawa autorskie i informacje formalne.

---

## 2. Pliki Powiązane w Projekcie

- Strona główna: [`D:\PRACA\ARTBAR\ARTBAR NEW WEB\index.html`](file:///D:/PRACA/ARTBAR/ARTBAR%20NEW%20WEB/index.html)
- Konfigurator 3D (Online Repo): [https://bartnik-hue.github.io/Bar-konfigurator/](https://bartnik-hue.github.io/Bar-konfigurator/)
- Konfigurator 3D (Lokalny): [`D:\PRACA\ARTBAR\ARTBAR NEW WEB\KONFIGURATOR ARTBAR\index.html`](file:///D:/PRACA/ARTBAR/ARTBAR%20NEW%20WEB/KONFIGURATOR%20ARTBAR/index.html)
- Pobrane wideo: [`D:\PRACA\ARTBAR\ARTBAR NEW WEB\assets\video\artbar-hero.mp4`](file:///D:/PRACA/ARTBAR/ARTBAR%20NEW%20WEB/assets/video/artbar-hero.mp4)
- Zasoby graficzne: [`D:\PRACA\ARTBAR\ARTBAR NEW WEB\assets\`](file:///D:/PRACA/ARTBAR/ARTBAR%20NEW%20WEB/assets/)
- Prezentacja pozostałych 4 wariantów: [`D:\PRACA\ARTBAR\ARTBAR NEW WEB\propozycje_stylow.html`](file:///D:/PRACA/ARTBAR/ARTBAR%20NEW%20WEB/propozycje_stylow.html)
