/* ==========================================================================
   DecorAura 3D - Interactive 3D Scroll Assembly Hero Engine (Three.js + GSAP)
   Model: Aurelia Lamp
   Features: Broken Floating Initial State -> Scroll-Triggered Assembly -> Reveal
   ========================================================================== */

import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

let scene, camera, renderer;
let lampGroup, baseMesh, standMesh, ringMesh, shadeMesh, bulbMesh, orbMesh1, orbMesh2;
let pointLight, spotLight, ambientLight;

// Initial floating offset targets for scroll assembly interpolation
const initialTransforms = {
  base: { pos: new THREE.Vector3(-2.8, -1.8, 1.5), rot: new THREE.Vector3(0.6, -0.8, 0.4) },
  stand: { pos: new THREE.Vector3(2.5, 3.2, -1.8), rot: new THREE.Vector3(-0.9, 0.5, -0.6) },
  ring: { pos: new THREE.Vector3(-3.2, 2.0, -2.5), rot: new THREE.Vector3(1.2, 0.4, 0.8) },
  shade: { pos: new THREE.Vector3(3.0, 1.5, 2.2), rot: new THREE.Vector3(-0.7, 0.9, -0.5) },
  bulb: { pos: new THREE.Vector3(0.0, 4.5, 3.0), rot: new THREE.Vector3(0.3, 0.2, 0.0) },
  orb1: { pos: new THREE.Vector3(-4.0, -3.0, -3.0), rot: new THREE.Vector3(1.0, 1.0, 1.0) },
  orb2: { pos: new THREE.Vector3(4.2, -2.5, 3.5), rot: new THREE.Vector3(-1.0, -1.0, -1.0) }
};

// Target assembled local positions
const targetTransforms = {
  base: { pos: new THREE.Vector3(0, -1.4, 0), rot: new THREE.Vector3(0, 0, 0) },
  stand: { pos: new THREE.Vector3(0, 0.1, 0), rot: new THREE.Vector3(0, 0, 0) },
  ring: { pos: new THREE.Vector3(0, -0.6, 0), rot: new THREE.Vector3(0, 0, 0) },
  shade: { pos: new THREE.Vector3(0, 1.2, 0), rot: new THREE.Vector3(0, 0, 0) },
  bulb: { pos: new THREE.Vector3(0, 1.0, 0), rot: new THREE.Vector3(0, 0, 0) },
  orb1: { pos: new THREE.Vector3(0, -1.4, 0), rot: new THREE.Vector3(0, 0, 0) },
  orb2: { pos: new THREE.Vector3(0, -1.4, 0), rot: new THREE.Vector3(0, 0, 0) }
};

// Mouse tracking vector for subtle parallax movement
const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
let scrollProgress = 0;

export function initHero3D() {
  const container = document.getElementById('hero-3d');
  const canvas = document.getElementById('hero-canvas');
  if (!container || !canvas) return;

  // 1. Scene Setup
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xF8F5F0);
  scene.fog = new THREE.FogExp2(0xF8F5F0, 0.04);

  // 2. Camera Setup
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 1.5, 7.5);

  // 3. Renderer Setup
  renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // 4. Lighting Setup
  ambientLight = new THREE.AmbientLight(0xFFF8EE, 1.2);
  scene.add(ambientLight);

  const mainLight = new THREE.DirectionalLight(0xFFF5E6, 2.5);
  mainLight.position.set(5, 8, 5);
  mainLight.castShadow = true;
  mainLight.shadow.mapSize.width = 2048;
  mainLight.shadow.mapSize.height = 2048;
  mainLight.shadow.bias = -0.0001;
  scene.add(mainLight);

  const rimLight = new THREE.DirectionalLight(0xC5A059, 1.8);
  rimLight.position.set(-6, 4, -5);
  scene.add(rimLight);

  // Inner warm lamp light inside shade
  pointLight = new THREE.PointLight(0xFFB042, 0, 8);
  pointLight.position.set(0, 1.0, 0);
  scene.add(pointLight);

  // 5. Build Procedural Aurelia Lamp Mesh Assembly
  buildAureliaLampProcedural();

  // 6. Check Reduced Motion Accessibility
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    applyAssembledState(1.0);
  } else {
    // Initial Broken Floating State
    applyAssembledState(0.0);
    setupScrollTrigger();
  }

  // Hide loader indicator
  const loader = document.querySelector('.hero-loader');
  if (loader) loader.classList.add('hidden');

  // Event Listeners
  window.addEventListener('resize', onWindowResize);
  window.addEventListener('mousemove', onMouseMove);

  // Render Loop
  animate();
}

