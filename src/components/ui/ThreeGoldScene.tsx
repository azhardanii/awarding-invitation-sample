"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export const ThreeGoldScene: React.FC = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 12;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    container.appendChild(renderer.domElement);

    // 2. Lighting (Luxury Specular Gold Lighting)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const goldPointLight = new THREE.PointLight(0xf5e6ad, 3.5, 50);
    goldPointLight.position.set(5, 5, 8);
    scene.add(goldPointLight);

    const blueAccentLight = new THREE.PointLight(0x4a6baf, 2, 40);
    blueAccentLight.position.set(-6, -4, 5);
    scene.add(blueAccentLight);

    // 3. Materials
    const goldMaterial = new THREE.MeshStandardMaterial({
      color: 0xc9a961,
      metalness: 0.9,
      roughness: 0.18,
      wireframe: false,
    });

    const innerCoreMaterial = new THREE.MeshStandardMaterial({
      color: 0xf5e6ad,
      metalness: 0.95,
      roughness: 0.1,
      emissive: 0x654926,
      emissiveIntensity: 0.4,
    });

    // 4. 3D Floating Geometries Group
    const group = new THREE.Group();
    scene.add(group);

    // Central 3D Award Torus Ring 1
    const ringGeo1 = new THREE.TorusGeometry(3.2, 0.12, 32, 100);
    const ringMesh1 = new THREE.Mesh(ringGeo1, goldMaterial);
    ringMesh1.rotation.x = Math.PI / 4;
    group.add(ringMesh1);

    // Central 3D Award Torus Ring 2 (Interlocking)
    const ringGeo2 = new THREE.TorusGeometry(2.4, 0.08, 32, 100);
    const ringMesh2 = new THREE.Mesh(ringGeo2, goldMaterial);
    ringMesh2.rotation.y = Math.PI / 3;
    group.add(ringMesh2);

    // Center 3D Octahedron Jewel Core
    const coreGeo = new THREE.OctahedronGeometry(1.2, 2);
    const coreMesh = new THREE.Mesh(coreGeo, innerCoreMaterial);
    group.add(coreMesh);

    // Surrounding Floating 3D Gold Particles
    const particlesCount = 35;
    const particleGeos = [
      new THREE.IcosahedronGeometry(0.15, 0),
      new THREE.OctahedronGeometry(0.18, 0),
      new THREE.TetrahedronGeometry(0.12, 0),
    ];

    const particleMeshes: THREE.Mesh[] = [];

    for (let i = 0; i < particlesCount; i++) {
      const geo = particleGeos[i % particleGeos.length];
      const pMesh = new THREE.Mesh(geo, goldMaterial);

      const radius = 4 + Math.random() * 6;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;

      pMesh.position.x = radius * Math.cos(theta) * Math.cos(phi);
      pMesh.position.y = radius * Math.sin(phi);
      pMesh.position.z = (Math.random() - 0.5) * 6;

      pMesh.scale.setScalar(Math.random() * 0.8 + 0.4);
      group.add(pMesh);
      particleMeshes.push(pMesh);
    }

    // 5. Parallax Mouse & Touch Interaction
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const windowHalfX = window.innerWidth / 2;
      const windowHalfY = window.innerHeight / 2;
      targetX = (e.clientX - windowHalfX) * 0.0008;
      targetY = (e.clientY - windowHalfY) * 0.0008;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const windowHalfX = window.innerWidth / 2;
        const windowHalfY = window.innerHeight / 2;
        targetX = (e.touches[0].clientX - windowHalfX) * 0.0008;
        targetY = (e.touches[0].clientY - windowHalfY) * 0.0008;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove);

    // 6. Resize Listener
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    // 7. Animation Loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth rotation
      ringMesh1.rotation.z = elapsedTime * 0.15;
      ringMesh1.rotation.y = elapsedTime * 0.2;

      ringMesh2.rotation.x = elapsedTime * 0.25;
      ringMesh2.rotation.z = -elapsedTime * 0.15;

      coreMesh.rotation.y = elapsedTime * 0.4;
      coreMesh.rotation.x = Math.sin(elapsedTime * 0.5) * 0.2;

      // Parallax smooth interpolation (easing)
      group.rotation.y += (targetX - group.rotation.y) * 0.05;
      group.rotation.x += (targetY - group.rotation.x) * 0.05;

      // Floating particle motion
      particleMeshes.forEach((p, idx) => {
        p.position.y += Math.sin(elapsedTime + idx) * 0.003;
        p.rotation.x += 0.01;
        p.rotation.y += 0.01;
      });

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("resize", handleResize);

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 pointer-events-none z-0 opacity-80"
      style={{ overflow: "hidden" }}
    />
  );
};
