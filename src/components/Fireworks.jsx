import { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { gsap } from 'gsap';

const COLOURS = [
  '#2ab5a0', '#FFD700', '#FF6B6B', '#74B9FF',
  '#FD79A8', '#A29BFE', '#55EFC4', '#FDCB6E',
  '#E17055', '#00CEC9', '#FF7675', '#6C5CE7',
];

const Fireworks = forwardRef((props, ref) => {
  const canvasRef = useRef(null);

  useImperativeHandle(ref, () => ({
    burst(x, y) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');

      // Fire 3 bursts from random positions near the button
      const BURSTS = 6;
      for (let b = 0; b < BURSTS; b++) {
        setTimeout(() => {
          const bx = x + (Math.random() - 0.5) * 300;
          const by = y + (Math.random() - 0.5) * 200;
          fireBurst(ctx, bx, by);
        }, b * 120);
      }
    }
  }));

  function fireBurst(ctx, cx, cy) {
    const PARTICLES = 28;
    const colour = COLOURS[Math.floor(Math.random() * COLOURS.length)];
    const colour2 = COLOURS[Math.floor(Math.random() * COLOURS.length)];

    const particles = Array.from({ length: PARTICLES }, (_, i) => {
      const angle  = (i / PARTICLES) * Math.PI * 2 + Math.random() * 0.3;
      const speed  = 3 + Math.random() * 5;
      const size   = 2 + Math.random() * 3;
      const obj    = {
        x: cx, y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        size,
        alpha: 1,
        colour: Math.random() > 0.5 ? colour : colour2,
        trail: [],
        gravity: 0.12 + Math.random() * 0.08,
        decay: 0.012 + Math.random() * 0.01,
      };
      return obj;
    });

    // Also fire some sparkle particles straight up
    for (let i = 0; i < 8; i++) {
      particles.push({
        x: cx, y: cy,
        vx: (Math.random() - 0.5) * 3,
        vy: -(4 + Math.random() * 6),
        size: 1.5 + Math.random() * 2,
        alpha: 1,
        colour: '#FFFFFF',
        trail: [],
        gravity: 0.15,
        decay: 0.018,
      });
    }

    let animFrame;
    function draw() {
      let alive = false;
      particles.forEach(p => {
        if (p.alpha <= 0) return;
        alive = true;

        // Store trail
        p.trail.push({ x: p.x, y: p.y });
        if (p.trail.length > 6) p.trail.shift();

        // Draw trail
        for (let t = 0; t < p.trail.length - 1; t++) {
          const trailAlpha = (t / p.trail.length) * p.alpha * 0.4;
          ctx.save();
          ctx.globalAlpha = trailAlpha;
          ctx.beginPath();
          ctx.moveTo(p.trail[t].x, p.trail[t].y);
          ctx.lineTo(p.trail[t + 1].x, p.trail[t + 1].y);
          ctx.strokeStyle = p.colour;
          ctx.lineWidth = p.size * 0.6;
          ctx.lineCap = 'round';
          ctx.stroke();
          ctx.restore();
        }

        // Draw particle
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.colour;
        ctx.shadowColor = p.colour;
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.restore();

        // Update
        p.vy += p.gravity;
        p.x  += p.vx;
        p.y  += p.vy;
        p.vx *= 0.98;
        p.alpha -= p.decay;
      });

      if (alive) animFrame = requestAnimationFrame(draw);
    }
    draw();
  }

  // Resize canvas to full viewport
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  // Clear canvas periodically
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;
    function clear() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      raf = requestAnimationFrame(clear);
    }
    raf = requestAnimationFrame(clear);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed', inset: 0,
        zIndex: 9998, pointerEvents: 'none',
      }}
    />
  );
});

export default Fireworks;
