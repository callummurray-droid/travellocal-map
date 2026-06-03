import { useEffect, useRef } from 'react';

const DURATION = 4200;

export default function ParticleTransition({ active, capturedCards, onComplete }) {
  const canvasRef  = useRef(null);
  const rafRef     = useRef(null);

  useEffect(() => {
    if (!active || !capturedCards?.length) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;

    const cx = canvas.width  / 2;
    const cy = canvas.height / 2;

    // Cache gradient once — not inside animation loop
    const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    grad.addColorStop(0,   '#13294B');
    grad.addColorStop(0.5, '#162d4a');
    grad.addColorStop(1,   '#192f48');

    // Cache vignette gradient once
    const vignette = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(canvas.width, canvas.height) * 0.7);
    vignette.addColorStop(0,   'rgba(13,24,41,0.82)');
    vignette.addColorStop(0.5, 'rgba(13,24,41,0.45)');
    vignette.addColorStop(1,   'rgba(13,24,41,0)');

    // Preload images properly using a map
    const srcSet  = [...new Set(capturedCards.map(c => c.src))];
    const imgMap  = {};
    let   pending = srcSet.length;

    const onLoaded = () => {
      pending--;
      if (pending <= 0) init();
    };

    srcSet.forEach(src => {
      const img = new Image();
      imgMap[src] = img;
      if (img.complete && img.naturalWidth) { onLoaded(); return; }
      img.onload  = onLoaded;
      img.onerror = onLoaded;
      img.src = src;
    });

    // If all already cached
    if (pending <= 0) init();

    function init() {
      const particles = capturedCards.map((card, i) => ({
        img:   imgMap[card.src],
        sx:    card.x,
        sy:    card.y,
        sw:    card.w,
        sh:    card.h,
        ex:    cx + (Math.random() - 0.5) * 50,
        ey:    cy + (Math.random() - 0.5) * 50,
        endRotation: (Math.random() - 0.5) * 480,
        // Stagger spread across first 25% of animation
        delay: (i / capturedCards.length) * 0.25,
      }));

      let startTime = null;

      // Ease — slow start, accelerates into centre
      function easeIn(t) { return t * t * t; }

      // Smooth step for opacity
      function smoothstep(t) { return t * t * (3 - 2 * t); }

      function drawRoundedImage(img, x, y, w, h, r) {
        if (!img?.complete || !img.naturalWidth) return;
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.arcTo(x + w, y,     x + w, y + h, r);
        ctx.arcTo(x + w, y + h, x,     y + h, r);
        ctx.arcTo(x,     y + h, x,     y,     r);
        ctx.arcTo(x,     y,     x + w, y,     r);
        ctx.closePath();
        ctx.clip();
        try { ctx.drawImage(img, x, y, w, h); } catch(e) {}
        ctx.restore();
      }

      function animate(ts) {
        if (!startTime) startTime = ts;
        const elapsed  = ts - startTime;
        const progress = Math.min(elapsed / DURATION, 1);

        // Background gradient — cached, no allocation per frame
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw particles
        particles.forEach(p => {
          const raw = Math.max(0, (progress - p.delay) / (1 - p.delay));
          const t   = Math.min(raw, 1);

          if (t <= 0) {
            // Card hasn't started moving yet — draw at exact original position
            ctx.save();
            ctx.globalAlpha = 1;
            drawRoundedImage(p.img, p.sx - p.sw/2, p.sy - p.sh/2, p.sw, p.sh, 16);
            ctx.restore();
            return;
          }

          const eased = easeIn(t);

          const x       = p.sx + (p.ex - p.sx) * eased;
          const y       = p.sy + (p.ey - p.sy) * eased;
          const scale   = Math.max(0, 1 - eased * 0.92);
          const opacity = t < 0.65 ? 1 : 1 - smoothstep((t - 0.65) / 0.35);
          const rot     = p.endRotation * eased;

          if (scale < 0.02 || opacity < 0.01) return;

          const w = p.sw * scale;
          const h = p.sh * scale;

          ctx.save();
          ctx.globalAlpha = opacity;
          ctx.translate(x, y);
          ctx.rotate(rot * Math.PI / 180);
          drawRoundedImage(p.img, -w/2, -h/2, w, h, Math.max(2, 16 * scale));
          ctx.restore();
        });

        // Vignette overlay — matches Act 1 dark centre
        ctx.fillStyle = vignette;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Canvas itself fades in over first 200ms to avoid pop
        const fadeIn = Math.min(elapsed / 200, 1);
        canvas.style.opacity = fadeIn;

        if (progress < 1) {
          rafRef.current = requestAnimationFrame(animate);
        } else {
          if (onComplete) onComplete();
        }
      }

      rafRef.current = requestAnimationFrame(animate);
    }

    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [active, capturedCards]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        pointerEvents: 'none',
        opacity: 0,
        willChange: 'opacity',
      }}
    />
  );
}
