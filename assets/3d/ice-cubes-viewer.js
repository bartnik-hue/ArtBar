// ════════════════════════════════════════════════════════════
// ICE CUBES 3D — tło parallax dla działu FABRYKA LODU
// Czysty styl piktogramu (icon-svg-fabryka-lodu):
// - Ostre, klasyczne krawędzie sześcianu (zero zaokrągleń, zero trójkątów)
// - Pogrubiony, wyrazisty złoty kontur (linewidth do 4.2px)
// - Kreski refleksów na ściankach dokładnie jak w piktogramie
// - Ścianki w kolorze tła (#030303) zasłaniające linie tylne (hidden-line)
// - ZERO odbić i cieniowania — czysta, wektorowa estetyka
// - Płynna, wieloplanowa paralaksa: każda kostka ma INDYWIDUALNĄ głębokość
//   i własny zasięg reakcji na ruch myszy, dzięki czemu kostki poruszają
//   się naturalnie względem siebie bez efektu sztywnego bloku.
// API: mountIceCubes(container), destroyIceCubes()
// ════════════════════════════════════════════════════════════
import * as THREE from 'three';
import { LineSegments2 } from 'three/addons/lines/LineSegments2.js';
import { LineSegmentsGeometry } from 'three/addons/lines/LineSegmentsGeometry.js';
import { LineMaterial } from 'three/addons/lines/LineMaterial.js';

const GOLD = 0xFACB7D;
const PAGE_BG = 0x030303;      // ścianki w kolorze tła strony (zasłaniają linie w tle)
const HALF = 0.5;              // połowa krawędzi sześcianu jednostkowego
const WORLD_WIDTH = 16;        // szerokość kadru w jednostkach świata

// Kompozycja tła: każda kostka ma UNIKALNĄ głębokość (depth) w przestrzeni 3D.
// Daje to w pełni naturalną, wielowarstwową paralaksę — nawet sąsiadujące
// duże kostki pierwszego planu przesuwają się z różną dynamiką!
const COMPOSITION = [
  { x: 0.80,  y: 0.20, s: 1.65, depth: 9.0,  glints: true }, // największa na 1. planie
  { x: 0.965, y: 0.63, s: 1.40, depth: 7.2,  glints: true }, // duża z prawej
  { x: 0.905, y: 0.33, s: 1.25, depth: 5.5,  glints: true }, // średnio-duża
  { x: 0.70,  y: 0.36, s: 1.10, depth: 4.0,  glints: true }, // średnia
  { x: 0.835, y: 0.52, s: 1.00, depth: 2.4,  glints: true }, // średnia
  { x: 0.875, y: 0.84, s: 0.90, depth: 0.8,  glints: true }, // średnia niżej
  { x: 0.93,  y: 0.09, s: 0.75, depth: -0.8, glints: false },
  { x: 0.745, y: 0.68, s: 0.72, depth: -2.3, glints: false },
  { x: 0.645, y: 0.14, s: 0.60, depth: -3.8, glints: false },
  { x: 0.035, y: 0.30, s: 0.50, depth: -5.0, glints: false },
  { x: 0.60,  y: 0.55, s: 0.50, depth: -6.2, glints: false },
  { x: 0.43,  y: 0.95, s: 0.48, depth: -7.4, glints: false },
  { x: 0.52,  y: 0.04, s: 0.42, depth: -8.6, glints: false }  // najdalsza, w tle
];

// Refleksy piktogramowe: kreska na górnej ściance + "L" w dolnym rogu lewej ścianki
function glintPositions() {
  const f = HALF + 0.003; // mikroskopijny offset zapobiegający z-fightingowi
  return [
    // Górna ścianka (+Y)
    -0.30, f, 0.08,   -0.30, f, -0.30,
    // Lewa ścianka (+Z)
    -0.36, -0.32, f,  -0.36, 0.08, f,
    -0.36, -0.32, f,  -0.16, -0.32, f
  ];
}

let state = null;

