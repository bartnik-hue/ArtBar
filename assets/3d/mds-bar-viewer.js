import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';

// Stan instancji przeglądarki 3D
let activeInstance = null;

export function mountMdsBarViewer(mountEl) {
  if (!mountEl) return;
  if (activeInstance) {
    activeInstance.destroy();
    activeInstance = null;
  }

  // Wymagania:
  // - Płaszczyzny przezroczyste (brak tła sceny, przezroczysty WebGL canvas)
  // - Bez ramki / ramki karty, na całą szerokość pola
  // - Napisy uproszczone do minimum: tylko dyskretny stan na dole
  // - Ledy w napisach/konsoli całkowicie usunięte
  // - Wyrzucone przyciski zwiń/rozwiń, automatyczny obrót i wyśrodkowanie
  // - Pozostawiony gruby pasek suwaka na całą szerokość pola
  mountEl.innerHTML = `
    <style id="mds-slider-styles">
      .mds-custom-slider {
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        width: 100% !important;
        height: 18px !important;
        background: transparent !important;
        outline: none !important;
        cursor: pointer;
        margin: 0 !important;
        padding: 0 !important;
        display: block !important;
        box-sizing: border-box !important;
      }
      /* WebKit / Chromium track: kontur złoty z 50% przezroczystością */
      .mds-custom-slider::-webkit-slider-runnable-track {
        width: 100%;
        height: 14px;
        background: transparent !important;
        border: 1.5px solid rgba(250, 203, 125, 0.5) !important;
        border-radius: 9999px;
        box-shadow: 0 0 10px rgba(250, 203, 125, 0.15);
        transition: border-color 0.2s ease, box-shadow 0.2s ease;
      }
      .mds-custom-slider:hover::-webkit-slider-runnable-track {
        border-color: rgba(250, 203, 125, 0.8) !important;
        box-shadow: 0 0 14px rgba(250, 203, 125, 0.3);
      }
      /* WebKit / Chromium thumb: złota kulka idealnie pośrodku paska */
      .mds-custom-slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: #FACB7D;
        background: radial-gradient(circle at 35% 35%, #FFFFFF 0%, #FACB7D 60%, #D49B30 100%);
        box-shadow: 0 0 10px rgba(250, 203, 125, 0.95), 0 0 3px rgba(0, 0, 0, 0.7);
        border: none;
        cursor: grab;
        margin-top: -0.5px;
        transition: transform 0.15s ease, box-shadow 0.15s ease;
      }
      .mds-custom-slider::-webkit-slider-thumb:hover {
        transform: scale(1.3);
        box-shadow: 0 0 16px rgba(250, 203, 125, 1);
      }
      .mds-custom-slider::-webkit-slider-thumb:active {
        cursor: grabbing;
        transform: scale(1.4);
      }
      /* Firefox track */
      .mds-custom-slider::-moz-range-track {
        width: 100%;
        height: 14px;
        background: transparent !important;
        border: 1.5px solid rgba(250, 203, 125, 0.5) !important;
        border-radius: 9999px;
        box-shadow: 0 0 10px rgba(250, 203, 125, 0.15);
      }
      /* Firefox thumb */
      .mds-custom-slider::-moz-range-thumb {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: #FACB7D;
        background: radial-gradient(circle at 35% 35%, #FFFFFF 0%, #FACB7D 60%, #D49B30 100%);
        box-shadow: 0 0 10px rgba(250, 203, 125, 0.95);
        border: none;
        cursor: grab;
      }
    </style>

    <div class="w-full flex flex-col items-center select-none">
      
      <!-- Scena 3D na całą szerokość pola, przezroczysta, bez ramki -->
      <div id="mds-canvas-wrapper" class="relative w-full" style="width: 100%; aspect-ratio: 1 / 1; margin-bottom: 50px;">
        
        <!-- Dyskretny loader -->
        <div id="mds-loader" class="absolute inset-0 z-20 flex items-center justify-center transition-opacity duration-500 pointer-events-none">
          <div class="w-8 h-8 rounded-full border-2 border-[#FACB7D]/20 border-t-[#FACB7D] animate-spin"></div>
        </div>

        <!-- Canvas Box -->
        <div id="mds-canvas-box" class="w-full h-full relative cursor-grab active:cursor-grabbing" style="position: absolute; inset: 0;">
          <canvas id="mds-3d-canvas" style="display: block; width: 100%; height: 100%;"></canvas>
        </div>

        <!-- Suwak postępu animacji: obniżony o 50px w dół, krótszy o 50px, wyśrodkowany, przezroczysty w 50% -->
        <div class="absolute bottom-6 inset-x-0 z-10 flex flex-col items-center justify-center pointer-events-none px-4 sm:px-6" style="transform: translateY(50px);">
          <div class="w-full max-w-[290px] sm:max-w-[350px] pointer-events-auto flex flex-col items-center">
            <input 
              id="mds-slider" 
              type="range" 
              min="0" 
              max="1000" 
              value="0" 
              class="mds-custom-slider"
              title="Przesuń, aby złożyć lub rozłożyć moduł baru"
            />
            <!-- Stan mebla na środku sceny -->
            <div id="mds-state-text" class="text-[11px] tracking-[0.28em] text-[#FACB7D]/75 uppercase font-mono font-medium text-center select-none pt-2.5 pointer-events-none">
              ZŁOŻONY
            </div>
          </div>
        </div>

      </div>

    </div>
  `;

  activeInstance = createThreeApp(mountEl);
  window._mdsApp = activeInstance;
}

