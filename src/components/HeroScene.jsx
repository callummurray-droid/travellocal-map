import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

const ALL_CARDS = [
  { src: '/cards/morocco.png',   shadow: 'rgba(61,90,128,0.5)'   },
  { src: '/cards/india.png',     shadow: 'rgba(139,115,85,0.5)'  },
  { src: '/cards/indonesia.png', shadow: 'rgba(184,149,106,0.5)' },
  { src: '/cards/portugal.png',  shadow: 'rgba(196,97,58,0.5)'   },
  { src: '/cards/greece.png',    shadow: 'rgba(196,97,58,0.5)'   },
  { src: '/cards/costarica.png', shadow: 'rgba(232,160,32,0.5)'  },
  { src: '/cards/peru.png',      shadow: 'rgba(61,90,128,0.5)'   },
  { src: '/cards/italy.png',     shadow: 'rgba(196,97,58,0.5)'   },
  { src: '/cards/australia.png', shadow: 'rgba(196,97,58,0.5)'   },
  { src: '/cards/germany.png',   shadow: 'rgba(232,160,32,0.5)'  },
  { src: '/cards/egypt.png',     shadow: 'rgba(61,90,128,0.5)'   },
  { src: '/cards/scotland.png',  shadow: 'rgba(184,149,106,0.5)' },
  { src: '/cards/thailand.png',  shadow: 'rgba(196,97,58,0.5)'   },
  { src: '/cards/laos.png',      shadow: 'rgba(196,97,58,0.5)'   },
];

const CARD_W = 175;
const CARD_H = 215;
const GAP    = 80;

const Y_OFFSETS = [
  -180, 120, -80, 200, -220, 60,
  -140, 180, -60, 240, -200, 100, -100, 160,
];

const SPOTLIGHT_R = 260; // px radius of the reveal circle

