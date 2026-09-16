/* ==========================================================================
   DecorAura 3D - Interactive Product Page 360-Degree Viewer
   ========================================================================== */

import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

let scene, camera, renderer, modelGroup;
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };

export function initProductViewer(canvasId = 'product-3d-canvas') {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const parent = canvas.parentElement;
  const width = parent.clientWidth;
  const height = parent.clientHeight;

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xF8F5F0);

  camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
  camera.position.set(0, 1.2, 5.5);

  renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.shadowMap.enabled = true;

  // Lighting
  const ambient = new THREE.AmbientLight(0xFFF8EE, 1.4);
  scene.add(ambient);

  const mainLight = new THREE.DirectionalLight(0xFFF5E6, 2.0);
  mainLight.position.set(5, 8, 5);
  scene.add(mainLight);

  const innerLight = new THREE.PointLight(0xFFB042, 3.5, 6);
  innerLight.position.set(0, 0.8, 0);
  scene.add(innerLight);

  // Build Assembled Product Model
  modelGroup = new THREE.Group();
  scene.add(modelGroup);

  const bronzeMat = new THREE.MeshStandardMaterial({ color: 0x8C6D38, metalness: 0.85, roughness: 0.25 });
  const brassMat = new THREE.MeshStandardMaterial({ color: 0xC5A059, metalness: 0.9, roughness: 0.2 });
  const shadeMat = new THREE.MeshPhysicalMaterial({ color: 0xFFFBF5, roughness: 0.15, transmission: 0.85, transparent: true, opacity: 0.95 });
  const bulbMat = new THREE.MeshStandardMaterial({ color: 0xFFE0B2, emissive: 0xFF9800, emissiveIntensity: 0.4 });

  // Base
  const base = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.15, 0.2, 64), bronzeMat);
  base.position.y = -1.2;
  modelGroup.add(base);

  // Stem
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 2.2, 32), brassMat);
  stem.position.y = 0.0;
  modelGroup.add(stem);

  // Ring
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.65, 0.05, 32, 64), brassMat);
  ring.rotation.x = Math.PI / 2;
  ring.position.y = -0.5;
  modelGroup.add(ring);

  // Shade
  const shade = new THREE.Mesh(new THREE.SphereGeometry(1.0, 64, 32, 0, Math.PI * 2, 0, Math.PI * 0.65), shadeMat);
  shade.position.y = 1.1;
  modelGroup.add(shade);

  // Bulb
  const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.3, 32, 32), bulbMat);
  bulb.position.y = 0.8;
  modelGroup.add(bulb);

  // Mouse Orbit Drag Controls
  canvas.addEventListener('mousedown', (e) => {
    isDragging = true;
    previousMousePosition = { x: e.clientX, y: e.clientY };
  });

  window.addEventListener('mouseup', () => { isDragging = false; });

  canvas.addEventListener('mousemove', (e) => {
    if (!isDragging || !modelGroup) return;

    const deltaMove = {
      x: e.clientX - previousMousePosition.x,
      y: e.clientY - previousMousePosition.y
    };

    modelGroup.rotation.y += deltaMove.x * 0.01;
    modelGroup.rotation.x += deltaMove.y * 0.01;

    previousMousePosition = { x: e.clientX, y: e.clientY };
  });

  // Touch Support
  canvas.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      isDragging = true;
      previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  });

  canvas.addEventListener('touchmove', (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    const deltaMove = {
      x: e.touches[0].clientX - previousMousePosition.x,
      y: e.touches[0].clientY - previousMousePosition.y
    };
    modelGroup.rotation.y += deltaMove.x * 0.01;
    previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  });

  canvas.addEventListener('touchend', () => { isDragging = false; });

  function animateProduct() {
    requestAnimationFrame(animateProduct);
    if (!isDragging && modelGroup) {
      modelGroup.rotation.y += 0.004; // Slow idle auto spin
    }
    renderer.render(scene, camera);
  }

  animateProduct();
}
