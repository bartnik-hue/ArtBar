import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { FridgeGenerator } from './FridgeGenerator.js';

/**
 * Rejestr i zarządca modeli 3D oraz punktów połączeniowych (Snap Sockets).
 * Obsługuje centrowanie pivotu w środku mebli oraz podział na Narożnik Prawy i Narożnik Lewy (odbicie lustrzane).
 */
export class ModelRegistry {
    constructor() {
        this.loader = new GLTFLoader();
        this.templates = new Map();
        
        // Domyślne wartości kalibracji z milimetrową dokładnością
        this.defaultCalibration = {
            barStraight: {
                width: 1.500,
                offsetX: 0.000,
                offsetY: 0.000,
                offsetZ: 0.000,
                rotY: 0
            },
            barCornerRight: {
                width: 0.950,
                offsetX: 0.000,
                offsetY: 0.000,
                offsetZ: 0.000,
                rotY: 0
            },
            barCornerLeft: {
                width: 0.950,
                offsetX: 0.000,
                offsetY: 0.000,
                offsetZ: 0.000,
                rotY: 0
            },
            barCornerRightOut: {
                width: 1.500,
                offsetX: 0.000,
                offsetY: 0.000,
                offsetZ: 0.000,
                rotY: 0
            },
            barCornerLeftOut: {
                width: 1.500,
                offsetX: 0.000,
                offsetY: 0.000,
                offsetZ: 0.000,
                rotY: 0
            },
            regal: {
                width: 1.500,
                offsetX: 0.000,
                offsetY: 0.000,
                offsetZ: 0.000,
                rotY: 0
            },
            fridge: {
                width: 1.000,
                offsetX: 0.000,
                offsetY: 0.000,
                offsetZ: 0.000,
                rotY: 0
            },
            fridgeSlim: {
                width: 0.500,
                offsetX: 0.000,
                offsetY: 0.000,
                offsetZ: 0.000,
                rotY: 0
            },
            logoBarStraight: {
                width: 1.200,
                height: 0.450,
                offsetX: 0.000,
                offsetY: 0.550,
                offsetZ: 0.225,
                rotY: 0
            },
            logoCornerRight: {
                width: 0.700,
                height: 0.450,
                offsetX: 0.150,
                offsetY: 0.550,
                offsetZ: 0.150,
                rotY: 45
            },
            logoCornerLeft: {
                width: 0.700,
                height: 0.450,
                offsetX: -0.150,
                offsetY: 0.550,
                offsetZ: 0.150,
                rotY: -45
            }
        };

        this.placeholderLogoTexture = null;
        this.activeLogoTexture = null;
        this.isLogoEnabled = false;
        this.loadPlaceholderTexture();

        this.calibration = this.loadCalibration();
    }

    loadPlaceholderTexture() {
        const texLoader = new THREE.TextureLoader();
        texLoader.load(
            'wzor/dlugi alpha0001.png',
            (tex) => {
                tex.colorSpace = THREE.SRGBColorSpace;
                this.placeholderLogoTexture = tex;
                if (!this.activeLogoTexture) {
                    this.updateAllLogoPlanes(tex);
                }
            },
            undefined,
            () => {
                // Folder wzor nie istnieje w repozytorium - brak domyślnego logo (użytkownik wgrywa własne)
                this.placeholderLogoTexture = null;
            }
        );
    }