export default function HeroScene({ onExplore }) {
  const sceneRef     = useRef(null);
  const stripRef     = useRef(null);
  const canvasRef    = useRef(null);
  const mouseRef     = useRef({ x: -999, y: -999 });
  const cursorRef    = useRef(null);
  const rafRef       = useRef(null);
  const tweenRef     = useRef(null);
  const [entered, setEntered] = useState(false);

  // Marquee loop
  useEffect(() => {
    const el = stripRef.current;
    if (!el) return;
    const totalW = (CARD_W + GAP) * ALL_CARDS.length;
    gsap.set(el, { x: 0 });
    const tween = gsap.to(el, {
      x: -totalW, duration: 60, ease: 'none', repeat: -1,
      modifiers: {
        x: gsap.utils.unitize(x => {
          const v = parseFloat(x);
          return v <= -totalW ? v + totalW : v;
        }),
      },
    });
    tweenRef.current = tween;
    return () => tween.kill();
  }, []);

  // Canvas spotlight — draws the map with a circular clip reveal
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = '/world-map.png';

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    let animFrame;
    const draw = () => {
      const { x, y } = mouseRef.current;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (x < 0) { animFrame = requestAnimationFrame(draw); return; }

      // Draw map image covering full canvas
      ctx.save();

      // Feathered circle clip using radial gradient as mask
      const gradient = ctx.createRadialGradient(x, y, SPOTLIGHT_R * 0.4, x, y, SPOTLIGHT_R);
      gradient.addColorStop(0, 'rgba(0,0,0,1)');
      gradient.addColorStop(1, 'rgba(0,0,0,0)');

      ctx.beginPath();
      ctx.arc(x, y, SPOTLIGHT_R, 0, Math.PI * 2);
      ctx.clip();

      // Draw the world map image stretched to fill viewport
      if (img.complete) {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      }

      // Apply feathered edge by compositing the gradient as alpha mask
      ctx.globalCompositeOperation = 'destination-in';
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.restore();
      animFrame = requestAnimationFrame(draw);
    };

    img.onload = () => { animFrame = requestAnimationFrame(draw); };
    if (img.complete) animFrame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener('resize', resize);
    };
  }, []);

  // Mouse tracking — smooth cursor follow
  useEffect(() => {
    const cursor = cursorRef.current;
    let cx = -100, cy = -100;

    const onMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      if (!entered) setEntered(true);
      // Smooth cursor lag
      gsap.to({ cx, cy }, {
        duration: 0.15,
        cx: e.clientX,
        cy: e.clientY,
        onUpdate: function() {
          cx = this.targets()[0].cx;
          cy = this.targets()[0].cy;
          if (cursor) {
            cursor.style.left = cx + 'px';
            cursor.style.top  = cy + 'px';
          }
        },
      });
    };

    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  // Entrance animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.15 });

      tl.to('#tl-nav', { opacity: 1, duration: 0.7, ease: 'power3.out' }, 0);

      gsap.set('#marquee-wrap', { opacity: 0 });
      tl.to('#marquee-wrap', { opacity: 0.5, duration: 1.4, ease: 'power2.out' }, 0.2);

      gsap.set('.headline-word-inner', { y: '110%' });
      tl.to('.headline-word-inner', { y: '0%', duration: 0.9, stagger: 0.055, ease: 'power4.out' }, 0.35);

      gsap.set('#trustpilot', { opacity: 0, y: 14 });
      tl.to('#trustpilot', { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, 1.0);

      gsap.set('#cta-btn', { opacity: 0, scale: 0.85, y: 10 });
      tl.to('#cta-btn', { opacity: 1, scale: 1, y: 0, duration: 0.7, ease: 'back.out(2)' }, 1.2);

    }, sceneRef);
    return () => ctx.revert();
  }, []);

  const handleExplore = () => {
    const tl = gsap.timeline({ onComplete: onExplore });
    tl.to('#cta-btn', { scale: 1.06, duration: 0.12, ease: 'power2.out' })
      .to('#cta-btn', { scale: 0.95, duration: 0.08 });
    tl.to('.headline-word-inner', { y: '110%', duration: 0.5, stagger: 0.03, ease: 'power3.in' }, 0.15)
      .to('#trustpilot',   { opacity: 0, y: -10, duration: 0.35 }, 0.15)
      .to('#cta-btn',      { opacity: 0, scale: 0.9, duration: 0.3 }, 0.22)
      .to('#marquee-wrap', { opacity: 0, duration: 0.4 }, 0.1)
      .to('#spotlight-canvas', { opacity: 0, duration: 0.3 }, 0.1)
      .to('#tl-nav',       { opacity: 0, duration: 0.3 }, 0.15)
      .to('#custom-cursor', { opacity: 0, duration: 0.2 }, 0.1);
  };

  const words = ['Explore','the','world','through','the','eyes','of','someone','who','lives','there'];
  const displayCards = [...ALL_CARDS, ...ALL_CARDS];

  return (
    <div
      ref={sceneRef}
      className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden select-none"
      style={{ cursor: 'none' }}
    >
      {/* Navy background */}
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(180deg, #1c3260 0%, #162a50 30%, #101f3c 65%, #0d1829 100%)'
      }}/>

      {/* World map spotlight canvas — sits above bg, below cards */}
      <canvas
        ref={canvasRef}
        id="spotlight-canvas"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 2,
          pointerEvents: 'none',
          opacity: 0.9,
        }}
      />

      {/* Marquee cards */}
      <div
        id="marquee-wrap"
        style={{
          position: 'absolute', inset: 0, overflow: 'hidden',
          zIndex: 3, opacity: 0, pointerEvents: 'none',
          display: 'flex', alignItems: 'center',
        }}
      >
        <div
          ref={stripRef}
          style={{
            display: 'flex', alignItems: 'center',
            gap: GAP, willChange: 'transform', width: 'max-content',
          }}
        >
          {displayCards.map((card, i) => (
            <div
              key={i}
              style={{
                width: CARD_W, height: CARD_H, flexShrink: 0,
                transform: `translateY(${Y_OFFSETS[i % Y_OFFSETS.length]}px)`,
                borderRadius: 18, overflow: 'hidden',
                boxShadow: `0 8px 32px ${card.shadow}`,
              }}
            >
              <img
                src={card.src} alt=""
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', pointerEvents: 'none' }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Radial vignette so centre headline reads clearly */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 4, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 50% 45% at 50% 50%, rgba(13,24,41,0.88) 0%, rgba(13,24,41,0.5) 55%, transparent 100%)',
      }}/>

      {/* Centre content */}
      <div style={{
        position: 'relative', zIndex: 10,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        textAlign: 'center', maxWidth: 780, padding: '0 40px',
      }}>
        <h1 style={{
          fontFamily: 'Georgia, serif',
          fontSize: 'clamp(32px, 4vw, 60px)',
          lineHeight: 1.2, color: 'white',
          letterSpacing: '-0.02em', fontWeight: 400, marginBottom: 20,
        }}>
          {words.map((word, i) => (
            <span key={i} style={{ display: 'inline-block', overflow: 'hidden', marginRight: '0.26em' }}>
              <span className="headline-word-inner" style={{ display: 'inline-block' }}>{word}</span>
            </span>
          ))}
        </h1>

        <div id="trustpilot" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
          <span style={{ fontFamily: 'Mulish, sans-serif', color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>Excellent</span>
          <div style={{ display: 'flex', gap: 4 }}>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="tp-star">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="white">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
            ))}
          </div>
          <span style={{ fontFamily: 'Mulish, sans-serif', color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>2,276 reviews</span>
          <span style={{ fontFamily: 'Mulish, sans-serif', color: '#00b67a', fontSize: 13, fontWeight: 600 }}>★ Trustpilot</span>
        </div>

        <button id="cta-btn" className="cta-btn" onClick={handleExplore}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
          Let's explore the world together
        </button>
      </div>

      {/* Custom cursor */}
      <div
        ref={cursorRef}
        id="custom-cursor"
        style={{
          position: 'fixed',
          width: 12,
          height: 12,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.9)',
          boxShadow: '0 0 20px 6px rgba(255,255,255,0.25), 0 0 0 1px rgba(255,255,255,0.4)',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          zIndex: 9999,
          transition: 'width 0.2s, height 0.2s',
          mixBlendMode: 'screen',
        }}
      />

      {/* Hint text — fades after mouse moves */}
      {!entered && (
        <div style={{
          position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)',
          zIndex: 20, display: 'flex', alignItems: 'center', gap: 8,
          fontFamily: 'Mulish, sans-serif', fontSize: 12,
          color: 'rgba(255,255,255,0.35)', letterSpacing: '0.08em',
          animation: 'fadeInHint 1s ease 2s both',
          pointerEvents: 'none',
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M12 2a7 7 0 0 1 7 7v1l1 1v3l-1 1-1 4H6l-1-4-1-1v-3l1-1V9a7 7 0 0 1 7-7z"/>
            <path d="M12 2v4M8.5 3.5l2 2M15.5 3.5l-2 2"/>
          </svg>
          Move your cursor to explore
        </div>
      )}

      <style>{`
        @keyframes fadeInHint {
          from { opacity: 0; transform: translateX(-50%) translateY(6px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </div>
  );
}
