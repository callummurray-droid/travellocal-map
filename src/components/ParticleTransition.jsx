import { useEffect, useRef } from 'react';

const DURATION = 3600;

export default function ParticleTransition({ active, capturedCards, onComplete }) {
  const canvasRef = useRef(null);
  const rafRef    = useRef(null);

  useEffect(() => {
    if (!active || !capturedCards?.length) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;

    const cx = canvas.width  / 2;
    const cy = canvas.height / 2;

    // Preload all unique images
    const srcSet = [...new Set(capturedCards.map(c => c.src))];
    const imgMap = {};
    let loaded = 0;

    srcSet.forEach(src => {
      const img = new Image();
      img.src = src;
      img.onload  = () => { imgMap[src] = img; loaded++; if (loaded === srcSet.length) init(); };
      img.onerror = () => { loaded++; if (loaded === srcSet.length) init(); };
    });
    if (srcSet.every(src => { const i = new Image(); i.src = src; return i.complete; })) {
      srcSet.forEach(src => { const i = new Image(); i.src = src; imgMap[src] = i; });
      init();
    }

    function init() {
      // Build particles directly from captured card positions
      // Each visible card becomes a particle starting at its exact screen location
      const particles = capturedCards.map((card, i) => ({
        img:    imgMap[card.src] || new Image(),
        sx:     card.x,           // real screen X centre
        sy:     card.y,           // real screen Y centre
        sw:     card.w,           // real card width
        sh:     card.h,           // real card height
        // End — converge tightly at screen centre
        ex:     cx + (Math.random() - 0.5) * 60,
        ey:     cy + (Math.random() - 0.5) * 60,
        startRotation: 0,         // starts at natural angle
        endRotation:   (Math.random() - 0.5) * 540,
        delay: i * (0.18 / capturedCards.length), // stagger so they don't all start at once
      }));

      let startTime = null;

      function easeInOut(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      }

      function drawRoundedImage(ctx, img, x, y, w, h, r) {
        if (!img || !img.complete || !img.naturalWidth) return;
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

        // Draw gradient matching hero exactly — no jarring colour change
        const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
        grad.addColorStop(0, '#13294B');
        grad.addColorStop(1, 'rgba(255,255,255,0.10)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        particles.forEach(p => {
          const raw = Math.max(0, (progress - p.delay) / (1 - p.delay));
          if (raw <= 0) {
            // Draw card at its original position before animation starts
            ctx.save();
            ctx.globalAlpha = 1;
            drawRoundedImage(ctx, p.img, p.sx - p.sw/2, p.sy - p.sh/2, p.sw, p.sh, 16);
            ctx.restore();
            return;
          }

          const t     = Math.min(raw, 1);
          const eased = easeInOut(t);

          // Position travels from real card location → centre
          const x = p.sx + (p.ex - p.sx) * eased;
          const y = p.sy + (p.ey - p.sy) * eased;

          // Scale — shrinks as it converges (card gets "pulled away")
          const scale = 1 - eased * 0.9;

          // Opacity — holds full until 70%, then fades out
          const opacity = t < 0.7 ? 1 : 1 - ((t - 0.7) / 0.3);

          // Rotation — spins faster as it accelerates inward
          const rotation = p.startRotation + (p.endRotation) * eased;

          if (scale <= 0.02 || opacity <= 0) return;

          const w = p.sw * scale;
          const h = p.sh * scale;

          ctx.save();
          ctx.globalAlpha = opacity;
          ctx.translate(x, y);
          ctx.rotate((rotation * Math.PI) / 180);
          drawRoundedImage(ctx, p.img, -w/2, -h/2, w, h, 16 * scale);
          ctx.restore();
        });

        if (progress < 1) {
          rafRef.current = requestAnimationFrame(animate);
        } else {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          if (onComplete) onComplete();
        }
      }

      rafRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
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
      }}
    />
  );
}
