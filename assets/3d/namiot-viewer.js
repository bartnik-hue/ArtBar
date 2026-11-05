import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

// Rejestr aktywnych instancji
const activeInstances = new Map();

// Parametry shadera i sceny skalibrowane przez użytkownika
const CONFIG = {
  lineColor: 0xE2B961,       // Czyste, szlachetne złoto (True Noble Gold)       // Prawdziwe szlachetne złoto (nie pomarańczowe)       // Brand Gold
  fillColor: 0x060605,       // Głęboki satynowy onyks pod stretch       // Głęboki satynowy grafit pod stretch       // Ciemne tło okluzji
  thickness: 2.0,            // Szerokość linii konturu
  sensitivity: 0.50,         // Ostrość przejścia konturu
  fillOpacity: 1.0,          // 100% krycia korpusu (pełne zasłanianie tylnych krawędzi)
  rotSpeed: 0.20,            // Subtelny, majestatyczny obrót pionowy
  goldPoles: true,           // Złote maszty konstrukcyjne
  showFloorRing: true,       // Złoty pierścień na podłodze
  showFloorShadow: true      // Cień kontaktowy na podłodze
};

// Shadery GPU (100% akceleracja na karcie graficznej, zero opóźnień)
const pictogramVertexShader = `
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
    vViewPosition = -mvPos.xyz;
    gl_Position = projectionMatrix * mvPos;
  }
`;

const pictogramFragmentShader = `
  uniform vec3 uOutlineColor;
  uniform vec3 uFillColor;
  uniform float uFillOpacity;
  uniform float uThickness;
  uniform float uSensitivity;
  varying vec3 vNormal;
  varying vec3 vViewPosition;

  void main() {
    vec3 N = normalize(vNormal);
    vec3 V = normalize(vViewPosition);

    // Kąt normalnej do promienia widzenia (obrys sylwetki)
    float dotNV = abs(dot(N, V));
    float rim = 1.0 - dotNV;
    float edge = smoothstep(1.0 - (uThickness * 0.08), 1.0, rim);

    // Wykrywanie załamań geometrii za pomocą pochodnych ekranowych GPU
    vec3 dNx = dFdx(N);
    vec3 dNy = dFdy(N);
    float curvature = length(dNx) + length(dNy);
    float crease = smoothstep(1.0 - uSensitivity, 1.0, curvature * 2.0);

    float line = clamp(edge + crease, 0.0, 1.0);

    // Oświetlenie modelujące krzywizny i naprężenia stretchu
    vec3 L1 = normalize(vec3(0.35, 1.0, 0.45));
    float diff = max(dot(N, L1), 0.0);

    // Złoty refleks światła na naprężonych grzbietach stretchu
    vec3 H = normalize(L1 + V);
    float spec = pow(max(dot(N, H), 0.0), 14.0);
    float fresnel = pow(1.0 - dotNV, 2.8);

    // Tkanina: głęboki, luksusowy ciemny grafit/onyks,
    // ożywiony delikatnym złotym światłem na wypukłościach i grzbietach
    vec3 fabricDark = vec3(0.045, 0.042, 0.038);
    vec3 fabricLight = mix(fabricDark, uOutlineColor, 0.14);
    vec3 bodyShade = mix(fabricDark, fabricLight, diff) + (uOutlineColor * (spec * 0.32 + fresnel * 0.22));

    // Wyraziste złote linie konturu (piktogram)
    vec3 finalCol = mix(bodyShade, uOutlineColor, line);
    float alpha = max(line, uFillOpacity);

    gl_FragColor = vec4(finalCol, alpha);
  }
`;

/**
 * Montuje pełnoekranowe, nieinteraktywne tło 3D z obracającym się namiotem
 * @param {HTMLElement} mountEl - element kontenera tła
 */
export function mountNamiotBackground(mountEl) {
  if (!mountEl) return;
  if (activeInstances.has(mountEl)) {
    try { activeInstances.get(mountEl).destroy(); } catch (e) {}
    activeInstances.delete(mountEl);
  }

  // Wymuszenie braku możliwości manipulacji (czyste tło wideo/3D)
  mountEl.innerHTML = `
    <div class="w-full h-full relative select-none overflow-visible flex items-center justify-center pointer-events-auto">
      <canvas class="block pointer-events-auto" style="width: 100%; height: 100%; display: block; cursor: grab; touch-action: pan-y;"></canvas>
    </div>
  `;

  const canvas = mountEl.querySelector('canvas');
  const inst = createBackgroundApp(canvas, mountEl);
  activeInstances.set(mountEl, inst);
  return inst;
}