function buildAureliaLampProcedural() {
  lampGroup = new THREE.Group();
  scene.add(lampGroup);

  // Materials
  const bronzeMat = new THREE.MeshStandardMaterial({
    color: 0x8C6D38,
    metalness: 0.85,
    roughness: 0.25,
    envMapIntensity: 1.5
  });

  const brassMat = new THREE.MeshStandardMaterial({
    color: 0xC5A059,
    metalness: 0.9,
    roughness: 0.2
  });

  const shadeMat = new THREE.MeshPhysicalMaterial({
    color: 0xFFFBF5,
    roughness: 0.15,
    transmission: 0.85,
    thickness: 0.5,
    transparent: true,
    opacity: 0.95,
    ior: 1.5
  });

  const bulbMat = new THREE.MeshStandardMaterial({
    color: 0xFFE0B2,
    emissive: 0xFF9800,
    emissiveIntensity: 0.2,
    roughness: 0.1
  });

  // 1. Base Cylinder
  const baseGeo = new THREE.CylinderGeometry(1.1, 1.25, 0.25, 64);
  baseMesh = new THREE.Mesh(baseGeo, bronzeMat);
  baseMesh.castShadow = true;
  baseMesh.receiveShadow = true;
  lampGroup.add(baseMesh);

  // 2. Vertical Stem Stand
  const standGroup = new THREE.Group();
  const stemGeo = new THREE.CylinderGeometry(0.08, 0.08, 2.4, 32);
  const stemMesh = new THREE.Mesh(stemGeo, brassMat);
  stemMesh.position.y = 0.5;
  stemMesh.castShadow = true;
  standGroup.add(stemMesh);

  const collarGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.15, 32);
  const collarMesh = new THREE.Mesh(collarGeo, bronzeMat);
  collarMesh.position.y = -0.5;
  standGroup.add(collarMesh);
  standMesh = standGroup;
  lampGroup.add(standMesh);

  // 3. Floating Accent Ring
  const ringGeo = new THREE.TorusGeometry(0.7, 0.05, 32, 64);
  ringMesh = new THREE.Mesh(ringGeo, brassMat);
  ringMesh.rotation.x = Math.PI / 2;
  ringMesh.castShadow = true;
  lampGroup.add(ringMesh);

  // 4. Curved Glass Shade
  const shadeGeo = new THREE.SphereGeometry(1.1, 64, 32, 0, Math.PI * 2, 0, Math.PI * 0.65);
  shadeMesh = new THREE.Mesh(shadeGeo, shadeMat);
  shadeMesh.castShadow = true;
  lampGroup.add(shadeMesh);

  // 5. Bulb
  const bulbGeo = new THREE.SphereGeometry(0.35, 32, 32);
  bulbMesh = new THREE.Mesh(bulbGeo, bulbMat);
  lampGroup.add(bulbMesh);

  // 6. Orbital Orbs (Decorative elements floating around base)
  const orbGeo = new THREE.SphereGeometry(0.18, 32, 32);
  orbMesh1 = new THREE.Mesh(orbGeo, brassMat);
  orbMesh2 = new THREE.Mesh(orbGeo, bronzeMat);
  lampGroup.add(orbMesh1);
  lampGroup.add(orbMesh2);
}

