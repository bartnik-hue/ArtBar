import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { ModelRegistry } from '../../konfigurator/js/ModelRegistry.js?v=fixed_corners';

let activeInstance = null;

// Kolejność presetów w pętli automatycznej
const PRESET_KEYS = ['straight', 'l_shape', 'horseshoe', 'island'];

// Definicje 4 presetów układów barów z konfiguratora
export const PRESETS_CONFIG = {
  straight: {
    id: 'straight',
    name: 'Układ Prosty',
    subtitle: 'Linia 7.5m',
    modules: [
      { key: 'BAR_STRAIGHT', pos: [-2.25, 0, 0], rotY: 0 },
      { key: 'BAR_STRAIGHT', pos: [-0.75, 0, 0], rotY: 0 },
      { key: 'BAR_STRAIGHT', pos: [0.75, 0, 0], rotY: 0 },
      { key: 'BAR_STRAIGHT', pos: [2.25, 0, 0], rotY: 0 },
      { key: 'BAR_STRAIGHT', pos: [3.75, 0, 0], rotY: 0 },
      { key: 'BACK_SHELF',   pos: [-1.75, 0, -1.35], rotY: 0 },
      { key: 'BACK_FRIDGE',  pos: [-0.5, 0, -1.35], rotY: 0 },
      { key: 'BACK_SHELF',   pos: [0.75, 0, -1.35], rotY: 0 },
      { key: 'BACK_FRIDGE',  pos: [2.0, 0, -1.35], rotY: 0 },
      { key: 'BACK_SHELF',   pos: [3.25, 0, -1.35], rotY: 0 }
    ]
  },
  l_shape: {
    id: 'l_shape',
    name: 'Układ L',
    subtitle: 'Narożny',
    modules: [
      { key: 'BAR_STRAIGHT',     pos: [-3.75, 0, 0], rotY: 0 },
      { key: 'BAR_STRAIGHT',     pos: [-2.25, 0, 0], rotY: 0 },
      { key: 'BAR_STRAIGHT',     pos: [-0.75, 0, 0], rotY: 0 },
      { key: 'BAR_STRAIGHT',     pos: [0.75, 0, 0], rotY: 0 },
      { key: 'BAR_CORNER_RIGHT', pos: [1.975, 0, 0], rotY: 0 },
      { key: 'BAR_STRAIGHT',     pos: [1.975, 0, -1.225], rotY: 1.5708 },
      { key: 'BAR_STRAIGHT',     pos: [1.975, 0, -2.725], rotY: 1.5708 },
      { key: 'BAR_STRAIGHT',     pos: [1.975, 0, -4.225], rotY: 1.5708 },
      { key: 'BACK_FRIDGE',      pos: [-3.5, 0, -1.5], rotY: 0 },
      { key: 'BACK_SHELF',       pos: [-2.25, 0, -1.5], rotY: 0 },
      { key: 'BACK_SHELF',       pos: [-0.75, 0, -1.5], rotY: 0 },
      { key: 'BACK_SHELF',       pos: [0.4, 0, -2.6], rotY: 1.5708 },
      { key: 'BACK_FRIDGE',      pos: [0.4, 0, -3.85], rotY: 1.5708 }
    ]
  },
  horseshoe: {
    id: 'horseshoe',
    name: 'Podkowa',
    subtitle: 'Układ U',
    modules: [
      { key: 'BAR_STRAIGHT',     pos: [-1.5, 0, 0], rotY: 0 },
      { key: 'BAR_STRAIGHT',     pos: [0, 0, 0], rotY: 0 },
      { key: 'BAR_STRAIGHT',     pos: [1.5, 0, 0], rotY: 0 },
      { key: 'BAR_CORNER_LEFT',  pos: [-2.725, 0, 0], rotY: 0 },
      { key: 'BAR_CORNER_RIGHT', pos: [2.725, 0, 0], rotY: 0 },
      { key: 'BAR_STRAIGHT',     pos: [-2.725, 0, -1.225], rotY: -1.5708 },
      { key: 'BAR_STRAIGHT',     pos: [-2.725, 0, -2.725], rotY: -1.5708 },
      { key: 'BAR_CORNER_LEFT',  pos: [-2.725, 0, -3.95], rotY: -1.5708 },
      { key: 'BAR_STRAIGHT',     pos: [2.725, 0, -1.225], rotY: 1.5708 },
      { key: 'BAR_STRAIGHT',     pos: [2.725, 0, -2.725], rotY: 1.5708 },
      { key: 'BAR_CORNER_RIGHT', pos: [2.725, 0, -3.95], rotY: 1.5708 },
      { key: 'BACK_SHELF',       pos: [0, 0, -1.5], rotY: 0 },
      { key: 'BACK_SHELF',       pos: [-1.0625, 0, -2.5625], rotY: 4.7124 },
      { key: 'BACK_SHELF',       pos: [1.0625, 0, -2.625], rotY: 1.5708 },
      { key: 'BACK_FRIDGE_SLIM', pos: [-1.0625, 0, -3.5625], rotY: 4.7124 },
      { key: 'BACK_FRIDGE_SLIM', pos: [1.0625, 0, -3.625], rotY: 1.5708 }
    ]
  },
  island: {
    id: 'island',
    name: 'Wyspa 360°',
    subtitle: 'Centralna',
    modules: [
      { key: 'BAR_STRAIGHT',     pos: [-1.5, 0, 0], rotY: 0 },
      { key: 'BAR_STRAIGHT',     pos: [0, 0, 0], rotY: 0 },
      { key: 'BAR_STRAIGHT',     pos: [1.5, 0, 0], rotY: 0 },
      { key: 'BAR_CORNER_LEFT',  pos: [-2.725, 0, 0], rotY: 0 },
      { key: 'BAR_CORNER_RIGHT', pos: [2.725, 0, 0], rotY: 0 },
      { key: 'BAR_STRAIGHT',     pos: [-2.725, 0, -1.225], rotY: -1.5708 },
      { key: 'BAR_STRAIGHT',     pos: [-2.725, 0, -2.725], rotY: -1.5708 },
      { key: 'BAR_STRAIGHT',     pos: [-2.725, 0, -4.225], rotY: -1.5708 },
      { key: 'BAR_CORNER_LEFT',  pos: [-2.725, 0, -5.45], rotY: -1.5708 },
      { key: 'BAR_STRAIGHT',     pos: [2.725, 0, -1.225], rotY: 1.5708 },
      { key: 'BAR_STRAIGHT',     pos: [2.725, 0, -2.725], rotY: 1.5708 },
      { key: 'BAR_STRAIGHT',     pos: [2.725, 0, -4.225], rotY: 1.5708 },
      { key: 'BAR_CORNER_RIGHT', pos: [2.725, 0, -5.45], rotY: 1.5708 },
      { key: 'BAR_STRAIGHT',     pos: [-1.5, 0, -5.45], rotY: 3.1416 },
      { key: 'BAR_STRAIGHT',     pos: [0, 0, -5.45], rotY: 3.1416 },
      { key: 'BAR_STRAIGHT',     pos: [1.5, 0, -5.45], rotY: 3.1416 },
      { key: 'BACK_SHELF',       pos: [0, 0, -1.54], rotY: 0 },
      { key: 'BACK_SHELF',       pos: [1.085, 0, -2.625], rotY: 1.5708 },
      { key: 'BACK_SHELF',       pos: [-1.085, 0, -2.625], rotY: 4.7124 },
      { key: 'BACK_SHELF',       pos: [0, 0, -3.71], rotY: 3.1416 }
    ]
  }
};

