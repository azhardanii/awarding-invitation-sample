"use client";

import React, { useEffect, useRef } from "react";

export const GoldParticlesCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    // Particle Configuration
    const particleCount = width < 768 ? 35 : 70;
    const particles: Array<{
      x: number;
      y: number;
      radius: number;
      speedX: number;
      speedY: number;
      opacity: number;
      maxOpacity: number;
      pulseSpeed: number;
    }> = [];

    for (let i = 0; i < particleCount; i++) {
      const maxOpacity = Math.random() * 0.6 + 0.2;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2 + 0.8,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: -Math.random() * 0.4 - 0.1,
        opacity: Math.random() * maxOpacity,
        maxOpacity,
        pulseSpeed: Math.random() * 0.015 + 0.005,
      });
    }

    // Parallax mouse effect
    let mouseX = width / 2;
    let mouseY = height / 2;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    window.addEventListener("mousemove", handleMouseMove);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Render dark ambient vignette overlay
      const radialGlow = ctx.createRadialGradient(
        width / 2,
        height * 0.3,
        50,
        width / 2,
        height / 2,
        Math.max(width, height)
      );
      radialGlow.addColorStop(0, "rgba(20, 26, 42, 0.4)");
      radialGlow.addColorStop(0.7, "rgba(6, 7, 11, 0.95)");
      radialGlow.addColorStop(1, "#06070B");
      ctx.fillStyle = radialGlow;
      ctx.fillRect(0, 0, width, height);

      // Render gold particles
      particles.forEach((p) => {
        p.x += p.speedX + (mouseX - width / 2) * 0.00005;
        p.y += p.speedY + (mouseY - height / 2) * 0.00005;

        p.opacity += p.pulseSpeed;
        if (p.opacity > p.maxOpacity || p.opacity < 0.1) {
          p.pulseSpeed = -p.pulseSpeed;
        }

        // Loop boundaries
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);

        // Gold radial gradient for particle
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 2);
        grad.addColorStop(0, `rgba(255, 245, 208, ${p.opacity})`);
        grad.addColorStop(0.5, `rgba(201, 169, 97, ${p.opacity * 0.8})`);
        grad.addColorStop(1, "rgba(201, 169, 97, 0)");

        ctx.fillStyle = grad;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.85 }}
    />
  );
};
