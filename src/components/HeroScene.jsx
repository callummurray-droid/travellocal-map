import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { STAMP_CONFIG } from '../data/countries';

const HERO_CARDS = [
  { src: '/heroes/hero2.png', rotate: -8,  x: -95,  y: 20 },
  { src: '/heroes/hero1.png', rotate:  2,  x:  0,   y: 0  },
  { src: '/heroes/hero3.png', rotate:  9,  x:  88,  y: 15 },
];

// Extended stamp set — randomise subset on each load
const ALL_STAMPS = [
  { id: 'turkey',      src: '/stamps/turkey.png',      defaultRotate: -8  },
  { id: 'japan',       src: '/stamps/japan.png',        defaultRotate: -5  },
  { id: 'usa',         src: '/stamps/usa.png',          defaultRotate:  6  },
  { id: 'switzerland', src: '/stamps/switzerland.png',  defaultRotate:  4  },
  { id: 'brazil',      src: '/stamps/brazil.png',       defaultRotate:  8  },
  { id: 'mexico',      src: '/stamps/mexico.png',       defaultRotate: -6  },
];

// Positions for 6 stamps around the canvas
const STAMP_POSITIONS = [
  { top: '4%',  left: '0%',   width: 150 },
  { top: '24%', left: '0%',   width: 185 },
  { top: '62%', left: '-1%',  width: 172 },
  { top: '2%',  right: '16%', width: 155 },
  { top: '8%',  right: '0%',  width: 170 },
  { top: '56%', right: '-1%', width: 178 },
];

function getStampSubset() {
  const shuffled = [...ALL_STAMPS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 6).map((stamp, i) => ({
    ...stamp,
    ...STAMP_POSITIONS[i],
  }));
}

