import * as THREE from 'three';

/**
 * Dostępne gotowe wzory grafik panoramicznych z folderu grafiki/
 */
export const PANORAMA_PRESETS = [
    { id: 'kwiaty2', name: 'Kwiaty Botaniczne', file: 'grafiki/kwiaty2.jpg', thumbTitle: 'Ciemna botanika florystyczna' },
    { id: 'kwiaty3', name: 'Kwiaty Egzotyczne', file: 'grafiki/kwiaty3.jpg', thumbTitle: 'Żywe egzotyczne kwiaty' },
    { id: 'palmy', name: 'Palmy Tropikalne', file: 'grafiki/palmy.jpg', thumbTitle: 'Liście palmowe i monstery' },
    { id: 'zloto', name: 'Złota Elegancja', file: 'grafiki/zloto.jpg', thumbTitle: 'Złocisty agat z płynnymi falami' },
    { id: 'art_deco_pano', name: 'Art Deco Gold', file: 'grafiki/art_deco_pano.jpg', thumbTitle: 'Luksusowa geometria Art Deco' },
    { id: 'emerald_gold_pano', name: 'Szmaragd & Złoto', file: 'grafiki/emerald_gold_pano.jpg', thumbTitle: 'Malachit z płynnym złotem kintsugi' },
    { id: 'chevron_oak_pano', name: 'Dąb Chevron', file: 'grafiki/chevron_oak_pano.jpg', thumbTitle: 'Wędzony dąb w jodełkę francuską' },
    { id: 'alcohol_ink_blue_pano', name: 'Płynny Granat', file: 'grafiki/alcohol_ink_blue_pano.jpg', thumbTitle: 'Tusz alkoholowy i mosiądz' },
    { id: 'calacatta_gold_pano', name: 'Marmur Calacatta', file: 'grafiki/calacatta_gold_pano.jpg', thumbTitle: 'Biały marmur ze złotą żyłą' },
    { id: 'seigaiha_wave_pano', name: 'Japońska Fala', file: 'grafiki/seigaiha_wave_pano.jpg', thumbTitle: 'Fale Seigaiha na graficie' },
    { id: 'baroque_damask_pano', name: 'Ciemny Welwet', file: 'grafiki/baroque_damask_pano.jpg', thumbTitle: 'Pałacowy żakard barokowy' },
    { id: 'cyberpunk_neon_pano', name: 'Cyberpunk Neon', file: 'grafiki/cyberpunk_neon_pano.jpg', thumbTitle: 'Futurystyczne obwody neonowe' },
    { id: 'modern_terrazzo_pano', name: 'Lastryko Terrazzo', file: 'grafiki/modern_terrazzo_pano.jpg', thumbTitle: 'Ciemne lastryko z miedzią i kwarcem' },
    { id: 'rainforest_animals_pano', name: 'Tropikalny Las', file: 'grafiki/rainforest_animals_pano.jpg', thumbTitle: 'Egzotyczny las deszczowy i zwierzęta' },
    { id: 'tech_circuit_blueprint_pano', name: 'Cyber Schemat', file: 'grafiki/tech_circuit_blueprint_pano.jpg', thumbTitle: 'Inżynieryjny schemat obwodów' },
    { id: 'carbon_fiber_hex_pano', name: 'Karbon & Heksagon', file: 'grafiki/carbon_fiber_hex_pano.jpg', thumbTitle: 'Splot karbonu i siatka tytanowa' },
    { id: 'royal_navy_monogram_pano', name: 'Królewski Granat', file: 'grafiki/royal_navy_monogram_pano.jpg', thumbTitle: 'Głęboki granat ze złotym monogramem' },
    { id: 'sage_botanical_linen_pano', name: 'Szałwia & Złoto', file: 'grafiki/sage_botanical_linen_pano.jpg', thumbTitle: 'Szałwiowa botanika i len' }
];

/**
 * Zarządca personalizacji grafiki, tła panoramicznego i brandingu frontów barowych.
 */
export class BrandingManager {
    constructor(barBuilder, registry = null) {
        this.barBuilder = barBuilder;
        this.registry = registry;
        this.textureLoader = new THREE.TextureLoader();

        // ==========================================
        // 1. TŁO PANORAMICZNE (materiał 'front')
        // ==========================================
        this.isBackgroundEnabled = false;
        this.currentBackgroundUrl = null;
        this.currentBackgroundTexture = null;
        this.activePresetId = null;
        this.backgroundMode = 'chain'; // 'chain' (ciągły pas o stałej długości) | 'repeat' (każdy moduł ma całą)
        this.backgroundSpanModules = 5; // Domyślna długość grafiki: 5 barów (7.5m)
        this.shelfSpanModules = 3;      // Domyślna długość grafiki na regałach: 3 regały (4.5m)
        this.defaultFrontTextures = new Map(); // id modułu -> domyślna tekstura plastiku

        // ==========================================
        // 2. LOGO / BRANDING NAKŁADKOWY (LogoPlane)
        // ==========================================
        this.isEnabled = false;
        this.currentTexture = null;
        this.currentDataUrl = null;

        const cal = registry?.calibration?.logoBarStraight || {};
        this.baseWidth = cal.width || 1.20;
        this.baseHeight = cal.height || 0.45;
        this.naturalAspect = this.baseWidth / this.baseHeight;
        this.scaleMultiplier = 1.0;
        this.offsetY = cal.offsetY !== undefined ? cal.offsetY : 0.55;
        this.lockAspect = true;

        this.onDimensionsChanged = null;
        this.onBackgroundChanged = null;

        // ==========================================
        // 3. KALIBRACJA ZGRANIA TEKSTURY (OFFSET / SKALA)
        // ==========================================
        this.textureTuning = this.getDefaultTextureTuning();
        this.loadTextureTuning();
    }

