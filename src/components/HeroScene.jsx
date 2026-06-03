import { useEffect, useRef } from 'react';
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

// Single row — large gaps, dramatic vertical offsets per card
// Heights reference: viewport centre = 0, negative = up, positive = down
const CARD_W = 175;
const CARD_H = 215;
const GAP = 80; // big breathing room between cards

// Vertical offset for each card — large range to create the scattered floating look
const Y_OFFSETS = [
  -180,  // card 0 — high up
   120,  // card 1 — low
  -80,   // card 2 — mid up
   200,  // card 3 — very low
  -220,  // card 4 — very high
   60,   // card 5 — slightly low
  -140,  // card 6 — high
   180,  // card 7 — low
  -60,   // card 8 — slightly high
   240,  // card 9 — very low
  -200,  // card 10 — very high
   100,  // card 11 — mid low
  -100,  // card 12 — mid high
   160,  // card 13 — low
];

export default function HeroScene({ onExplore }) {
  const sceneRef  = useRef(null);
  const stripRef  = useRef(null);

  useEffect(() => {
    const el = stripRef.current;
    if (!el) return;

    const totalW = (CARD_W + GAP) * ALL_CARDS.length;

    gsap.set(el, { x: 0 });

    const tween = gsap.to(el, {
      x: -totalW,
      duration: 60,
      ease: 'none',
      repeat: -1,
      modifiers: {
        x: gsap.utils.unitize(x => {
          const v = parseFloat(x);
          return v <= -totalW ? v + totalW : v;
        }),
      },
    });

    return () => tween.kill();
  }, []);

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

  // Duplicate for seamless loop
  const displayCards = [...ALL_CARDS, ...ALL_CARDS];

  return (
    <div ref={sceneRef} className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden select-none">

      <div className="absolute inset-0" style={{
        background: 'linear-gradient(180deg, #1c3260 0%, #162a50 30%, #101f3c 65%, #0d1829 100%)'
      }}/>

      {/* Single marquee strip — centred vertically, cards float up/down from centre */}
      <div
        id="marquee-wrap"
        style={{
          position: 'absolute',
          inset: 0,
          overflow: 'hidden',
          zIndex: 1,
          opacity: 0,
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div
          ref={stripRef}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: GAP,
            willChange: 'transform',
            width: 'max-content',
          }}
        >
          {displayCards.map((card, i) => {
            const offset = Y_OFFSETS[i % Y_OFFSETS.length];
            return (
              <div
                key={i}
                style={{
                  width: CARD_W,
                  height: CARD_H,
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
                    draggable: false,
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Vignette — strong centre darkness so headline reads clearly */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
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
    </div>
  );
}
