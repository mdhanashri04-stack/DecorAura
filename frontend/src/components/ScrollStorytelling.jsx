import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getWebGLConfig, setupVisibilityObserver } from '../utils/mobilePerf';

gsap.registerPlugin(ScrollTrigger);

export default function ScrollStorytelling() {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const [activeStage, setActiveStage] = useState(0);
  const currentStageRef = useRef(0);
  const isComponentVisible = useRef(true);

  const stages = [
    { num: '01', title: 'MATERIAL', desc: 'Raw minerals, mouth-blown opal glass, and solid champagne brass sourced sustainably.' },
    { num: '02', title: 'FORM', desc: 'Precision hand-lathe turning and thermal glass shaping into organic curves.' },
    { num: '03', title: 'DETAIL', desc: 'Integrated 2700K warm LED halo circuitry and seamless recessed joints.' },
    { num: '04', title: 'FINISH', desc: 'Hand-buffed bronze patina with a protective matte architectural sealant.' },
    { num: '05', title: 'OBJECT', desc: 'The completed Aurelia Lamp, crafted to bring quiet luxury to your living space.' }
  ];

  useEffect(() => {
    let scene, camera, renderer, animId;
    let sphereMesh, torusMesh;
    let ctx;
    const webglConfig = getWebGLConfig();

    const initThree = () => {
      if (!canvasRef.current) return;

      scene = new THREE.Scene();
      scene.background = new THREE.Color(0x181715); // Dark charcoal background

      camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
      camera.position.set(0, 0, 5);

      renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: !webglConfig.isMobile, alpha: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(webglConfig.pixelRatio);

      // Lighting
      const amb = new THREE.AmbientLight(0xFFF8EE, 1.2);
      scene.add(amb);

      const spot = new THREE.PointLight(0xC5A059, 4, 10);
      spot.position.set(2, 3, 3);
      scene.add(spot);

      // Material Story Objects
      const mat = new THREE.MeshStandardMaterial({
        color: 0xC5A059,
        metalness: 0.8,
        roughness: 0.2,
        wireframe: true
      });

      const sphereDetail = webglConfig.isMobile ? 2 : 3;
      sphereMesh = new THREE.Mesh(new THREE.IcosahedronGeometry(1.2, sphereDetail), mat);
      scene.add(sphereMesh);

      torusMesh = new THREE.Mesh(new THREE.TorusGeometry(1.8, 0.08, webglConfig.torusRadialSegments, webglConfig.torusTubularSegments), mat);
      scene.add(torusMesh);

      // GSAP ScrollTrigger
      ctx = gsap.context(() => {
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=300%',
          pin: true,
          refreshPriority: 1,
          scrub: webglConfig.scrubConfig,
          onUpdate: (self) => {
            const index = Math.min(Math.floor(self.progress * stages.length), stages.length - 1);
            if (index !== currentStageRef.current) {
              currentStageRef.current = index;
              setActiveStage(index);
            }

            // Update 3D Material properties based on stage
            if (sphereMesh) {
              sphereMesh.rotation.y = self.progress * Math.PI * 4;
              sphereMesh.rotation.x = self.progress * Math.PI * 2;

              if (index === 0) {
                sphereMesh.material.wireframe = true;
                sphereMesh.material.roughness = 0.8;
              } else if (index === 1) {
                sphereMesh.material.wireframe = false;
                sphereMesh.material.roughness = 0.5;
              } else if (index === 2) {
                sphereMesh.material.metalness = 0.9;
                sphereMesh.material.roughness = 0.2;
              } else if (index === 3) {
                sphereMesh.material.color.setHex(0x8C6D38);
              } else {
                sphereMesh.material.color.setHex(0xC5A059);
              }
            }
          }
        });
      }, sectionRef);
    };

    initThree();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (isComponentVisible.current) {
        if (torusMesh) torusMesh.rotation.z += 0.005;
        if (renderer && scene && camera) {
          renderer.render(scene, camera);
        }
      }
    };

    const cleanupObserver = setupVisibilityObserver(sectionRef.current, (visible) => {
      isComponentVisible.current = visible;
    });

    animate();

    const handleResize = () => {
      if (!camera || !renderer) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      cleanupObserver();
      window.removeEventListener('resize', handleResize);
      if (ctx) ctx.revert();
      if (renderer) renderer.dispose();
    };
  }, []);

  return (
    <section ref={sectionRef} style={{ touchAction: 'pan-y' }} className="relative w-full h-screen bg-charcoal-900 text-white overflow-hidden">
      {/* Background 3D Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-10 opacity-70 outline-none" />

      {/* Overlay Story Content */}
      <div className="absolute inset-0 z-20 flex flex-col justify-between p-8 md:p-16 pt-28 max-w-7xl mx-auto pointer-events-none">
        
        {/* Top Header */}
        <div>
          <span className="text-xs font-sans font-semibold uppercase tracking-[0.2em] text-bronze-500 mb-2 block">
            Exhibition Process
          </span>
          <h2 className="text-4xl md:text-6xl font-serif text-white tracking-tight">FROM MATERIAL TO OBJECT</h2>
        </div>

        {/* Center Stage Card */}
        <div className="max-w-md bg-charcoal-800/80 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl pointer-events-auto transition-all duration-500">
          <span className="text-4xl font-serif font-light text-bronze-500 block mb-2">
            {stages[activeStage].num}
          </span>
          <h3 className="text-2xl font-serif text-white tracking-widest mb-3">
            {stages[activeStage].title}
          </h3>
          <p className="text-sm font-sans text-white/70 leading-relaxed">
            {stages[activeStage].desc}
          </p>
        </div>

        {/* Bottom Progress Steps */}
        <div className="flex items-center gap-2 border-t border-white/10 pt-4">
          {stages.map((st, idx) => (
            <div
              key={st.num}
              className={`flex-1 h-1 rounded-full transition-all duration-300 ${
                idx === activeStage ? 'bg-bronze-500' : 'bg-white/20'
              }`}
            ></div>
          ))}
        </div>
      </div>
    </section>
  );
}