export function mountIceCubes(container) {
  if (!container) return;
  if (state && state.container === container) return;
  destroyIceCubes();

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.domElement.style.cssText = 'display:block;width:100%;height:100%;pointer-events:none;';
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();

  // Kamera ortograficzna wzdłuż przekątnej (1,1,1) = idealna izometria piktogramu
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 200);
  const back = new THREE.Vector3(1, 1, 1).normalize();
  const right = new THREE.Vector3(1, 0, -1).normalize();
  const up = new THREE.Vector3().crossVectors(back, right).normalize();
  camera.position.copy(back).multiplyScalar(60);
  camera.up.copy(up);
  camera.lookAt(0, 0, 0);

  // Czyste, ostre geometrie sześcianu — bez zaokrągleń, bez trójkątów
  const boxGeo = new THREE.BoxGeometry(1, 1, 1);
  const faceMat = new THREE.MeshBasicMaterial({
    color: PAGE_BG,
    polygonOffset: true,
    polygonOffsetFactor: 2,
    polygonOffsetUnits: 2
  });

  const edgesGeo = new THREE.EdgesGeometry(boxGeo);
  const outlineGeo = new LineSegmentsGeometry().fromEdgesGeometry(edgesGeo);
  const glintGeo = new LineSegmentsGeometry().setPositions(glintPositions());

  const minDepth = -9.0;
  const maxDepth = 9.0;
  const allMats = [];

  const cubes = COMPOSITION.map((cfg) => {
    // Współczynnik głębokości od 0 (najdalej) do 1 (najbliżej)
    const t = THREE.MathUtils.clamp((cfg.depth - minDepth) / (maxDepth - minDepth), 0, 1);

    // Dynamicznie skalowana grubość konturu (od 2.2px dla tła do 4.2px dla pierwszego planu)
    const edgeWidth = 2.2 + t * 2.0;
    const glintWidth = edgeWidth * 0.85;

    // Przezroczystość: głębsze kostki są bardziej subtelne (0.30 - 1.0)
    const opacity = 0.30 + t * 0.70;

    // Unikalne parametry paralaksy dla DANEJ kostki
    const mouseFactor = 0.14 + t * 0.60;   // zasięg reakcji na kursor
    const scrollFactor = (t - 0.45) * 0.28; // przesunięcie przy scrollowaniu

    const edgeMat = new LineMaterial({
      color: GOLD,
      linewidth: edgeWidth,
      transparent: true,
      opacity: opacity,
      worldUnits: false
    });
    allMats.push(edgeMat);

    let glintMat = null;
    if (cfg.glints) {
      glintMat = new LineMaterial({
        color: GOLD,
        linewidth: glintWidth,
        transparent: true,
        opacity: opacity * 0.95,
        worldUnits: false
      });
      allMats.push(glintMat);
    }

    const g = new THREE.Group();
    g.scale.setScalar(cfg.s);
    g.add(new THREE.Mesh(boxGeo, faceMat));
    g.add(new LineSegments2(outlineGeo, edgeMat));
    if (cfg.glints && glintMat) {
      g.add(new LineSegments2(glintGeo, glintMat));
    }
    scene.add(g);

    return {
      g,
      cfg,
      depth: cfg.depth,
      mouseFactor,
      scrollFactor
    };
  });

  // Wymiarowanie kadru
  let viewW = WORLD_WIDTH, viewH = WORLD_WIDTH, pxPerUnit = 100;
  let dirty = true;

  function resize() {
    const w = Math.max(1, container.clientWidth);
    const h = Math.max(1, container.clientHeight);
    renderer.setSize(w, h, false);

    // Na węższych ekranach dopasowujemy szerokość widoku
    viewW = w < 700 ? WORLD_WIDTH * 0.62 : WORLD_WIDTH;
    pxPerUnit = w / viewW;
    viewH = h / pxPerUnit;

    camera.left = -viewW / 2;
    camera.right = viewW / 2;
    camera.top = viewH / 2;
    camera.bottom = -viewH / 2;
    camera.updateProjectionMatrix();

    allMats.forEach(m => m.resolution.set(w, h));
    dirty = true;
  }

  // Obsługa ruchu myszy i przewijania strony (zarówno okna, jak i modala w index.html)
  const target = new THREE.Vector2();
  const smooth = new THREE.Vector2();
  let scrollTarget = 0, scrollSmooth = 0;
  const backdrop = document.getElementById('dept-modal-backdrop');

  function onPointerMove(e) {
    target.x = (e.clientX / window.innerWidth) * 2 - 1;
    target.y = (e.clientY / window.innerHeight) * 2 - 1;
  }

  function onScroll() {
    scrollTarget = (backdrop && backdrop.scrollTop) ? backdrop.scrollTop : (window.scrollY || 0);
  }

  window.addEventListener('pointermove', onPointerMove, { passive: true });
  window.addEventListener('scroll', onScroll, { passive: true });
  if (backdrop) backdrop.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  scrollSmooth = scrollTarget;

  const ro = new ResizeObserver(resize);
  ro.observe(container);
  resize();

  let visible = true;
  const io = new IntersectionObserver((entries) => {
    visible = entries[0].isIntersecting;
    if (visible) dirty = true;
  }, { threshold: 0 });
  io.observe(container);

  const tmp = new THREE.Vector3();

  function layout() {
    const scrollUnits = scrollSmooth / pxPerUnit;
    cubes.forEach(({ g, cfg, depth, mouseFactor, scrollFactor }) => {
      // Pozycja bazowa w płaszczyźnie ekranu
      let sx = (cfg.x - 0.5) * viewW;
      let sy = (0.5 - cfg.y) * viewH;

      // Czysta paralaksa: każda kostka reaguje proporcjonalnie do SWOJEJ głębokości!
      sx -= smooth.x * mouseFactor;
      sy += smooth.y * mouseFactor + scrollUnits * scrollFactor;

      tmp.copy(right).multiplyScalar(sx)
        .addScaledVector(up, sy)
        .addScaledVector(back, depth);
      g.position.copy(tmp);
    });
  }

  const clock = new THREE.Clock();
  let rafId = 0;

  function tick() {
    rafId = requestAnimationFrame(tick);
    const dt = Math.min(clock.getDelta(), 0.05);
    if (!visible) return;

    const a = 1 - Math.pow(0.004, dt);
    const dx = target.x - smooth.x;
    const dy = target.y - smooth.y;
    const ds = scrollTarget - scrollSmooth;

    if (Math.abs(dx) > 1e-4 || Math.abs(dy) > 1e-4 || Math.abs(ds) > 0.05) {
      smooth.x += dx * a;
      smooth.y += dy * a;
      scrollSmooth += ds * a;
      dirty = true;
    }

    if (!dirty) return; // Oszczędność GPU — render tylko gdy jest ruch
    layout();
    renderer.render(scene, camera);
    dirty = false;
  }
  tick();

  state = {
    container,
    destroy() {
      cancelAnimationFrame(rafId);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('scroll', onScroll);
      if (backdrop) backdrop.removeEventListener('scroll', onScroll);
      ro.disconnect();
      io.disconnect();

      boxGeo.dispose();
      edgesGeo.dispose();
      outlineGeo.dispose();
      glintGeo.dispose();
      faceMat.dispose();
      allMats.forEach(m => m.dispose());
      renderer.dispose();
      renderer.domElement.remove();
    }
  };
}

export function destroyIceCubes() {
  if (state) {
    state.destroy();
    state = null;
  }
}
