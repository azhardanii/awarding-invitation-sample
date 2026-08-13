"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export const ThreeGoldScene: React.FC = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isMobile = window.innerWidth < 768;
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 12;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: !isMobile,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(dpr);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const goldLight = new THREE.PointLight(0xf5e6ad, 3.5, 50);
    goldLight.position.set(5, 5, 8);
    scene.add(goldLight);
    const blueLight = new THREE.PointLight(0x4a6baf, 2, 40);
    blueLight.position.set(-6, -4, 5);
    scene.add(blueLight);

    // Materials
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xc9a961, metalness: 0.9, roughness: 0.18 });
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0xf5e6ad, metalness: 0.95, roughness: 0.1,
      emissive: 0x654926, emissiveIntensity: 0.4,
    });

    const group = new THREE.Group();
    scene.add(group);

    // Rings — reduced segments for performance
    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(3.2, 0.12, 16, 64), goldMat);
    ring1.rotation.x = Math.PI / 4;
    group.add(ring1);

    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(2.4, 0.08, 16, 64), goldMat);
    ring2.rotation.y = Math.PI / 3;
    group.add(ring2);

    const core = new THREE.Mesh(new THREE.OctahedronGeometry(1.2, 1), coreMat);
    group.add(core);

    // Fewer particles for smooth FPS
    const PARTICLE_COUNT = isMobile ? 10 : 16;
    const particleGeos = [
      new THREE.IcosahedronGeometry(0.15, 0),
      new THREE.OctahedronGeometry(0.18, 0),
      new THREE.TetrahedronGeometry(0.12, 0),
    ];
    const particles: THREE.Mesh[] = [];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const mesh = new THREE.Mesh(particleGeos[i % particleGeos.length], goldMat);
      const radius = 4 + Math.random() * 5;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;
      mesh.position.set(
        radius * Math.cos(theta) * Math.cos(phi),
        radius * Math.sin(phi),
        (Math.random() - 0.5) * 5
      );
      mesh.scale.setScalar(Math.random() * 0.7 + 0.35);
      group.add(mesh);
      particles.push(mesh);
    }
    const particleOffsets = particles.map((_, i) => i * 0.9);

    // Mouse/touch parallax
    let targetX = 0;
    let targetY = 0;
    const onMouseMove = (e: MouseEvent) => {
      targetX = (e.clientX - window.innerWidth / 2) * 0.0007;
      targetY = (e.clientY - window.innerHeight / 2) * 0.0007;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!e.touches.length) return;
      targetX = (e.touches[0].clientX - window.innerWidth / 2) * 0.0007;
      targetY = (e.touches[0].clientY - window.innerHeight / 2) * 0.0007;
    };
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });

    const onResize = () => {
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    // RAF throttle at ~35fps to stay light on the main thread
    let animId: number;
    const clock = new THREE.Clock();
    let lastTime = 0;
    const FPS_INTERVAL = 1000 / 35;

    const animate = (now: number) => {
      animId = requestAnimationFrame(animate);
      if (now - lastTime < FPS_INTERVAL) return;
      lastTime = now;

      const t = clock.getElapsedTime();

      ring1.rotation.z = t * 0.14;
      ring1.rotation.y = t * 0.18;
      ring2.rotation.x = t * 0.22;
      ring2.rotation.z = -t * 0.13;
      core.rotation.y = t * 0.38;
      core.rotation.x = Math.sin(t * 0.45) * 0.18;

      group.rotation.y += (targetX - group.rotation.y) * 0.04;
      group.rotation.x += (targetY - group.rotation.x) * 0.04;

      for (let i = 0; i < particles.length; i++) {
        particles[i].rotation.x += 0.008;
        particles[i].rotation.y += 0.009;
        particles[i].position.y += Math.sin(t * 0.6 + particleOffsets[i]) * 0.002;
      }

      renderer.render(scene, camera);
    };

    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("resize", onResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      [goldMat, coreMat].forEach((m) => m.dispose());
      particleGeos.forEach((g) => g.dispose());
      [ring1, ring2, core].forEach((m) => m.geometry.dispose());
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