export default function HeroScene({ onExplore }) {
  const sceneRef  = useRef(null);
  const stampsRef = useRef(getStampSubset());

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.15 });

      // Nav slides down
      tl.to('#tl-nav', { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, 0);

      // Stamps fly in from off-screen edges
      stampsRef.current.forEach((stamp, i) => {
        const el = `#stamp-${stamp.id}`;
        const fromX = stamp.left !== undefined ? -350 : 350;
        gsap.set(el, { opacity: 0, x: fromX, rotation: stamp.defaultRotate * 2 });
        tl.to(el, {
          opacity: 0.88,
          x: 0,
          rotation: stamp.defaultRotate,
          duration: 1.0,
          ease: 'back.out(1.3)',
        }, 0.05 + i * 0.09);
      });

      // Hero cards fan in
      gsap.set('.hero-card', { opacity: 0, y: 70, scale: 0.82 });
      tl.to('.hero-card', {
        opacity: 1, y: 0, scale: 1,
        duration: 0.85,
        stagger: 0.13,
        ease: 'back.out(1.5)',
      }, 0.35);

      // Headline words slide up through mask
      gsap.set('.headline-word-inner', { y: '110%' });
      tl.to('.headline-word-inner', {
        y: '0%',
        duration: 0.85,
        stagger: 0.055,
        ease: 'power4.out',
      }, 0.7);

      // Trustpilot
      gsap.set('#trustpilot', { opacity: 0, y: 14 });
      tl.to('#trustpilot', { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, 1.25);

      // CTA
      gsap.set('#cta-btn', { opacity: 0, scale: 0.82, y: 12 });
      tl.to('#cta-btn', { opacity: 1, scale: 1, y: 0, duration: 0.75, ease: 'back.out(2.2)' }, 1.45);

    }, sceneRef);
    return () => ctx.revert();
  }, []);

  const handleExplore = () => {
    const tl = gsap.timeline({ onComplete: onExplore });

    tl.to('#cta-btn', { scale: 1.06, duration: 0.12, ease: 'power2.out' })
      .to('#cta-btn', { scale: 0.94, duration: 0.08, ease: 'power2.in' });

    tl.to('.headline-word-inner', { y: '110%', duration: 0.5, stagger: 0.035, ease: 'power3.in' }, 0.18)
      .to('#trustpilot',  { opacity: 0, y: -12, duration: 0.35, ease: 'power2.in' }, 0.18)
      .to('#cta-btn',     { opacity: 0, scale: 0.88, y: 14, duration: 0.35, ease: 'power2.in' }, 0.26)
      .to('.hero-card',   { opacity: 0, scale: 0.78, y: -40, stagger: 0.06, duration: 0.5, ease: 'power3.in' }, 0.18)
      .to(stampsRef.current.map(s => `#stamp-${s.id}`), {
        opacity: 0, scale: 0.45, duration: 0.45, stagger: 0.04, ease: 'power3.in',
      }, 0.12)
      .to('#tl-nav', { opacity: 0, duration: 0.35, ease: 'power2.in' }, 0.18);
  };

  const words = ['Explore','the','world','through','the','eyes','of','someone','who','lives','there'];

  return (
    <div ref={sceneRef} className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden select-none">

      {/* Vertical gradient — top navy to dark navy bottom, matching Figma */}
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(180deg, #1e3564 0%, #172850 35%, #0f1e3a 70%, #0d1829 100%)'
      }}/>

      {/* Stamps — mix-blend-mode multiply removes black backgrounds */}
      {stampsRef.current.map(stamp => (
        <img
          key={stamp.id}
          id={`stamp-${stamp.id}`}
          src={stamp.src}
          alt={stamp.id}
          className="stamp absolute pointer-events-auto cursor-pointer"
          style={{
            width: stamp.width,
            top: stamp.top,
            left: stamp.left,
            right: stamp.right,
            transform: `rotate(${stamp.defaultRotate}deg)`,
            zIndex: 3,
            opacity: 0,
            mixBlendMode: 'screen',
            filter: 'contrast(1.05) brightness(1.05)',
          }}
        />
      ))}

      {/* Hero photo cards — images already have rounded corners baked in */}
      <div className="relative flex items-end justify-center mb-10" style={{ height: 300, width: 460 }}>
        {HERO_CARDS.map((card, i) => (
          <div
            key={i}
            className="hero-card absolute"
            style={{
              width: 215,
              transform: `rotate(${card.rotate}deg) translateX(${card.x}px) translateY(${card.y}px)`,
              zIndex: i === 1 ? 10 : i === 0 ? 8 : 9,
              borderRadius: 18,
              overflow: 'hidden',
              boxShadow: '0 24px 64px rgba(0,0,0,0.55)',
              background: 'transparent',
            }}
          >
            <img
              src={card.src}
              alt=""
              style={{
                width: '100%',
                height: 260,
                objectFit: 'cover',
                display: 'block',
                borderRadius: 18,
                background: 'transparent',
              }}
            />
          </div>
        ))}
      </div>

      {/* Headline */}
      <h1
        className="relative text-center text-white z-10 mb-4"
        style={{
          fontFamily: 'Georgia, serif',
          fontSize: 'clamp(30px, 3.8vw, 56px)',
          lineHeight: 1.2,
          maxWidth: 740,
          letterSpacing: '-0.02em',
          fontWeight: 400,
        }}
      >
        {words.map((word, i) => (
          <span key={i} style={{ display: 'inline-block', overflow: 'hidden', marginRight: '0.28em' }}>
            <span className="headline-word-inner" style={{ display: 'inline-block' }}>{word}</span>
          </span>
        ))}
      </h1>

      {/* Trustpilot */}
      <div id="trustpilot" className="flex items-center gap-2 mb-7 z-10">
        <span style={{ fontFamily: 'Mulish, sans-serif', color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>Excellent</span>
        <div className="flex gap-1">
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

      {/* CTA */}
      <button id="cta-btn" className="cta-btn z-10" onClick={handleExplore}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
        Let's explore the world together
      </button>
    </div>
  );
}