function applyAssembledState(progress) {
  // Lerp progress factor between initial floating displacement and final assembly
  const p = Math.max(0, Math.min(1, progress));

  // Helper to interpolate vectors
  const lerpPosRot = (mesh, key) => {
    if (!mesh) return;
    const init = initialTransforms[key];
    const target = targetTransforms[key];

    mesh.position.x = THREE.MathUtils.lerp(init.pos.x, target.pos.x, p);
    mesh.position.y = THREE.MathUtils.lerp(init.pos.y, target.pos.y, p);
    mesh.position.z = THREE.MathUtils.lerp(init.pos.z, target.pos.z, p);

    mesh.rotation.x = THREE.MathUtils.lerp(init.rot.x, target.rot.x, p);
    mesh.rotation.y = THREE.MathUtils.lerp(init.rot.y, target.rot.y, p);
    mesh.rotation.z = THREE.MathUtils.lerp(init.rot.z, target.rot.z, p);
  };

  lerpPosRot(baseMesh, 'base');
  lerpPosRot(standMesh, 'stand');
  lerpPosRot(ringMesh, 'ring');
  lerpPosRot(shadeMesh, 'shade');
  lerpPosRot(bulbMesh, 'bulb');
  lerpPosRot(orbMesh1, 'orb1');
  lerpPosRot(orbMesh2, 'orb2');

  // Scale orbs down to tuck into base at assembly
  const orbScale = THREE.MathUtils.lerp(1.2, 0.4, p);
  if (orbMesh1) orbMesh1.scale.setScalar(orbScale);
  if (orbMesh2) orbMesh2.scale.setScalar(orbScale);

  // Inner bulb glow light intensity ramps up near completion
  if (pointLight) {
    pointLight.intensity = THREE.MathUtils.lerp(0.0, 4.5, Math.pow(p, 2));
  }

  // Camera Orbit angle transition
  if (camera) {
    camera.position.x = THREE.MathUtils.lerp(-1.5, 0, p);
    camera.position.y = THREE.MathUtils.lerp(2.2, 0.8, p);
    camera.position.z = THREE.MathUtils.lerp(9.0, 6.2, p);
    camera.lookAt(0, 0.2, 0);
  }

  // Update Assembly Badge UI text
  const badgeText = document.getElementById('assembly-progress-text');
  if (badgeText) {
    const percent = Math.round(p * 100);
    if (percent === 100) {
      badgeText.textContent = 'Aurelia Lamp Assembled';
    } else {
      badgeText.textContent = `Assembling Structure: ${percent}%`;
    }
  }

  // Reveal Product Card at completion
  const card = document.querySelector('.hero-product-card');
  if (card) {
    if (p > 0.85) {
      card.classList.add('visible');
    } else {
      card.classList.remove('visible');
    }
  }
}

function setupScrollTrigger() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    // If GSAP ScrollTrigger hasn't loaded yet, fallback to scroll event listener
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      const maxScroll = window.innerHeight * 1.5;
      scrollProgress = Math.min(scrollY / maxScroll, 1.0);
      applyAssembledState(scrollProgress);
    });
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  ScrollTrigger.create({
    trigger: "#hero-3d",
    start: "top top",
    end: "+=150%",
    pin: true,
    scrub: 1.2,
    onUpdate: (self) => {
      scrollProgress = self.progress;
      applyAssembledState(scrollProgress);
    }
  });
}

function onMouseMove(event) {
  mouse.targetX = (event.clientX / window.innerWidth - 0.5) * 2;
  mouse.targetY = (event.clientY / window.innerHeight - 0.5) * 2;
}

function onWindowResize() {
  if (!camera || !renderer) return;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);

  // Smooth dampening for mouse parallax tracking
  mouse.x += (mouse.targetX - mouse.x) * 0.05;
  mouse.y += (mouse.targetY - mouse.y) * 0.05;

  if (lampGroup) {
    lampGroup.rotation.y = mouse.x * 0.18 + (scrollProgress * Math.PI * 0.4);
    lampGroup.rotation.x = mouse.y * 0.1;
  }

  renderer.render(scene, camera);
}

// Auto init on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  initHero3D();
});
