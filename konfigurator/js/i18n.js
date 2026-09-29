/**
 * ArtBar 3D Configurator - i18n Translation Module
 * Supports: Polish (pl) & English (en)
 */

export const TRANSLATIONS = {
    pl: {
        // Meta & Preloader
        page_title: "Artbar Solutions - Konfigurator Barów Eventowych 3D",
        loader_loading: "Ładowanie modeli 3D...",
        loader_progress: "Ładowanie modeli 3D... ({percent}%)",

        // Top Actions Toolbar
        tool_presets: "Gotowe Układy",
        tool_presets_short: "Układy",
        tool_presets_title: "Wybierz gotowy układ baru",

        tool_branding: "Branding / Grafika",
        tool_branding_short: "Branding",
        tool_branding_title: "Wgraj własną grafikę na fronty",

        tool_led: "Ustawienia LED",
        tool_led_short: "LED",
        tool_led_title: "Ustawienia podświetlenia LED (kolor i natężenie)",

        tool_scene: "Ustawienia Sceny",
        tool_scene_short: "Scena",
        tool_scene_title: "Ustawienia tła i oświetlenia sceny",

        tool_calib: "Kalibracja Offsetu",
        tool_calib_short: "Admin",
        tool_calib_title: "Narzędzie administracyjne kalibracji offsetów",

        tool_summary: "Podsumowanie",
        tool_summary_short: "Podsumowanie",
        tool_summary_title: "Zestawienie elementów baru",

        tool_save_send: "Zapisz i wyślij",
        tool_save_send_short: "Wyślij",
        tool_save_send_title: "Zapisz ten układ i wyślij formularz zapytania",

        tool_save_layout: "Zapisz Układ",
        tool_save_layout_short: "Zapisz",
        tool_save_layout_title: "Zapisz bieżący układ i grafikę do pliku JSON",

        tool_load_layout: "Wczytaj Układ",
        tool_load_layout_short: "Wczytaj",
        tool_load_layout_title: "Wczytaj układ z pliku JSON",

        tool_help: "Pomoc",
        tool_help_short: "Pomoc",
        tool_help_title: "Instrukcja obsługi konfiguratora 3D",

        tool_clear: "Wyczyść",
        tool_clear_short: "Wyczyść",
        tool_clear_title: "Wyczyść całą scenę",

        // Bottom Controls HUD
        hud_add_label: "Dodaj:",
        hud_bar_straight: "Bar Prosty",
        hud_bar_straight_short: "Prosty",
        hud_bar_straight_title: "Postaw moduł prosty baru",

        hud_bar_corner: "Róg",
        hud_bar_corner_short: "Róg",
        hud_bar_corner_title: "Postaw narożnik 90° (automatyczne dopasowanie)",

        hud_back_shelf: "Regał",
        hud_back_shelf_short: "Regał",
        hud_back_shelf_title: "Postaw regał zaplecza",

        hud_back_fridge: "Lodówka 2D",
        hud_back_fridge_short: "Lodówka 2D",
        hud_back_fridge_title: "Postaw lodówkę przeszkloną dwudrzwiową (1.0m)",

        hud_back_fridge_slim: "Lodówka 1D",
        hud_back_fridge_slim_short: "Lodówka 1D",
        hud_back_fridge_slim_title: "Postaw lodówkę przeszkloną jednodrzwiową (0.5m)",

        hud_view_orbit: "Widok 3D",
        hud_view_orbit_short: "3D",

        hud_view_top: "Rzut z góry",
        hud_view_top_short: "Góra",

        hud_view_ortho: "Widok Ortho",
        hud_view_ortho_short: "Ortho",
        hud_view_ortho_title: "Rzut aksonometryczny pod kątem (Orthographic)",

        // Canvas Hint
        canvas_hint_desktop: "<strong>Kliknij PPM na siatce:</strong> wstaw nowy moduł pod kursor<br><strong>Kliknij LPM w moduł:</strong> zaznacz moduł i zobacz złote kropki połączeń<br><strong>Kliknij kropkę:</strong> dołącz kolejny moduł z automatycznym spasowaniem",
        canvas_hint_touch: "<strong>Dotknij moduł:</strong> zaznacz i obróć &bull; <strong>Dotknij złotej kropki:</strong> dołącz moduł &bull; <strong>Przytrzymaj palec na siatce:</strong> wstaw moduł",

        // Context Menu
        context_title_select: "Wybierz moduł",
        context_straight: "Moduł prosty baru (1.5m)",
        context_corner: "Narożnik 90°",
        context_shelf: "Regał zaplecza (1.5m)",
        context_fridge: "Lodówka 2-drzwiowa (1.0m)",
        context_fridge_slim: "Lodówka 1-drzwiowa (0.5m)",

        // Radial Menu
        radial_rotate: "Obróć",
        radial_rotate_title: "Obróć moduł o 90° (Klawisz R)",
        radial_move: "Przesuń",
        radial_move_title: "Przesuń ten pojedynczy moduł",
        radial_move_all: "Przesuń<br>cały moduł",
        radial_move_all_title: "Przesuń cały moduł wraz ze wszystkimi połączonymi obiektami",
        radial_delete: "Usuń",
        radial_delete_title: "Usuń ten moduł (Klawisz Del)",
        radial_delete_all: "Usuń<br>cały moduł",
        radial_delete_all_title: "Usuń cały moduł wraz ze wszystkimi połączonymi obiektami (Shift+Del)",

        // Presets Panel
        presets_title: "Gotowe Układy Barów",
        preset_straight_name: "Układ Prosty (Długi)",
        preset_straight_desc: "Linia 7.5m (5 modułów) + 3 regały i 2 lodówki",
        preset_l_shape_name: "Litera L (Narożny)",
        preset_l_shape_desc: "Narożnik (8 modułów) + 3 regały i 2 lodówki",
        preset_horseshoe_name: "Podkowa (U)",
        preset_horseshoe_desc: "Układ U (11 modułów) + wyspa regałów i chłodziarek",
        preset_island_name: "Wyspa 360°",
        preset_island_desc: "Pełny obwód (16 modułów) + 4 regały centralne",

        // Branding Panel
        branding_panel_title: "Branding & Grafika Baru",
        branding_sec1_title: "1. Tło Frontów (Panorama)",
        branding_sec1_toggle_title: "Włącz lub wyłącz tło panoramiczne na frontach",
        branding_sec1_desc: "Grafika rozciąga się w płynną całość na połączonych frontach barów oraz regałów zaplecza (za półkami).",
        branding_mode_chain: "Ciągły pas (Cały bar)",
        branding_mode_chain_title: "Grafika tworzy jedną ciągłą całość na wszystkich modułach w linii",
        branding_mode_repeat: "Powtarzaj moduł",
        branding_mode_repeat_title: "Każdy moduł powtarza całą grafikę",
        branding_span_bar_label: "Długość na barze:",
        branding_span_shelf_label: "Długość na regałach:",
        branding_catalog_label: "Wybierz gotowy wzór z katalogu:",
        branding_upload_custom: "Wgraj własną grafikę",
        branding_upload_custom_hint: "Format JPG lub PNG",
        branding_reset_pano: "Przywróć domyślny front",

        // Panorama preset names
        pano_kwiaty2: "Kwiaty Botaniczne",
        pano_kwiaty3: "Kwiaty Egzotyczne",
        pano_palmy: "Palmy Tropikalne",
        pano_zloto: "Złota Elegancja",
        pano_art_deco: "Art Deco Gold",
        pano_emerald_gold: "Szmaragd & Złoto",
        pano_chevron_oak: "Dąb Chevron",
        pano_alcohol_ink: "Płynny Granat",
        pano_calacatta: "Marmur Calacatta",
        pano_seigaiha: "Japońska Fala",
        pano_baroque: "Ciemny Welwet",
        pano_cyberpunk: "Cyberpunk Neon",
        pano_rainforest: "Tropikalny Las",
        pano_circuit: "Cyber Schemat",
        pano_sage: "Szałwia Botanika",

        // Logo section
        branding_sec2_title: "2. Logotyp (Nakładka)",
        branding_sec2_toggle_title: "Włącz lub wyłącz logotyp na frontach",
        branding_sec2_desc: "Logotyp marki lub klienta wyświetlany centralnie na modułach baru.",
        branding_logo_upload: "Wgraj plik logo",
        branding_logo_upload_hint: "PNG z przezroczystością, JPG lub SVG",
        branding_logo_preview: "Podgląd wgranego logo:",
        branding_logo_apply: "Zastosuj do frontów",
        branding_logo_remove: "Usuń logo",
        branding_adjust_title: "Dopasowanie logo",
        branding_auto_aspect: "Auto-proporcje",
        branding_auto_aspect_title: "Dopasuj rozmiar do oryginalnych proporcji pliku graficznego",
        branding_scale_label: "Skala:",
        branding_lock_aspect: "Zablokuj proporcje (AR)",
        branding_width_label: "Szerokość:",
        branding_height_label: "Wysokość:",
        branding_posy_label: "Wysokość na barze (Pion):",

        // LED Panel
        led_panel_title: "Podświetlenie LED",
        led_enable_label: "Włącz LED",
        led_enable_desc: "Świecenie listew i elementów LED",
        led_off_title: "Gdy LED jest wyłączony",
        led_off_invisible: "Niewidoczna (Przezroczysta)",
        led_off_invisible_title: "Listwa LED staje się całkowicie niewidoczna / przezroczysta",
        led_off_black: "Czarny profil",
        led_off_black_title: "Listwa LED przyjmuje matowy czarny profil",
        led_color_title: "Kolor Światła LED",
        led_intensity_title: "Natężenie Świecenia (Emisja)",
        led_intensity_label: "Jasność LED:",
        led_intensity_subtle: "Dyskretne (0.2)",
        led_intensity_std: "Standard (2.5)",
        led_intensity_vivid: "Intensywny neon (8.0)",

        // Scene Panel
        scene_panel_title: "Ustawienia Sceny",
        scene_bg_title: "Kolor Tła Sceny",
        scene_light_intensity_title: "Natężenie Oświetlenia",
        scene_light_main: "Główne światło:",
        scene_light_ambient: "Światło otoczenia (Ambient):",
        scene_light_dir_title: "Kierunek Padania Światła",
        scene_light_azimuth: "Kierunek poziomy (Azymut):",
        scene_light_elevation: "Wysokość światła (Elewacja):",
        scene_floor_title: "Materiał Podłogi",
        scene_floor_roughness: "Połysk / Chropowatość:",
        scene_floor_high_gloss: "Wysoki połysk",
        scene_floor_semi_matte: "Półmat",
        scene_floor_full_matte: "Pełny mat",
        scene_floor_metalness: "Refleksyjność / Metaliczność:",

        // Summary Panel
        summary_panel_title: "Podsumowanie Konfiguracji",
        summary_spec_title: "Specyfikacja Sprzętu",
        summary_straight: "Moduł prosty baru (1.5m):",
        summary_corner: "Narożnik 90°:",
        summary_shelf: "Regał zaplecza z półkami:",
        summary_fridge: "Lodówka przeszklona 2D (1.0m):",
        summary_fridge_slim: "Lodówka przeszklona 1D (0.5m):",
        summary_total_length: "Łączna długość frontu baru:",
        summary_btn_print: "Drukuj / Eksportuj Zestawienie",
        summary_btn_send: "Zapisz i wyślij zapytanie",
        unit_pcs: "szt.",

        // Help Modal
        help_modal_title: "Instrukcja Obsługi Konfiguratora Artbar",
        help_modal_subtitle: "Poznaj najważniejsze funkcje, skróty klawiszowe oraz techniki projektowania barów modułowych",
        help_card1_title: "Sterowanie Kamerą i Widok 3D",
        help_card1_item1: "<span class=\"help-kbd\">LPM</span> + przeciągnij – <strong>Obrót kamery</strong> wokół sceny.",
        help_card1_item2: "<span class=\"help-kbd\">PPM</span> lub <span class=\"help-kbd\">ŚPM</span> + przeciągnij – <strong>Przesuwanie widoku</strong> (panowanie).",
        help_card1_item3: "<span class=\"help-kbd\">Rolka myszy</span> – <strong>Przybliżanie / oddalanie</strong> (Zoom).",
        help_card1_item4: "<strong>Dolny pasek widoków:</strong> Szybkie przełączanie między <em>Widokiem 3D</em>, <em>Rzutem z góry</em> oraz <em>Widokiem Ortho</em>.",

        help_card2_title: "Wstawianie i Łączenie Modułów",
        help_card2_item1: "<strong>Dolny pasek:</strong> Kliknij przycisk modułu (<em>Bar Prosty</em>, <em>Róg</em>, <em>Regał</em>, <em>Lodówka</em>), by wstawić go na scenę.",
        help_card2_item2: "<strong>Menu pod <span class=\"help-kbd\">PPM</span>:</strong> Kliknij prawym przyciskiem myszy na siatce, by wstawić moduł w punkcie kursora.",
        help_card2_item3: "<strong>Złote punkty łączenia:</strong> Po zaznaczeniu modułu kliknij złotą kropkę, aby natychmiast dostawić kolejny spasowany moduł.",
        help_card2_item4: "<strong>Magnetyczne przyciąganie:</strong> Przy przesuwaniu moduły samoczynnie przyciągają się i łączą w stabilny ciąg barowy!",
        help_card2_item5: "<span class=\"help-kbd\">Shift</span> – <strong>Precyzyjne ustawianie:</strong> Przytrzymaj Shift podczas wstawiania/przesuwania modułu – siatka zagęszcza się 4-krotnie i pozwala na swobodne ustawienie bez przyciągania do innych modułów.",

        help_card3_title: "Edycja, Obrót i Usuwanie",
        help_card3_item1: "<span class=\"help-kbd\">LPM</span> w moduł – Zaznacza element i wyświetla menu akcji nad barem.",
        help_card3_item2: "<span class=\"help-kbd\">R</span> lub przycisk <strong>Obróć</strong> – Obrót modułu o kąt 90°.",
        help_card3_item3: "Przycisk <strong>Przesuń</strong> – Zmiana położenia pojedynczego modułu.",
        help_card3_item4: "Przycisk <strong>Przesuń cały moduł</strong> – Przesuwa cały połączony bar wraz ze wszystkimi modułami.",
        help_card3_item5: "Przycisk <strong>✕ Usuń</strong> (<span class=\"help-kbd\">Del</span>) – Usunięcie zaznaczonego modułu.",
        help_card3_item6: "Przycisk <strong>🗑 Usuń cały moduł</strong> (<span class=\"help-kbd\">Shift</span> + <span class=\"help-kbd\">Del</span>) – Usunięcie całego połączonego układu barowego.",

        help_card4_title: "Branding & Grafika Frontów",
        help_card4_item1: "Otwórz menu <strong>Branding / Grafika</strong> u góry ekranu.",
        help_card4_item2: "<strong>Tło Frontów (Panorama):</strong> Wybierz ekskluzywny wzór z katalogu (np. Złoto, Kamienie Szlachetne, Graffiti) lub wgraj grafikę JPG/PNG.",
        help_card4_item3: "<strong>Płynne łączenie na rogach:</strong> Grafika tworzy nieprzerwany, estetyczny ciąg wzdłuż całego baru i narożników.",
        help_card4_item4: "<strong>Logotyp:</strong> Wgraj logo firmy, dopasuj skalę, szerokość oraz wysokość na frontach.",

        help_card5_title: "Podświetlenie LED i Efekty",
        help_card5_item1: "Otwórz menu <strong>Ustawienia LED</strong>.",
        help_card5_item2: "Włącz lub wyłącz podświetlenie listew neonowych przełącznikiem głównym.",
        help_card5_item3: "Wybierz kolor z dedykowanej palety (m.in. Złoty Artbar, Ciepły Biały, Neon Blue) lub wskaż własny kolor.",
        help_card5_item4: "Reguluj <strong>Jasność LED</strong> – światło rzuca realistyczne odbicia na posadzkę.",
        help_card5_item5: "Gdy LED jest wyłączony: wybierz profil przezroczysty lub elegancki matowy czarny.",

        help_card6_title: "Gotowe Układy, Zapis i Podsumowanie",
        help_card6_item1: "<strong>Gotowe Układy:</strong> Szybki start z gotowych konfiguracji (Prosty, L-Shape, Podkowa U, Wyspa 360°).",
        help_card6_item2: "<strong>Ustawienia Sceny:</strong> Kolor tła, kąt słońca oraz stopień połysku podłogi (od lustra do matu).",
        help_card6_item3: "<strong>Zapisz / Wczytaj Układ:</strong> Zapis projektu do pliku <code>.json</code> i natychmiastowe wczytanie.",
        help_card6_item4: "<strong>Podsumowanie:</strong> Zestawienie ilości modułów, łączna długość frontu w metrach oraz druk specyfikacji.",

        help_dont_show: "Nie pokazuj automatycznie przy uruchomieniu",
        help_btn_start: "Rozpocznij projektowanie &rarr;",

        // Quote & Save/Send Modal
        quote_modal_title: "Zapisz i Wyślij Konfigurację",
        quote_modal_subtitle: "Twój układ 3D został automatycznie zapisany i dołączony do zapytania ofertowego",
        quote_badge_attached: "Załączony układ 3D",
        quote_spec_length: "Długość frontu:",
        quote_spec_modules: "Moduły baru:",
        quote_spec_shelves: "Regały zaplecza:",
        quote_spec_fridges: "Lodówki:",
        quote_spec_branding: "Grafika frontów:",
        quote_spec_led: "Podświetlenie LED:",
        quote_btn_download_json: "Pobierz kopię pliku (.json)",

        quote_label_name: "Imię i Nazwisko / Osoba kontaktowa *",
        quote_ph_name: "np. Jan Kowalski",
        quote_label_company: "Nazwa Firmy / Organizatora",
        quote_ph_company: "np. Agencja Eventowa / Festiwal",
        quote_label_email: "Adres E-mail *",
        quote_ph_email: "twoj-email@domena.pl",
        quote_label_phone: "Numer Telefonu *",
        quote_ph_phone: "+48 123 456 789",
        quote_label_date: "Termin wydarzenia",
        quote_label_location: "Miejsce eventu / Miasto",
        quote_ph_location: "np. Warszawa / Kraków / Plener",
        quote_label_notes: "Dodatkowe uwagi / pytania",
        quote_ph_notes: "Napisz, czy potrzebujesz także obsługi barmańskiej, koncesji ABC, fabryki lodu, kubków eco lub autorskiego systemu ArtPOS...",
        quote_privacy: "Wysyłając zapytanie, przesyłasz przygotowany układ baru do zespołu ArtBar Solutions w celu bezpłatnej wyceny i konsultacji technicznej.",
        quote_btn_submit: "Wyślij zapytanie z załączonym układem",

        quote_success_title: "Dziękujemy! Zapytanie zostało przyjęte",
        quote_success_desc: "Twój układ baru oraz dane kontaktowe zostały zapisane. Specjaliści ArtBar Solutions skontaktują się z Tobą w najkrótszym możliwym czasie.",
        quote_mailto_cta: "Otwórz kopię zapytania w programie pocztowym",
        quote_btn_return: "Wróć do konfiguratora",

        // Dynamic strings & Toasts
        toast_models_loaded: "Wczytano modele 3D oraz przykładowy układ baru Artbar.",
        toast_models_error: "Wystąpił problem z wczytaniem niektórych modeli. Sprawdź konsolę.",
        toast_module_removed: "Usunięto moduł.",
        toast_module_all_removed: "Usunięto cały moduł ({count} el.).",
        toast_module_placed: "Postawiono moduł.",
        toast_module_cancelled: "Anulowano stawianie / przemieszczanie modułu.",
        toast_module_snapped: "Dodano moduł z automatycznym spasowaniem.",
        toast_ghost_attached: "Moduł przyklejony do kursora. Zbliż do złącza, aby przyciągnąć. LPM - postaw, R - obrót, PPM/ESC - anuluj.",
        toast_pick_straight: "Wybrano Bar Prosty. Kliknij lewym przyciskiem myszy na siatce, aby go postawić. R - obrót, ESC - anuluj.",
        toast_pick_corner: "Wybrano Narożnik 90°. Zbliż do złącza baru, aby dopasować stronę i kąt. R - obrót, ESC - anuluj.",
        toast_pick_shelf: "Wybrano Regał zaplecza. Kliknij lewym przyciskiem myszy na siatce, aby go postawić. R - obrót, ESC - anuluj.",
        toast_pick_fridge: "Wybrano Lodówkę przeszkloną 2D (1.0m). Kliknij lewym przyciskiem myszy na siatce, aby ją postawić. R - obrót, ESC - anuluj.",
        toast_pick_fridge_slim: "Wybrano Lodówkę przeszkloną 1D (0.5m). Kliknij lewym przyciskiem myszy na siatce, aby ją postawić. R - obrót, ESC - anuluj.",
        toast_rotated: "Obrócono moduł o 90°",
        toast_move_single: "Tryb przesuwania modułu. Zbliż do złącza, aby dociągnąć, lub postaw na siatce. ESC/PPM - powrót.",
        toast_move_all: "Przesuwanie całego modułu ({count} el.). R - obrót, LPM - postaw, ESC/PPM - powrót.",
        confirm_clear_scene: "Czy na pewno chcesz wyczyścić całą konfigurację baru?",
        toast_scene_cleared: "Wyczyszczono scenę.",
        toast_layout_saved: "Zapisano układ do pliku: {filename}",
        toast_layout_save_error: "Wystąpił błąd podczas zapisu projektu.",
        toast_layout_loaded: "Układ baru oraz grafiki zostały wczytane!",
        alert_layout_load_failed: "Nie udało się wczytać pliku. Upewnij się, że to poprawny plik konfiguracyjny Artbar (.json).",
        toast_preset_loaded: "Załadowano preset: {name}",
        toast_pano_enabled: "Włączono tło panoramiczne na frontach baru.",
        toast_pano_disabled: "Wyłączono tło panoramiczne na frontach.",
        toast_pano_chain: "Tryb tła: Ciągły pas (płynna panorama na całym ciągu baru).",
        toast_pano_repeat: "Tryb tła: Powtarzaj pełną grafikę na każdym module.",
        toast_pano_applied: "Zastosowano tło panoramiczne: {name}",
        toast_pano_custom_loaded: "Wgrano własną grafikę tła i zastosowano na frontach baru!",
        toast_pano_custom_error: "Nie udało się wczytać grafiki. Upewnij się, że plik to poprawny obraz JPG lub PNG.",
        toast_pano_reset: "Przywrócono domyślne tło frontów baru.",
        toast_logo_loaded: "Wgrano grafikę logo i zaktualizowano fronty baru!",
        toast_logo_applied: "Zastosowano logo do frontów baru.",
        toast_logo_removed: "Usunięto logo z frontów baru.",
        toast_quote_opened: "Zapisano układ baru. Uzupełnij formularz, aby wysłać zapytanie.",
        toast_quote_submitted: "Zapytanie z układem baru zostało przygotowane!",
        toast_quote_no_data: "Brak danych projektu do pobrania.",
        toast_quote_downloaded: "Pobrano plik projektu: {filename}",
        toast_quote_empty_hint: "Wskazówka: Dodaj moduły baru na scenie, aby przygotować precyzyjną wycenę.",

        // Format helpers
        bars_count: "{n} barów ({m} m)",
        bar_count_single: "1 bar (1.5 m)",
        shelves_count: "{n} regały ({m} m)",
        shelf_count_single: "1 regał (1.5 m)",
        modules_breakdown: "{total} szt. ({straight} prostych + {corners} narożnych)",
        fridges_breakdown: "{total} szt. ({f2d} 2D + {f1d} 1D)",
        branding_default: "Standardowy ArtBar",
        branding_ai: "Grafika generatywna AI",
        branding_custom: "Własna grafika klienta",
        date_today: "Dzisiaj"
    },

    en: {
        // Meta & Preloader
        page_title: "ArtBar Solutions - 3D Event Bar Configurator",
        loader_loading: "Loading 3D models...",
        loader_progress: "Loading 3D models... ({percent}%)",

        // Top Actions Toolbar
        tool_presets: "Ready Presets",
        tool_presets_short: "Presets",
        tool_presets_title: "Select a prebuilt bar layout",

        tool_branding: "Branding & Artwork",
        tool_branding_short: "Branding",
        tool_branding_title: "Upload custom artwork or branding to bar fronts",

        tool_led: "LED Lighting",
        tool_led_short: "LED",
        tool_led_title: "LED backlight settings (color and intensity)",

        tool_scene: "Scene Settings",
        tool_scene_short: "Scene",
        tool_scene_title: "Scene background and lighting settings",

        tool_calib: "Offset Calibration",
        tool_calib_short: "Admin",
        tool_calib_title: "Administrative module offset calibration tool",

        tool_summary: "Summary & Specs",
        tool_summary_short: "Summary",
        tool_summary_title: "Bar equipment breakdown and specifications",

        tool_save_send: "Save & Request Quote",
        tool_save_send_short: "Quote",
        tool_save_send_title: "Save this layout and submit inquiry form",

        tool_save_layout: "Save Layout",
        tool_save_layout_short: "Save",
        tool_save_layout_title: "Save current layout and graphics to JSON file",

        tool_load_layout: "Load Layout",
        tool_load_layout_short: "Load",
        tool_load_layout_title: "Load layout from JSON file",

        tool_help: "User Guide",
        tool_help_short: "Help",
        tool_help_title: "3D Configurator user guide and shortcuts",

        tool_clear: "Clear Scene",
        tool_clear_short: "Clear",
        tool_clear_title: "Clear the entire scene",

        // Bottom Controls HUD
        hud_add_label: "Add:",
        hud_bar_straight: "Straight Bar",
        hud_bar_straight_short: "Straight",
        hud_bar_straight_title: "Add straight bar module",

        hud_bar_corner: "Corner",
        hud_bar_corner_short: "Corner",
        hud_bar_corner_title: "Add 90° corner (automatic snap)",

        hud_back_shelf: "Back Shelf",
        hud_back_shelf_short: "Shelf",
        hud_back_shelf_title: "Add backbar storage shelf",

        hud_back_fridge: "2-Door Fridge",
        hud_back_fridge_short: "Fridge 2D",
        hud_back_fridge_title: "Add 2-door glass display fridge (1.0m)",

        hud_back_fridge_slim: "1-Door Fridge",
        hud_back_fridge_slim_short: "Fridge 1D",
        hud_back_fridge_slim_title: "Add 1-door glass display fridge (0.5m)",

        hud_view_orbit: "3D Orbit",
        hud_view_orbit_short: "3D",

        hud_view_top: "Top View",
        hud_view_top_short: "Top",

        hud_view_ortho: "Ortho View",
        hud_view_ortho_short: "Ortho",
        hud_view_ortho_title: "Axonometric angled view (Orthographic)",

        // Canvas Hint
        canvas_hint_desktop: "<strong>Right-click grid:</strong> insert new module under cursor<br><strong>Left-click module:</strong> select module & reveal golden snap sockets<br><strong>Click snap socket:</strong> attach next module with auto-fit",
        canvas_hint_touch: "<strong>Tap module:</strong> select & rotate &bull; <strong>Tap gold dot:</strong> attach module &bull; <strong>Long press grid:</strong> insert module",

        // Context Menu
        context_title_select: "Select Module",
        context_straight: "Straight bar module (1.5m)",
        context_corner: "90° Corner module",
        context_shelf: "Backbar shelf (1.5m)",
        context_fridge: "2-Door glass fridge (1.0m)",
        context_fridge_slim: "1-Door glass fridge (0.5m)",

        // Radial Menu
        radial_rotate: "Rotate",
        radial_rotate_title: "Rotate module 90° (Key R)",
        radial_move: "Move",
        radial_move_title: "Move this single module",
        radial_move_all: "Move<br>entire bar",
        radial_move_all_title: "Move entire bar with all connected objects",
        radial_delete: "Delete",
        radial_delete_title: "Delete this module (Key Del)",
        radial_delete_all: "Delete<br>entire bar",
        radial_delete_all_title: "Delete entire connected bar layout (Shift+Del)",

        // Presets Panel
        presets_title: "Ready Bar Layouts",
        preset_straight_name: "Straight Line (Long)",
        preset_straight_desc: "7.5m bar line (5 modules) + 3 shelves & 2 fridges",
        preset_l_shape_name: "L-Shape (Corner)",
        preset_l_shape_desc: "Corner setup (8 modules) + 3 shelves & 2 fridges",
        preset_horseshoe_name: "Horseshoe (U-Shape)",
        preset_horseshoe_desc: "U-shape (11 modules) + backbar island & coolers",
        preset_island_name: "360° Island",
        preset_island_desc: "Full perimeter (16 modules) + 4 central shelves",

        // Branding Panel
        branding_panel_title: "Bar Branding & Graphics",
        branding_sec1_title: "1. Front Artwork (Panorama)",
        branding_sec1_toggle_title: "Toggle front panorama artwork on or off",
        branding_sec1_desc: "Artwork stretches seamlessly across connected bar fronts and backbar shelves (behind racks).",
        branding_mode_chain: "Continuous ribbon (Full bar)",
        branding_mode_chain_title: "Artwork forms one continuous panorama across all modules in line",
        branding_mode_repeat: "Repeat per module",
        branding_mode_repeat_title: "Each module repeats the entire artwork",
        branding_span_bar_label: "Length on bar:",
        branding_span_shelf_label: "Length on shelves:",
        branding_catalog_label: "Choose a design from catalog:",
        branding_upload_custom: "Upload custom artwork",
        branding_upload_custom_hint: "JPG or PNG format",
        branding_reset_pano: "Reset to default front",

        // Panorama preset names
        pano_kwiaty2: "Botanical Flowers",
        pano_kwiaty3: "Exotic Flowers",
        pano_palmy: "Tropical Palms",
        pano_zloto: "Gold Elegance",
        pano_art_deco: "Art Deco Gold",
        pano_emerald_gold: "Emerald & Gold",
        pano_chevron_oak: "Oak Chevron",
        pano_alcohol_ink: "Liquid Navy",
        pano_calacatta: "Calacatta Marble",
        pano_seigaiha: "Japanese Wave",
        pano_baroque: "Dark Velvet",
        pano_cyberpunk: "Cyberpunk Neon",
        pano_rainforest: "Rainforest Wildlife",
        pano_circuit: "Cyber Circuit",
        pano_sage: "Sage Botanical",

        // Logo section
        branding_sec2_title: "2. Logo Overlay",
        branding_sec2_toggle_title: "Toggle logo overlay on or off",
        branding_sec2_desc: "Brand or sponsor logo displayed centrally on bar modules.",
        branding_logo_upload: "Upload logo file",
        branding_logo_upload_hint: "Transparent PNG, JPG or SVG",
        branding_logo_preview: "Uploaded logo preview:",
        branding_logo_apply: "Apply to fronts",
        branding_logo_remove: "Remove logo",
        branding_adjust_title: "Logo Sizing",
        branding_auto_aspect: "Auto Aspect",
        branding_auto_aspect_title: "Adjust size to match original image proportions",
        branding_scale_label: "Scale:",
        branding_lock_aspect: "Lock aspect ratio (AR)",
        branding_width_label: "Width:",
        branding_height_label: "Height:",
        branding_posy_label: "Vertical position:",

        // LED Panel
        led_panel_title: "LED Illumination",
        led_enable_label: "Enable LED",
        led_enable_desc: "Glow of neon strips and bar components",
        led_off_title: "When LED is turned off",
        led_off_invisible: "Invisible (Transparent)",
        led_off_invisible_title: "LED strip becomes completely invisible / transparent",
        led_off_black: "Black profile",
        led_off_black_title: "LED strip adopts matte black architectural profile",
        led_color_title: "LED Light Color",
        led_intensity_title: "Emission Intensity",
        led_intensity_label: "LED Brightness:",
        led_intensity_subtle: "Subtle (0.2)",
        led_intensity_std: "Standard (2.5)",
        led_intensity_vivid: "Vivid neon (8.0)",

        // Scene Panel
        scene_panel_title: "Scene Settings",
        scene_bg_title: "Scene Background Color",
        scene_light_intensity_title: "Lighting Intensity",
        scene_light_main: "Key light:",
        scene_light_ambient: "Ambient light:",
        scene_light_dir_title: "Light Direction & Angle",
        scene_light_azimuth: "Horizontal angle (Azimuth):",
        scene_light_elevation: "Light elevation:",
        scene_floor_title: "Floor Material",
        scene_floor_roughness: "Gloss / Roughness:",
        scene_floor_high_gloss: "High gloss",
        scene_floor_semi_matte: "Semi-matte",
        scene_floor_full_matte: "Full matte",
        scene_floor_metalness: "Reflection / Metalness:",

        // Summary Panel
        summary_panel_title: "Configuration Summary",
        summary_spec_title: "Equipment Specification",
        summary_straight: "Straight bar module (1.5m):",
        summary_corner: "90° Corner module:",
        summary_shelf: "Backbar shelf with racks:",
        summary_fridge: "2-Door glass fridge (1.0m):",
        summary_fridge_slim: "1-Door glass fridge (0.5m):",
        summary_total_length: "Total bar front length:",
        summary_btn_print: "Print / Export Specification",
        summary_btn_send: "Save and request quote",
        unit_pcs: "pcs.",

        // Help Modal
        help_modal_title: "ArtBar Configurator User Guide",
        help_modal_subtitle: "Master key features, keyboard shortcuts, and modular bar design techniques",
        help_card1_title: "Camera Controls & 3D Navigation",
        help_card1_item1: "<span class=\"help-kbd\">LMB</span> + drag – <strong>Orbit camera</strong> around the scene.",
        help_card1_item2: "<span class=\"help-kbd\">RMB</span> or <span class=\"help-kbd\">MMB</span> + drag – <strong>Pan view</strong>.",
        help_card1_item3: "<span class=\"help-kbd\">Mouse wheel</span> – <strong>Zoom in / out</strong>.",
        help_card1_item4: "<strong>Bottom view bar:</strong> Instant switching between <em>3D Orbit</em>, <em>Top View</em>, and <em>Ortho View</em>.",

        help_card2_title: "Inserting & Magnetic Snapping",
        help_card2_item1: "<strong>Bottom bar:</strong> Click module button (<em>Straight Bar</em>, <em>Corner</em>, <em>Shelf</em>, <em>Fridge</em>) to add to scene.",
        help_card2_item2: "<strong><span class=\"help-kbd\">RMB</span> Menu:</strong> Right-click on floor grid to spawn module under cursor.",
        help_card2_item3: "<strong>Golden snap sockets:</strong> When a module is selected, click any gold dot to attach a perfectly aligned module.",
        help_card2_item4: "<strong>Magnetic snapping:</strong> While moving, modules automatically snap and join into a seamless bar layout!",
        help_card2_item5: "<span class=\"help-kbd\">Shift</span> – <strong>Precision placement:</strong> Hold Shift while placing/moving – grid subdivisions quadruple, disabling auto-snap.",

        help_card3_title: "Editing, Rotating & Deleting",
        help_card3_item1: "<span class=\"help-kbd\">LMB</span> on module – Selects object and reveals radial action menu.",
        help_card3_item2: "<span class=\"help-kbd\">R</span> or <strong>Rotate</strong> button – Rotate module by 90°.",
        help_card3_item3: "<strong>Move</strong> button – Reposition selected single module.",
        help_card3_item4: "<strong>Move entire bar</strong> button – Repositions the complete connected bar assembly.",
        help_card3_item5: "<strong>✕ Delete</strong> (<span class=\"help-kbd\">Del</span>) – Remove the selected module.",
        help_card3_item6: "<strong>🗑 Delete entire bar</strong> (<span class=\"help-kbd\">Shift</span> + <span class=\"help-kbd\">Del</span>) – Remove entire connected bar layout.",

        help_card4_title: "Branding & Front Artwork",
        help_card4_item1: "Open <strong>Branding & Artwork</strong> from top toolbar.",
        help_card4_item2: "<strong>Front Panorama:</strong> Choose exclusive designs from catalog (e.g. Gold, Marble, Velvet) or upload custom JPG/PNG.",
        help_card4_item3: "<strong>Corner continuity:</strong> Artwork flows without interruption across straight and corner modules.",
        help_card4_item4: "<strong>Logo Overlay:</strong> Upload brand logo, adjust scale, width, and vertical positioning.",

        help_card5_title: "LED Lighting & Visual Effects",
        help_card5_item1: "Open <strong>LED Lighting</strong> settings.",
        help_card5_item2: "Toggle neon illumination on or off using the master switch.",
        help_card5_item3: "Select color from luxury palette (ArtBar Gold, Warm White, Neon Blue) or pick custom hex.",
        help_card5_item4: "Adjust <strong>LED Brightness</strong> – casts realistic floor light reflections.",
        help_card5_item5: "When LED is off: choose between transparent or sleek matte black profile.",

        help_card6_title: "Presets, Save & Export",
        help_card6_item1: "<strong>Ready Presets:</strong> Quick start with prebuilt setups (Straight, L-Shape, Horseshoe, 360° Island).",
        help_card6_item2: "<strong>Scene Settings:</strong> Background color, sun angle, and floor reflectivity (mirror to matte).",
        help_card6_item3: "<strong>Save / Load Layout:</strong> Export design to <code>.json</code> and reload anytime.",
        help_card6_item4: "<strong>Summary & Quote:</strong> Module count breakdown, total bar front length, and PDF/print spec.",

        help_dont_show: "Do not show automatically on startup",
        help_btn_start: "Start Designing &rarr;",

        // Quote & Save/Send Modal
        quote_modal_title: "Save & Request Bar Quote",
        quote_modal_subtitle: "Your 3D layout has been automatically saved and attached to your inquiry",
        quote_badge_attached: "Attached 3D Layout",
        quote_spec_length: "Front length:",
        quote_spec_modules: "Bar modules:",
        quote_spec_shelves: "Back shelves:",
        quote_spec_fridges: "Fridges:",
        quote_spec_branding: "Front artwork:",
        quote_spec_led: "LED lighting:",
        quote_btn_download_json: "Download file copy (.json)",

        quote_label_name: "Full Name / Contact Person *",
        quote_ph_name: "e.g. John Smith",
        quote_label_company: "Company Name / Event Organizer",
        quote_ph_company: "e.g. Event Agency / Festival",
        quote_label_email: "Email Address *",
        quote_ph_email: "your-email@domain.com",
        quote_label_phone: "Phone Number *",
        quote_ph_phone: "+44 20 1234 5678",
        quote_label_date: "Event Date",
        quote_label_location: "Event Location / City",
        quote_ph_location: "e.g. London / Warsaw / Outdoor venue",
        quote_label_notes: "Additional notes / questions",
        quote_ph_notes: "Let us know if you also require professional bartenders, catering licenses, craft ice, eco glassware, or ArtPOS systems...",
        quote_privacy: "By submitting, you send your 3D bar layout to ArtBar Solutions for a complimentary quote and technical consultation.",
        quote_btn_submit: "Submit Inquiry with Attached Layout",

        quote_success_title: "Thank You! Your inquiry has been received",
        quote_success_desc: "Your 3D bar layout and contact details have been safely recorded. An ArtBar Solutions specialist will reach out shortly.",
        quote_mailto_cta: "Open inquiry draft in your email client",
        quote_btn_return: "Return to configurator",

        // Dynamic strings & Toasts
        toast_models_loaded: "3D models and sample ArtBar layout loaded successfully.",
        toast_models_error: "Problem loading some 3D models. Please check console.",
        toast_module_removed: "Module removed.",
        toast_module_all_removed: "Removed entire bar layout ({count} pcs).",
        toast_module_placed: "Module placed.",
        toast_module_cancelled: "Module placement cancelled.",
        toast_module_snapped: "Module added with automatic magnetic snap.",
        toast_ghost_attached: "Module attached to cursor. Move close to snap socket. LMB - place, R - rotate, RMB/ESC - cancel.",
        toast_pick_straight: "Straight Bar selected. Left-click on floor grid to place. R - rotate, ESC - cancel.",
        toast_pick_corner: "90° Corner selected. Move close to bar socket to snap. R - rotate, ESC - cancel.",
        toast_pick_shelf: "Backbar Shelf selected. Left-click on floor grid to place. R - rotate, ESC - cancel.",
        toast_pick_fridge: "2-Door Fridge (1.0m) selected. Left-click on floor grid to place. R - rotate, ESC - cancel.",
        toast_pick_fridge_slim: "1-Door Fridge (0.5m) selected. Left-click on floor grid to place. R - rotate, ESC - cancel.",
        toast_rotated: "Module rotated 90°",
        toast_move_single: "Repositioning single module. Move near socket to snap, or place on grid. ESC/RMB - back.",
        toast_move_all: "Moving entire bar assembly ({count} pcs). R - rotate, LMB - place, ESC/RMB - back.",
        confirm_clear_scene: "Are you sure you want to clear the entire bar configuration?",
        toast_scene_cleared: "Scene cleared.",
        toast_layout_saved: "Layout saved to file: {filename}",
        toast_layout_save_error: "Error occurred while saving project.",
        toast_layout_loaded: "Bar layout and artwork loaded successfully!",
        alert_layout_load_failed: "Failed to load file. Please make sure it is a valid ArtBar (.json) configuration.",
        toast_preset_loaded: "Preset loaded: {name}",
        toast_pano_enabled: "Front panorama artwork enabled.",
        toast_pano_disabled: "Front panorama artwork disabled.",
        toast_pano_chain: "Artwork mode: Continuous ribbon (seamless across entire bar).",
        toast_pano_repeat: "Artwork mode: Repeat full graphic on each module.",
        toast_pano_applied: "Applied panorama artwork: {name}",
        toast_pano_custom_loaded: "Custom background graphic loaded and applied to bar fronts!",
        toast_pano_custom_error: "Failed to load graphic. Make sure the file is a valid JPG or PNG image.",
        toast_pano_reset: "Default bar front texture restored.",
        toast_logo_loaded: "Logo graphic uploaded and applied to bar fronts!",
        toast_logo_applied: "Logo applied to bar fronts.",
        toast_logo_removed: "Logo removed from bar fronts.",
        toast_quote_opened: "Bar layout saved. Complete the form to request a quote.",
        toast_quote_submitted: "Bar layout inquiry prepared successfully!",
        toast_quote_no_data: "No project data available to download.",
        toast_quote_downloaded: "Downloaded project file: {filename}",
        toast_quote_empty_hint: "Tip: Add bar modules to the scene to prepare an accurate quote.",

        // Format helpers
        bars_count: "{n} bars ({m} m)",
        bar_count_single: "1 bar (1.5 m)",
        shelves_count: "{n} shelves ({m} m)",
        shelf_count_single: "1 shelf (1.5 m)",
        modules_breakdown: "{total} pcs ({straight} straight + {corners} corners)",
        fridges_breakdown: "{total} pcs ({f2d} 2D + {f1d} 1D)",
        branding_default: "Standard ArtBar",
        branding_ai: "AI Generative Artwork",
        branding_custom: "Client Custom Artwork",
        date_today: "Today"
    }
};

