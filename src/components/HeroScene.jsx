import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const ALL_CARDS = [
  { src: '/cards/morocco.png',   shadow: 'rgba(61,90,128,0.6)'   },
  { src: '/cards/india.png',     shadow: 'rgba(139,115,85,0.6)'  },
  { src: '/cards/indonesia.png', shadow: 'rgba(184,149,106,0.6)' },
  { src: '/cards/portugal.png',  shadow: 'rgba(196,97,58,0.6)'   },
  { src: '/cards/greece.png',    shadow: 'rgba(196,97,58,0.6)'   },
  { src: '/cards/costarica.png', shadow: 'rgba(232,160,32,0.6)'  },
  { src: '/cards/peru.png',      shadow: 'rgba(61,90,128,0.6)'   },
  { src: '/cards/italy.png',     shadow: 'rgba(196,97,58,0.6)'   },
  { src: '/cards/australia.png', shadow: 'rgba(196,97,58,0.6)'   },
  { src: '/cards/germany.png',   shadow: 'rgba(232,160,32,0.6)'  },
  { src: '/cards/egypt.png',     shadow: 'rgba(61,90,128,0.6)'   },
  { src: '/cards/scotland.png',  shadow: 'rgba(184,149,106,0.6)' },
  { src: '/cards/thailand.png',  shadow: 'rgba(196,97,58,0.6)'   },
  { src: '/cards/laos.png',      shadow: 'rgba(196,97,58,0.6)'   },
];

// Each row has cards with individual vertical offsets to break the straight line
// offsets are applied per-card within the row to create the scattered feel
const ROWS = [
  {
    id: 0,
    cards: [0, 4, 8, 12, 2, 6, 10],
    baseTop: 80,      // px from top
    speed: 40,
    direction: 1,
    cardW: 170,
    cardH: 210,
    // Per-card y offset within this row — creates the scattered look
    offsets: [0, -30, 20, -15, 25, -20, 10],
  },
  {
    id: 1,
    cards: [3, 7, 11, 1, 5, 9, 13],
    baseTop: 280,
    speed: 55,
    direction: -1,
    cardW: 180,
    cardH: 220,
    offsets: [20, -25, 10, -30, 15, -10, 25],
  },
  {
    id: 2,
    cards: [1, 5, 9, 13, 3, 7, 11],
    baseTop: 490,
    speed: 38,
    direction: 1,
    cardW: 165,
    cardH: 205,
    offsets: [-20, 25, -10, 20, -25, 15, -5],
  },
  {
    id: 3,
    cards: [2, 6, 10, 0, 4, 8, 12],
    baseTop: 680,
    speed: 48,
    direction: -1,
    cardW: 175,
    cardH: 215,
    offsets: [15, -20, 30, -10, 20, -25, 5],
  },
];

function MarqueeRow({ row }) {
  const rowRef = useRef(null);

  useEffect(() => {
    const el = rowRef.current;
    if (!el) return;
    const gap = 24;
    const totalW = (row.cardW + gap) * row.cards.length;
    const startX = row.direction === 1 ? 0 : -totalW;
    gsap.set(el, { x: startX });

    const tween = gsap.to(el, {
      x: row.direction === 1 ? -totalW : 0,
      duration: row.speed,
      ease: 'none',
      repeat: -1,
      modifiers: {
        x: gsap.utils.unitize(x => {
          const v = parseFloat(x);
          if (row.direction === 1) return v <= -totalW ? v + totalW : v;
          return v >= 0 ? v - totalW : v;
        }),
      },
    });

    return () => tween.kill();
  }, []);

  // Triple the cards so the loop is always seamless
  const display = [...row.cards, ...row.cards, ...row.cards];

  return (
    <div
      ref={rowRef}
      style={{
        display: 'flex',
        gap: 24,
        alignItems: 'flex-start',
        willChange: 'transform',
        width: 'max-content',
        position: 'absolute',
        top: row.baseTop,
        left: 0,
      }}
    >
      {display.map((cardIdx, i) => {
        const card = ALL_CARDS[cardIdx];
        const offset = row.offsets[i % row.offsets.length];
        return (
          <div
            key={i}
            style={{
              width: row.cardW,
              height: row.cardH,
              flexShrink: 0,
              transform: `translateY(${offset}px)`,
              borderRadius: 18,
              overflow: 'hidden',
              boxShadow: `0 8px 32px ${card.shadow}`,
            }}
          >
            <img
              src={card.src}
              alt=""
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
                pointerEvents: 'none',
                userSelect: 'none',
              }}
            />
          </div>
        );
      })}
    </div>
  );
}

export default function HeroScene({ onExplore }) {
  const sceneRef = useRef(null);

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
      .to('#marquee-wrap', { opacity: 0, duration: 0.5 }, 0.1)
      .to('#tl-nav',       { opacity: 0, duration: 0.3 }, 0.15);
  };

  const words = ['Explore','the','world','through','the','eyes','of','someone','who','lives','there'];

  return (
    <div ref={sceneRef} className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden select-none">

      {/* Background */}
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(180deg, #1c3260 0%, #162a50 30%, #101f3c 65%, #0d1829 100%)'
      }}/>

      {/* Marquee layer — absolute positioned rows at different heights */}
      <div
        id="marquee-wrap"
        style={{
          position: 'absolute',
          inset: 0,
          overflow: 'hidden',
          zIndex: 1,
          opacity: 0,
          pointerEvents: 'none',
        }}
      >
        {ROWS.map(row => <MarqueeRow key={row.id} row={row} />)}
      </div>

      {/* Radial vignette — darkens centre so headline is readable */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 55% 50% at 50% 50%, rgba(13,24,41,0.82) 0%, rgba(13,24,41,0.4) 60%, transparent 100%)',
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
    </div>
  );
}
