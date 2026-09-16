import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RotateCw, ZoomIn, Palette } from 'lucide-react';

export default function ProductViewer({ product }) {
  const canvasRef = useRef(null);
  const [materialColor, setMaterialColor] = useState(0x8C6D38); // Champagne bronze

  useEffect(() => {
    let scene, camera, renderer, animId;
    let modelGroup, bronzeMesh;
    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };

    const init = () => {
      if (!canvasRef.current) return;

      const width = canvasRef.current.parentElement.clientWidth;
      const height = canvasRef.current.parentElement.clientHeight;

      scene = new THREE.Scene();
      scene.background = new THREE.Color(0xF9F6F0);

      camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
      camera.position.set(0, 1.2, 5.5);

      renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true, alpha: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.shadowMap.enabled = true;

      // Lights
      const amb = new THREE.AmbientLight(0xFFF8EE, 1.4);
      scene.add(amb);

      const mainLight = new THREE.DirectionalLight(0xFFF5E6, 2.2);
      mainLight.position.set(5, 8, 5);
      scene.add(mainLight);

      const innerLight = new THREE.PointLight(0xFFB042, 3.5, 6);
      innerLight.position.set(0, 0.8, 0);
      scene.add(innerLight);

      // Model Group (Aurelia Halo Sculptural Designer Lamp)
      modelGroup = new THREE.Group();
      scene.add(modelGroup);

      const metalMat = new THREE.MeshStandardMaterial({ color: materialColor, metalness: 0.88, roughness: 0.22 });
      const ceramicMat = new THREE.MeshStandardMaterial({ color: 0xF5F0E6, roughness: 0.65, metalness: 0.05 });
      const haloOpalescentMat = new THREE.MeshPhysicalMaterial({ color: 0xFFFAEE, roughness: 0.12, transmission: 0.92, thickness: 0.45, transparent: true, opacity: 0.96 });
      const lightCoreMat = new THREE.MeshStandardMaterial({ color: 0xFFF0D6, emissive: 0xFF9800, emissiveIntensity: 0.45 });

      // 1. Base: Weighted Ceramic Pedestal
      const baseGroup = new THREE.Group();
      const bMain = new THREE.Mesh(new THREE.CylinderGeometry(1.05, 1.25, 0.32, 64), ceramicMat);
      bMain.position.y = -1.2;
      bMain.castShadow = true;
      baseGroup.add(bMain);
      const bCollar = new THREE.Mesh(new THREE.CylinderGeometry(0.95, 1.05, 0.08, 64), metalMat);
      bCollar.position.y = -1.02;
      baseGroup.add(bCollar);
      modelGroup.add(baseGroup);

      // 2. Stem: Architectural Champagne Metal Stem
      const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.09, 2.2, 32), metalMat);
      stem.position.y = 0.1;
      modelGroup.add(stem);

      // 3. Ring: Architectural Collar Ring
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.48, 0.045, 32, 64), metalMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = -0.55;
      modelGroup.add(ring);

      // 4. Shade: Luminous Sculptural Halo Ring
      const halo = new THREE.Mesh(new THREE.TorusGeometry(1.1, 0.15, 32, 100), haloOpalescentMat);
      halo.position.y = 1.1;
      halo.castShadow = true;
      modelGroup.add(halo);

      // 5. Bulb: Central Glowing Light Core Orb
      const lightCore = new THREE.Mesh(new THREE.SphereGeometry(0.38, 64, 64), lightCoreMat);
      lightCore.position.y = 1.1;
      modelGroup.add(lightCore);

      // 6. Accent Beads
      const orb1 = new THREE.Mesh(new THREE.SphereGeometry(0.14, 32, 32), metalMat);
      orb1.position.set(0.5, -1.02, 0.4);
      modelGroup.add(orb1);

      // Mouse Orbit
      const canvas = canvasRef.current;
      const handleMouseDown = (e) => {
        isDragging = true;
        prevMouse = { x: e.clientX, y: e.clientY };
      };
      const handleMouseUp = () => { isDragging = false; };
      const handleMouseMove = (e) => {
        if (!isDragging || !modelGroup) return;
        const dx = e.clientX - prevMouse.x;
        const dy = e.clientY - prevMouse.y;
        modelGroup.rotation.y += dx * 0.01;
        modelGroup.rotation.x += dy * 0.01;
        prevMouse = { x: e.clientX, y: e.clientY };
      };

      if (canvas) {
        canvas.addEventListener('mousedown', handleMouseDown);
        canvas.addEventListener('mousemove', handleMouseMove);
      }
      window.addEventListener('mouseup', handleMouseUp);

      return () => {
        if (canvas) {
          canvas.removeEventListener('mousedown', handleMouseDown);
          canvas.removeEventListener('mousemove', handleMouseMove);
        }
        window.removeEventListener('mouseup', handleMouseUp);
      };
    };

    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (modelGroup) modelGroup.rotation.y += 0.003;
      if (renderer && scene && camera) {
        renderer.render(scene, camera);
      }
    };

    const cleanupListeners = init();
    animate();

    return () => {
      cancelAnimationFrame(animId);
      if (cleanupListeners) cleanupListeners();
      if (renderer) renderer.dispose();
    };
  }, [materialColor]);

  const colorSwatches = [
    { name: 'Bronze', hex: 0x8C6D38, css: '#8C6D38' },
    { name: 'Brass', hex: 0xC5A059, css: '#C5A059' },
    { name: 'Charcoal', hex: 0x22201D, css: '#22201D' },
  ];

  return (
    <div className="relative w-full aspect-square bg-ivory-100 rounded-3xl overflow-hidden border border-ivory-300 shadow-sm">
      <canvas ref={canvasRef} className="w-full h-full block cursor-grab active:cursor-grabbing outline-none" />

      {/* Controls Overlay */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <div className="p-2.5 rounded-full glass-card text-charcoal-800 text-xs font-sans flex items-center gap-1.5 shadow-sm">
          <RotateCw size={14} /> 360° Rotate
        </div>
      </div>

      {/* Material Color Switcher */}
      <div className="absolute bottom-4 left-4 p-3 rounded-2xl glass-card border border-ivory-300 flex items-center gap-3 shadow-md">
        <span className="text-[11px] font-sans font-semibold uppercase tracking-wider text-charcoal-600 flex items-center gap-1">
          <Palette size={14} /> Finish:
        </span>
        <div className="flex items-center gap-2">
          {colorSwatches.map((swatch) => (
            <button
              key={swatch.name}
              onClick={() => setMaterialColor(swatch.hex)}
              style={{ backgroundColor: swatch.css }}
              className={`w-6 h-6 rounded-full border-2 transition-transform duration-200 ${
                materialColor === swatch.hex ? 'border-charcoal-900 scale-110' : 'border-white'
              }`}
              title={swatch.name}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