let currentLang = 'pl';
const listeners = [];

export function getCurrentLang() {
    return currentLang;
}

export function onLanguageChange(fn) {
    if (typeof fn === 'function') listeners.push(fn);
}

export function t(key, params = {}) {
    const dict = TRANSLATIONS[currentLang] || TRANSLATIONS.pl;
    let str = dict[key] || TRANSLATIONS.pl[key] || key;
    if (params && typeof params === 'object') {
        for (const [k, v] of Object.entries(params)) {
            str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), v);
        }
    }
    return str;
}

export function formatBarSpan(span) {
    const m = (span * 1.5).toFixed(1);
    if (span === 1) return t('bar_count_single');
    return t('bars_count', { n: span, m });
}

export function formatShelfSpan(span) {
    const m = (span * 1.5).toFixed(1);
    if (span === 1) return t('shelf_count_single');
    return t('shelves_count', { n: span, m });
}

export function applyLanguage(lang) {
    if (lang !== 'pl' && lang !== 'en') lang = 'pl';
    currentLang = lang;
    try {
        localStorage.setItem('artbar_configurator_lang', lang);
    } catch (_) {}

    document.documentElement.lang = lang;
    document.title = t('page_title');

    // Update Language switcher buttons
    document.querySelectorAll('#config-lang-switch .lang-btn').forEach(btn => {
        if (btn.dataset.lang === lang) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Translate all elements with data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (key) {
            el.innerHTML = t(key);
        }
    });

    // Translate titles
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
        const key = el.getAttribute('data-i18n-title');
        if (key) {
            el.setAttribute('title', t(key));
        }
    });

    // Translate short labels (used for responsive button texts)
    document.querySelectorAll('[data-i18n-short]').forEach(el => {
        const key = el.getAttribute('data-i18n-short');
        if (key) {
            el.dataset.short = t(key);
        }
    });

    // Translate placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (key) {
            el.setAttribute('placeholder', t(key));
        }
    });

    // Notify listeners
    listeners.forEach(fn => {
        try { fn(lang); } catch (e) { console.error('Error in i18n listener:', e); }
    });
}

