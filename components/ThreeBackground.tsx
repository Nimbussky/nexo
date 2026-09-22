"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ThreeBackground() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer with Award-Winning Studio Pipeline
    const scene = new THREE.Scene();
    const fogColor = new THREE.Color(0x05070a);
    scene.fog = new THREE.FogExp2(fogColor, 0.018);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 32);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: window.devicePixelRatio < 2,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.setClearColor(fogColor, 0);
    container.appendChild(renderer.domElement);

    // 2. Cinematic Multi-Point Lighting (Cool Key + Sky Fill + Ember Bounce)
    const keyLight = new THREE.DirectionalLight(0xc2d4f5, 1.2);
    keyLight.position.set(20, 25, 15);
    scene.add(keyLight);

    const skyFill = new THREE.HemisphereLight(0x8b5cf6, 0x05070a, 0.85);
    scene.add(skyFill);

    const emberBounce = new THREE.PointLight(0xff5a3c, 2.5, 45, 2);
    emberBounce.position.set(-8, -12, 10);
    scene.add(emberBounce);

    const cyanAccent = new THREE.PointLight(0x38bdf8, 2.2, 50, 2);
    cyanAccent.position.set(12, 10, 8);
    scene.add(cyanAccent);

    // 3. Central 3D Kinetic Geometric Structure (Torus Knot Core + Geodesic Shell)
    const worldGroup = new THREE.Group();
    scene.add(worldGroup);

    // Outer Geodesic Icosahedron Wireframe
    const icoGeo = new THREE.IcosahedronGeometry(13, 2);
    const icoMat = new THREE.MeshStandardMaterial({
      color: 0x8b5cf6,
      wireframe: true,
      transparent: true,
      opacity: 0.15,
      roughness: 0.2,
      metalness: 0.8,
    });
    const icoMesh = new THREE.Mesh(icoGeo, icoMat);
    worldGroup.add(icoMesh);

    // Inner Glowing Torus Knot Ring
    const torusGeo = new THREE.TorusKnotGeometry(7, 1.4, 128, 32, 2, 3);
    const torusMat = new THREE.MeshStandardMaterial({
      color: 0x1e1b4b,
      roughness: 0.15,
      metalness: 0.9,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
    });
    const torusMesh = new THREE.Mesh(torusGeo, torusMat);
    worldGroup.add(torusMesh);

    // 4. Instanced Floating Cosmic Star Dust / Particles (Single Draw Call)
    const particleCount = 280;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const palette = [
      new THREE.Color(0xa78bfa), // Light violet
      new THREE.Color(0x38bdf8), // Cyan
      new THREE.Color(0xff5a3c), // Ember red
      new THREE.Color(0xffffff), // Pure specular white
    ];

    for (let i = 0; i < particleCount; i++) {
      const radius = 12 + Math.random() * 18;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      const color = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.5,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    worldGroup.add(particles);

    // 5. Interactive Cursor Physics with Spring Damping
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const onMouseMove = (e: MouseEvent) => {
      const halfW = window.innerWidth / 2;
      const halfH = window.innerHeight / 2;
      mouseX = (e.clientX - halfW) * 0.0006;
      mouseY = (e.clientY - halfH) * 0.0006;
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });

    // Handle Resize
    const onResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener("resize", onResize);

    // 6. Smooth Animation Loop
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Smooth camera & group inertia
      targetX += (mouseX - targetX) * 0.04;
      targetY += (mouseY - targetY) * 0.04;

      worldGroup.rotation.y = t * 0.06 + targetX * 3;
      worldGroup.rotation.x = t * 0.03 + targetY * 3;

      torusMesh.rotation.z = t * 0.08;
      torusMesh.rotation.y = t * 0.04;

      // Pulse ember & cyan point lights subtly
      emberBounce.intensity = 2.0 + Math.sin(t * 1.5) * 0.6;
      cyanAccent.intensity = 2.0 + Math.cos(t * 1.8) * 0.5;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      icoGeo.dispose();
      icoMat.dispose();
      torusGeo.dispose();
      torusMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="pointer-events-none fixed inset-0 z-0 h-full w-full overflow-hidden opacity-75 transition-opacity duration-1000"
      aria-hidden="true"
    />
  );
}