    // ==========================================
    // OBSŁUGA TŁA PANORAMICZNEGO (FRONT BARU)
    // ==========================================

    /**
     * Ustawia gotowy preset tła z katalogu grafiki/
     */
    setBackgroundPreset(presetId, onLoaded = null) {
        const preset = PANORAMA_PRESETS.find(p => p.id === presetId);
        if (!preset) return;

        this.activePresetId = presetId;
        this.currentBackgroundUrl = preset.file;
        this.loadBackgroundTexture(preset.file, (texture) => {
            this.isBackgroundEnabled = true;
            this.updateFrontPanoramas();
            this.notifyBackgroundChanged();
            if (onLoaded) onLoaded(preset.file);
        });
    }

    /**
     * Wczytuje własny plik graficzny jako tło frontów
     */
    loadBackgroundFromFile(file, onLoaded = null) {
        if (!file || !file.type.startsWith('image/')) {
            console.warn('Wybrany plik nie jest obrazem.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const dataUrl = e.target.result;
            this.activePresetId = null;
            this.currentBackgroundUrl = dataUrl;
            this.aiMetadata = null;
            this.loadBackgroundTexture(dataUrl, (texture) => {
                this.isBackgroundEnabled = true;
                this.updateFrontPanoramas();
                this.notifyBackgroundChanged();
                if (onLoaded) onLoaded(dataUrl);
            });
        };
        reader.readAsDataURL(file);
    }

    /**
     * Wczytuje wygenerowaną grafikę z generatora AI (Stable Diffusion)
     */
    applyAiTexture(dataUrl, metadata = null, onLoaded = null) {
        if (!dataUrl) return;
        this.activePresetId = null;
        this.currentBackgroundUrl = dataUrl;
        this.aiMetadata = metadata;
        this.loadBackgroundTexture(dataUrl, (texture) => {
            this.isBackgroundEnabled = true;
            this.updateFrontPanoramas();
            this.notifyBackgroundChanged();
            if (onLoaded) onLoaded(dataUrl);
        });
    }

    loadBackgroundTexture(url, onReady = null) {
        this.textureLoader.load(url, (texture) => {
            texture.colorSpace = THREE.SRGBColorSpace;
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.ClampToEdgeWrapping;
            texture.flipY = true;
            texture.anisotropy = 16;
            this.currentBackgroundTexture = texture;
            if (onReady) onReady(texture);
        });
    }

    setBackgroundSpan(modulesCount) {
        this.backgroundSpanModules = Math.max(1, Math.min(20, parseInt(modulesCount, 10) || 5));
        this.updateFrontPanoramas();
        this.notifyBackgroundChanged();
    }

    setShelfSpan(modulesCount) {
        this.shelfSpanModules = Math.max(1, Math.min(20, parseInt(modulesCount, 10) || 3));
        this.updateFrontPanoramas();
        this.notifyBackgroundChanged();
    }

    setBackgroundEnabled(enabled) {
        this.isBackgroundEnabled = !!enabled;
        this.updateFrontPanoramas();
        this.notifyBackgroundChanged();
    }

    setBackgroundMode(mode) {
        if (mode === 'chain' || mode === 'repeat') {
            this.backgroundMode = mode;
            this.updateFrontPanoramas();
            this.notifyBackgroundChanged();
        }
    }

    resetBackgroundGraphic() {
        this.isBackgroundEnabled = false;
        this.currentBackgroundUrl = null;
        this.currentBackgroundTexture = null;
        this.activePresetId = null;
        this.aiMetadata = null;
        this.updateFrontPanoramas();
        this.notifyBackgroundChanged();
    }

    /**
     * Wykrywa ciągi modułów z frontem dekoracyjnym (bary proste i narożniki),
     * łącząc je wzdłuż fizycznych styków złączy w przestrzeni 3D
     */
    detectBarChains() {
        const frontModules = this.barBuilder.modules.filter(m => 
            m.modelKey === 'BAR_STRAIGHT' ||
            m.modelKey === 'BAR_CORNER_RIGHT' ||
            m.modelKey === 'BAR_CORNER_LEFT' ||
            m.modelKey === 'BAR_CORNER'
        );
        if (frontModules.length === 0) return [];

        const threshold = 0.28; // promień tolerancji styków złączy

        const getFrontInfo = (m) => {
            const rot = m.mesh.rotation.y;
            const pos = m.mesh.position;
            let frontLength = 1.50;
            let localIn = new THREE.Vector3(0, 0.5, 0);
            let localOut = new THREE.Vector3(0, 0.5, 0);

            if (m.modelKey === 'BAR_STRAIGHT') {
                frontLength = 1.50;
                localIn.set(-0.75, 0.5, 0);
                localOut.set(0.75, 0.5, 0);
            } else if (m.modelKey === 'BAR_CORNER_RIGHT' || m.modelKey === 'BAR_CORNER') {
                frontLength = 1.36;
                localIn.set(-0.475, 0.5, 0);
                localOut.set(0, 0.5, -0.475);
            } else if (m.modelKey === 'BAR_CORNER_LEFT') {
                frontLength = 1.36;
                localIn.set(0.475, 0.5, 0);
                localOut.set(0, 0.5, -0.475);
            }

            const worldIn = localIn.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), rot).add(pos);
            const worldOut = localOut.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), rot).add(pos);

            return {
                id: m.id,
                module: m,
                modelKey: m.modelKey,
                frontLength,
                worldIn,
                worldOut,
                connections: []
            };
        };

        const frontInfos = new Map();
        frontModules.forEach(m => {
            frontInfos.set(m.id, getFrontInfo(m));
        });

        // Wykryj wzajemne połączenia portów wejścia / wyjścia w przestrzeni świata
        const infoList = Array.from(frontInfos.values());
        for (let i = 0; i < infoList.length; i++) {
            for (let j = i + 1; j < infoList.length; j++) {
                const a = infoList[i];
                const b = infoList[j];

                const dOutIn = a.worldOut.distanceTo(b.worldIn);
                const dInOut = a.worldIn.distanceTo(b.worldOut);
                const dOutOut = a.worldOut.distanceTo(b.worldOut);
                const dInIn = a.worldIn.distanceTo(b.worldIn);

                if (dOutIn < threshold) {
                    a.connections.push({ otherId: b.id, myPort: 'out', otherPort: 'in' });
                    b.connections.push({ otherId: a.id, myPort: 'in', otherPort: 'out' });
                } else if (dInOut < threshold) {
                    a.connections.push({ otherId: b.id, myPort: 'in', otherPort: 'out' });
                    b.connections.push({ otherId: a.id, myPort: 'out', otherPort: 'in' });
                } else if (dOutOut < threshold) {
                    a.connections.push({ otherId: b.id, myPort: 'out', otherPort: 'out' });
                    b.connections.push({ otherId: a.id, myPort: 'out', otherPort: 'out' });
                } else if (dInIn < threshold) {
                    a.connections.push({ otherId: b.id, myPort: 'in', otherPort: 'in' });
                    b.connections.push({ otherId: a.id, myPort: 'in', otherPort: 'in' });
                }
            }
        }

        const visited = new Set();
        const chains = [];

        // 1. Rozpocznij od końców ciągów (moduły ze stopniem połączeń <= 1)
        const endpoints = infoList.filter(info => info.connections.length <= 1);
        endpoints.forEach(startInfo => {
            if (visited.has(startInfo.id)) return;

            const chain = [];
            let curr = startInfo;
            let prevId = null;
            let enterViaPort = (curr.connections.length === 1)
                ? (curr.connections[0].myPort === 'out' ? 'in' : 'out')
                : 'in';

            while (curr && !visited.has(curr.id)) {
                visited.add(curr.id);

                const isReversed = (enterViaPort === 'out');
                chain.push({
                    module: curr.module,
                    frontLength: curr.frontLength,
                    isReversed: isReversed
                });

                const exitPort = isReversed ? 'in' : 'out';
                const nextConn = curr.connections.find(c => c.otherId !== prevId && c.myPort === exitPort) ||
                                 curr.connections.find(c => c.otherId !== prevId);

                if (nextConn) {
                    prevId = curr.id;
                    enterViaPort = nextConn.otherPort;
                    curr = frontInfos.get(nextConn.otherId);
                } else {
                    curr = null;
                }
            }

            if (chain.length > 0) chains.push(chain);
        });

        // 2. Obsłuż pozostałe moduły (np. zapętlenia, wyspy lub zamknięte bary)
        infoList.forEach(info => {
            if (!visited.has(info.id)) {
                const chain = [];
                let curr = info;
                let prevId = null;
                let enterViaPort = 'in';

                while (curr && !visited.has(curr.id)) {
                    visited.add(curr.id);
                    const isReversed = (enterViaPort === 'out');
                    chain.push({
                        module: curr.module,
                        frontLength: curr.frontLength,
                        isReversed: isReversed
                    });

                    const exitPort = isReversed ? 'in' : 'out';
                    const nextConn = curr.connections.find(c => c.otherId !== prevId && c.myPort === exitPort) ||
                                     curr.connections.find(c => c.otherId !== prevId);

                    if (nextConn) {
                        prevId = curr.id;
                        enterViaPort = nextConn.otherPort;
                        curr = frontInfos.get(nextConn.otherId);
                    } else {
                        curr = null;
                    }
                }

                if (chain.length > 0) chains.push(chain);
            }
        });

        return chains;
    }

    /**
     * Wykrywa ciągi modułów regałów zaplecza (BACK_SHELF),
     * łącząc je wzdłuż fizycznych styków bocznych w przestrzeni 3D
     */
    detectShelfChains() {
        const shelfModules = this.barBuilder.modules.filter(m => m.modelKey === 'BACK_SHELF');
        if (shelfModules.length === 0) return [];

        const threshold = 0.28; // promień tolerancji styków złączy regałów

        const getShelfInfo = (m) => {
            const rot = m.mesh.rotation.y;
            const pos = m.mesh.position;
            const frontLength = 1.50; // szerokość modułu regału: 1.5m
            // W lokalnych współrzędnych regału: wejście to lewa strona (X = -0.75), wyjście to prawa strona (X = +0.75)
            const localIn = new THREE.Vector3(-0.75, 0.9, 0);
            const localOut = new THREE.Vector3(0.75, 0.9, 0);

            const worldIn = localIn.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), rot).add(pos);
            const worldOut = localOut.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), rot).add(pos);

            return {
                id: m.id,
                module: m,
                modelKey: m.modelKey,
                frontLength,
                worldIn,
                worldOut,
                connections: []
            };
        };

        const shelfInfos = new Map();
        shelfModules.forEach(m => {
            shelfInfos.set(m.id, getShelfInfo(m));
        });

        // Wykryj wzajemne połączenia portów lewego i prawego boku regałów
        const infoList = Array.from(shelfInfos.values());
        for (let i = 0; i < infoList.length; i++) {
            for (let j = i + 1; j < infoList.length; j++) {
                const a = infoList[i];
                const b = infoList[j];

                const dOutIn = a.worldOut.distanceTo(b.worldIn);
                const dInOut = a.worldIn.distanceTo(b.worldOut);
                const dOutOut = a.worldOut.distanceTo(b.worldOut);
                const dInIn = a.worldIn.distanceTo(b.worldIn);

                if (dOutIn < threshold) {
                    a.connections.push({ otherId: b.id, myPort: 'out', otherPort: 'in' });
                    b.connections.push({ otherId: a.id, myPort: 'in', otherPort: 'out' });
                } else if (dInOut < threshold) {
                    a.connections.push({ otherId: b.id, myPort: 'in', otherPort: 'out' });
                    b.connections.push({ otherId: a.id, myPort: 'out', otherPort: 'in' });
                } else if (dOutOut < threshold) {
                    a.connections.push({ otherId: b.id, myPort: 'out', otherPort: 'out' });
                    b.connections.push({ otherId: a.id, myPort: 'out', otherPort: 'out' });
                } else if (dInIn < threshold) {
                    a.connections.push({ otherId: b.id, myPort: 'in', otherPort: 'in' });
                    b.connections.push({ otherId: a.id, myPort: 'in', otherPort: 'in' });
                }
            }
        }

        const visited = new Set();
        const chains = [];

        // 1. Rozpocznij od końców ciągów (moduły ze stopniem połączeń <= 1),
        // preferując moduły z wolnym lewym portem 'in' (początek ciągu od lewej)
        const endpoints = infoList.filter(info => info.connections.length <= 1);
        endpoints.sort((a, b) => {
            const aOpenIn = (a.connections.length === 0 || a.connections[0].myPort === 'out') ? 1 : 0;
            const bOpenIn = (b.connections.length === 0 || b.connections[0].myPort === 'out') ? 1 : 0;
            return bOpenIn - aOpenIn;
        });

        endpoints.forEach(startInfo => {
            if (visited.has(startInfo.id)) return;

            const chain = [];
            let curr = startInfo;
            let prevId = null;
            let enterViaPort = (curr.connections.length === 1)
                ? (curr.connections[0].myPort === 'out' ? 'in' : 'out')
                : 'in';

            while (curr && !visited.has(curr.id)) {
                visited.add(curr.id);

                const isReversed = (enterViaPort === 'out');
                chain.push({
                    module: curr.module,
                    frontLength: curr.frontLength,
                    isReversed: isReversed
                });

                const exitPort = isReversed ? 'in' : 'out';
                const nextConn = curr.connections.find(c => c.otherId !== prevId && c.myPort === exitPort) ||
                                 curr.connections.find(c => c.otherId !== prevId);

                if (nextConn) {
                    prevId = curr.id;
                    enterViaPort = nextConn.otherPort;
                    curr = shelfInfos.get(nextConn.otherId);
                } else {
                    curr = null;
                }
            }

            if (chain.length > 0) chains.push(chain);
        });

        // 2. Obsłuż ewentualne pozostałe moduły
        infoList.forEach(info => {
            if (!visited.has(info.id)) {
                const chain = [];
                let curr = info;
                let prevId = null;
                let enterViaPort = 'in';

                while (curr && !visited.has(curr.id)) {
                    visited.add(curr.id);
                    const isReversed = (enterViaPort === 'out');
                    chain.push({
                        module: curr.module,
                        frontLength: curr.frontLength,
                        isReversed: isReversed
                    });

                    const exitPort = isReversed ? 'in' : 'out';
                    const nextConn = curr.connections.find(c => c.otherId !== prevId && c.myPort === exitPort) ||
                                     curr.connections.find(c => c.otherId !== prevId);

                    if (nextConn) {
                        prevId = curr.id;
                        enterViaPort = nextConn.otherPort;
                        curr = shelfInfos.get(nextConn.otherId);
                    } else {
                        curr = null;
                    }
                }

                if (chain.length > 0) chains.push(chain);
            }
        });

        return chains;
    }

    /**
     * Główna funkcja aplikująca teksturę panoramiczną na fronty barów, narożników
     * oraz fronty (plecy za półkami) regałów zaplecza z ciągłym, proporcjonalnym mapowaniem UV wzdłuż każdego ciągu
     */
    updateFrontPanoramas() {
        const barChains = this.detectBarChains();
        const shelfChains = this.detectShelfChains();
        const sharedTex = this.currentBackgroundTexture;
        const processedModuleIds = new Set();

        // 1. Zastosuj panoramę na fronty barów i narożników
        barChains.forEach(chain => {
            let accumMeters = 0;
            chain.forEach(item => {
                processedModuleIds.add(item.module.id);
                this.applyPanoramaToModule(
                    item.module,
                    sharedTex,
                    accumMeters,
                    item.frontLength,
                    item.isReversed
                );
                accumMeters += item.frontLength;
            });
        });

        // 2. Zastosuj panoramę na fronty (plecy za półkami) regałów zaplecza
        shelfChains.forEach(chain => {
            let accumMeters = 0;
            chain.forEach(item => {
                processedModuleIds.add(item.module.id);
                this.applyPanoramaToModule(
                    item.module,
                    sharedTex,
                    accumMeters,
                    item.frontLength,
                    item.isReversed
                );
                accumMeters += item.frontLength;
            });
        });

        // 3. Zresetuj moduły, które nie są częścią frontu baru ani regału (np. lodówki)
        this.barBuilder.modules.forEach(m => {
            if (!processedModuleIds.has(m.id)) {
                this.restoreDefaultFrontMaterial(m);
            }
        });
    }

    applyPanoramaToModule(moduleData, sharedTex, accumMeters = 0, frontLengthMeters = 1.50, isReversed = false) {
        if (!moduleData || !moduleData.mesh) return;

        moduleData.mesh.traverse(child => {
            if (child.isMesh && child.material) {
                const mats = Array.isArray(child.material) ? child.material : [child.material];
                mats.forEach(mat => {
                    const isFrontMat = mat && (
                        mat.name === 'front' ||
                        (mat.name && mat.name.toLowerCase().includes('branding')) ||
                        (!Array.isArray(child.material) && (child.userData.isFrontPanel || child.userData.isCornerFront))
                    );
                    if (isFrontMat) {
                        child.receiveShadow = false;
                        child.castShadow = false;
                        mat.side = THREE.FrontSide;
                        mat.polygonOffset = true;
                        mat.polygonOffsetFactor = -2;
                        mat.polygonOffsetUnits = -4;

                        // Zapisz oryginalną fabryczną teksturę i kolor
                        if (!this.defaultFrontTextures.has(moduleData.id)) {
                            this.defaultFrontTextures.set(moduleData.id, {
                                map: mat.map || null,
                                color: mat.color ? mat.color.clone() : new THREE.Color('#141414')
                            });
                        }

                        if (this.isBackgroundEnabled && sharedTex) {
                            // Pobierz parametry kalibracji (offset, skala, flip) dla tego typu modułu
                            const tuning = this.getTextureTuning(moduleData.modelKey);
                            const isShelf = (moduleData.modelKey === 'BACK_SHELF');
                            const span = isShelf ? (this.shelfSpanModules || 3) : (this.backgroundSpanModules || 5);
                            const spanMeters = span * 1.50; // np. 5 barów po 1.5m = 7.5m, 3 regały po 1.5m = 4.5m

                            // Wykorzystaj istniejący klon tekstury lub stwórz nowy jeśli trzeba
                            let texClone = mat.map;
                            if (!texClone || !texClone.isTexture || texClone.image !== sharedTex.image) {
                                texClone = sharedTex.clone();
                                texClone.wrapS = THREE.RepeatWrapping;
                                texClone.wrapT = THREE.ClampToEdgeWrapping;
                                texClone.anisotropy = 16;
                                mat.map = texClone;
                            }

                            const repeatFactor = (tuning.repeatU !== undefined && tuning.repeatU !== null) ? Number(tuning.repeatU) : 1.0;
                            const flip = !!tuning.flipU;
                            const offU = Number(tuning.offsetU) || 0.0;
                            const offV = Number(tuning.offsetV) || 0.0;

                            if (this.backgroundMode === 'chain') {
                                const fracWidth = (frontLengthMeters / spanMeters) * repeatFactor;
                                const shouldReverse = flip ? !isReversed : isReversed;

                                if (shouldReverse) {
                                    texClone.repeat.set(-fracWidth, 1);
                                    texClone.offset.set((((accumMeters + frontLengthMeters) / spanMeters) + offU) % 1.0, offV);
                                } else {
                                    texClone.repeat.set(fracWidth, 1);
                                    texClone.offset.set(((accumMeters / spanMeters) + offU) % 1.0, offV);
                                }
                            } else {
                                const repeatX = repeatFactor * (flip ? -1 : 1);
                                texClone.repeat.set(repeatX, 1);
                                texClone.offset.set(offU % 1.0, offV);
                            }
                            mat.color.set(0xffffff);
                            mat.roughness = 0.5;
                            mat.metalness = 0.05;
                            mat.normalMap = null;
                            mat.roughnessMap = null;
                            mat.metalnessMap = null;
                            if (mat.emissive) {
                                mat.emissive.set(0x000000);
                                mat.emissiveIntensity = 0.0;
                            }
                            mat.needsUpdate = true;
                        } else {
                            // Przywróć fabryczną teksturę i kolor
                            const def = this.defaultFrontTextures.get(moduleData.id);
                            mat.map = def ? (def.map || null) : null;
                            if (def && def.color) {
                                mat.color.copy(def.color);
                            } else {
                                mat.color.set('#141414');
                            }
                            mat.roughness = 0.5;
                            mat.metalness = 0.05;
                            mat.normalMap = null;
                            mat.roughnessMap = null;
                            mat.metalnessMap = null;
                            if (mat.emissive) {
                                mat.emissive.set(0x000000);
                                mat.emissiveIntensity = 0.0;
                            }
                            mat.needsUpdate = true;
                        }
                    }
                });
            }
        });
    }

    restoreDefaultFrontMaterial(moduleData) {
        if (!moduleData || !moduleData.mesh) return;
        moduleData.mesh.traverse(child => {
            if (child.isMesh && child.material) {
                const mats = Array.isArray(child.material) ? child.material : [child.material];
                mats.forEach(mat => {
                    const isFrontMat = mat && (
                        mat.name === 'front' ||
                        (mat.name && mat.name.toLowerCase().includes('branding')) ||
                        (!Array.isArray(child.material) && (child.userData.isFrontPanel || child.userData.isCornerFront))
                    );
                    if (isFrontMat) {
                        child.receiveShadow = false;
                        child.castShadow = false;
                        mat.side = THREE.FrontSide;
                        mat.polygonOffset = true;
                        mat.polygonOffsetFactor = -2;
                        mat.polygonOffsetUnits = -4;
                        const def = this.defaultFrontTextures.get(moduleData.id);
                        mat.map = def ? (def.map || null) : null;
                        if (def && def.color) {
                            mat.color.copy(def.color);
                        } else {
                            mat.color.set('#141414');
                        }
                        mat.roughness = 0.5;
                        mat.metalness = 0.05;
                        mat.normalMap = null;
                        mat.roughnessMap = null;
                        mat.metalnessMap = null;
                        if (mat.emissive) {
                            mat.emissive.set(0x000000);
                            mat.emissiveIntensity = 0.0;
                        }
                        mat.needsUpdate = true;
                    }
                });
            }
        });
    }

    // ==========================================
    // METODY KALIBRACJI TEKSTURY (OFFSET / SKALA)
    // ==========================================

    getDefaultTextureTuning() {
        return {
            BAR_CORNER_LEFT:  { offsetU: 0.0, repeatU: 1.0, flipU: false, offsetV: 0.0 },
            BAR_CORNER_RIGHT: { offsetU: 0.0, repeatU: 1.0, flipU: false, offsetV: 0.0 },
            BAR_STRAIGHT:     { offsetU: 0.0, repeatU: 1.0, flipU: false, offsetV: 0.0 },
            BACK_SHELF:       { offsetU: 0.0, repeatU: 1.0, flipU: false, offsetV: 0.0 }
        };
    }

    loadTextureTuning() {
        this.textureTuning = this.getDefaultTextureTuning();
        try {
            localStorage.removeItem('artbar_texture_tuning');
        } catch (e) {}
    }

    saveTextureTuning() {
        try {
            localStorage.setItem('artbar_texture_tuning', JSON.stringify(this.textureTuning));
        } catch (e) {
            console.warn('Nie udało się zapisać dostrajania tekstur:', e);
        }
    }

    getTextureTuning(modelKey) {
        const key = (modelKey === 'BAR_CORNER') ? 'BAR_CORNER_RIGHT' : modelKey;
        const def = { offsetU: 0.0, repeatU: 1.0, flipU: false, offsetV: 0.0 };
        return { ...def, ...(this.textureTuning[key] || {}) };
    }

    setTextureTuning(modelKey, params) {
        const key = (modelKey === 'BAR_CORNER') ? 'BAR_CORNER_RIGHT' : modelKey;
        if (!this.textureTuning[key]) {
            this.textureTuning[key] = { offsetU: 0.0, repeatU: 1.0, flipU: false, offsetV: 0.0 };
        }
        Object.assign(this.textureTuning[key], params);
        this.saveTextureTuning();
        this.updateFrontPanoramas();
        this.notifyBackgroundChanged();
    }

    resetTextureTuning(modelKey = null) {
        const defs = this.getDefaultTextureTuning();
        if (modelKey) {
            const key = (modelKey === 'BAR_CORNER') ? 'BAR_CORNER_RIGHT' : modelKey;
            this.textureTuning[key] = { ...defs[key] };
        } else {
            this.textureTuning = {
                BAR_CORNER_LEFT:  { ...defs.BAR_CORNER_LEFT },
                BAR_CORNER_RIGHT: { ...defs.BAR_CORNER_RIGHT },
                BAR_STRAIGHT:     { ...defs.BAR_STRAIGHT },
                BACK_SHELF:       { ...defs.BACK_SHELF }
            };
        }
        this.saveTextureTuning();
        this.updateFrontPanoramas();
        this.notifyBackgroundChanged();
    }

    notifyBackgroundChanged() {
        if (typeof this.onBackgroundChanged === 'function') {
            this.onBackgroundChanged({
                enabled: this.isBackgroundEnabled,
                url: this.currentBackgroundUrl,
                presetId: this.activePresetId,
                mode: this.backgroundMode,
                spanModules: this.backgroundSpanModules,
                shelfSpanModules: this.shelfSpanModules,
                textureTuning: this.textureTuning
            });
        }
    }

    // ==========================================
    // OBSŁUGA LOGO / BRANDING NAKŁADKOWY
    // ==========================================

    loadGraphicFromFile(file, onLoaded) {
        if (!file || !file.type.startsWith('image/')) {
            console.warn('Wybrany plik nie jest obrazem.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            this.loadGraphicFromDataUrl(e.target.result, onLoaded);
        };
        reader.readAsDataURL(file);
    }

    loadGraphicFromDataUrl(dataUrl, onLoaded) {
        if (!dataUrl) return;
        this.currentDataUrl = dataUrl;

        this.textureLoader.load(dataUrl, (texture) => {
            texture.colorSpace = THREE.SRGBColorSpace;
            texture.wrapS = THREE.ClampToEdgeWrapping;
            texture.wrapT = THREE.ClampToEdgeWrapping;
            texture.flipY = true;
            this.currentTexture = texture;
            if (this.registry) {
                this.registry.activeLogoTexture = texture;
            }

            // Oblicz naturalne proporcje wczytanego obrazu i dopasuj
            const img = texture.image;
            const imgW = img?.naturalWidth || img?.width || 1200;
            const imgH = img?.naturalHeight || img?.height || 450;
            if (imgW && imgH) {
                this.naturalAspect = imgW / imgH;
                this.autoFitAspect();
            }

            this.applyToAllFronts();
            this.notifyDimensionsChanged();
            if (onLoaded) onLoaded(dataUrl);
        });
    }

    autoFitAspect() {
        const maxW = 1.20;
        const maxH = 0.50;
        if (this.naturalAspect >= (maxW / maxH)) {
            this.baseWidth = maxW;
            this.baseHeight = maxW / this.naturalAspect;
        } else {
            this.baseHeight = maxH;
            this.baseWidth = maxH * this.naturalAspect;
        }
        this.baseWidth = Math.round(this.baseWidth * 1000) / 1000;
        this.baseHeight = Math.round(this.baseHeight * 1000) / 1000;
        this.scaleMultiplier = 1.0;
        this.updateLogoPlanes();
    }

    getEffectiveWidth() {
        return Math.round(this.baseWidth * this.scaleMultiplier * 1000) / 1000;
    }

    getEffectiveHeight() {
        return Math.round(this.baseHeight * this.scaleMultiplier * 1000) / 1000;
    }

    setScale(scalePercent) {
        this.scaleMultiplier = Math.max(0.1, scalePercent / 100);
        this.updateLogoPlanes();
        this.notifyDimensionsChanged();
    }

    setWidth(width) {
        const w = Math.max(0.15, Math.min(1.45, width));
        if (this.lockAspect && this.naturalAspect) {
            const h = Math.max(0.08, Math.min(0.75, w / this.naturalAspect));
            this.baseWidth = w / this.scaleMultiplier;
            this.baseHeight = h / this.scaleMultiplier;
        } else {
            this.baseWidth = w / this.scaleMultiplier;
        }
        this.updateLogoPlanes();
        this.notifyDimensionsChanged();
    }

    setHeight(height) {
        const h = Math.max(0.08, Math.min(0.75, height));
        if (this.lockAspect && this.naturalAspect) {
            const w = Math.max(0.15, Math.min(1.45, h * this.naturalAspect));
            this.baseWidth = w / this.scaleMultiplier;
            this.baseHeight = h / this.scaleMultiplier;
        } else {
            this.baseHeight = h / this.scaleMultiplier;
        }
        this.updateLogoPlanes();
        this.notifyDimensionsChanged();
    }

    setOffsetY(offsetY) {
        this.offsetY = Math.max(0.20, Math.min(0.85, offsetY));
        this.updateLogoPlanes();
        this.notifyDimensionsChanged();
    }

    setLockAspect(locked) {
        this.lockAspect = !!locked;
        if (this.lockAspect) {
            const effW = this.getEffectiveWidth();
            const effH = this.getEffectiveHeight();
            if (effH > 0) {
                this.naturalAspect = effW / effH;
            }
        }
    }

    resetAspect() {
        if (this.currentTexture?.image) {
            const img = this.currentTexture.image;
            const imgW = img.naturalWidth || img.width || 1200;
            const imgH = img.naturalHeight || img.height || 450;
            this.naturalAspect = imgW / imgH;
        } else {
            this.naturalAspect = 1.20 / 0.45;
        }
        this.autoFitAspect();
        this.notifyDimensionsChanged();
    }

    updateLogoPlanes() {
        const effectiveW = this.getEffectiveWidth();
        const effectiveH = this.getEffectiveHeight();

        if (this.registry?.calibration?.logoBarStraight) {
            this.registry.calibration.logoBarStraight.width = effectiveW;
            this.registry.calibration.logoBarStraight.height = effectiveH;
            this.registry.calibration.logoBarStraight.offsetY = this.offsetY;
            this.registry.saveCalibration();
        }

        this.barBuilder.modules.forEach(moduleData => {
            moduleData.mesh.traverse(child => {
                if (child.isMesh && child.userData.isLogoPlane) {
                    child.position.y = this.offsetY;
                    if (child.geometry) {
                        child.geometry.dispose();
                        child.geometry = new THREE.PlaneGeometry(effectiveW, effectiveH);
                    }
                }
            });
        });
    }

    notifyDimensionsChanged() {
        if (typeof this.onDimensionsChanged === 'function') {
            this.onDimensionsChanged({
                scale: Math.round(this.scaleMultiplier * 100),
                width: this.getEffectiveWidth(),
                height: this.getEffectiveHeight(),
                offsetY: Math.round(this.offsetY * 100) / 100,
                lockAspect: this.lockAspect
            });
        }
    }

    applyToAllFronts() {
        const tex = this.currentTexture || (this.registry?.placeholderLogoTexture);
        if (!tex) return;

        this.barBuilder.modules.forEach(moduleData => {
            this.applyToModule(moduleData, tex);
        });
    }

    setEnabled(enabled) {
        this.isEnabled = !!enabled;
        if (this.registry) {
            this.registry.isLogoEnabled = this.isEnabled;
        }
        this.barBuilder.modules.forEach(moduleData => {
            moduleData.mesh.traverse(child => {
                if (child.isMesh && child.userData.isLogoPlane) {
                    child.visible = this.isEnabled;
                }
            });
        });
    }

    applyToModule(moduleData, texture) {
        const tex = texture || this.currentTexture || (this.registry?.placeholderLogoTexture);
        if (!tex) return;

        const effectiveW = this.getEffectiveWidth();
        const effectiveH = this.getEffectiveHeight();

        moduleData.mesh.traverse(child => {
            if (child.isMesh && child.userData.isLogoPlane) {
                child.material.map = tex;
                child.material.needsUpdate = true;
                child.visible = this.isEnabled;
                child.position.y = this.offsetY;
                if (child.geometry) {
                    child.geometry.dispose();
                    child.geometry = new THREE.PlaneGeometry(effectiveW, effectiveH);
                }
            }
        });
    }

    getSettings() {
        return {
            background: {
                enabled: this.isBackgroundEnabled,
                url: this.currentBackgroundUrl,
                presetId: this.activePresetId,
                mode: this.backgroundMode,
                spanModules: this.backgroundSpanModules,
                shelfSpanModules: this.shelfSpanModules,
                aiMetadata: this.aiMetadata || null
            },
            textureTuning: this.textureTuning,
            logo: {
                baseWidth: this.baseWidth,
                baseHeight: this.baseHeight,
                scaleMultiplier: this.scaleMultiplier,
                offsetY: this.offsetY,
                lockAspect: this.lockAspect,
                naturalAspect: this.naturalAspect,
                enabled: this.isEnabled
            }
        };
    }

    applySettings(settings) {
        if (!settings) return;

        // Dostrojenie tekstur frontu (offsety/skale narożników)
        if (settings.textureTuning) {
            this.textureTuning = {
                ...this.getDefaultTextureTuning(),
                ...settings.textureTuning
            };
            this.saveTextureTuning();
        }

        // Tło panoramiczne
        if (settings.background) {
            const bg = settings.background;
            this.backgroundMode = bg.mode || 'chain';
            this.activePresetId = bg.presetId || null;
            if (bg.spanModules !== undefined) this.backgroundSpanModules = bg.spanModules;
            if (bg.shelfSpanModules !== undefined) this.shelfSpanModules = bg.shelfSpanModules;
            if (bg.aiMetadata) this.aiMetadata = bg.aiMetadata;
            if (bg.url) {
                this.currentBackgroundUrl = bg.url;
                this.loadBackgroundTexture(bg.url, (tex) => {
                    this.isBackgroundEnabled = !!bg.enabled;
                    this.updateFrontPanoramas();
                    this.notifyBackgroundChanged();
                });
            } else {
                this.resetBackgroundGraphic();
            }
        }

        // Logo
        const logo = settings.logo || settings; // kompatybilność ze starszą strukturą
        if (logo.baseWidth !== undefined) this.baseWidth = logo.baseWidth;
        if (logo.baseHeight !== undefined) this.baseHeight = logo.baseHeight;
        if (logo.scaleMultiplier !== undefined) this.scaleMultiplier = logo.scaleMultiplier;
        if (logo.offsetY !== undefined) this.offsetY = logo.offsetY;
        if (logo.lockAspect !== undefined) this.lockAspect = logo.lockAspect;
        if (logo.naturalAspect !== undefined) this.naturalAspect = logo.naturalAspect;
        if (logo.enabled !== undefined) this.setEnabled(logo.enabled);

        this.updateLogoPlanes();
        this.notifyDimensionsChanged();
    }

    resetBranding() {
        this.currentTexture = null;
        this.currentDataUrl = null;
        if (this.registry) {
            this.registry.activeLogoTexture = null;
        }

        const defaultTex = this.registry?.placeholderLogoTexture || null;
        this.baseWidth = 1.20;
        this.baseHeight = 0.45;
        this.naturalAspect = 1.20 / 0.45;
        this.scaleMultiplier = 1.0;
        this.offsetY = 0.55;
        this.updateLogoPlanes();
        this.notifyDimensionsChanged();

        this.barBuilder.modules.forEach(moduleData => {
            moduleData.mesh.traverse(child => {
                if (child.isMesh && child.userData.isLogoPlane) {
                    child.material.map = defaultTex;
                    child.material.needsUpdate = true;
                    child.visible = this.isEnabled;
                }
            });
        });
    }
}