export function initI18n() {
    // 1. Check URL search param (?lang=en / ?lang=pl) or hash (#lang=en)
    const urlParams = new URLSearchParams(window.location.search);
    let lang = urlParams.get('lang');
    if (!lang && window.location.hash.includes('lang=')) {
        const match = window.location.hash.match(/lang=([a-z]{2})/i);
        if (match) lang = match[1].toLowerCase();
    }

    // 2. Check localStorage
    if (!lang) {
        try {
            lang = localStorage.getItem('artbar_configurator_lang') || localStorage.getItem('artbar_lang');
        } catch (_) {}
    }

    // 3. Fallback to 'pl'
    if (lang !== 'pl' && lang !== 'en') {
        lang = 'pl';
    }

    // Bind click events on switcher buttons
    document.querySelectorAll('#config-lang-switch .lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const targetLang = btn.dataset.lang;
            if (targetLang && targetLang !== currentLang) {
                applyLanguage(targetLang);
            }
        });
    });

    // Listen for postMessage from parent iframe
    window.addEventListener('message', (ev) => {
        if (ev.data && ev.data.type === 'ARTBAR_SET_LANG') {
            const requestedLang = ev.data.lang;
            if (requestedLang && (requestedLang === 'pl' || requestedLang === 'en')) {
                applyLanguage(requestedLang);
            }
        }
    });

    applyLanguage(lang);
    return lang;
}

