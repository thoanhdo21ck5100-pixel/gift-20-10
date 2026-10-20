import React, { useEffect, useRef } from 'react';

interface Petal {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  rotation: number;
  rotationSpeed: number;
  color: string;
  type: 'petal' | 'heart' | 'sakura';
  swaySpeed: number;
  swayAmplitude: number;
  swayOffset: number;
  opacity: number;
}

interface HeartBurst {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  color: string;
}

interface FallingPetalsCanvasProps {
  intensity?: 'gentle' | 'vibrant' | 'off';
  interactive?: boolean;
}

export const FallingPetalsCanvas: React.FC<FallingPetalsCanvasProps> = ({
  intensity = 'vibrant',
  interactive = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const petalsRef = useRef<Petal[]>([]);
  const burstsRef = useRef<HeartBurst[]>([]);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({ x: 0, y: 0, active: false });

  useEffect(() => {
    if (intensity === 'off') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Color palettes for flower petals and soft hearts
    const petalColors = [
      'rgba(244, 114, 182, 0.75)', // soft rose pink
      'rgba(251, 113, 133, 0.70)', // deep blush
      'rgba(249, 168, 212, 0.80)', // baby pink
      'rgba(254, 205, 211, 0.85)', // peach blossom
      'rgba(253, 186, 116, 0.60)', // warm sunset peach
      'rgba(225, 29, 72, 0.65)',   // classic crimson rose
    ];

    const count = intensity === 'vibrant' ? 45 : 22;

    const createPetal = (startY?: number): Petal => {
      const types: ('petal' | 'heart' | 'sakura')[] = ['petal', 'petal', 'sakura', 'heart'];
      const chosenType = types[Math.floor(Math.random() * types.length)];
      return {
        x: Math.random() * width,
        y: startY !== undefined ? startY : Math.random() * height,
        size: 9 + Math.random() * 14,
        speedY: 0.8 + Math.random() * 1.5,
        speedX: -0.5 + Math.random() * 1.0,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 2.2,
        color: petalColors[Math.floor(Math.random() * petalColors.length)],
        type: chosenType,
        swaySpeed: 0.015 + Math.random() * 0.02,
        swayAmplitude: 20 + Math.random() * 40,
        swayOffset: Math.random() * Math.PI * 2,
        opacity: 0.5 + Math.random() * 0.45,
      };
    };

    // Initialize petals pool
    petalsRef.current = Array.from({ length: count }, () => createPetal());

    const drawPetalShape = (c: CanvasRenderingContext2D, size: number) => {
      c.beginPath();
      c.moveTo(0, -size);
      c.bezierCurveTo(size * 0.7, -size * 0.6, size * 0.8, size * 0.3, 0, size);
      c.bezierCurveTo(-size * 0.8, size * 0.3, -size * 0.7, -size * 0.6, 0, -size);
      c.fill();
    };

    const drawHeartShape = (c: CanvasRenderingContext2D, size: number) => {
      c.beginPath();
      const topCurveHeight = size * 0.3;
      c.moveTo(0, topCurveHeight);
      // top left curve
      c.bezierCurveTo(-size / 2, -topCurveHeight, -size, size / 3, 0, size);
      // top right curve
      c.bezierCurveTo(size, size / 3, size / 2, -topCurveHeight, 0, topCurveHeight);
      c.fill();
    };

    let tick = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      tick += 1;

      // Render & update falling petals
      for (let i = 0; i < petalsRef.current.length; i++) {
        const p = petalsRef.current[i];

        p.y += p.speedY;
        p.rotation += p.rotationSpeed;
        const sway = Math.sin(tick * p.swaySpeed + p.swayOffset) * 0.8;
        p.x += p.speedX + sway;

        // Interaction with mouse/finger draft
        if (mouseRef.current.active) {
          const dx = p.x - mouseRef.current.x;
          const dy = p.y - mouseRef.current.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            const force = (120 - dist) / 120;
            p.x += (dx / dist) * force * 4;
            p.y += (dy / dist) * force * 2;
          }
        }

        // Loop back to top if reached bottom
        if (p.y > height + 30) {
          petalsRef.current[i] = createPetal(-20);
        }
        if (p.x < -30) p.x = width + 20;
        if (p.x > width + 30) p.x = -20;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;

        if (p.type === 'heart') {
          drawHeartShape(ctx, p.size * 0.7);
        } else {
          drawPetalShape(ctx, p.size);
        }

        ctx.restore();
      }

      // Render & update heart bursts
      for (let b = burstsRef.current.length - 1; b >= 0; b--) {
        const burst = burstsRef.current[b];
        burst.x += burst.speedX;
        burst.y += burst.speedY;
        burst.speedY += 0.05; // gravity
        burst.opacity -= 0.015;

        if (burst.opacity <= 0) {
          burstsRef.current.splice(b, 1);
          continue;
        }

        ctx.save();
        ctx.translate(burst.x, burst.y);
        ctx.globalAlpha = Math.max(0, burst.opacity);
        ctx.fillStyle = burst.color;
        drawHeartShape(ctx, burst.size);
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    // Mouse / touch interaction
    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0]?.clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0]?.clientY : e.clientY;
      if (clientX !== undefined && clientY !== undefined) {
        mouseRef.current = { x: clientX, y: clientY, active: true };
      }
    };

    const handlePointerLeave = () => {
      mouseRef.current.active = false;
    };

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      if (!interactive) return;
      const clientX = 'touches' in e ? e.touches[0]?.clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0]?.clientY : e.clientY;
      if (clientX === undefined || clientY === undefined) return;

      // Spawn a mini cluster of rising hearts
      for (let k = 0; k < 6; k++) {
        burstsRef.current.push({
          x: clientX + (Math.random() - 0.5) * 20,
          y: clientY + (Math.random() - 0.5) * 20,
          size: 8 + Math.random() * 8,
          speedX: (Math.random() - 0.5) * 4,
          speedY: -2.5 - Math.random() * 3,
          opacity: 1,
          color: petalColors[Math.floor(Math.random() * petalColors.length)],
        });
      }
    };

    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('touchmove', handlePointerMove, { passive: true });
    window.addEventListener('mouseleave', handlePointerLeave);
    window.addEventListener('click', handlePointerDown);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('mouseleave', handlePointerLeave);
      window.removeEventListener('click', handlePointerDown);
    };
  }, [intensity, interactive]);

  if (intensity === 'off') return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10"
      aria-hidden="true"
    />
  );
};
