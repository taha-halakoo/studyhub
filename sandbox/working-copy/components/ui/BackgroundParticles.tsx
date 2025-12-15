import React, { useEffect, useRef } from 'react';

export const BackgroundParticles = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    // Mouse/Touch State
    const mouse = { x: -1000, y: -1000, active: false };

    // Particle Configuration
    const particleCount = 60; // Minimal count for non-distraction
    const particles: { 
      x: number; y: number; 
      vx: number; vy: number; 
      size: number; alpha: number; 
      targetAlpha: number;
    }[] = [];

    // Initialize Particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.2, // Very slow drift
        vy: (Math.random() - 0.5) * 0.2,
        size: Math.random() * 2,
        alpha: Math.random() * 0.5,
        targetAlpha: Math.random() * 0.5
      });
    }

    let animationFrameId: number;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      particles.forEach((p) => {
        // Movement
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around screen
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Twinkle Effect
        if (Math.random() > 0.99) p.targetAlpha = Math.random() * 0.5;
        p.alpha += (p.targetAlpha - p.alpha) * 0.05;

        // Interaction (Repulsion)
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const interactionRadius = 200;

        if (dist < interactionRadius) {
          const force = (interactionRadius - dist) / interactionRadius;
          const angle = Math.atan2(dy, dx);
          const pushX = Math.cos(angle) * force * 1.5;
          const pushY = Math.sin(angle) * force * 1.5;
          
          p.x -= pushX;
          p.y -= pushY;
          
          // Glow up on interaction
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(137, 180, 250, ${0.2 * force})`; // Blue glow
          ctx.fill();
        }

        // Draw Core Particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`; // White core
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    // Event Listeners
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMove = (e: MouseEvent | TouchEvent) => {
      if ('touches' in e) {
        mouse.x = e.touches[0].clientX;
        mouse.y = e.touches[0].clientY;
      } else {
        mouse.x = (e as MouseEvent).clientX;
        mouse.y = (e as MouseEvent).clientY;
      }
      mouse.active = true;
    };

    const handleLeave = () => { mouse.x = -1000; mouse.y = -1000; };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('touchmove', handleMove);
    window.addEventListener('mouseleave', handleLeave);
    
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('mouseleave', handleLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: 'radial-gradient(circle at center, #1e1e2e 0%, #11111b 100%)' }}
    />
  );
};