    loadCalibration() {
        try {
            localStorage.removeItem('artbar_calibration_v9');
            localStorage.removeItem('artbar_calibration_v8');
        } catch (e) {}
        const saved = localStorage.getItem('artbar_calibration_v10');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                return { ...this.defaultCalibration, ...parsed };
            } catch (e) {
                console.warn('Błąd odczytu zapisanej kalibracji, użyto domyślnej:', e);
            }
        }
        return JSON.parse(JSON.stringify(this.defaultCalibration));
    }

    saveCalibration() {
        localStorage.setItem('artbar_calibration_v10', JSON.stringify(this.calibration));
    }

    resetCalibration() {
        this.calibration = JSON.parse(JSON.stringify(this.defaultCalibration));
        this.saveCalibration();
    }

    async loadAllModels(onProgress) {
        const modelsToLoad = [
            { key: 'BAR_STRAIGHT', url: 'MODELE/BarModel.glb?v=6',     label: 'Moduł prosty baru' },
            { key: 'RAW_CORNER',   url: 'MODELE/rog.glb?v=6',          label: 'Narożnik' },
            { key: 'BACK_SHELF',   url: 'MODELE/regal.glb?v=6',        label: 'Regał zaplecza' }
        ];

        let loadedCount = 0;
        const total = modelsToLoad.length + 2; // +1 dla lustrzanego rogu, +1 dla lodówki

        for (const m of modelsToLoad) {
            try {
                const gltf = await this.loadGLB(m.url);
                const scene = gltf.scene;
                this.setupShadowsAndMaterials(scene, m.key);

                if (m.key === 'RAW_CORNER') {
                    // 1. Narożnik Prawy (idealnie symetryczny miter 45° i równe ramiona modularne)
                    const cornerRight = this.createCornerRightWrapper(scene);
                    this.templates.set('BAR_CORNER_RIGHT', cornerRight);
                    this.templates.set('BAR_CORNER', cornerRight); // alias wsteczny

                    // 2. Narożnik Lewy (dokładne odbicie lustrzane narożnika prawego w osi X)
                    const mirroredLeft = this.createMirroredCorner(cornerRight);
                    this.templates.set('BAR_CORNER_LEFT', mirroredLeft);
                    loadedCount += 2;
                } else if (m.key === 'BAR_STRAIGHT') {
                    // 3. Moduł prosty baru ze skalibrowanym profilem styku
                    const barStraight = this.createBarStraightWrapper(scene);
                    this.templates.set('BAR_STRAIGHT', barStraight);
                    loadedCount++;
                } else if (m.key === 'BACK_SHELF') {
                    // 4. Regał zaplecza z panelem grafiki za półkami
                    const shelf = this.createShelfWrapper(scene);
                    this.templates.set('BACK_SHELF', shelf);
                    loadedCount++;
                } else {
                    // Inne moduły
                    const centered = this.createCenteredWrapper(scene);
                    this.templates.set(m.key, centered);
                    loadedCount++;
                }

                if (onProgress) onProgress(loadedCount / total, `Wczytano ${m.label}`);
            } catch (err) {
                console.error(`Błąd wczytywania modelu ${m.key} z ${m.url}:`, err);
            }
        }

        // 5. Wygeneruj modele lodówek (dwudrzwiowa 1.0m oraz jednodrzwiowa Slim 0.5m)
        const fridgeRaw = FridgeGenerator.createFridgeModel();
        const fridgeCentered = this.createCenteredWrapper(fridgeRaw);
        this.templates.set('BACK_FRIDGE', fridgeCentered);

        const fridgeSlimRaw = FridgeGenerator.createSingleFridgeModel();
        const fridgeSlimCentered = this.createCenteredWrapper(fridgeSlimRaw);
        this.templates.set('BACK_FRIDGE_SLIM', fridgeSlimCentered);

        loadedCount += 2;
        if (onProgress) onProgress(1.0, 'Wszystkie modele gotowe');
    }

    loadGLB(url) {
        return new Promise((resolve, reject) => {
            this.loader.load(url, resolve, undefined, reject);
        });
    }

    /**
     * Zamyka model baru prostego w kontenerze wycentrowanym w X, podstawa Y=0, i Z dopasowane do płaszczyzny styku narożnika.
     * Dodaje dedykowany, czysty panel frontowy (BarFrontPanel) typu PlaneGeometry, eliminując artefakty Z-fighting ze starych plansz Blenderowych.
     */
    createBarStraightWrapper(rootObject) {
        // 1. Całkowicie usuń stare plansze Blenderowe (PLANSZA.001, PLANSZA.004 / BarArt.001, BarArt.104)
        const toRemove = [];
        rootObject.traverse(child => {
            const rawName = (child.name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
            if (rawName.includes('plansza') || rawName.includes('barart001') || rawName.includes('barart104')) {
                toRemove.push(child);
            }
        });
        toRemove.forEach(c => {
            if (c.parent) c.parent.remove(c);
            if (c.geometry) c.geometry.dispose();
        });

        // 2. Dodaj dedykowany panel frontowy PlaneGeometry dla baru prostego (szer. 1.50m, wys. 1.091m)
        // Środek Y = 0.6425m (zakres Y od 0.097m do 1.188m), Z = 0.3501m (tuż przed lico szafki Z=0.350m).
        // FrontSide zapewnia, że front jest idealnie widoczny od zewnątrz, a od środka baru (strona barmana) jest niewidoczny (brak przebijania).
        const frontMat = new THREE.MeshStandardMaterial({
            name: 'front',
            color: new THREE.Color('#141414'),
            roughness: 0.5,
            metalness: 0.05,
            emissive: new THREE.Color(0x000000),
            emissiveIntensity: 0.0,
            side: THREE.FrontSide,
            polygonOffset: true,
            polygonOffsetFactor: -2,
            polygonOffsetUnits: -4
        });

        // Panel frontowy baru prostego o szerokości 1.506m (zapewnia 3mm zakładki na każdym styku z modułami sąsiednimi/narożnikami),
        // wycentrowany idealnie w osi X (0.000m) zamiast przesunięcia +7mm.
        // Z = 0.3502m (tuż przed lico szafki, idealnie licowane z narożnikami).
        const barFrontPanel = new THREE.Mesh(new THREE.PlaneGeometry(1.506, 1.091), frontMat);
        barFrontPanel.name = 'BarFrontPanel';
        barFrontPanel.userData.isFrontPanel = true;
        barFrontPanel.userData.isLedMesh = false;
        barFrontPanel.receiveShadow = false;
        barFrontPanel.castShadow = false;
        barFrontPanel.position.set(0.000, 0.6425, 0.3502);
        rootObject.add(barFrontPanel);

        // 3. Dodaj tylną ściankę dla strony barmana (BarBackPanel).
        // Eliminuje problem przezroczystości od strony barmana:
        // - Od frontu (gość): widoczny jest BarFrontPanel z grafiką/brandingiem.
        // - Od tyłu (barman): widoczny jest BarBackPanel jako pełna, czarna, matowa ścianka korpusu mebla.
        // Obrót rotY = Math.PI sprawia, że lico ścianki wskazuje dokładnie do wnętrza mebla (-Z w stronę barmana).
        const backMat = new THREE.MeshStandardMaterial({
            name: 'interior_back',
            color: new THREE.Color('#141414'),
            roughness: 0.5,
            metalness: 0.05,
            side: THREE.FrontSide
        });

        const barBackPanel = new THREE.Mesh(new THREE.PlaneGeometry(1.500, 1.091), backMat);
        barBackPanel.name = 'BarBackPanel';
        barBackPanel.userData.isFrontPanel = false; // Nigdy nie otrzymuje tekstury brandingu
        barBackPanel.userData.isLedMesh = false;
        barBackPanel.receiveShadow = true;
        barBackPanel.castShadow = true;
        barBackPanel.rotation.y = Math.PI; // Lico skierowane do wnętrza szafki / w stronę barmana
        barBackPanel.position.set(0.000, 0.6425, 0.3498); // 0.4mm za frontem (Z=0.3502)
        rootObject.add(barBackPanel);

        rootObject.position.set(0, 0, 0);
        rootObject.rotation.set(0, 0, 0);
        rootObject.scale.set(1, 1, 1);
        rootObject.updateMatrixWorld(true);

        const box = new THREE.Box3().setFromObject(rootObject);

        const wrapper = new THREE.Group();
        wrapper.name = 'CenteredBarStraightWrapper';

        // X jest wycentrowany w pliku GLB (-0.75m do +0.75m), Y spoczywa na podłodze, Z zoptymalizowany pod styk (-0.145m)
        rootObject.position.set(0, -box.min.y, -0.145);
        wrapper.add(rootObject);

        return wrapper;
    }

    /**
     * Tworzy idealnie symetryczny narożnik prawy (skalowanie miteru 45° i równe ramiona modularne)
     */
    createCornerRightWrapper(rootObject) {
        rootObject.position.set(0, 0, 0);
        rootObject.rotation.set(0, 0, 0);
        rootObject.scale.set(1, 1, 1);
        rootObject.updateMatrixWorld(true);

        const box = new THREE.Box3().setFromObject(rootObject);

        const wrapper = new THREE.Group();
        wrapper.name = 'CenteredCornerRightWrapper';

        // Wyrównanie symetrii ramion rogu (skala w osi X względem wewnętrznego narożnika X=0.7500)
        // Współczynnik skali: (0.555825 - (-0.330000)) / (1.665277 - 0.750020) = 0.967842
        const scaleX = 0.967842;
        const scaleNode = new THREE.Group();
        scaleNode.name = 'SymmetrizedCornerNode';

        rootObject.position.set(-0.7500, 0, 0);
        scaleNode.scale.set(scaleX, 1, 1);
        scaleNode.add(rootObject);
        scaleNode.position.set(0.7500, 0, 0);

        // Umieszczenie w kontenerze: wejście na X = -0.475 (-halfW), wyjście na Z = -0.475 (-halfW), podstawa Y=0
        const container = new THREE.Group();
        container.position.set(-1.225, -box.min.y, -0.145);
        container.add(scaleNode);

        wrapper.add(container);
        return wrapper;
    }

    /**
     * Zamyka model w kontenerze, gdzie punkt (0, 0, 0) znajduje się dokładnie w środku geometrycznym mebla na podłodze (Y=0)
     */
    createCenteredWrapper(rootObject) {
        rootObject.position.set(0, 0, 0);
        rootObject.rotation.set(0, 0, 0);
        rootObject.scale.set(1, 1, 1);
        rootObject.updateMatrixWorld(true);

        const box = new THREE.Box3().setFromObject(rootObject);
        const center = new THREE.Vector3();
        box.getCenter(center);

        const wrapper = new THREE.Group();
        wrapper.name = 'CenteredModelWrapper';

        // Przesuń zawartość tak, by geometryczny środek X i Z leżał w (0, 0), a podstawa w Y=0
        rootObject.position.set(-center.x, -box.min.y, -center.z);
        wrapper.add(rootObject);

        return wrapper;
    }

    /**
     * Zamyka model regału zaplecza w wycentrowanym kontenerze oraz dodaje
     * dedykowany panel dekoracyjny frontu grafiki umieszczony za półkami regału.
     */
    createShelfWrapper(rootObject) {
        // Stwórz czysty, dedykowany materiał dla frontu regału (BEZ żadnej emisji LED, aby grafika była idealnie czysta i nasycona)
        const shelfFrontMat = new THREE.MeshStandardMaterial({
            name: 'front',
            color: new THREE.Color('#141414'), // Domyślnie czarne tworzywo (jak reszta regału gdy branding jest wyłączony)
            roughness: 0.5,
            metalness: 0.05,
            emissive: new THREE.Color(0x000000), // Całkowicie wyłączona emisja światła
            emissiveIntensity: 0.0,
            side: THREE.FrontSide,
            polygonOffset: true,
            polygonOffsetFactor: -2,
            polygonOffsetUnits: -4
        });

        // Wymiary panelu za półkami: szerokość 1.50m (pełna szerokość modułu),
        // wysokość 1.36m (od powierzchni blatu na Y=0.90 do szczytu regału na Y=2.26).
        // W nieprzesuniętym modelu regal.glb:
        // Środek Y = (0.90 + 2.26) / 2 = 1.58m
        // Tylna ścianka BarArt.111 leży na Z = -0.085m, więc lico panelu umieszczamy na Z = -0.083m (2mm z przodu)
        const geom = new THREE.PlaneGeometry(1.50, 1.36);
        const shelfPanel = new THREE.Mesh(geom, shelfFrontMat);
        shelfPanel.name = 'ShelfFrontPanel';
        shelfPanel.userData.isFrontPanel = true;
        shelfPanel.userData.isShelfPanel = true;
        shelfPanel.userData.isLedMesh = false; // Zapobiega zaklasyfikowaniu panelu jako elementu świecącego LED
        shelfPanel.receiveShadow = false;
        shelfPanel.castShadow = false;
        shelfPanel.position.set(0, 1.58, -0.083);

        rootObject.add(shelfPanel);

        return this.createCenteredWrapper(rootObject);
    }

    /**
     * Tworzy czyste lustrzane odbicie wycentrowanego narożnika w osi X
     */
    createMirroredCorner(centeredRight) {
        const mirroredWrapper = new THREE.Group();
        mirroredWrapper.name = 'CenteredMirroredCorner';

        const clone = centeredRight.clone(true);
        // Odbicie w osi X względem środka bryły (który jest dokładnie w 0, 0, 0)
        clone.scale.x = -1;
        mirroredWrapper.add(clone);

        mirroredWrapper.traverse(child => {
            if (child.isMesh) {
                if (child.material) {
                    const isFront = child.userData.isCornerFront || child.userData.isFrontPanel;
                    if (Array.isArray(child.material)) {
                        child.material = child.material.map(m => {
                            const cloned = m.clone();
                            cloned.side = isFront ? THREE.FrontSide : THREE.DoubleSide;
                            cloned.shadowSide = isFront ? THREE.FrontSide : THREE.DoubleSide;
                            return cloned;
                        });
                    } else {
                        child.material = child.material.clone();
                        child.material.side = isFront ? THREE.FrontSide : THREE.DoubleSide;
                        child.material.shadowSide = isFront ? THREE.FrontSide : THREE.DoubleSide;
                    }
                }
                if (this.isBrandingTarget(child)) {
                    child.userData.isBrandingFront = true;
                }
            }
        });

        return mirroredWrapper;
    }

    /**
     * Zastąpiono dedykowanymi nakładkami (LogoPlane).
     * Wyłączono nadpisywanie materiałów samego modelu GLB, aby grafika nie przenikała na tył mebla.
     */
    isBrandingTarget(child) {
        return false;
    }

    normalizeFrontUVs(geometry) {
        if (!geometry || !geometry.attributes.position || !geometry.attributes.uv) return;
        const pos = geometry.attributes.position;
        const uv = geometry.attributes.uv;

        let minX = Infinity, maxX = -Infinity;
        let minY = Infinity, maxY = -Infinity;
        for (let i = 0; i < pos.count; i++) {
            const x = pos.getX(i);
            const y = pos.getY(i);
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
        }

        const spanX = maxX - minX || 1;
        const spanY = maxY - minY || 1;

        for (let i = 0; i < pos.count; i++) {
            const u = (pos.getX(i) - minX) / spanX;
            const v = (pos.getY(i) - minY) / spanY;
            uv.setXY(i, u, v);
        }
        uv.needsUpdate = true;
    }

    /**
     * Odwraca nawinięcie trójkątów i wektory normalne lica frontu narożnika (rog.glb).
     * W oryginalnym pliku Blender trójkąty lica były nawinięte do wnętrza szafki (w stronę barmana).
     * Po odwróceniu lico wskazuje dokładnie w stronę gości (+Z i +X), a przy side: THREE.FrontSide
     * jest automatycznie odcinane (culling) od strony wnętrza baru, całkowicie eliminując
     * przenikanie grafiki brandingu na stanowisko barmana.
     * Odwraca wyłącznie indeksy lica frontowego (max 36 indeksów / 12 trójkątów dla nowej siatki lub 24 dla legacy).
     */
    fixCornerFrontWinding(geometry) {
        if (!geometry || !geometry.index) return;
        const indices = geometry.index.array;
        const count = (geometry.index.count === 747) ? 24 : Math.min(geometry.index.count, 36);
        const start = (geometry.index.count === 747) ? 717 : 0;

        // Zamień miejscami wierzchołek 1 i 2 w każdym trójkącie frontu, odwracając kolejność nawijania (CW <-> CCW)
        for (let i = start; i < start + count; i += 3) {
            const tmp = indices[i + 1];
            indices[i + 1] = indices[i + 2];
            indices[i + 2] = tmp;
        }
        geometry.index.needsUpdate = true;

        // Odwróć wektory normalne wyłącznie dla wierzchołków lica frontowego, aby wskazywały na zewnątrz bryły
        if (geometry.attributes.normal) {
            const normals = geometry.attributes.normal;
            const visited = new Set();
            for (let i = start; i < start + count; i++) {
                const idx = indices[i];
                if (!visited.has(idx)) {
                    visited.add(idx);
                    normals.setXYZ(idx, -normals.getX(idx), -normals.getY(idx), -normals.getZ(idx));
                }
            }
            normals.needsUpdate = true;
        }
    }

    /**
     * Rozwija i normalizuje współrzędne UV frontu narożnika (dwa skrzydła pod kątem 90°)
     * wzdłuż pełnego obwodu lica (u od 0.0 na wejściu do 1.0 na wyjściu złącza).
     * Uwzględnia wyskalowanie symetrii skrzydła X (scaleX = 0.967842).
     */
    normalizeCornerFrontUVs(geometry) {
        if (!geometry || !geometry.attributes.position || !geometry.attributes.uv || !geometry.index) return;
        const pos = geometry.attributes.position;
        const uv = geometry.attributes.uv;
        const indices = geometry.index.array;

        // Wymiary narożnika w pliku rog.glb po wyskalowaniu symetrii ramion (scaleX = 0.967842):
        // Skrzydło 1: od wejścia X = -0.3302 do rogu X = 0.3822 (długość fizyczna 0.7124 * 0.967842 = 0.6895m)
        // Skrzydło 2: od rogu Z = 0.3400 do wyjścia Z = -0.3300 (długość fizyczna 0.6700m)
        const entranceX = -0.3302;
        const cornerX = 0.3822;
        const cornerZ = 0.3400;
        const exitZ = -0.3300;
        const scaleX = 0.967842;

        const L1 = (cornerX - entranceX) * scaleX; // 0.6895m
        const L2 = cornerZ - exitZ;                 // 0.6700m
        const totalL = L1 + L2;                     // 1.3595m

        const minY = 0.09708;
        const maxY = 1.20000;
        const spanY = maxY - minY;

        // Dla siatki legacy (747 indeksów) przednie lico to 24 indeksy (717 do 741).
        // Dla nowej siatki z materiałem 'branding' lico frontu to 36 indeksów (12 trójkątów).
        const startIndex = (geometry.index.count === 747) ? 717 : 0;
        const endIndex = (geometry.index.count === 747) ? 741 : Math.min(geometry.index.count, 36);
        const visited = new Set();

        for (let i = startIndex; i < endIndex; i++) {
            const idx = indices[i];
            if (visited.has(idx)) continue;
            visited.add(idx);

            const px = pos.getX(idx);
            const py = pos.getY(idx);
            const pz = pos.getZ(idx);

            let distAlong = 0;
            if (pz >= 0.32) {
                distAlong = Math.max(0, Math.min(L1, (px - entranceX) * scaleX));
            } else {
                const distZ = cornerZ - pz;
                distAlong = L1 + Math.max(0, Math.min(L2, distZ));
            }

            // U biegnie zawsze płynnie od 0.0 na wejściu (gniazdo 'in') do 1.0 na wyjściu (gniazdo 'out')
            const u = distAlong / totalL;
            const v = Math.max(0, Math.min(1, (py - minY) / spanY));

            uv.setXY(idx, u, v);
        }
        uv.needsUpdate = true;
    }

    /**
     * Kalibruje geometrię i siatki narożnika (rog.glb):
     * 1. Wyodrębnia trójkąty wewnętrznej ścianki i skosu z siatki 'branding' do dedykowanej siatki 'BarCornerInnerWall'.
     *    W pliku rog.glb materiał 'branding' miał 42 indeksy (14 trójkątów), z czego ostatnie 6 indeksów (T12 i T13)
     *    to w rzeczywistości wewnętrzne ścianki korpusu mebla! Pozostawienie ich w siatce brandingu z materiałem FrontSide
     *    powodowało, że były one odcinane (backface culling) od strony barmana, tworząc dużą przezroczystą dziurę w ściance.
     * 2. Naprawia odwrócone wektory normalne oraz nawinięcie trójkątów wewnętrznej ścianki skrzydła 1 (w osi X)
     *    w korpusie mebla (BarArt002: trójkąty 187, 188, 189, 265, 266, 268), tak aby wskazywały do wnętrza baru (-Z).
     */
    setupCornerMeshes(root) {
        let bodyMesh = null;
        let brandingMesh = null;

        root.traverse(child => {
            if (child.isMesh) {
                const mats = Array.isArray(child.material) ? child.material : [child.material];
                const hasBranding = mats.some(m => m && (m.name || '').toLowerCase().includes('branding'));
                if (hasBranding) {
                    brandingMesh = child;
                } else if ((child.name || '').toLowerCase().includes('barart') || (child.name || '').toLowerCase().includes('002')) {
                    bodyMesh = child;
                }
            }
        });

        if (brandingMesh && brandingMesh.geometry && brandingMesh.geometry.index && brandingMesh.geometry.index.count === 42) {
            const brandGeom = brandingMesh.geometry;
            const brandIndices = brandGeom.index.array;
            const bPos = brandGeom.attributes.position;
            const bNorm = brandGeom.attributes.normal;
            const bUv = brandGeom.attributes.uv;

            const innerIndices = brandIndices.slice(36, 42); // [9, 25, 24, 15, 12, 0]
            const innerPosArr = [];
            const innerNormArr = [];
            const innerUvArr = [];

            for (let i = 0; i < innerIndices.length; i++) {
                const vIdx = innerIndices[i];
                innerPosArr.push(bPos.getX(vIdx), bPos.getY(vIdx), bPos.getZ(vIdx));
                innerNormArr.push(bNorm.getX(vIdx), bNorm.getY(vIdx), bNorm.getZ(vIdx));
                innerUvArr.push(bUv.getX(vIdx), bUv.getY(vIdx));
            }

            const innerGeom = new THREE.BufferGeometry();
            innerGeom.setAttribute('position', new THREE.Float32BufferAttribute(innerPosArr, 3));
            innerGeom.setAttribute('normal', new THREE.Float32BufferAttribute(innerNormArr, 3));
            innerGeom.setAttribute('uv', new THREE.Float32BufferAttribute(innerUvArr, 2));
            innerGeom.setIndex([0, 1, 2, 3, 4, 5]);

            const innerMat = new THREE.MeshStandardMaterial({
                name: 'corner_interior',
                color: new THREE.Color('#141414'),
                roughness: 0.5,
                metalness: 0.05,
                side: THREE.DoubleSide,
                shadowSide: THREE.DoubleSide
            });

            const innerMesh = new THREE.Mesh(innerGeom, innerMat);
            innerMesh.name = 'BarCornerInnerWall';
            innerMesh.userData.isFrontPanel = false;
            innerMesh.userData.isCornerFront = false;
            innerMesh.userData.isLedMesh = false;
            innerMesh.castShadow = true;
            innerMesh.receiveShadow = true;

            if (brandingMesh.parent) {
                brandingMesh.parent.add(innerMesh);
            } else {
                root.add(innerMesh);
            }

            brandGeom.setIndex(new THREE.BufferAttribute(brandIndices.slice(0, 36), 1));
            brandGeom.index.needsUpdate = true;
        }

        if (bodyMesh && bodyMesh.geometry && bodyMesh.geometry.index) {
            const bodyGeom = bodyMesh.geometry;
            const bodyIndices = bodyGeom.index.array;
            const bodyPos = bodyGeom.attributes.position;
            const bodyNorm = bodyGeom.attributes.normal;
            const bodyUv = bodyGeom.attributes.uv;

            const wing1Triangles = [187, 188, 189, 265, 266, 268];
            const modifiedVerts = new Set();

            wing1Triangles.forEach(t => {
                const base = t * 3;
                if (base + 2 < bodyIndices.length) {
                    const tmp = bodyIndices[base + 1];
                    bodyIndices[base + 1] = bodyIndices[base + 2];
                    bodyIndices[base + 2] = tmp;

                    [bodyIndices[base], bodyIndices[base + 1], bodyIndices[base + 2]].forEach(vIdx => {
                        if (!modifiedVerts.has(vIdx)) {
                            modifiedVerts.add(vIdx);
                            bodyNorm.setXYZ(vIdx, -bodyNorm.getX(vIdx), -bodyNorm.getY(vIdx), -bodyNorm.getZ(vIdx));
                            const px = bodyPos.getX(vIdx);
                            const py = bodyPos.getY(vIdx);
                            const u = (px - (-0.330)) / (0.328 - (-0.330));
                            const v = (py - 0.097) / (1.201 - 0.097);
                            bodyUv.setXY(vIdx, Math.max(0, Math.min(1, u)), Math.max(0, Math.min(1, v)));
                        }
                    });
                }
            });
            bodyGeom.index.needsUpdate = true;
            bodyNorm.needsUpdate = true;
            bodyUv.needsUpdate = true;
        }
    }

    setupShadowsAndMaterials(root, modelKey) {
        // 1. Całkowicie usuń zduplikowaną w Blenderze planszę PLANSZA.001 (BarArt.001) oraz stare plansze z pliku BarModel.glb.
        // Three.js GLTFLoader usuwa kropki z nazw obiektów (np. 'PLANSZA.001' -> 'PLANSZA001'), dlatego oczyszczamy znaki nieliterowe.
        const duplicatesToRemove = [];
        root.traverse(child => {
            const rawName = (child.name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
            if (rawName.includes('plansza') || rawName.includes('barart001') || rawName.includes('barart104')) {
                duplicatesToRemove.push(child);
            }
        });
        duplicatesToRemove.forEach(c => {
            if (c.parent) c.parent.remove(c);
            if (c.geometry) c.geometry.dispose();
        });

        // 2. Napraw siatki narożnika (wyodrębnienie wewnętrznej ścianki z siatki brandingu, naprawa normalnych ścianki skrzydła 1)
        if (modelKey === 'RAW_CORNER') {
            this.setupCornerMeshes(root);
        }

        root.traverse(child => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;

                // Oznacz siatki z materiałem 'front', 'branding', planszę baru prostego lub lico narożnika dla tła panoramicznego
                const mats = Array.isArray(child.material) ? child.material : [child.material];
                const hasFrontMat = mats.some(m => m && (m.name === 'front' || (m.name || '').toLowerCase().includes('front')));
                const hasBrandingMat = mats.some(m => m && (m.name || '').toLowerCase().includes('branding'));

                const isLegacyCornerMesh = (child.geometry && child.geometry.index && child.geometry.index.count === 747);

                if (hasBrandingMat) {
                    child.userData.isFrontPanel = true;
                    child.userData.isCornerFront = true;
                    child.receiveShadow = false;
                    child.castShadow = false;

                    // Materiał frontu narożnika o IDENTYCZNYCH właściwościach fizycznych jak BarFrontPanel (brak normalMap, roughness 0.5, metalness 0.05)
                    const cornerFrontMat = new THREE.MeshStandardMaterial({
                        name: 'front',
                        color: new THREE.Color('#141414'),
                        roughness: 0.5,
                        metalness: 0.05,
                        emissive: new THREE.Color(0x000000),
                        emissiveIntensity: 0.0,
                        side: THREE.FrontSide,
                        polygonOffset: true,
                        polygonOffsetFactor: -2,
                        polygonOffsetUnits: -4
                    });
                    child.material = cornerFrontMat;
                    // Odwróć nawinięcie trójkątów i wektory normalne lica narożnika z pliku rog.glb,
                    // aby lico wskazywało na zewnątrz mebla (w stronę gości),
                    // a od strony barmana było automatycznie odcinane (culling).
                    this.fixCornerFrontWinding(child.geometry);
                    this.normalizeCornerFrontUVs(child.geometry);
                } else if (hasFrontMat) {
                    child.userData.isFrontPanel = true;
                    child.receiveShadow = false;
                    child.castShadow = false;
                    const cleanFrontMat = new THREE.MeshStandardMaterial({
                        name: 'front',
                        color: new THREE.Color('#141414'),
                        roughness: 0.5,
                        metalness: 0.05,
                        emissive: new THREE.Color(0x000000),
                        emissiveIntensity: 0.0,
                        side: THREE.FrontSide,
                        polygonOffset: true,
                        polygonOffsetFactor: -2,
                        polygonOffsetUnits: -4
                    });
                    child.material = cleanFrontMat;
                    this.normalizeFrontUVs(child.geometry);
                } else if (isLegacyCornerMesh) {
                    child.userData.isFrontPanel = true;
                    child.userData.isCornerFront = true;
                    child.receiveShadow = false;
                    child.castShadow = false;
                    const origMat = mats[0];
                    const frontMat = new THREE.MeshStandardMaterial({
                        name: 'front',
                        color: new THREE.Color('#141414'),
                        roughness: 0.5,
                        metalness: 0.05,
                        emissive: new THREE.Color(0x000000),
                        emissiveIntensity: 0.0,
                        side: THREE.FrontSide,
                        polygonOffset: true,
                        polygonOffsetFactor: -2,
                        polygonOffsetUnits: -4
                    });
                    origMat.name = 'frame';
                    origMat.side = THREE.DoubleSide;

                    // W siatce BarArt.002 z 747 indeksami (249 trójkątów):
                    // - Indeksy 0..717: korpus, blat i półki narożnika -> materiał 'frame'
                    // - Indeksy 717..741 (24 indeksy / 8 trójkątów): ZEWNĘTRZNE lico narożnika -> materiał 'front'
                    // - Indeksy 741..747 (6 indeksów / 2 trójkąty): WEWNĘTRZNA ścianka narożnika -> materiał 'frame' (brak grafiki wewnątrz)
                    child.geometry.clearGroups();
                    child.geometry.addGroup(0, 717, 0);  // Grupa 0: korpus i blat -> 'frame'
                    child.geometry.addGroup(717, 24, 1); // Grupa 1: zewnętrzne lico -> 'front'
                    child.geometry.addGroup(741, 6, 0);  // Grupa 2: wewnętrzna ścianka -> 'frame'
                    child.material = [origMat, frontMat];
                    this.fixCornerFrontWinding(child.geometry);
                    this.normalizeCornerFrontUVs(child.geometry);
                }

                if (child.userData.isFrontPanel) {
                    child.receiveShadow = false;
                    child.castShadow = false;
                }

                // Oznacz siatki frontowe dla brandingu
                if (this.isBrandingTarget(child)) {
                    child.userData.isBrandingFront = true;
                }

                // Oznacz siatki z materiałem 'led' dla podświetlenia LED
                const hasLedMat = mats.some(m => m && (m.name || '').toLowerCase().includes('led'));
                if (hasLedMat) {
                    child.userData.isLedMesh = true;
                    mats.forEach(m => {
                        if (m && (m.name || '').toLowerCase().includes('led')) {
                            m.emissive = new THREE.Color('#FACB7D');
                            m.emissiveIntensity = 2.5;
                            m.color = new THREE.Color('#FACB7D');
                            m.roughness = 0.2;
                            m.metalness = 0.0;
                        }
                    });
                }

                if (child.material) {
                    const allMats = Array.isArray(child.material) ? child.material : [child.material];
                    allMats.forEach(m => {
                        // Korpus mebli i ramy otrzymują DoubleSide (brak dziur i przezroczystości od środka),
                        // natomiast panele frontowe z brandingiem pozostają FrontSide (brak przenikania grafiki do szafek barmana)
                        if (!child.userData.isFrontPanel && !child.userData.isCornerFront) {
                            m.side = THREE.DoubleSide;
                            m.shadowSide = THREE.DoubleSide;
                        }
                        if (m.map) {
                            m.map.anisotropy = 8;
                        }
                    });
                }
            }
        });
    }

    /**
     * Zwraca sklonowaną instancję wybranego modelu ze strukturą pivotu i kalibracji
     */
    instantiate(modelKey) {
        // Mapuj alias 'BAR_CORNER' na 'BAR_CORNER_RIGHT'
        const effectiveKey = (modelKey === 'BAR_CORNER') ? 'BAR_CORNER_RIGHT' : modelKey;
        const template = this.templates.get(effectiveKey);
        if (!template) {
            console.error(`Brak szablonu dla modelu: ${effectiveKey}`);
            return null;
        }

        const clone = template.clone(true);

        // Klonuj materiały instancji, aby moduły mogły mieć unikalne mapowanie UV panoramy
        clone.traverse(child => {
            if (child.isMesh && child.material) {
                child.material = Array.isArray(child.material)
                    ? child.material.map(m => m.clone())
                    : child.material.clone();
            }
        });

        // Główny wrapper modułu w scenie
        const wrapper = new THREE.Group();
        wrapper.name = `Module_${effectiveKey}`;
        wrapper.userData.modelKey = effectiveKey;
        wrapper.userData.isBarModule = true;

        // Węzeł pivotu (odpowiada za kalibracyjny offset i obrót wokół własnego środka)
        const pivotNode = new THREE.Group();
        pivotNode.name = 'PivotCalibrationNode';
        pivotNode.add(clone);

        // Zaaplikuj offsety kalibracyjne
        this.applyCalibrationToInstance(pivotNode, effectiveKey);

        wrapper.add(pivotNode);

        // Dodaj dedykowany plane na logo wyłącznie dla baru prostego (BAR_STRAIGHT)
        if (effectiveKey === 'BAR_STRAIGHT') {
            const logoPlane = this.createLogoPlane(effectiveKey);
            if (logoPlane) {
                wrapper.add(logoPlane);
            }
        }

        return wrapper;
    }

    getLogoCalibrationKey(modelKey) {
        if (modelKey === 'BAR_STRAIGHT') return 'logoBarStraight';
        return null;
    }

    createLogoPlane(modelKey) {
        const calKey = this.getLogoCalibrationKey(modelKey);
        if (!calKey) return null;

        const cal = this.calibration[calKey] || {};
        const width = cal.width || 1.20;
        const height = cal.height || 0.45;

        const geom = new THREE.PlaneGeometry(width, height);
        const mat = new THREE.MeshBasicMaterial({
            map: this.activeLogoTexture || this.placeholderLogoTexture || null,
            transparent: true,
            opacity: 0.99,
            depthWrite: false,
            polygonOffset: true,
            polygonOffsetFactor: -2,
            polygonOffsetUnits: -2,
            side: THREE.FrontSide
        });

        const mesh = new THREE.Mesh(geom, mat);
        mesh.name = 'LogoPlane';
        mesh.userData.isLogoPlane = true;
        mesh.userData.logoKey = calKey;
        mesh.position.set(cal.offsetX || 0, cal.offsetY !== undefined ? cal.offsetY : 0.55, cal.offsetZ !== undefined ? cal.offsetZ : 0.225);
        mesh.rotation.y = (cal.rotY || 0) * (Math.PI / 180);
        mesh.visible = this.isLogoEnabled === true;

        return mesh;
    }

    updateAllLogoPlanes(texture) {
        if (window.app?.barBuilder?.modules) {
            window.app.barBuilder.modules.forEach(m => {
                const plane = m.mesh.getObjectByName('LogoPlane');
                if (plane && plane.material) {
                    plane.material.map = texture;
                    plane.material.needsUpdate = true;
                }
            });
        }
    }

    applyCalibrationToInstance(pivotNode, modelKey) {
        const cal = this.getCalibrationFor(modelKey);
        if (!cal) return;

        pivotNode.position.set(cal.offsetX || 0, cal.offsetY || 0, cal.offsetZ || 0);
        pivotNode.rotation.y = (cal.rotY || 0) * (Math.PI / 180);
    }

    getCalibrationFor(modelKey) {
        switch (modelKey) {
            case 'BAR_STRAIGHT':        return this.calibration.barStraight;
            case 'BAR_CORNER_RIGHT':
            case 'BAR_CORNER':          return this.calibration.barCornerRight;
            case 'BAR_CORNER_LEFT':     return this.calibration.barCornerLeft;
            case 'barCornerRightOut':   return this.calibration.barCornerRightOut;
            case 'barCornerLeftOut':    return this.calibration.barCornerLeftOut;
            case 'BACK_SHELF':          
            case 'regal':               return this.calibration.regal;
            case 'BACK_FRIDGE':         
            case 'fridge':              return this.calibration.fridge;
            case 'BACK_FRIDGE_SLIM':
            case 'fridgeSlim':          return this.calibration.fridgeSlim || { width: 0.500, offsetX: 0, offsetY: 0, offsetZ: 0, rotY: 0 };
            case 'logoBarStraight':     return this.calibration.logoBarStraight;
            case 'logoCornerRight':     return this.calibration.logoCornerRight;
            case 'logoCornerLeft':      return this.calibration.logoCornerLeft;
            default: return null;
        }
    }

    /**
     * Zwraca definicję punktów połączeń (gniazd) dla danego typu modułu
     */
    getSocketDefinitions(modelKey) {
        const effectiveKey = (modelKey === 'BAR_CORNER') ? 'BAR_CORNER_RIGHT' : modelKey;
        const cal = this.getCalibrationFor(effectiveKey) || {};
        const width = cal.width || 1.50;
        const halfW = width / 2;

        switch (effectiveKey) {
            case 'BAR_STRAIGHT':
                return [
                    {
                        id: 'left',
                        label: 'Lewa strona (prosto lub róg w lewo)',
                        position: new THREE.Vector3(-halfW, 0.5, 0),
                        direction: new THREE.Vector3(-1, 0, 0),
                        compatible: ['BAR_STRAIGHT', 'BAR_CORNER_LEFT', 'BAR_CORNER']
                    },
                    {
                        id: 'right',
                        label: 'Prawa strona (prosto lub róg w prawo)',
                        position: new THREE.Vector3(halfW, 0.5, 0),
                        direction: new THREE.Vector3(1, 0, 0),
                        compatible: ['BAR_STRAIGHT', 'BAR_CORNER_RIGHT', 'BAR_CORNER']
                    }
                ];

            case 'BAR_CORNER_RIGHT':
                // Narożnik prawy: wchodzi od lewej (-halfW), zakręca pod kątem 90° w głąb (wyjście na -halfW w osi Z)
                return [
                    {
                        id: 'in',
                        label: 'Wejście z lewej',
                        position: new THREE.Vector3(-halfW, 0.5, 0),
                        direction: new THREE.Vector3(-1, 0, 0),
                        compatible: ['BAR_STRAIGHT', 'BAR_CORNER']
                    },
                    {
                        id: 'out',
                        label: 'Wyjście zakrętu w prawo (90°)',
                        position: new THREE.Vector3(0, 0.5, -halfW),
                        direction: new THREE.Vector3(0, 0, -1),
                        compatible: ['BAR_STRAIGHT', 'BAR_CORNER_RIGHT', 'BAR_CORNER']
                    }
                ];

            case 'BAR_CORNER_LEFT':
                // Narożnik lewy: wchodzi od prawej (halfW), zakręca pod kątem 90° w głąb (wyjście na -halfW w osi Z)
                return [
                    {
                        id: 'in',
                        label: 'Wejście z prawej',
                        position: new THREE.Vector3(halfW, 0.5, 0),
                        direction: new THREE.Vector3(1, 0, 0),
                        compatible: ['BAR_STRAIGHT', 'BAR_CORNER']
                    },
                    {
                        id: 'out',
                        label: 'Wyjście zakrętu w lewo (90°)',
                        position: new THREE.Vector3(0, 0.5, -halfW),
                        direction: new THREE.Vector3(0, 0, -1),
                        compatible: ['BAR_STRAIGHT', 'BAR_CORNER_LEFT', 'BAR_CORNER']
                    }
                ];

            case 'BACK_SHELF':
            case 'BACK_FRIDGE':
            case 'BACK_FRIDGE_SLIM':
                return [
                    {
                        id: 'left',
                        label: 'Lewa strona',
                        position: new THREE.Vector3(-halfW, 0.9, 0),
                        direction: new THREE.Vector3(-1, 0, 0),
                        compatible: ['BACK_SHELF', 'BACK_FRIDGE', 'BACK_FRIDGE_SLIM']
                    },
                    {
                        id: 'right',
                        label: 'Prawa strona',
                        position: new THREE.Vector3(halfW, 0.9, 0),
                        direction: new THREE.Vector3(1, 0, 0),
                        compatible: ['BACK_SHELF', 'BACK_FRIDGE', 'BACK_FRIDGE_SLIM']
                    }
                ];

            default:
                return [];
        }
    }
}