export function mountBarPresetsViewer(mountEl, options = {}) {
  if (!mountEl) return;
  if (activeInstance) {
    activeInstance.destroy();
    activeInstance = null;
  }

  const initialPreset = options.defaultPreset || 'straight';

  mountEl.innerHTML = `
    <div class="w-full flex flex-col items-center select-none text-white font-sans">
      
      <!-- GÓRA: Scena 3D w okręgu (taki sam sposób jak w MDS bar) -->
      <div id="presets-canvas-wrapper" class="relative w-full h-[450px] sm:h-[530px] max-w-[680px] mx-auto flex items-center justify-center">
        
        <!-- Dyskretny loader ładowania modeli -->
        <div id="presets-loader" class="absolute inset-0 z-30 flex flex-col items-center justify-center transition-opacity duration-500 bg-[#030303]/60 backdrop-blur-sm pointer-events-none">
          <div class="w-10 h-10 rounded-full border-2 border-[#FACB7D]/20 border-t-[#FACB7D] animate-spin mb-3"></div>
          <span id="presets-loader-text" class="text-xs uppercase tracking-[0.25em] text-[#FACB7D] font-mono">Wczytywanie modułów 3D...</span>
        </div>

        <!-- Canvas Container -->
        <div id="presets-canvas-box" class="w-full h-full relative cursor-grab active:cursor-grabbing" style="position: absolute; inset: 0;">
          <canvas id="presets-3d-canvas" style="display: block; width: 100%; height: 100%;"></canvas>
        </div>

      </div>

      <!-- DÓŁ: Tylko przyciski do zmiany układu -->
      <div class="w-full max-w-[620px] px-3 sm:px-4 mt-3 sm:mt-5 flex flex-col items-center">
        <div class="w-full grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
          <button 
            type="button" 
            data-preset="straight" 
            class="preset-btn group relative px-3 py-3 rounded-xl border transition-all duration-300 flex flex-col items-center justify-center text-center cursor-pointer select-none active:scale-[0.98]"
          >
            <span class="font-serif-luxury font-bold text-xs uppercase tracking-wider mb-0.5 transition-colors">Prosty</span>
            <span class="text-[9.5px] font-mono tracking-widest opacity-80">Linia 7.5m</span>
          </button>

          <button 
            type="button" 
            data-preset="l_shape" 
            class="preset-btn group relative px-3 py-3 rounded-xl border transition-all duration-300 flex flex-col items-center justify-center text-center cursor-pointer select-none active:scale-[0.98]"
          >
            <span class="font-serif-luxury font-bold text-xs uppercase tracking-wider mb-0.5 transition-colors">Układ L</span>
            <span class="text-[9.5px] font-mono tracking-widest opacity-80">Narożny</span>
          </button>

          <button 
            type="button" 
            data-preset="horseshoe" 
            class="preset-btn group relative px-3 py-3 rounded-xl border transition-all duration-300 flex flex-col items-center justify-center text-center cursor-pointer select-none active:scale-[0.98]"
          >
            <span class="font-serif-luxury font-bold text-xs uppercase tracking-wider mb-0.5 transition-colors">Podkowa</span>
            <span class="text-[9.5px] font-mono tracking-widest opacity-80">Układ U</span>
          </button>

          <button 
            type="button" 
            data-preset="island" 
            class="preset-btn group relative px-3 py-3 rounded-xl border transition-all duration-300 flex flex-col items-center justify-center text-center cursor-pointer select-none active:scale-[0.98]"
          >
            <span class="font-serif-luxury font-bold text-xs uppercase tracking-wider mb-0.5 transition-colors">Wyspa 360°</span>
            <span class="text-[9.5px] font-mono tracking-widest opacity-80">Centralna</span>
          </button>
        </div>


      </div>

    </div>
  `;

  activeInstance = createPresetsApp(mountEl, initialPreset);
  return activeInstance;
}