export function getTranslatedMailto({ name, company, email, phone, date, location, notes, stats, brandingDesc, ledColor }) {
    const isEn = currentLang === 'en';
    const mailSubject = isEn
        ? encodeURIComponent(`Bar Quote Request - 3D Configurator: ${name}${company ? ' (' + company + ')' : ''}`)
        : encodeURIComponent(`Zapytanie Ofertowe - Konfigurator Baru 3D: ${name}${company ? ' (' + company + ')' : ''}`);

    const mailBody = isEn
        ? encodeURIComponent(
`Dear ArtBar Solutions Team,

I am submitting a quote inquiry for a 3D bar layout created in the online configurator.

CONTACT INFORMATION:
- Full Name: ${name}
- Company / Organizer: ${company || 'Not provided'}
- Email: ${email}
- Phone: ${phone}
- Event Date: ${date || 'To be determined'}
- Event Location: ${location || 'To be determined'}

CONFIGURED BAR SPECIFICATIONS:
- Total Front Length: ${stats.totalFrontMeters.toFixed(1)} m
- Total Bar Modules: ${stats.BAR_STRAIGHT + stats.BAR_CORNER} pcs (straight: ${stats.BAR_STRAIGHT}, corners: ${stats.BAR_CORNER})
- Backbar Storage Shelves: ${stats.BACK_SHELF} pcs
- Glass Display Fridges: ${stats.BACK_FRIDGE + stats.BACK_FRIDGE_SLIM} pcs (2D: ${stats.BACK_FRIDGE}, 1D: ${stats.BACK_FRIDGE_SLIM})
- Artwork / Branding: ${brandingDesc}
- LED Lighting: ${ledColor}

ADDITIONAL NOTES:
${notes || 'No additional notes.'}

---
Sent from ArtBar Solutions 3D Event Bar Configurator
https://artbar.com.pl`
        )
        : encodeURIComponent(
`Dzień dobry Zespole ArtBar Solutions,

Przesyłam zapytanie ofertowe dotyczące konfiguracji baru 3D przygotowanej w konfiguratorze.

DANE KONTAKTOWE:
- Imię i nazwisko: ${name}
- Firma / Organizator: ${company || 'Nie podano'}
- Adres e-mail: ${email}
- Telefon: ${phone}
- Termin wydarzenia: ${date || 'Do ustalenia'}
- Miejsce eventu: ${location || 'Do ustalenia'}

PARAMETRY SKONFIGUROWANEGO BARU:
- Łączna długość frontu: ${stats.totalFrontMeters.toFixed(1)} m
- Liczba modułów baru: ${stats.BAR_STRAIGHT + stats.BAR_CORNER} szt. (proste: ${stats.BAR_STRAIGHT}, narożniki: ${stats.BAR_CORNER})
- Regały zaplecza: ${stats.BACK_SHELF} szt.
- Lodówki gastronomiczne: ${stats.BACK_FRIDGE + stats.BACK_FRIDGE_SLIM} szt. (2D: ${stats.BACK_FRIDGE}, 1D: ${stats.BACK_FRIDGE_SLIM})
- Motyw graficzny / branding: ${brandingDesc}
- Podświetlenie LED: ${ledColor}

DODATKOWE UWAGI:
${notes || 'Brak dodatkowych uwag.'}

---
Wiadomość z Konfiguratora Barów 3D ArtBar Solutions
https://artbar.com.pl`
        );

    return `mailto:eventy@artbar.com.pl?subject=${mailSubject}&body=${mailBody}`;
}
