import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const CARD_IMAGES = [
  '/cards/morocco.png',
  '/cards/india.png',
  '/cards/indonesia.png',
  '/cards/portugal.png',
  '/cards/greece.png',
  '/cards/costarica.png',
  '/cards/peru.png',
  '/cards/italy.png',
  '/cards/australia.png',
  '/cards/germany.png',
  '/cards/egypt.png',
  '/cards/scotland.png',
  '/cards/thailand.png',
  '/cards/laos.png',
];

const PARTICLE_COUNT = 80;

export default function ParticleTransition({ active, onComplete }) {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const imagesRef = useRef([]);
  const rafRef = useRef(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    // Preload images
    let loaded = 0;
    const imgs = CARD_IMAGES.map(src => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        loaded++;
        if (loaded === CARD_IMAGES.length) init();
      };
      img.onerror = () => { loaded++; if (loaded === CARD_IMAGES.length) init(); };
      return img;
    });
    imagesRef.current = imgs;

    // If images already cached, init immediately
    if (imgs.every(i => i.complete)) init();

    function init() {
      // Build particles
      particlesRef.current = Array.from({ length: PARTICLE_COUNT }, (_, i) => {
        const img = imgs[i % imgs.length];
        const size = 60 + Math.random() * 60; // 60–120px
        const angle = Math.random() * Math.PI * 2;
        const radius = 80 + Math.random() * 120; // start near centre
        const targetAngle = Math.random() * Math.PI * 2;
        const targetRadius = 200 + Math.random() * (Math.min(canvas.width, canvas.height) * 0.45);

        return {
          img,
          size,
          // Start position — clustered at centre
          x: cx + Math.cos(angle) * radius * 0.3,
          y: cy + Math.sin(angle) * radius * 0.3,
          // Target — explode outward
          tx: cx + Math.cos(targetAngle) * targetRadius,
          ty: cy + Math.sin(targetAngle) * targetRadius,
          rotation: (Math.random() - 0.5) * 40,
          targetRotation: (Math.random() - 0.5) * 360,
          opacity: 0,
          scale: 0.2,
          // Animation timing
          delay: Math.random() * 0.3,
          borderRadius: 14,
        };
      });

      startTimeRef.current = performance.now();
      animate();
    }

    const DURATION = 2200; // total ms
    const EXPLODE_END = 0.45; // fraction when explosion peaks
    const IMPLODE_START = 0.5; // fraction when they start coming back

    function easeInOut(t) {
      return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    }

    function easeOutBack(t) {
      const c1 = 1.70158, c3 = c1 + 1;
      return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
    }

    function drawRoundedImage(ctx, img, x, y, w, h, r) {
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + w - r, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + r);
      ctx.lineTo(x + w, y + h - r);
      ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      ctx.lineTo(x + r, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
      ctx.clip();
      try { ctx.drawImage(img, x, y, w, h); } catch(e) {}
      ctx.restore();
    }

    function animate() {
      const elapsed = performance.now() - startTimeRef.current;
      const progress = Math.min(elapsed / DURATION, 1);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach(p => {
        const pProgress = Math.max(0, Math.min((progress - p.delay) / (1 - p.delay), 1));
        if (pProgress <= 0) return;

        let x, y, rotation, scale, opacity;

        if (pProgress < EXPLODE_END) {
          // Exploding outward
          const t = easeInOut(pProgress / EXPLODE_END);
          x = p.x + (p.tx - p.x) * t;
          y = p.y + (p.ty - p.y) * t;
          rotation = p.rotation + (p.targetRotation - p.rotation) * t;
          scale = 0.2 + 0.8 * t;
          opacity = Math.min(pProgress / 0.15, 1);
        } else if (pProgress < IMPLODE_START) {
          // Peak — fully scattered
          x = p.tx; y = p.ty;
          rotation = p.targetRotation;
          scale = 1;
          opacity = 1;
        } else {
          // Imploding back to centre, shrinking to nothing
          const t = easeInOut((pProgress - IMPLODE_START) / (1 - IMPLODE_START));
          x = p.tx + (cx - p.tx) * t;
          y = p.ty + (cy - p.ty) * t;
          rotation = p.targetRotation * (1 - t);
          scale = 1 - t;
          opacity = 1 - Math.pow(t, 2);
        }

        ctx.save();
        ctx.globalAlpha = opacity;
        ctx.translate(x, y);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.scale(scale, scale);

        const w = p.size, h = p.size * 1.2;
        drawRoundedImage(ctx, p.img, -w / 2, -h / 2, w, h, p.borderRadius);

        ctx.restore();
      });

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (onComplete) onComplete();
      }
    }

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [active]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        pointerEvents: 'none',
        background: '#13294B',
      }}
    />
  );
}