export function destroyBarPresetsViewer() {
  if (activeInstance) {
    activeInstance.destroy();
    activeInstance = null;
  }
}

function createPresetsApp(mountEl, initialPresetId) {
  const container = mountEl.querySelector('#presets-canvas-box');
  const canvas = mountEl.querySelector('#presets-3d-canvas');
  const loaderEl = mountEl.querySelector('#presets-loader');
  const loaderText = mountEl.querySelector('#presets-loader-text');
  const buttons = mountEl.querySelectorAll('.preset-btn');

  // 1. Scene, Camera, Renderer (PRZEZROCZYSTE TŁO - alpha: true, scene.background = null)
  const scene = new THREE.Scene();
  scene.background = null;

  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 70);
  camera.position.set(7.0, 5.8, 9.8); // Zoptymalizowany kadr, w którym każdy układ (nawet 7.5m prosty) mieści się w całości

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance'
  });
  renderer.setClearColor(0x000000, 0);
  const initialWidth = container.clientWidth || 500;
  const initialHeight = container.clientHeight || 500;
  renderer.setSize(initialWidth, initialHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.35; // Identyczna ekspozycja jak w scenie MDS
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // Środowisko refleksów (RoomEnvironment) dokładnie jak w scenie animacji MDS (bar i regał)
  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;

  // 2. Controls (automatyczny obrót 360°, ZABLOKOWANY ZOOM tak by cały obiekt zawsze idealnie mieścił się w oknie)
  const defaultCenter = new THREE.Vector3(0, 0.70, 0);
  const controls = new OrbitControls(camera, renderer.domElement);

  // Blokada propagacji gestów dotykowych (zapobiega niepożądanemu swipe całego artykułu/podstrony na telefonie)
  ['touchstart', 'touchmove', 'touchend', 'touchcancel'].forEach(evt => {
    renderer.domElement.addEventListener(evt, (e) => {
      e.stopPropagation();
    }, { passive: false });
  });
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.target.copy(defaultCenter);
  controls.enablePan = false;  // Blokada przesuwania środka sceny
  controls.enableZoom = false; // Całkowita blokada zoomu zgodnie z życzeniem użytkownika (stały, idealny kadr)
  controls.enableRotate = true; // Swobodny obrót 360° wokół osi
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.55;
  controls.maxPolarAngle = Math.PI / 2 + 0.02;

  // 3. Oświetlenie studyjne - dopasowane do luksusowej palety barw ArtBar (identycznie jak w MDS)
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.90);
  scene.add(ambientLight);

  // Główne światło kluczowe (keyLight)
  const keyLight = new THREE.DirectionalLight(0xfffaed, 2.3);
  keyLight.position.set(4.5, 7.5, 5.5);
  keyLight.target.position.copy(defaultCenter);
  scene.add(keyLight.target);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.width = 2048;
  keyLight.shadow.mapSize.height = 2048;
  keyLight.shadow.camera.near = 0.5;
  keyLight.shadow.camera.far = 30;
  keyLight.shadow.bias = -0.0003;
  scene.add(keyLight);

  // Ciepłe złote światło wypełniające (goldFill)
  const goldFill = new THREE.DirectionalLight(0xFACB7D, 1.6);
  goldFill.position.set(-6.0, 5.5, -3.5);
  scene.add(goldFill);

  // Kontra tylna (rimLight) dająca elegancki błękitno-srebrzysty kontur
  const rimLight = new THREE.DirectionalLight(0x99bbff, 1.2);
  rimLight.position.set(-1.5, 6.5, -6.0);
  scene.add(rimLight);

  // Dyskretne ciepłe doświetlenie od dołu
  const groundBounce = new THREE.DirectionalLight(0xFACB7D, 0.4);
  groundBounce.position.set(0, -3.0, 3.0);
  scene.add(groundBounce);



  // 4. Podłoga z miękkim cieniem i eleganckie podwójne złote koło (tak jak w MDS)
  const shadowPlaneGeo = new THREE.PlaneGeometry(22, 22);
  const shadowPlaneMat = new THREE.ShadowMaterial({ opacity: 0.40 });
  const shadowPlane = new THREE.Mesh(shadowPlaneGeo, shadowPlaneMat);
  shadowPlane.rotation.x = -Math.PI / 2;
  shadowPlane.position.set(0, -0.001, 0);
  shadowPlane.receiveShadow = true;
  scene.add(shadowPlane);

  // Wewnętrzny złoty pierścień na podłodze
  const innerRingGeo = new THREE.RingGeometry(3.6, 3.625, 96);
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0xFACB7D,
    transparent: true,
    opacity: 0.30,
    side: THREE.DoubleSide
  });
  const innerRing = new THREE.Mesh(innerRingGeo, ringMat);
  innerRing.rotation.x = -Math.PI / 2;
  innerRing.position.set(0, 0.001, 0);
  scene.add(innerRing);

  // Zewnętrzny subtelny złoty pierścień na podłodze
  const outerRingGeo = new THREE.RingGeometry(5.8, 5.818, 96);
  const outerRingMat = new THREE.MeshBasicMaterial({
    color: 0xFACB7D,
    transparent: true,
    opacity: 0.18,
    side: THREE.DoubleSide
  });
  const outerRing = new THREE.Mesh(outerRingGeo, outerRingMat);
  outerRing.rotation.x = -Math.PI / 2;
  outerRing.position.set(0, 0.001, 0);
  scene.add(outerRing);

  // 5. Inicjalizacja modeli i kontenerów presetów
  const registry = new ModelRegistry('konfigurator/MODELE/');
  const presetGroups = new Map(); // id -> { group, materials: [] }
  let activePresetId = initialPresetId;

  // Maszyna stanów sekwencyjnego przenikania (najpierw jeden znika, potem drugi się pojawia)
  // Fazy: 'IDLE' -> 'FADING_OUT' -> 'FADING_IN' -> 'IDLE'
  let transitionState = 'IDLE';
  let targetPresetId = null;
  let phaseStartTime = 0;
  const FADE_OUT_DURATION = 0.38; // 380ms zanikania
  const FADE_IN_DURATION  = 0.38; // 380ms pojawiania się
  const AUTO_CYCLE_ENABLED = false; // Wyłączona automatyczna zmiana układów zgodnie z życzeniem użytkownika
  const AUTO_CYCLE_DELAY  = 3.00; // 3 sekundy prezentacji każdego układu

  let isReady = false;
  let lastCycleSwitchTime = 0;
  let isUserPaused = false;
  let userPauseTimeout = null;

  // Funkcja budująca preset w dedykowanej grupie THREE.Group i idealnie go centrująca
  function buildPresetGroup(presetConf) {
    const root = new THREE.Group();
    root.name = `Preset_${presetConf.id}`;

    const rawGroup = new THREE.Group();
    const presetMaterials = [];
    const presetLights = [];

    presetConf.modules.forEach(mod => {
      const mesh = registry.instantiate(mod.key);
      if (!mesh) return;

      mesh.position.set(mod.pos[0], mod.pos[1], mod.pos[2]);
      mesh.rotation.y = mod.rotY;

      // Usuwamy z lodówek butelki (w prezentacji układów mają być niewidoczne)
      const bottlesToRemove = [];
      mesh.traverse(child => {
        if (child.name === 'FridgeBottle' || child.userData.isBottle || 
            (child.geometry && child.geometry.type === 'CylinderGeometry' && child.geometry.parameters && child.geometry.parameters.radiusTop === 0.028)) {
          bottlesToRemove.push(child);
        }
      });
      bottlesToRemove.forEach(b => {
        if (b.parent) b.parent.remove(b);
      });

      // Konfiguracja materiałów i świecących LED wbudowanych bezpośrednio w bryłę mebla
      mesh.traverse(child => {
        if (child.isMesh && child.material) {
          const mats = Array.isArray(child.material) ? child.material : [child.material];
          mats.forEach(m => {
            // Refleksy HDR otoczenia
            if (m.isMeshStandardMaterial || m.isMeshPhysicalMaterial) {
              m.envMapIntensity = 1.0;
            }

            // Wykrywanie wbudowanych siatek LED (led003 w barze, led w narożniku, led002 w regale)
            const isLed = child.userData.isLedMesh ||
                          child.name.toLowerCase().includes('led') ||
                          (m.name || '').toLowerCase().includes('led');

            if (isLed) {
              child.userData.isLedMesh = true;
              m.userData.isLed = true;
              m.color = new THREE.Color(0xFFF2D8); // Jasny rozżarzony rdzeń diody LED
              m.emissive = new THREE.Color(0xFFC875); // Luksusowa złota emisja ArtBar (#FACB7D)
              m.emissiveIntensity = 7.5; // Wysoka intensywność świecenia diody LED
              m.userData.baseEmissiveIntensity = 7.5;
              m.roughness = 0.15;
              m.metalness = 0.0;
            }

            if (m.userData.baseOpacity === undefined) {
              m.userData.baseOpacity = m.opacity !== undefined ? m.opacity : 1.0;
            }
            if (!presetMaterials.includes(m)) {
              presetMaterials.push(m);
            }
          });
        }
      });

      // Dodanie fizycznych źródeł światła (PointLight) schowanych bezpośrednio POD blatem i półkami
      // Równomierny rozstaw co ~0.50m wzdłuż całego baru, narożników i łączeń (brak ciemnych plam na złączach)
      if (mod.key === 'BAR_STRAIGHT') {
        // 3 punkty świetlne w module prostym 1.5m (co 0.50m: -0.50, 0.0, +0.50)
        // Odległość od skrajnego światła do krawędzi modułu wynosi 0.25m,
        // dzięki czemu na każdym złączu (moduł-moduł lub moduł-róg) odstęp wynosi dokładnie 0.50m!
        [-0.50, 0.0, 0.50].forEach(xOff => {
          const pt = new THREE.PointLight(0xFFC875, 2.0, 2.4, 1.8);
          pt.position.set(xOff, 1.15, 0.42);
          pt.userData.baseIntensity = 2.0;
          mesh.add(pt);
          presetLights.push(pt);
        });

      } else if (mod.key === 'BAR_CORNER_RIGHT' || mod.key === 'BAR_CORNER') {
        // Narożnik prawy – 3 punkty świetlne:
        // 1. Skrzydło 1 (wejście) przy styku z barem prostym
        // 2. Szczyt narożnika (miter 45°)
        // 3. Skrzydło 2 (wyjście) przy styku z barem prostym
        const cornerPoints = [
          { x: -0.22, y: 1.15, z: 0.42 }, // styk skrzydła 1 (odstęp 0.25m od krawędzi złącza)
          { x:  0.35, y: 1.15, z: 0.35 }, // szczyt narożnika
          { x:  0.42, y: 1.15, z: -0.22 } // styk skrzydła 2 (odstęp 0.25m od krawędzi złącza)
        ];
        cornerPoints.forEach(pos => {
          const pt = new THREE.PointLight(0xFFC875, 2.0, 2.4, 1.8);
          pt.position.set(pos.x, pos.y, pos.z);
          pt.userData.baseIntensity = 2.0;
          mesh.add(pt);
          presetLights.push(pt);
        });

      } else if (mod.key === 'BAR_CORNER_LEFT') {
        // Narożnik lewy (odbicie lustrzane w osi X)
        const cornerPointsLeft = [
          { x:  0.22, y: 1.15, z: 0.42 },
          { x: -0.35, y: 1.15, z: 0.35 },
          { x: -0.42, y: 1.15, z: -0.22 }
        ];
        cornerPointsLeft.forEach(pos => {
          const pt = new THREE.PointLight(0xFFC875, 2.0, 2.4, 1.8);
          pt.position.set(pos.x, pos.y, pos.z);
          pt.userData.baseIntensity = 2.0;
          mesh.add(pt);
          presetLights.push(pt);
        });

      } else if (mod.key === 'BACK_SHELF') {
        // Regał zaplecza – punkty świetlne schowane pod półkami
        const ptTop = new THREE.PointLight(0xFFC875, 1.5, 2.2, 1.8);
        ptTop.position.set(0, 1.40, 0.22);
        ptTop.userData.baseIntensity = 1.5;
        mesh.add(ptTop);
        presetLights.push(ptTop);

        const ptBottom = new THREE.PointLight(0xFFC875, 1.5, 2.2, 1.8);
        ptBottom.position.set(0, 0.90, 0.22);
        ptBottom.userData.baseIntensity = 1.5;
        mesh.add(ptBottom);
        presetLights.push(ptBottom);
      }

      rawGroup.add(mesh);
    });

    // Precyzyjne centrowanie całego układu w punkt (0, 0, 0)
    rawGroup.updateMatrixWorld(true);
    const bbox = new THREE.Box3().setFromObject(rawGroup);
    const center = new THREE.Vector3();
    bbox.getCenter(center);

    // Przesuwamy zawartość tak, by geometryczny środek leżał w (0, 0) na podłodze
    rawGroup.position.set(-center.x, 0, -center.z);
    root.add(rawGroup);

    return {
      group: root,
      materials: presetMaterials,
      lights: presetLights
    };
  }

  // Ustawienie przezroczystości materiałów i świateł danego presetu
  function setPresetOpacity(presetData, factor) {
    const clamped = Math.max(0, Math.min(1, factor));
    const isSolid = clamped >= 0.999;
    
    // Siatki i materiały
    presetData.materials.forEach(mat => {
      if (mat.userData.isLed) {
        mat.emissiveIntensity = (mat.userData.baseEmissiveIntensity || 7.5) * clamped;
      }
      if (isSolid) {
        mat.transparent = false;
        mat.depthWrite = true;
        mat.opacity = mat.userData.baseOpacity || 1.0;
      } else {
        mat.transparent = true;
        mat.depthWrite = false; // Eliminacja artefaktów znikania elementów w Three.js
        mat.opacity = (mat.userData.baseOpacity || 1.0) * clamped;
      }
    });

    // Fizyczne źródła światła PointLight
    if (presetData.lights) {
      presetData.lights.forEach(lt => {
        lt.intensity = (lt.userData.baseIntensity || 2.2) * clamped;
        lt.visible = clamped > 0.005;
      });
    }
  }

  function updateButtonStyles(currentId) {
    buttons.forEach(btn => {
      const pId = btn.getAttribute('data-preset');
      const isActive = pId === currentId;
      if (isActive) {
        btn.className = 'preset-btn group relative px-3 py-3 rounded-xl border border-[#FACB7D] bg-gradient-to-r from-[#FACB7D] via-[#e6b45e] to-[#c79132] text-black font-bold shadow-[0_0_20px_rgba(250,203,125,0.45)] flex flex-col items-center justify-center text-center cursor-pointer select-none active:scale-[0.98] transition-all duration-300';
      } else {
        btn.className = 'preset-btn group relative px-3 py-3 rounded-xl border border-[#FACB7D]/30 bg-black/60 text-[#FACB7D]/85 hover:text-[#FACB7D] hover:border-[#FACB7D]/75 hover:bg-white/[0.04] flex flex-col items-center justify-center text-center cursor-pointer select-none active:scale-[0.98] transition-all duration-300';
      }
    });
  }

  // Rozpoczęcie sekwencyjnego przejścia:
  // Krok 1: Zanikanie obecnego układu (Fade OUT)
  // Krok 2: Po pełnym zniknięciu -> podmienienie na nowy układ i pojawianie się (Fade IN)
  function startSequentialTransition(newPresetId) {
    if (newPresetId === activePresetId && transitionState === 'IDLE') return;
    if (!presetGroups.has(newPresetId)) return;

    targetPresetId = newPresetId;
    transitionState = 'FADING_OUT';
    phaseStartTime = performance.now();
    updateButtonStyles(targetPresetId);
  }

  function getNextPresetId() {
    const curIdx = PRESET_KEYS.indexOf(activePresetId);
    const nextIdx = (curIdx + 1) % PRESET_KEYS.length;
    return PRESET_KEYS[nextIdx];
  }

  // Obsługa kliknięcia w klawisze presetów
  buttons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const pId = btn.getAttribute('data-preset');
      if (pId && pId !== activePresetId) {
        startSequentialTransition(pId);
        // Pauzujemy automatyczny cykl na 10 sekund po kliknięciu przez użytkownika
        lastCycleSwitchTime = performance.now() + 7000;
      }
    });
  });

  // Wczytanie wszystkich modeli i zbudowanie presetów
  registry.loadAllModels((progress, msg) => {
    if (loaderText) {
      loaderText.textContent = `${msg} (${Math.round(progress * 100)}%)`;
    }
  }).then(() => {
    // Budujemy wszystkie 4 presety
    Object.keys(PRESETS_CONFIG).forEach(key => {
      const pConf = PRESETS_CONFIG[key];
      const pData = buildPresetGroup(pConf);
      scene.add(pData.group);
      presetGroups.set(key, pData);

      if (key === activePresetId) {
        pData.group.visible = true;
        setPresetOpacity(pData, 1.0);
      } else {
        pData.group.visible = false;
        setPresetOpacity(pData, 0.0);
      }
    });

    updateButtonStyles(activePresetId);
    isReady = true;
    lastCycleSwitchTime = performance.now();

    // Schowaj loader
    if (loaderEl) {
      loaderEl.style.opacity = '0';
      setTimeout(() => { loaderEl.style.display = 'none'; }, 500);
    }
  }).catch(err => {
    console.error('Błąd podczas ładowania modeli presetów:', err);
    if (loaderText) loaderText.textContent = 'Błąd wczytywania modeli.';
  });

  // 6. Główna pętla renderowania i animacji
  let isRunning = true;
  let animationFrameId = null;

  function animate() {
    if (!isRunning) return;
    animationFrameId = requestAnimationFrame(animate);

    controls.update();

    const now = performance.now();

    // 1. Obsługa maszyny stanów sekwencyjnego fade'owania
    if (transitionState === 'FADING_OUT') {
      const elapsed = (now - phaseStartTime) / 1000;
      const progress = Math.min(1.0, elapsed / FADE_OUT_DURATION);

      // Funkcja smoothstep
      const ease = progress * progress * (3 - 2 * progress);

      const currentData = presetGroups.get(activePresetId);
      if (currentData) {
        setPresetOpacity(currentData, 1.0 - ease);
      }

      // Gdy układ całkowicie zniknął (opacity = 0)
      if (progress >= 1.0) {
        if (currentData) {
          currentData.group.visible = false;
          setPresetOpacity(currentData, 0.0);
        }

        // Przełączenie na nowy układ
        activePresetId = targetPresetId;
        const nextData = presetGroups.get(activePresetId);
        if (nextData) {
          nextData.group.visible = true;
          setPresetOpacity(nextData, 0.0);
        }

        // Start fazy FADE IN
        transitionState = 'FADING_IN';
        phaseStartTime = now;
      }
    } else if (transitionState === 'FADING_IN') {
      const elapsed = (now - phaseStartTime) / 1000;
      const progress = Math.min(1.0, elapsed / FADE_IN_DURATION);

      const ease = progress * progress * (3 - 2 * progress);

      const nextData = presetGroups.get(activePresetId);
      if (nextData) {
        setPresetOpacity(nextData, ease);
      }

      // Gdy nowy układ w pełni się pojawił (opacity = 1)
      if (progress >= 1.0) {
        if (nextData) {
          setPresetOpacity(nextData, 1.0); // powrót do pełnego solidnego renderu
        }
        transitionState = 'IDLE';
        targetPresetId = null;
        lastCycleSwitchTime = now; // reset timera 3s
      }
    } else if (AUTO_CYCLE_ENABLED && isReady && transitionState === 'IDLE') {
      // 2. Automatyczna pętla (wyłączona): co 3 sekundy przechodź do kolejnego układu
      const idleTime = (now - lastCycleSwitchTime) / 1000;
      if (idleTime >= AUTO_CYCLE_DELAY) {
        const nextId = getNextPresetId();
        startSequentialTransition(nextId);
      }
    }

    renderer.render(scene, camera);
  }

  animate();

  // Resize handler
  const resizeObserver = new ResizeObserver(() => {
    if (!container || !renderer || !camera) return;
    const w = container.clientWidth;
    const h = container.clientHeight;
    if (w > 0 && h > 0) {
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }
  });
  resizeObserver.observe(container);

  const appObj = {
    camera,
    controls,
    scene,
    switchToPreset: (id) => startSequentialTransition(id),
    destroy: () => {
      isRunning = false;
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      controls.dispose();
      renderer.dispose();
      scene.clear();
      if (canvas && canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }
    }
  };
  window.__barPresetsApp = appObj;
  return appObj;
}
