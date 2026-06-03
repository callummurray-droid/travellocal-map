import { useEffect, useRef } from 'react';

const CARD_IMAGES = [
  '/cards/morocco.png', '/cards/india.png', '/cards/indonesia.png',
  '/cards/portugal.png', '/cards/greece.png', '/cards/costarica.png',
  '/cards/peru.png', '/cards/italy.png', '/cards/australia.png',
  '/cards/germany.png', '/cards/egypt.png', '/cards/scotland.png',
  '/cards/thailand.png', '/cards/laos.png',
];

const PARTICLE_COUNT = 80;
const DURATION = 3800; // ms — slower, more cinematic

export default function ParticleTransition({ active, onComplete }) {
  const canvasRef = useRef(null);
  const rafRef    = useRef(null);

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;

    const cx = canvas.width  / 2;
    const cy = canvas.height / 2;

    // Preload images
    let loaded = 0;
    const imgs = CARD_IMAGES.map(src => {
      const img = new Image();
      img.src = src;
      img.onload  = () => { loaded++; if (loaded === CARD_IMAGES.length) init(); };
      img.onerror = () => { loaded++; if (loaded === CARD_IMAGES.length) init(); };
      return img;
    });
    if (imgs.every(i => i.complete)) init();

    function init() {
      // Particles start OUTSIDE — scattered around the viewport edges
      // and travel INWARD toward centre (like the marquee being sucked in)
      const particles = Array.from({ length: PARTICLE_COUNT }, (_, i) => {
        const img  = imgs[i % imgs.length];
        const size = 55 + Math.random() * 70;

        // Start position — spread around the full viewport
        const angle  = (i / PARTICLE_COUNT) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
        const spread = 0.38 + Math.random() * 0.38; // 38–76% of half-viewport
        const hw     = canvas.width  / 2;
        const hh     = canvas.height / 2;
        const sx     = cx + Math.cos(angle) * hw * spread * 2;
        const sy     = cy + Math.sin(angle) * hh * spread * 2;

        // End position — converge tightly at centre, tiny
        const endAngle  = Math.random() * Math.PI * 2;
        const endRadius = Math.random() * 40;
        const ex = cx + Math.cos(endAngle) * endRadius;
        const ey = cy + Math.sin(endAngle) * endRadius;

        return {
          img, size,
          sx, sy, ex, ey,
          startRotation: (Math.random() - 0.5) * 30,
          endRotation:   (Math.random() - 0.5) * 720,
          delay: Math.random() * 0.25, // slight stagger
        };
      });

      let startTime = null;

      function ease(t) {
        // Cubic ease in — starts slow, accelerates toward centre
        return t * t * t;
      }

      function easeInOut(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
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

      function animate(ts) {
        if (!startTime) startTime = ts;
        const elapsed  = ts - startTime;
        const progress = Math.min(elapsed / DURATION, 1);

        // Dark navy background — map is NOT shown yet
        ctx.fillStyle = '#13294B';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        particles.forEach(p => {
          // Each particle has a slight delay before starting
          const raw = Math.max(0, (progress - p.delay) / (1 - p.delay));
          if (raw <= 0) return;
          const t = Math.min(raw, 1);

          const eased = easeInOut(t);

          // Position — from scattered edge to centre
          const x = p.sx + (p.ex - p.sx) * eased;
          const y = p.sy + (p.ey - p.sy) * eased;

          // Scale — starts at 1, shrinks to 0 as they converge
          const scale = 1 - Math.pow(eased, 1.5) * 0.95;

          // Opacity — fades out in final 20%
          const opacity = t < 0.8 ? 1 : 1 - ((t - 0.8) / 0.2);

          // Rotation — spins as it travels
          const rotation = p.startRotation + (p.endRotation - p.startRotation) * eased;

          if (scale <= 0 || opacity <= 0) return;

          ctx.save();
          ctx.globalAlpha = opacity;
          ctx.translate(x, y);
          ctx.rotate((rotation * Math.PI) / 180);
          ctx.scale(scale, scale);

          const w = p.size, h = p.size * 1.2;
          drawRoundedImage(ctx, p.img, -w / 2, -h / 2, w, h, 14);

          ctx.restore();
        });

        if (progress < 1) {
          rafRef.current = requestAnimationFrame(animate);
        } else {
          // All particles gone — now reveal the map
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          if (onComplete) onComplete();
        }
      }

      rafRef.current = requestAnimationFrame(animate);
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
      }}
    />
  );
}