export function pauseMdsBarViewer() {
  if (activeInstance) {
    activeInstance.pause();
  }
}

export function resumeMdsBarViewer() {
  if (activeInstance) {
    activeInstance.resume();
  }
}

export function destroyMdsBarViewer() {
  if (activeInstance) {
    activeInstance.destroy();
    activeInstance = null;
  }
}

function createThreeApp(mountEl) {
  const container = mountEl.querySelector('#mds-canvas-box');
  const canvas = mountEl.querySelector('#mds-3d-canvas');
  const loaderEl = mountEl.querySelector('#mds-loader');
  const sliderEl = mountEl.querySelector('#mds-slider');
  const stateTextEl = mountEl.querySelector('#mds-state-text');

  // 1. Scene, Camera, Renderer (PRZEZROCZYSTE TŁO - scene.background = null, alpha: true)
  RectAreaLightUniformsLib.init();
  const scene = new THREE.Scene();
  scene.background = null;

  const defaultCameraTarget = new THREE.Vector3(-0.95, 0.95, 0);
  const defaultCameraPos = new THREE.Vector3(2.45, 2.30, 3.70);

  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 50);
  camera.position.copy(defaultCameraPos);

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance'
  });
  renderer.setClearColor(0x000000, 0); // w 100% przezroczyste tło
  const initialWidth = container.clientWidth || container.offsetWidth || 400;
  const initialHeight = container.clientHeight || container.offsetHeight || 400;
  renderer.setSize(initialWidth, initialHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.35;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // Środowisko refleksów dla powierzchni metalowych i złotych
  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;

  // 2. Controls (automatyczny obrót 360° wokół środka sceny między barem a regałem)
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.target.copy(defaultCameraTarget);
  controls.enablePan = false; // Blokada przemieszczania kamery (brak translacji/przesuwania środka sceny)
  controls.enableRotate = true; // Zachowany swobodny obrót 360°
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.8;
  controls.maxPolarAngle = Math.PI / 2 + 0.02;
  controls.minDistance = 2.0;
  controls.maxDistance = 8.0;

  // 3. Oświetlenie studyjne
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
  scene.add(ambientLight);

  const keyLight = new THREE.DirectionalLight(0xfffaed, 2.3);
  keyLight.position.set(2.8, 5.5, 3.5);
  keyLight.target.position.copy(defaultCameraTarget);
  scene.add(keyLight.target);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.width = 1024;
  keyLight.shadow.mapSize.height = 1024;
  keyLight.shadow.camera.near = 0.5;
  keyLight.shadow.camera.far = 14;
  keyLight.shadow.bias = -0.0004;
  scene.add(keyLight);

  const goldFill = new THREE.DirectionalLight(0xFACB7D, 1.6);
  goldFill.position.set(-3.8, 3.5, -2.5);
  scene.add(goldFill);

  const rimLight = new THREE.DirectionalLight(0x99bbff, 1.2);
  rimLight.position.set(-0.95, 4.5, -4.0);
  scene.add(rimLight);

  // Miękki cień kontaktowy pod barem i regałem na przezroczystym tle
  const shadowPlaneGeo = new THREE.PlaneGeometry(8, 8);
  const shadowPlaneMat = new THREE.ShadowMaterial({ opacity: 0.42 });
  const shadowPlane = new THREE.Mesh(shadowPlaneGeo, shadowPlaneMat);
  shadowPlane.rotation.x = -Math.PI / 2;
  shadowPlane.position.set(-0.95, -0.001, 0);
  shadowPlane.receiveShadow = true;
  scene.add(shadowPlane);

  // Dyskretne złote kółko na podłodze pod obiema bryłami
  const ringGeo = new THREE.RingGeometry(1.85, 1.868, 64);
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0xFACB7D,
    transparent: true,
    opacity: 0.20,
    side: THREE.DoubleSide
  });
  const floorRing = new THREE.Mesh(ringGeo, ringMat);
  floorRing.rotation.x = -Math.PI / 2;
  floorRing.position.set(-0.95, 0.001, 0);
  scene.add(floorRing);

  // 4. Parametry animacji i cyklu automatycznego
  const TIME_BAR_START = 1.0833; // Klatka 26 (bar złożony: 26/24)
  const TIME_BAR_END   = 3.3333; // Klatka 80 (bar rozłożony: 80/24)

  const TIME_REGAL_START = 0.1667; // Klatka 4 (regał złożony: 4/24)
  const TIME_REGAL_END   = 3.3333; // Klatka 80 (regał rozłożony: 80/24)

  // Cykl: ~7s rozkładanie -> 4s pauza na rozłożonym -> ~7s składanie -> 1s pauza na złożonym
  const DURATION_UNFOLD = 7.0;
  const DURATION_HOLD_UNFOLD = 4.0;
  const DURATION_FOLD = 7.0;
  const DURATION_HOLD_FOLD = 1.0;
  const TOTAL_CYCLE = DURATION_UNFOLD + DURATION_HOLD_UNFOLD + DURATION_FOLD + DURATION_HOLD_FOLD; // 19.0s

  let barMixer = null;
  let barActions = [];
  let regalMixer = null;
  let regalActions = [];

  let currentProgress = 0.0;
  let targetProgress = 0.0;
  let isRunning = true;
  let isLoaded = false;
  let animationFrameId = null;

  let cycleTime = 0.0;
  let isUserInteracting = false;
  let userResumeTimeout = null;
  let currentDirection = 1; // 1 = rozkładanie, -1 = składanie

  let planszaMesh = null;
  let pulkaMesh = null;
  let szufladaMesh = null;
  let regalBoardMesh = null;
  const barLedMeshes = [];
  const barGlowRibbons = [];
  const ledMeshes = [];
  const glowRibbons = [];
  const ledLights = [];

  // Tekstura miękkiej poświaty dla ciągłego paska LED (efekt neonu/glow bez punktów)
  function createLedGlowTexture() {
    const cvs = document.createElement('canvas');
    cvs.width = 64;
    cvs.height = 128;
    const ctx = cvs.getContext('2d');
    const grad = ctx.createLinearGradient(0, 0, 0, 128);
    grad.addColorStop(0.00, 'rgba(255, 160, 50, 0.0)');
    grad.addColorStop(0.20, 'rgba(255, 185, 90, 0.18)');
    grad.addColorStop(0.38, 'rgba(255, 215, 140, 0.60)');
    grad.addColorStop(0.48, 'rgba(255, 248, 220, 0.95)');
    grad.addColorStop(0.50, 'rgba(255, 255, 255, 1.00)');
    grad.addColorStop(0.52, 'rgba(255, 248, 220, 0.95)');
    grad.addColorStop(0.62, 'rgba(255, 215, 140, 0.60)');
    grad.addColorStop(0.80, 'rgba(255, 185, 90, 0.18)');
    grad.addColorStop(1.00, 'rgba(255, 160, 50, 0.0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 128);
    const tex = new THREE.CanvasTexture(cvs);
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    return tex;
  }

  const ledGlowTexture = createLedGlowTexture();

  function setupLedStrip(child, isFront, length, isRegal = false, isTop = false) {
    const ledColor = isFront ? 0xFFC875 : 0xFFE2B8;

    // 1. Bazowy materiał paska (ciemna szarość, gdy LED nie świeci)
    child.material = new THREE.MeshStandardMaterial({
      color: 0x242424,
      emissive: new THREE.Color(ledColor),
      emissiveIntensity: 0.0,
      roughness: 0.35,
      metalness: 0.05
    });
    ledMeshes.push(child);
    if (!isRegal) barLedMeshes.push(child);

    // 2. Ciągła optyczna wstęga poświaty LED (laser/neon halo z AdditiveBlending)
    const ribbonGeo = new THREE.PlaneGeometry(0.040, length);
    const ribbonMat = new THREE.MeshBasicMaterial({
      map: ledGlowTexture,
      transparent: true,
      opacity: 0.0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide
    });

    if (isRegal) {
      // Dla regału: localY to pozioma szerokość (Scene Z), localZ to dół (Scene -Y)
      const ribbonH = new THREE.Mesh(ribbonGeo, ribbonMat);
      ribbonH.rotation.set(isTop ? Math.PI : 0, 0, 0);
      child.add(ribbonH);
      glowRibbons.push(ribbonH);

      // Budowanie światła z gęstego szeregu punktów (diody LED)
      // 9 punktów wzdłuż szerokości półki 1.36m (co ~14cm)
      const yOffsets = [-0.56, -0.42, -0.28, -0.14, 0.0, 0.14, 0.28, 0.42, 0.56];
      const zPos = isTop ? -0.015 : 0.015;
      yOffsets.forEach((yOff) => {
        const pt = new THREE.PointLight(ledColor, 0, 1.4, 2.0);
        pt.position.set(0, yOff, zPos);
        pt.userData.baseIntensity = 0.42;
        child.add(pt);
        ledLights.push(pt);
      });
    } else {
      // Dla baru: localZ to pozioma szerokość (Scene Z), localY to góra (Scene +Y)
      const ribbonH = new THREE.Mesh(ribbonGeo, ribbonMat);
      ribbonH.rotation.set(Math.PI / 2, 0, 0);
      child.add(ribbonH);
      glowRibbons.push(ribbonH);
      barGlowRibbons.push(ribbonH);

      // Budowanie światła z gęstego szeregu punktów (diody LED)
      // Zgodnie z życzeniem użytkownika: gęsty ciąg punktów daje realistyczne punktowe odbicia w błyszczącym panelu
      if (isFront) {
        // 12 punktów wzdłuż 1.40m blatu (co ~11cm)
        const zOffsets = [-0.60, -0.49, -0.38, -0.27, -0.16, -0.05, 0.05, 0.16, 0.27, 0.38, 0.49, 0.60];
        zOffsets.forEach((zOff) => {
          const pt = new THREE.PointLight(ledColor, 0, 1.3, 2.0);
          pt.position.set(0, -0.012, zOff);
          pt.userData.baseIntensity = 0.55;
          child.add(pt);
          ledLights.push(pt);
        });
      } else {
        const zOffsets = [-0.55, -0.37, -0.18, 0.0, 0.18, 0.37, 0.55];
        zOffsets.forEach((zOff) => {
          const pt = new THREE.PointLight(ledColor, 0, 1.2, 2.0);
          pt.position.set(0, -0.015, zOff);
          pt.userData.baseIntensity = 0.45;
          child.add(pt);
          ledLights.push(pt);
        });
      }
    }
  }

  // 5. Ładowanie modeli (Bar animowany + Regał animowany za barem)
  const gltfLoader = new GLTFLoader();

  Promise.all([
    new Promise((resolve, reject) => gltfLoader.load('assets/3d/bar_animated.glb', resolve, undefined, reject)),
    new Promise((resolve, reject) => gltfLoader.load('assets/3d/regal_animated.glb', resolve, undefined, reject))
  ]).then(([barGltf, regalGltf]) => {
    // 1. Konfiguracja Baru MDS
    const barModel = barGltf.scene;

    barModel.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.material) {
          child.material.envMapIntensity = 1.0;
        }

        if (child.name.includes('PLANSZA')) {
          planszaMesh = child;
          if (child.material) child.material = child.material.clone();
        }

        if (child.name.includes('PULKA') && !child.name.toLowerCase().includes('duza')) {
          pulkaMesh = child;
          if (child.material) child.material = child.material.clone();
        }

        if (child.name.includes('SZUFLADA')) {
          szufladaMesh = child;
          if (child.material) child.material = child.material.clone();
        }

        if (child.name.includes('LED_FRONT') || child.name.includes('LED_BACK')) {
          const isFront = child.name.includes('LED_FRONT');
          setupLedStrip(child, isFront, 1.40, false);
        }
      }
    });

    scene.add(barModel);

    // 2. Konfiguracja Regału animowanego (stoi za barem po stronie barmana, oddalony o ok. 1m)
    const regalModel = regalGltf.scene;
    regalModel.position.set(-2.15, 0, 0);

    regalModel.traverse((child) => {
      if (child.name.includes('REGAL003') || child.name.includes('REGAL.003') || child.name.includes('REGAL_003')) {
        regalBoardMesh = child;
      }

      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.material) {
          const mats = Array.isArray(child.material) ? child.material : [child.material];
          mats.forEach((m) => {
            m.envMapIntensity = 1.0;
          });
        }

        // Ledy na obu półkach regału (u góry i u dołu na przeciwnej stronie)
        if (child.name.includes('REGAL_LED')) {
          const isTop = child.name.endsWith('GORA');
          setupLedStrip(child, true, 1.36, true, isTop);
        }
      }
    });

    if (regalBoardMesh) {
      regalBoardMesh.traverse((c) => {
        if (c.isMesh && c.material) {
          if (Array.isArray(c.material)) {
            c.material = c.material.map((m) => m.clone());
          } else {
            c.material = c.material.clone();
          }
        }
      });
    }

    scene.add(regalModel);

    // 3. Animacje Baru MDS
    if (barGltf.animations && barGltf.animations.length > 0) {
      barMixer = new THREE.AnimationMixer(barModel);
      barActions = barGltf.animations.map((clip) => {
        const act = barMixer.clipAction(clip);
        act.play();
        return act;
      });
    }

    // 4. Animacje Regału MDS
    if (regalGltf.animations && regalGltf.animations.length > 0) {
      regalMixer = new THREE.AnimationMixer(regalModel);
      regalActions = regalGltf.animations.map((clip) => {
        const act = regalMixer.clipAction(clip);
        act.play();
        return act;
      });
    }

    applyProgress(0.0);
    isLoaded = true;

    if (loaderEl) {
      loaderEl.style.opacity = '0';
      setTimeout(() => loaderEl.remove(), 400);
    }
    resize();
  }).catch((err) => {
    console.error('Błąd ładowania modeli 3D:', err);
  });

  // Stopniowe pojawianie się półki na butelki, płyty z logo i półki górnej
  function updateFadingObjects(prog) {
    // 1. Półka na butelki (SZUFLADA) - pojawia się tuż przed swoim pierwszym ruchem (ruch od ~0.267)
    let szufladaOpacity = 0.0;
    if (prog <= 0.16) {
      szufladaOpacity = 0.0;
    } else if (prog >= 0.28) {
      szufladaOpacity = 1.0;
    } else {
      const t = (prog - 0.16) / (0.28 - 0.16);
      szufladaOpacity = t * t * (3 - 2 * t);
    }

    if (szufladaMesh) {
      if (szufladaOpacity <= 0.001) {
        szufladaMesh.visible = false;
      } else {
        szufladaMesh.visible = true;
        if (szufladaMesh.material) {
          if (szufladaOpacity >= 0.999) {
            szufladaMesh.material.transparent = false;
            szufladaMesh.material.opacity = 1.0;
          } else {
            szufladaMesh.material.transparent = true;
            szufladaMesh.material.opacity = szufladaOpacity;
          }
        }
      }
    }

    // 2. Płyta z logo (PLANSZA)
    let planszaOpacity = 0.0;
    if (prog <= 0.35) {
      planszaOpacity = 0.0;
    } else if (prog >= 0.48) {
      planszaOpacity = 1.0;
    } else {
      const t = (prog - 0.35) / (0.48 - 0.35);
      planszaOpacity = t * t * (3 - 2 * t);
    }

    if (planszaMesh) {
      if (planszaOpacity <= 0.001) {
        planszaMesh.visible = false;
      } else {
        planszaMesh.visible = true;
        if (planszaMesh.material) {
          if (planszaOpacity >= 0.999) {
            planszaMesh.material.transparent = false;
            planszaMesh.material.opacity = 1.0;
          } else {
            planszaMesh.material.transparent = true;
            planszaMesh.material.opacity = planszaOpacity;
          }
        }
      }
    }

    let pulkaOpacity = 0.0;
    if (prog <= 0.52) {
      pulkaOpacity = 0.0;
    } else if (prog >= 0.66) {
      pulkaOpacity = 1.0;
    } else {
      const t = (prog - 0.52) / (0.66 - 0.52);
      pulkaOpacity = t * t * (3 - 2 * t);
    }

    if (pulkaMesh) {
      if (pulkaOpacity <= 0.001) {
        pulkaMesh.visible = false;
      } else {
        pulkaMesh.visible = true;
        if (pulkaMesh.material) {
          if (pulkaOpacity >= 0.999) {
            pulkaMesh.material.transparent = false;
            pulkaMesh.material.opacity = 1.0;
          } else {
            pulkaMesh.material.transparent = true;
            pulkaMesh.material.opacity = pulkaOpacity;
          }
        }
      }
    }

    barLedMeshes.forEach((mesh) => {
      if (pulkaOpacity <= 0.001) {
        mesh.visible = false;
      } else {
        mesh.visible = true;
        if (mesh.material) {
          if (pulkaOpacity >= 0.999) {
            mesh.material.transparent = false;
            mesh.material.opacity = 1.0;
          } else {
            mesh.material.transparent = true;
            mesh.material.opacity = pulkaOpacity;
          }
        }
      }
    });

    barGlowRibbons.forEach((ribbon) => {
      ribbon.visible = pulkaOpacity > 0.001;
    });

    // 4. Wsuwana plansza regału z logo (REGAL.003) - pojawia się tuż przed swoim ruchem w dół (ruch od klatki 59 do 80: prog ~0.72 do 1.0)
    let regalOpacity = 0.0;
    if (prog <= 0.58) {
      regalOpacity = 0.0;
    } else if (prog >= 0.72) {
      regalOpacity = 1.0;
    } else {
      const t = (prog - 0.58) / (0.72 - 0.58);
      regalOpacity = t * t * (3 - 2 * t);
    }

    if (regalBoardMesh) {
      if (regalOpacity <= 0.001) {
        regalBoardMesh.visible = false;
      } else {
        regalBoardMesh.visible = true;
        regalBoardMesh.traverse((c) => {
          if (c.isMesh && c.material) {
            const mats = Array.isArray(c.material) ? c.material : [c.material];
            mats.forEach((m) => {
              if (regalOpacity >= 0.999) {
                m.transparent = false;
                m.opacity = 1.0;
              } else {
                m.transparent = true;
                m.opacity = regalOpacity;
              }
            });
          }
        });
      }
    }

    return pulkaOpacity;
  }

  // Modulacja oświetlenia LED w modelu (zaświeca się na końcu rozkładania)
  function updateLedLighting(prog, pulkaOpacity) {
    let factor = 0.0;
    if (pulkaOpacity !== undefined && pulkaOpacity <= 0.01) {
      factor = 0.0;
    } else if (prog >= 0.80) {
      const t = (prog - 0.80) / 0.20;
      factor = Math.sin((t * Math.PI) / 2);
    } else {
      factor = 0.0;
    }

    const ledOffColor = new THREE.Color(0x242424);
    const ledOnColor = new THREE.Color(0xFFF2D8);

    ledMeshes.forEach((m) => {
      if (m.material) {
        const mats = Array.isArray(m.material) ? m.material : [m.material];
        mats.forEach(mat => {
          if (mat.emissive) {
            mat.emissiveIntensity = factor * 7.5;
            if (mat.color) {
              mat.color.copy(ledOffColor).lerp(ledOnColor, factor);
            }
          }
        });
      }
    });

    glowRibbons.forEach((r) => {
      if (r.material) {
        r.material.opacity = factor * 0.95;
      }
    });

    ledLights.forEach((l) => {
      l.intensity = factor * l.userData.baseIntensity;
    });
  }

  // Przewijanie animacji
  function applyProgress(prog) {
    currentProgress = Math.max(0.0, Math.min(1.0, prog));
    const targetBarTime = TIME_BAR_START + currentProgress * (TIME_BAR_END - TIME_BAR_START);
    const targetRegalTime = TIME_REGAL_START + currentProgress * (TIME_REGAL_END - TIME_REGAL_START);

    if (barMixer && barActions.length > 0) {
      barActions.forEach((a) => {
        a.reset();
        a.time = targetBarTime;
      });
      barMixer.update(0);
    }

    if (regalMixer && regalActions.length > 0) {
      regalActions.forEach((a) => {
        a.reset();
        a.time = targetRegalTime;
      });
      regalMixer.update(0);
    }

    const pulkaOpacity = updateFadingObjects(currentProgress);
    updateLedLighting(currentProgress, pulkaOpacity);

    // Aktualizacja wartości suwaka (pasek zachowuje przezroczyste wypełnienie i złoty kontur)
    if (sliderEl) {
      sliderEl.value = Math.round(currentProgress * 1000);
    }

    // Uproszczony stan do minimum (szary, ledwo widoczny)
    if (stateTextEl) {
      if (currentProgress < 0.03) {
        stateTextEl.textContent = 'ZŁOŻONY';
      } else if (currentProgress > 0.97) {
        stateTextEl.textContent = 'ROZŁOŻONY';
      } else {
        const p100 = Math.round(currentProgress * 100);
        const actionLabel = currentDirection === -1 ? 'SKŁADANIE' : 'ROZKŁADANIE';
        stateTextEl.textContent = `${actionLabel} (${p100}%)`;
      }
    }
  }

  // Obsługa suwaka w czasie rzeczywistym z inteligentnym wznawianiem pętli po interakcji
  const onPointerUp = () => {
    if (!isUserInteracting) return;
    if (userResumeTimeout) clearTimeout(userResumeTimeout);

    // Po puszczeniu suwaka odczekaj 1.8 sekundy i wznów automatyczną pętlę ze zsynchronizowanym czasem
    userResumeTimeout = setTimeout(() => {
      if (currentProgress >= 0.98) {
        cycleTime = DURATION_UNFOLD; // Faza hold unfolded
        currentDirection = -1;
      } else if (currentProgress <= 0.02) {
        cycleTime = TOTAL_CYCLE - DURATION_HOLD_FOLD; // Faza hold folded
        currentDirection = 1;
      } else if (currentDirection === -1) {
        // Kontynuacja składania
        const clamped = Math.max(0, Math.min(1, currentProgress));
        const t = Math.acos(2 * clamped - 1) / Math.PI;
        cycleTime = DURATION_UNFOLD + DURATION_HOLD_UNFOLD + t * DURATION_FOLD;
      } else {
        // Kontynuacja rozkładania
        const clamped = Math.max(0, Math.min(1, currentProgress));
        const t = Math.acos(1 - 2 * clamped) / Math.PI;
        cycleTime = t * DURATION_UNFOLD;
      }
      isUserInteracting = false;
    }, 1800);
  };

  if (sliderEl) {
    const onPointerDown = (e) => {
      e.stopPropagation();
      isUserInteracting = true;
      if (userResumeTimeout) {
        clearTimeout(userResumeTimeout);
        userResumeTimeout = null;
      }
    };

    let prevSliderVal = 0;
    sliderEl.addEventListener('pointerdown', onPointerDown);
    sliderEl.addEventListener('mousedown', onPointerDown);
    sliderEl.addEventListener('touchstart', onPointerDown, { passive: true });

    sliderEl.addEventListener('input', (e) => {
      isUserInteracting = true;
      const val = parseFloat(e.target.value) / 1000;
      if (val > prevSliderVal) {
        currentDirection = 1;
      } else if (val < prevSliderVal) {
        currentDirection = -1;
      }
      prevSliderVal = val;
      applyProgress(val);
      targetProgress = val;
      onPointerUp();
    });

    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('mouseup', onPointerUp);
    window.addEventListener('touchend', onPointerUp, { passive: true });
  }

  // Główna pętla renderowania
  const clock = new THREE.Clock();

  function animate() {
    if (!isRunning) return;
    animationFrameId = requestAnimationFrame(animate);

    const delta = Math.min(clock.getDelta(), 0.1);

    // Automatyczny cykl animacji rozkładania i składania
    if (isLoaded && !isUserInteracting) {
      cycleTime = (cycleTime + delta) % TOTAL_CYCLE;

      let prog = 0.0;
      if (cycleTime < DURATION_UNFOLD) {
        // 1. Rozkładanie powoli przez 7 sekund (0.0 -> 1.0)
        currentDirection = 1;
        const t = cycleTime / DURATION_UNFOLD;
        prog = 0.5 - 0.5 * Math.cos(Math.PI * t);
      } else if (cycleTime < DURATION_UNFOLD + DURATION_HOLD_UNFOLD) {
        // 2. Czekanie w stanie rozłożonym przez 4 sekundy (1.0)
        currentDirection = -1;
        prog = 1.0;
      } else if (cycleTime < DURATION_UNFOLD + DURATION_HOLD_UNFOLD + DURATION_FOLD) {
        // 3. Wracanie do złożenia przez 7 sekund (1.0 -> 0.0)
        currentDirection = -1;
        const t = (cycleTime - (DURATION_UNFOLD + DURATION_HOLD_UNFOLD)) / DURATION_FOLD;
        prog = 0.5 + 0.5 * Math.cos(Math.PI * t);
      } else {
        // 4. Czekanie w stanie złożonym przez 1 sekundę (0.0)
        currentDirection = 1;
        prog = 0.0;
      }

      applyProgress(prog);
    }

    controls.update();
    renderer.render(scene, camera);
  }

  animate();

  function resize() {
    if (!container) return;
    const w = container.clientWidth || container.offsetWidth || 400;
    const h = container.clientHeight || container.offsetHeight || 400;
    if (w > 0 && h > 0) {
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }
  }

  const resizeObserver = new ResizeObserver(() => {
    resize();
  });
  resizeObserver.observe(container);

  setTimeout(resize, 50);
  setTimeout(resize, 150);
  setTimeout(resize, 350);

  return {
    camera,
    controls,
    scene,
    pause() {
      isRunning = false;
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    },
    resume() {
      if (!isRunning) {
        isRunning = true;
        clock.getDelta();
        animate();
        resize();
      }
    },
    destroy() {
      isRunning = false;
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (userResumeTimeout) clearTimeout(userResumeTimeout);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('mouseup', onPointerUp);
      window.removeEventListener('touchend', onPointerUp);
      resizeObserver.disconnect();
      renderer.dispose();
      pmremGenerator.dispose();
    }
  };
}
