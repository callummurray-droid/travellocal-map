import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

// All 14 destination cards with their accent colours from Figma
const ALL_CARDS = [
  { src: '/cards/morocco.png',   label: 'Morocco',    accent: '#3D5A80' },
  { src: '/cards/india.png',     label: 'India',      accent: '#8B7355' },
  { src: '/cards/indonesia.png', label: 'Indonesia',  accent: '#B8956A' },
  { src: '/cards/portugal.png',  label: 'Portugal',   accent: '#C4613A' },
  { src: '/cards/greece.png',    label: 'Greece',     accent: '#C4613A' },
  { src: '/cards/costarica.png', label: 'Costa Rica', accent: '#E8A020' },
  { src: '/cards/peru.png',      label: 'Peru',       accent: '#3D5A80' },
  { src: '/cards/italy.png',     label: 'Italy',      accent: '#C4613A' },
  { src: '/cards/australia.png', label: 'Australia',  accent: '#C4613A' },
  { src: '/cards/germany.png',   label: 'Germany',    accent: '#E8A020' },
  { src: '/cards/egypt.png',     label: 'Egypt',      accent: '#3D5A80' },
  { src: '/cards/scotland.png',  label: 'Scotland',   accent: '#B8956A' },
  { src: '/cards/thailand.png',  label: 'Thailand',   accent: '#C4613A' },
  { src: '/cards/laos.png',      label: 'Laos',       accent: '#C4613A' },
];

// 4 marquee tracks — each with different vertical position, speed, direction, card subset
const TRACKS = [
  {
    id: 0,
    cards: [0, 4, 8, 12, 1, 5],       // indices into ALL_CARDS
    top: '8%',
    speed: 35,                          // seconds for full loop
    direction: 1,                       // left
    cardWidth: 160,
    cardHeight: 200,
  },
  {
    id: 1,
    cards: [2, 6, 10, 3, 7, 11],
    top: '35%',
    speed: 45,
    direction: -1,                      // right
    cardWidth: 185,
    cardHeight: 230,
  },
  {
    id: 2,
    cards: [1, 5, 9, 13, 2, 6],
    top: '60%',
    speed: 38,
    direction: 1,
    cardWidth: 165,
    cardHeight: 205,
  },
  {
    id: 3,
    cards: [3, 7, 11, 0, 4, 8],
    top: '82%',
    speed: 50,
    direction: -1,
    cardWidth: 175,
    cardHeight: 215,
  },
];