/**
 * Niszczy aktywne tło 3D i zwalnia zasoby GPU
 */
export function destroyNamiotBackground(mountEl) {
  if (mountEl) {
    if (activeInstances.has(mountEl)) {
      try { activeInstances.get(mountEl).destroy(); } catch (e) {}
      activeInstances.delete(mountEl);
    }
  } else {
    activeInstances.forEach((inst) => {
      try { inst.destroy(); } catch (e) {}
    });
    activeInstances.clear();
  }
}

function createBackgroundApp(canvas, container) {
  let isRunning = true;
  let animationFrameId = null;
  let tentModel = null;

  // 1. Scena, Renderer, Kamera
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  camera.position.set(0, 2.1, 9.2);
  const cameraTarget = new THREE.Vector3(0, 1.15, 0);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance'
  });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;

  // Środowisko refleksów
  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;

  // 2. Kontroler obrotu - TYLKO automatyczny obrót wokół osi pionowej, BEZ możliwości manipulacji
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.target.copy(cameraTarget);
  controls.autoRotate = true;
  controls.autoRotateSpeed = CONFIG.rotSpeed; // 0.20x - subtelny ciągły obrót
  controls.enableRotate = true;  // Uaktywniony obrót myszką i dotykiem!
  controls.enableZoom = false;    // Blokada zmiany miejsca kamery (zoom)
  controls.enablePan = false;     // Blokada przesuwania kamery (pan)
  controls.minPolarAngle = Math.PI * 0.25; // 45 st. od góry
  controls.maxPolarAngle = Math.PI * 0.48; // tuż nad podłożem

  // Dynamiczny kursor grab / grabbing
  canvas.addEventListener('pointerdown', () => { canvas.style.cursor = 'grabbing'; });
  window.addEventListener('pointerup', () => { canvas.style.cursor = 'grab'; });

  // 3. Oświetlenie studyjne
  const ambientLight = new THREE.AmbientLight(0xffffff, 1.1);
  scene.add(ambientLight);

  const keyLight = new THREE.DirectionalLight(0xfffaee, 2.0);
  keyLight.position.set(4.5, 8.0, 5.0);
  keyLight.target.position.copy(cameraTarget);
  scene.add(keyLight.target);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.set(1024, 1024);
  keyLight.shadow.bias = -0.0004;
  scene.add(keyLight);

  const goldFill = new THREE.DirectionalLight(0xDFB86C, 0.75);
  goldFill.position.set(-5.0, 4.0, -3.5);
  scene.add(goldFill);

  const rimLight = new THREE.DirectionalLight(0x99bbff, 1.1);
  rimLight.position.set(0.0, 6.0, -6.5);
  scene.add(rimLight);

  // 4. Podłoga: Cień kontaktowy i złoty pierścień
  const shadowGeo = new THREE.PlaneGeometry(16, 16);
  const shadowMat = new THREE.ShadowMaterial({ opacity: 0.45 });
  const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
  shadowMesh.rotation.x = -Math.PI / 2;
  shadowMesh.position.y = -0.001;
  shadowMesh.receiveShadow = true;
  scene.add(shadowMesh);

  const ringGeo = new THREE.RingGeometry(3.1, 3.125, 64);
  const ringMat = new THREE.MeshBasicMaterial({
    color: CONFIG.lineColor,
    transparent: true,
    opacity: 0.25,
    side: THREE.DoubleSide
  });
  const floorRing = new THREE.Mesh(ringGeo, ringMat);
  floorRing.rotation.x = -Math.PI / 2;
  floorRing.position.y = 0.001;
  scene.add(floorRing);

  // 5. Ładowanie modelu namiot.glb
  const gltfLoader = new GLTFLoader();
  gltfLoader.load(
    'assets/3d/namiot.glb',
    (gltf) => {
      if (!isRunning) return;
      tentModel = gltf.scene;

      // Zastosowanie shadera piktogramu do siatek namiotu
      tentModel.traverse((child) => {
        if (!child.isMesh) return;

        child.castShadow = true;
        child.receiveShadow = true;

        const isPole = child.material && child.material.name === 'POLE_ALU';

        if (CONFIG.goldPoles && isPole) {
          // Maszty konstrukcyjne: szlachetne szczotkowane złoto (cieniowane, nie świecące płasko na żółto)
          child.material = new THREE.MeshStandardMaterial({
            color: new THREE.Color(0xBFA054),
            metalness: 0.88,
            roughness: 0.35,
            side: THREE.DoubleSide
          });
          child.castShadow = true;
          child.receiveShadow = true;
        } else {
          // Shader piktogramu z okluzją głębi
          child.material = new THREE.ShaderMaterial({
            vertexShader: pictogramVertexShader,
            fragmentShader: pictogramFragmentShader,
            uniforms: {
              uOutlineColor: { value: new THREE.Color(CONFIG.lineColor) },
              uFillColor: { value: new THREE.Color(CONFIG.fillColor) },
              uFillOpacity: { value: CONFIG.fillOpacity },
              uThickness: { value: CONFIG.thickness },
              uSensitivity: { value: CONFIG.sensitivity }
            },
            side: THREE.DoubleSide,
            depthWrite: true,
            depthTest: true
          });
        }
      });

      // Dopasowanie skali i wyśrodkowanie
      const box = new THREE.Box3().setFromObject(tentModel);
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.z);
      const targetDiameter = 5.6; // Przywrócony elegancki rozmiar namiotu // Przywrócony rozmiar namiotu // Monumentalna rozpiętość kinowa // Rozszerzona monumentalna rozpiętość // Panoramiczna rozpiętość kinowa // Zwiększony 1.5x (5.2 * 1.5)
      const scale = targetDiameter / (maxDim || 1);
      tentModel.scale.setScalar(scale);

      box.setFromObject(tentModel);
      const center = box.getCenter(new THREE.Vector3());
      tentModel.position.x = -center.x;
      tentModel.position.z = -center.z;
      tentModel.position.y = -box.min.y;

      cameraTarget.set(0, (box.max.y - box.min.y) * 0.12, 0); // Obniżony środek obrotu do poziomu podłoża
      controls.target.copy(cameraTarget);

      // Dopasowanie pierścienia podłogowego
      const baseRadius = Math.max(size.x, size.z) * scale * 0.56;
      floorRing.geometry.dispose();
      floorRing.geometry = new THREE.RingGeometry(baseRadius, baseRadius + 0.025, 64);

      scene.add(tentModel);
    },
    undefined,
    (err) => console.error('Błąd ładowania namiot.glb w tle:', err)
  );

  // 6. Responsive Resize & Monumentalny Pas w tle z miękkim zanikaniem
  function resize() {
    if (!container || !renderer || !camera) return;

    let w = container.clientWidth;
    let h = container.clientHeight;

    if (!w || !h || w < 20 || h < 20) {
      w = container.parentElement ? container.parentElement.clientWidth : 1200;
      h = 900;
    }

    camera.aspect = w / h;
    camera.clearViewOffset();

    const baseFov = 26;
    const minAspect = 1.45;
    if (camera.aspect < minAspect) {
      camera.fov = 2 * Math.atan(Math.tan((baseFov * Math.PI) / 360) * (minAspect / camera.aspect)) * (180 / Math.PI);
    } else {
      camera.fov = baseFov;
    }

    camera.updateProjectionMatrix();

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(w, h, true);
  }

  resize();
  window.addEventListener('resize', resize);
  const resizeObserver = new ResizeObserver(() => resize());
  resizeObserver.observe(container);

  // Dodatkowa synchronizacja po wyłonieniu się modalu
  setTimeout(resize, 100);
  setTimeout(resize, 250);

  // 7. Pętla animacji
  function animate() {
    if (!isRunning) return;
    animationFrameId = requestAnimationFrame(animate);

    controls.update(); // płynny obrót 0.20x wokół osi Y
    renderer.render(scene, camera);
  }
  animate();

  // 8. Zwolnienie pamięci
  return {
    destroy() {
      isRunning = false;
      if (animationFrameId) cancelAnimationFrame(animationFrameId);

      window.removeEventListener('resize', resize);
      resizeObserver.unobserve(container);
      controls.dispose();

      if (tentModel) {
        tentModel.traverse((child) => {
          if (child.isMesh) {
            if (child.geometry) child.geometry.dispose();
            if (child.material) {
              if (Array.isArray(child.material)) {
                child.material.forEach(m => m.dispose());
              } else {
                child.material.dispose();
              }
            }
          }
        });
        scene.remove(tentModel);
      }

      shadowGeo.dispose();
      shadowMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      floorRing.geometry.dispose();

      pmremGenerator.dispose();
      renderer.dispose();
    }
  };
}
