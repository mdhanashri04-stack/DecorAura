import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles, ArrowRight, ChevronDown, Info } from 'lucide-react';
import { track3DHeroEvent } from '../utils/analytics';
import { getWebGLConfig, setupVisibilityObserver } from '../utils/mobilePerf';

gsap.registerPlugin(ScrollTrigger);

function isWebGLAvailable() {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

export default function Hero3D({ onExploreProduct, onReady }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const progressTextRef = useRef(null);
  const assemblyCompleteLogged = useRef(false);
  const isComponentVisible = useRef(true);

  // States: 'loading' | 'glb' | 'procedural' | 'static' | 'neutral'
  const [heroState, setHeroState] = useState('loading');
  const [activeHotspot, setActiveHotspot] = useState(null);

  useEffect(() => {
    let scene, camera, renderer, animationFrameId;
    let lampGroup, heroScrollTrigger;
    let baseMesh, stemMesh, ringMesh, shadeMesh, bulbMesh, orbMesh1, orbMesh2;
    let pointLight;
    let ctx;
    let isLoaded = false;
    const webglConfig = getWebGLConfig();

    // WebGL availability check
    if (!isWebGLAvailable()) {
      console.warn('[Hero3D] WebGL is not available in browser. Switching to static hero fallback.');
      setHeroState('static');
      onReady?.();
      return;
    }

    // Hard loading timeout: ensure loading screen NEVER hangs indefinitely (max 8s)
    const loadTimeout = setTimeout(() => {
      if (!isLoaded) {
        console.warn('[Hero3D] Model load timeout. Triggering procedural fallback.');
        if (lampGroup && lampGroup.children.length === 0) {
          buildProceduralAurelia();
        } else {
          setHeroState('procedural');
        }
      }
    }, 8000);

    const initialFloatingCoords = {
      base: { x: -3.2, y: -2.2, z: 2.0, rx: 0.8, ry: -1.2, rz: 0.5 },
      stem: { x: 3.5, y: 3.8, z: -2.2, rx: -1.1, ry: 0.8, rz: -0.7 },
      ring: { x: -4.0, y: 2.5, z: -3.0, rx: 1.4, ry: 0.5, rz: 1.0 },
      shade: { x: 3.8, y: 1.8, z: 2.8, rx: -0.9, ry: 1.2, rz: -0.6 },
      bulb: { x: 0.0, y: 5.2, z: 3.5, rx: 0.4, ry: 0.3, rz: 0.0 },
      orb1: { x: -5.0, y: -3.5, z: -3.5, rx: 1.2, ry: 1.2, rz: 1.2 },
      orb2: { x: 5.2, y: -2.8, z: 4.0, rx: -1.2, ry: -1.2, rz: -1.2 }
    };

    const targetAssembledCoords = {
      base: { x: 0, y: -1.5, z: 0, rx: 0, ry: 0, rz: 0 },
      stem: { x: 0, y: 0.1, z: 0, rx: 0, ry: 0, rz: 0 },
      ring: { x: 0, y: -0.6, z: 0, rx: Math.PI / 2, ry: 0, rz: 0 },
      shade: { x: 0, y: 1.1, z: 0, rx: 0, ry: 0, rz: 0 },
      bulb: { x: 0, y: 1.1, z: 0, rx: 0, ry: 0, rz: 0 },
      orb1: { x: 0, y: -1.5, z: 0, rx: 0, ry: 0, rz: 0 },
      orb2: { x: 0, y: -1.5, z: 0, rx: 0, ry: 0, rz: 0 }
    };

    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    let scrollProgressObj = { value: 0 };

    const updateAssembly = (progress) => {
      const p = Math.max(0, Math.min(1, progress));

      const lerpPart = (mesh, key) => {
        if (!mesh) return;
        const initPos = initialFloatingCoords[key];
        const targPos = targetAssembledCoords[key];
        if (!initPos || !targPos) return;

        mesh.position.x = THREE.MathUtils.lerp(initPos.x, targPos.x, p);
        mesh.position.y = THREE.MathUtils.lerp(initPos.y, targPos.y, p);
        mesh.position.z = THREE.MathUtils.lerp(initPos.z, targPos.z, p);

        mesh.rotation.x = THREE.MathUtils.lerp(initPos.rx, targPos.rx, p);
        mesh.rotation.y = THREE.MathUtils.lerp(initPos.ry, targPos.ry, p);
        mesh.rotation.z = THREE.MathUtils.lerp(initPos.rz, targPos.rz, p);
      };

      lerpPart(baseMesh, 'base');
      lerpPart(stemMesh, 'stem');
      lerpPart(ringMesh, 'ring');
      lerpPart(shadeMesh, 'shade');
      lerpPart(bulbMesh, 'bulb');
      lerpPart(orbMesh1, 'orb1');
      lerpPart(orbMesh2, 'orb2');

      if (pointLight) {
        pointLight.intensity = THREE.MathUtils.lerp(0.0, 4.5, Math.pow(p, 2));
      }

      if (camera) {
        camera.position.x = THREE.MathUtils.lerp(-1.2, 0, p);
        camera.position.y = THREE.MathUtils.lerp(2.0, 0.8, p);
        camera.position.z = THREE.MathUtils.lerp(9.0, 6.2, p);
        camera.lookAt(0, 0.2, 0);
      }
    };

    const setupScrollAnimation = () => {
      if (!containerRef.current) return;

      if (heroScrollTrigger) {
        heroScrollTrigger.kill();
        heroScrollTrigger = null;
      }

      ctx = gsap.context(() => {
        heroScrollTrigger = ScrollTrigger.create({
          trigger: containerRef.current,
          start: 'top top',
          end: '+=200%',
          pin: true,
          refreshPriority: 10,
          scrub: webglConfig.scrubConfig,
          onUpdate: (self) => {
            const p = Math.max(0, Math.min(1, self.progress));
            scrollProgressObj.value = p;
            if (progressTextRef.current) {
              progressTextRef.current.textContent = `${Math.round(p * 100)}%`;
            }
            if (p >= 0.99 && !assemblyCompleteLogged.current) {
              console.log('[DecorAura] Assembly complete');
              assemblyCompleteLogged.current = true;
              track3DHeroEvent('hero_3d_completed');
            } else if (p < 0.95) {
              assemblyCompleteLogged.current = false;
            }
            updateAssembly(p);
          },
          onLeave: () => {
            // Keep final 100% assembled state when continuing to scroll past Hero section
            scrollProgressObj.value = 1;
            if (progressTextRef.current) {
              progressTextRef.current.textContent = '100%';
            }
            updateAssembly(1);
          },
          onEnterBack: (self) => {
            // Resume scroll-driven assembly progress when scrolling back UP into Hero section
            const p = Math.max(0, Math.min(1, self.progress));
            scrollProgressObj.value = p;
            if (progressTextRef.current) {
              progressTextRef.current.textContent = `${Math.round(p * 100)}%`;
            }
            updateAssembly(p);
          },
          onLeaveBack: () => {
            // Reset to 0% only when scrolling back above the top of Hero section
            scrollProgressObj.value = 0;
            if (progressTextRef.current) {
              progressTextRef.current.textContent = '0%';
            }
            updateAssembly(0);
          }
        });
      }, containerRef);

      const initProgress = heroScrollTrigger ? Math.max(0, Math.min(1, heroScrollTrigger.progress)) : 0;
      scrollProgressObj.value = initProgress;
      updateAssembly(initProgress);
      if (progressTextRef.current) {
        progressTextRef.current.textContent = `${Math.round(initProgress * 100)}%`;
      }

      ScrollTrigger.refresh();
      if (onReady) {
        onReady();
      }
    };

    const buildProceduralAurelia = () => {
      if (!lampGroup) return;
      isLoaded = true;
      clearTimeout(loadTimeout);

      while (lampGroup.children.length > 0) {
        lampGroup.remove(lampGroup.children[0]);
      }

      const ceramicIvoryMat = new THREE.MeshStandardMaterial({ color: 0xF5F0E6, roughness: 0.65, metalness: 0.05 });
      const champagneBrassMat = new THREE.MeshStandardMaterial({ color: 0xC5A059, metalness: 0.88, roughness: 0.22 });
      const haloOpalescentMat = new THREE.MeshPhysicalMaterial({ color: 0xFFFAEE, roughness: 0.12, transmission: 0.92, thickness: 0.45, transparent: true, opacity: 0.96 });
      const lightCoreMat = new THREE.MeshStandardMaterial({ color: 0xFFF0D6, emissive: 0xFF9800, emissiveIntensity: 0.45 });
      const charcoalSlateMat = new THREE.MeshStandardMaterial({ color: 0x22201D, roughness: 0.5, metalness: 0.5 });

      // 1. Base
      const baseGroup = new THREE.Group();
      const bMain = new THREE.Mesh(new THREE.CylinderGeometry(1.05, 1.25, 0.32, webglConfig.cylinderSegments), ceramicIvoryMat);
      bMain.castShadow = webglConfig.enableShadows;
      baseGroup.add(bMain);
      const bCollar = new THREE.Mesh(new THREE.CylinderGeometry(0.95, 1.05, 0.08, webglConfig.cylinderSegments), champagneBrassMat);
      bCollar.position.y = 0.18;
      baseGroup.add(bCollar);
      baseMesh = baseGroup;
      lampGroup.add(baseMesh);

      // 2. Stem
      const stemGroup = new THREE.Group();
      const sMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.09, 2.2, webglConfig.cylinderSegments / 2), champagneBrassMat);
      sMesh.position.y = 0.1;
      sMesh.castShadow = webglConfig.enableShadows;
      stemGroup.add(sMesh);
      const cMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.12, webglConfig.cylinderSegments / 2), champagneBrassMat);
      cMesh.position.y = -0.55;
      stemGroup.add(cMesh);
      stemMesh = stemGroup;
      lampGroup.add(stemMesh);

      // 3. Ring
      ringMesh = new THREE.Mesh(new THREE.TorusGeometry(0.48, 0.045, webglConfig.torusRadialSegments, webglConfig.torusTubularSegments), champagneBrassMat);
      lampGroup.add(ringMesh);

      // 4. Shade
      shadeMesh = new THREE.Mesh(new THREE.TorusGeometry(1.1, 0.15, webglConfig.torusRadialSegments, webglConfig.torusTubularSegments), haloOpalescentMat);
      shadeMesh.castShadow = webglConfig.enableShadows;
      lampGroup.add(shadeMesh);

      // 5. Bulb
      bulbMesh = new THREE.Mesh(new THREE.SphereGeometry(0.38, webglConfig.sphereSegments, webglConfig.sphereSegments), lightCoreMat);
      lampGroup.add(bulbMesh);

      // 6. Orbs
      orbMesh1 = new THREE.Mesh(new THREE.SphereGeometry(0.14, webglConfig.sphereSegments / 2, webglConfig.sphereSegments / 2), champagneBrassMat);
      orbMesh2 = new THREE.Mesh(new THREE.SphereGeometry(0.12, webglConfig.sphereSegments / 2, webglConfig.sphereSegments / 2), charcoalSlateMat);
      lampGroup.add(orbMesh1);
      lampGroup.add(orbMesh2);

      setupScrollAnimation();
      setHeroState('procedural');
      track3DHeroEvent('hero_3d_loaded', { mode: 'procedural' });
    };

    const handleContextLost = (e) => {
      e.preventDefault();
      console.warn('[Hero3D] WebGL context lost. Switching to static hero fallback.');
      setHeroState('static');
    };

    const init = () => {
      try {
        if (!canvasRef.current) return;

        canvasRef.current.addEventListener('webglcontextlost', handleContextLost);

        scene = new THREE.Scene();
        scene.background = new THREE.Color(0xFDFBF7);
        scene.fog = new THREE.FogExp2(0xFDFBF7, 0.035);

        camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
        camera.position.set(0, 1.5, 7.8);

        renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: !webglConfig.isMobile, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(webglConfig.pixelRatio);
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.15;
        renderer.shadowMap.enabled = webglConfig.enableShadows;

        // Lights
        const ambLight = new THREE.AmbientLight(0xFFF8EE, 1.3);
        scene.add(ambLight);

        const dirLight = new THREE.DirectionalLight(0xFFF5E6, 2.6);
        dirLight.position.set(6, 9, 6);
        dirLight.castShadow = webglConfig.enableShadows;
        scene.add(dirLight);
        scene.add(dirLight);

        const rimLight = new THREE.DirectionalLight(0xC5A059, 1.8);
        rimLight.position.set(-6, 4, -5);
        scene.add(rimLight);

        pointLight = new THREE.PointLight(0xFFB042, 0, 8);
        pointLight.position.set(0, 0.9, 0);
        scene.add(pointLight);

        lampGroup = new THREE.Group();
        scene.add(lampGroup);

        // Tier 1: Try Loading Aurelia GLB Model
        const loader = new GLTFLoader();
        const modelUrl = '/models/aurelia-halo.glb';

        loader.load(
          modelUrl,
          (gltf) => {
            isLoaded = true;
            clearTimeout(loadTimeout);
            const modelScene = gltf.scene;
            lampGroup.add(modelScene);

            // Safely map nodes by exact name
            baseMesh = modelScene.getObjectByName('Base') || modelScene.getObjectByName('base');
            stemMesh = modelScene.getObjectByName('Stem') || modelScene.getObjectByName('stem');
            ringMesh = modelScene.getObjectByName('Ring') || modelScene.getObjectByName('ring') || modelScene.getObjectByName('HaloRing') || modelScene.getObjectByName('Halo');
            shadeMesh = modelScene.getObjectByName('Shade') || modelScene.getObjectByName('shade') || modelScene.getObjectByName('InnerSupport') || modelScene.getObjectByName('Glass');
            bulbMesh = modelScene.getObjectByName('Bulb') || modelScene.getObjectByName('bulb') || modelScene.getObjectByName('LightCore');
            orbMesh1 = modelScene.getObjectByName('Orb1') || modelScene.getObjectByName('orb1') || modelScene.getObjectByName('AccentRing');
            orbMesh2 = modelScene.getObjectByName('Orb2') || modelScene.getObjectByName('orb2');

            // Apply Luxury PBR Materials
            const ceramicIvoryMat = new THREE.MeshStandardMaterial({ color: 0xF5F0E6, roughness: 0.65, metalness: 0.05 });
            const champagneBrassMat = new THREE.MeshStandardMaterial({ color: 0xC5A059, metalness: 0.88, roughness: 0.22 });
            const haloOpalescentMat = new THREE.MeshPhysicalMaterial({ color: 0xFFFAEE, roughness: 0.12, transmission: 0.92, thickness: 0.45, transparent: true, opacity: 0.96 });
            const lightCoreMat = new THREE.MeshStandardMaterial({ color: 0xFFF0D6, emissive: 0xFF9800, emissiveIntensity: 0.45 });
            const charcoalSlateMat = new THREE.MeshStandardMaterial({ color: 0x22201D, roughness: 0.5, metalness: 0.5 });

            if (baseMesh) baseMesh.traverse((c) => { if (c.isMesh) c.material = ceramicIvoryMat; });
            if (stemMesh) stemMesh.traverse((c) => { if (c.isMesh) c.material = champagneBrassMat; });
            if (ringMesh) ringMesh.traverse((c) => { if (c.isMesh) c.material = champagneBrassMat; });
            if (shadeMesh) shadeMesh.traverse((c) => { if (c.isMesh) c.material = haloOpalescentMat; });
            if (bulbMesh) bulbMesh.traverse((c) => { if (c.isMesh) c.material = lightCoreMat; });
            if (orbMesh1) orbMesh1.traverse((c) => { if (c.isMesh) c.material = champagneBrassMat; });
            if (orbMesh2) orbMesh2.traverse((c) => { if (c.isMesh) c.material = charcoalSlateMat; });

            setupScrollAnimation();
            setHeroState('glb');
            track3DHeroEvent('hero_3d_loaded', { mode: 'glb' });
            console.log('[DecorAura] Hero 3D ready (GLB)');
          },
          undefined,
          (err) => {
            console.warn('[Hero3D] GLB load failed, using procedural fallback:', err);
            buildProceduralAurelia();
          }
        );
      } catch (err) {
        console.warn('[Hero3D] Three.js WebGL init error, switching to Static Image fallback:', err);
        setHeroState('static');
      }
    };

    const handleMouseMove = (e) => {
      mouse.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.targetY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    const handleResize = () => {
      if (!camera || !renderer) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (isComponentVisible.current) {
        mouse.x += (mouse.targetX - mouse.x) * 0.05;
        mouse.y += (mouse.targetY - mouse.y) * 0.05;

        if (lampGroup) {
          lampGroup.rotation.y = mouse.x * 0.15 + (scrollProgressObj.value * Math.PI * 0.4);
          lampGroup.rotation.x = mouse.y * 0.08;
        }

        if (renderer && scene && camera) {
          renderer.render(scene, camera);
        }
      }
    };

    init();
    animate();

    const cleanupObserver = setupVisibilityObserver(containerRef.current, (visible) => {
      isComponentVisible.current = visible;
    });

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(loadTimeout);
      cancelAnimationFrame(animationFrameId);
      cleanupObserver();
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (canvasRef.current) {
        canvasRef.current.removeEventListener('webglcontextlost', handleContextLost);
      }
      if (heroScrollTrigger) {
        heroScrollTrigger.kill();
        heroScrollTrigger = null;
      }
      if (ctx) ctx.revert();
      if (renderer) renderer.dispose();
    };
  }, []);

  const hotspots = [
    { id: 1, title: 'Soft Ambient Diffuser', desc: 'Mouth-blown opalescent glass creating 360° glare-free illumination.', top: '32%', left: '48%' },
    { id: 2, title: 'Hand-Finished Brass Stem', desc: 'Precision-milled brass with brushed champagne protective coating.', top: '55%', left: '52%' },
    { id: 3, title: 'Recycled Bronze Base', desc: 'Heavy weighted monolithic bronze base for perfect kinetic equilibrium.', top: '78%', left: '46%' }
  ];

  return (
    <div ref={containerRef} style={{ touchAction: 'pan-y' }} className="relative w-full h-screen bg-ivory-50 overflow-hidden">
      {/* Loading Overlay */}
      {heroState === 'loading' && (
        <div className="absolute inset-0 bg-ivory-50 z-50 flex flex-col items-center justify-center">
          <div className="text-3xl font-serif tracking-tight text-charcoal-900 mb-2">DecorAura</div>
          <div className="text-xs font-sans uppercase tracking-widest text-bronze-500 font-semibold mb-6">Preparing your space...</div>
          <div className="w-48 h-0.5 bg-ivory-200 overflow-hidden rounded-full">
            <div className="w-full h-full bg-bronze-500 animate-pulse"></div>
          </div>
        </div>
      )}

      {/* 3D Canvas (Active for loading, glb, procedural states) */}
      {(heroState === 'loading' || heroState === 'glb' || heroState === 'procedural') && (
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-10 outline-none" />
      )}

      {/* Static Image Fallback Layer */}
      {heroState === 'static' && (
        <div className="absolute inset-0 z-0 flex items-center justify-center opacity-90">
          <img
            src="https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=1200"
            alt="Aurelia Halo Lamp"
            className="max-h-[70vh] max-w-[80vw] object-contain drop-shadow-2xl"
            onError={() => setHeroState('neutral')}
          />
        </div>
      )}

      {/* Neutral Fallback Background Layer */}
      {heroState === 'neutral' && (
        <div className="absolute inset-0 bg-gradient-to-br from-ivory-100 via-ivory-200 to-ivory-300 z-0" />
      )}

      {/* Hero Typographic Overlay & Controls */}
      <div className="absolute inset-0 z-20 pointer-events-none flex flex-col justify-between p-6 md:p-12 pt-44 md:pt-48">
        
        {/* Top Eyebrow & Headline */}
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ivory-100/80 border border-ivory-300 text-[11px] font-sans font-semibold tracking-widest uppercase text-bronze-600 mb-4 backdrop-blur-md">
            <Sparkles size={12} /> OBJECT 01
          </div>

          <h1 className="text-5xl md:text-7xl font-serif text-charcoal-900 leading-[1.05] tracking-tight mb-4">
            Light, <br /><span className="italic font-light text-bronze-600">reimagined.</span>
          </h1>

          <p className="text-sm md:text-base font-sans text-charcoal-500 max-w-md leading-relaxed">
            Aurelia Halo is a sculptural table lamp designed to turn ordinary spaces into atmospheric ones through floating glass and brushed bronze.
          </p>

          <div className="mt-8 pointer-events-auto flex items-center gap-4">
            <button
              onClick={onExploreProduct}
              className="px-6 py-3 bg-charcoal-900 hover:bg-bronze-500 text-white rounded-full text-xs font-sans uppercase tracking-widest transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-bronze-500/20"
            >
              Explore Aurelia <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Interactive 3D Hotspots */}
        {(heroState === 'glb' || heroState === 'procedural') && hotspots.map((spot) => (
          <div
            key={spot.id}
            style={{ top: spot.top, left: spot.left }}
            className="absolute pointer-events-auto z-30 transform -translate-x-1/2 -translate-y-1/2"
          >
            <button
              onClick={() => {
                const nextState = activeHotspot === spot.id ? null : spot.id;
                setActiveHotspot(nextState);
                if (nextState) {
                  track3DHeroEvent('hero_3d_interaction', { hotspot_id: spot.id, hotspot_title: spot.title });
                }
              }}
              className="w-8 h-8 rounded-full bg-ivory-50/90 border-2 border-bronze-500 flex items-center justify-center shadow-md hotspot-pulse group transition-transform duration-300 hover:scale-110"
              aria-label={spot.title}
            >
              <Info size={14} className="text-charcoal-900 group-hover:text-bronze-600" />
            </button>

            {activeHotspot === spot.id && (
              <div className="absolute left-10 top-1/2 -translate-y-1/2 w-64 p-4 rounded-xl glass-card shadow-xl border border-ivory-300 z-40 text-left animate-fadeIn">
                <div className="text-xs font-sans font-bold uppercase tracking-wider text-bronze-600 mb-1">{spot.title}</div>
                <div className="text-xs font-sans text-charcoal-600 leading-relaxed">{spot.desc}</div>
              </div>
            )}
          </div>
        ))}

        {/* Bottom Assembly Counter & Scroll Prompt */}
        <div className="flex items-end justify-between w-full border-t border-ivory-300/40 pt-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-bronze-500 animate-ping"></div>
            <span className="text-xs font-sans uppercase tracking-widest text-charcoal-500 font-semibold">
              Assembly Progress: <span ref={progressTextRef} className="text-bronze-600 font-bold">0%</span>
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-sans uppercase tracking-widest text-bronze-600 font-semibold animate-bounce">
            <span>Scroll to form object</span>
            <ChevronDown size={14} />
          </div>
        </div>
      </div>
    </div>
  );
}