function MarqueeTrack({ track }) {
  const trackRef = useRef(null);
  const tweenRef = useRef(null);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    const cards = track.cards.length;
    const cardW = track.cardWidth + 20; // card + gap
    const totalW = cardW * cards;

    // Duplicate cards for seamless loop
    const startX = track.direction === 1 ? 0 : -totalW;
    gsap.set(el, { x: startX });

    tweenRef.current = gsap.to(el, {
      x: track.direction === 1 ? -totalW : 0,
      duration: track.speed,
      ease: 'none',
      repeat: -1,
      modifiers: {
        x: gsap.utils.unitize(x => {
          const val = parseFloat(x);
          if (track.direction === 1) {
            return val <= -totalW ? val + totalW : val;
          } else {
            return val >= 0 ? val - totalW : val;
          }
        })
      }
    });

    return () => tweenRef.current?.kill();
  }, []);

  // Duplicate cards for seamless loop
  const displayCards = [...track.cards, ...track.cards, ...track.cards];

  return (
    <div
      style={{
        position: 'absolute',
        top: track.top,
        left: 0,
        right: 0,
        height: track.cardHeight,
        overflow: 'hidden',
        pointerEvents: 'none',
        transform: 'translateY(-50%)',
      }}
    >
      <div
        ref={trackRef}
        style={{
          display: 'flex',
          gap: 20,
          willChange: 'transform',
          width: 'max-content',
        }}
      >
        {displayCards.map((cardIdx, i) => {
          const card = ALL_CARDS[cardIdx];
          const accentColor = card.accent;
          return (
            <div
              key={`${cardIdx}-${i}`}
              style={{
                width: track.cardWidth,
                height: track.cardHeight,
                borderRadius: 16,
                overflow: 'hidden',
                flexShrink: 0,
                border: `3px solid ${accentColor}`,
                boxShadow: `0 3px 14px 0 ${accentColor}99`,
                background: accentColor,
                position: 'relative',
              }}
            >
              <img
                src={card.src}
                alt={card.label}
                style={{
                  width: '100%',
                  height: `calc(100% - 44px)`,
                  objectFit: 'cover',
                  display: 'block',
                  borderRadius: '13px 13px 0 0',
                }}
              />
              <div style={{
                height: 44,
                display: 'flex',
                alignItems: 'center',
                paddingLeft: 10,
                gap: 5,
                background: accentColor,
              }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" fill="rgba(255,255,255,0.9)"/>
                  <circle cx="12" cy="10" r="3" fill={accentColor}/>
                </svg>
                <span style={{
                  fontFamily: 'Mulish, sans-serif',
                  fontSize: 13,
                  fontWeight: 700,
                  color: 'rgba(255,255,255,0.95)',
                  whiteSpace: 'nowrap',
                }}>
                  {card.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function HeroScene({ onExplore }) {
  const sceneRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.15 });

      // Nav fades in
      tl.to('#tl-nav', { opacity: 1, duration: 0.7, ease: 'power3.out' }, 0);

      // Headline words reveal
      gsap.set('.headline-word-inner', { y: '110%' });
      tl.to('.headline-word-inner', {
        y: '0%', duration: 0.9, stagger: 0.055, ease: 'power4.out',
      }, 0.3);

      // Trustpilot
      gsap.set('#trustpilot', { opacity: 0, y: 14 });
      tl.to('#trustpilot', { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, 0.9);

      // CTA
      gsap.set('#cta-btn', { opacity: 0, scale: 0.85, y: 10 });
      tl.to('#cta-btn', { opacity: 1, scale: 1, y: 0, duration: 0.7, ease: 'back.out(2)' }, 1.1);

      // Cards fade in after headline
      gsap.set('#marquee-wrap', { opacity: 0 });
      tl.to('#marquee-wrap', { opacity: 0.5, duration: 1.2, ease: 'power2.out' }, 0.4);

    }, sceneRef);
    return () => ctx.revert();
  }, []);

  const handleExplore = () => {
    const tl = gsap.timeline({ onComplete: onExplore });

    tl.to('#cta-btn', { scale: 1.06, duration: 0.12, ease: 'power2.out' })
      .to('#cta-btn', { scale: 0.95, duration: 0.08 });

    tl.to('.headline-word-inner', { y: '110%', duration: 0.5, stagger: 0.03, ease: 'power3.in' }, 0.15)
      .to('#trustpilot',   { opacity: 0, y: -10, duration: 0.35, ease: 'power2.in' }, 0.15)
      .to('#cta-btn',      { opacity: 0, scale: 0.9, duration: 0.3, ease: 'power2.in' }, 0.22)
      .to('#marquee-wrap', { opacity: 0, duration: 0.5, ease: 'power2.in' }, 0.1)
      .to('#tl-nav',       { opacity: 0, duration: 0.3, ease: 'power2.in' }, 0.15);
  };

  const words = ['Explore','the','world','through','the','eyes','of','someone','who','lives','there'];

  return (
    <div ref={sceneRef} className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden select-none">

      {/* Background */}
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(180deg, #1c3260 0%, #162a50 30%, #101f3c 65%, #0d1829 100%)'
      }}/>

      {/* Marquee tracks — sit behind content */}
      <div id="marquee-wrap" className="absolute inset-0" style={{ zIndex: 1, opacity: 0 }}>
        {TRACKS.map(track => (
          <MarqueeTrack key={track.id} track={track} />
        ))}
      </div>

      {/* Vignette — fades edges so content is readable */}
      <div className="absolute inset-0" style={{
        zIndex: 2,
        background: 'radial-gradient(ellipse 60% 55% at 50% 50%, transparent 30%, rgba(13,24,41,0.75) 100%)',
        pointerEvents: 'none',
      }}/>

      {/* Centre content */}
      <div className="relative flex flex-col items-center text-center" style={{ zIndex: 10, maxWidth: 780, padding: '0 40px' }}>

        <h1 style={{
          fontFamily: 'Georgia, serif',
          fontSize: 'clamp(32px, 4vw, 60px)',
          lineHeight: 1.2,
          color: 'white',
          letterSpacing: '-0.02em',
          fontWeight: 400,
          marginBottom: 20,
        }}>
          {words.map((word, i) => (
            <span key={i} style={{ display: 'inline-block', overflow: 'hidden', marginRight: '0.26em' }}>
              <span className="headline-word-inner" style={{ display: 'inline-block' }}>{word}</span>
            </span>
          ))}
        </h1>

        {/* Trustpilot */}
        <div id="trustpilot" className="flex items-center gap-2 mb-6">
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
