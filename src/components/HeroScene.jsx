import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const ALL_CARDS = [
  { src: '/heroes/hero4.png', label: 'Indonesia' },
  { src: '/heroes/hero5.png', label: 'Peru'      },
  { src: '/heroes/hero6.png', label: 'Morocco'   },
  { src: '/heroes/hero7.png', label: 'Costa Rica'},
];

const STAMP_POSITIONS = [
  { id: 'turkey',      src: '/stamps/turkey.png',      top: '3%',  left: '-2%',  width: 220, rotate: -10 },
  { id: 'japan',       src: '/stamps/japan.png',        top: '26%', left: '-2%',  width: 250, rotate: -6  },
  { id: 'usa',         src: '/stamps/usa.png',          top: '60%', left: '-3%',  width: 240, rotate:  7  },
  { id: 'switzerland', src: '/stamps/switzerland.png',  top: '2%',  right: '14%', width: 210, rotate:  5  },
  { id: 'brazil',      src: '/stamps/brazil.png',       top: '6%',  right: '-2%', width: 235, rotate:  9  },
  { id: 'mexico',      src: '/stamps/mexico.png',       top: '55%', right: '-2%', width: 245, rotate: -7  },
];

export default function HeroScene({ onExplore }) {
  const sceneRef   = useRef(null);
  const deckRef    = useRef(null);
  const cardsRef   = useRef([]);
  const currentRef = useRef(0);
  const timerRef   = useRef(null);

  const initDeck = () => {
    const cards = cardsRef.current.filter(Boolean);
    if (!cards.length) return;
    cards.forEach((card, i) => {
      const pos = ((i - currentRef.current) % cards.length + cards.length) % cards.length;
      gsap.set(card, {
        zIndex:   cards.length - pos,
        x:        pos === 0 ? 0  : pos === 1 ? 24 : pos === 2 ? 44 : 58,
        y:        pos === 0 ? 0  : pos === 1 ? -12 : pos === 2 ? -22 : -28,
        rotation: pos === 0 ? 2  : pos === 1 ? 7   : pos === 2 ? 12  : 15,
        scale:    pos === 0 ? 1  : pos === 1 ? 0.95 : pos === 2 ? 0.89 : 0.84,
        opacity:  pos < 4 ? 1 : 0,
      });
    });
  };

  const advanceCard = () => {
    const cards = cardsRef.current.filter(Boolean);
    if (!cards.length) return;
    const topCard = cards[currentRef.current];

    gsap.to(topCard, {
      x: -520, y: -100, rotation: -28, opacity: 0,
      duration: 0.6, ease: 'power3.in',
      onComplete: () => {
        gsap.set(topCard, { x: 62, y: -30, rotation: 17, scale: 0.83, zIndex: 0, opacity: 0 });
        gsap.to(topCard, { opacity: 1, duration: 0.25, delay: 0.05 });
      },
    });

    currentRef.current = (currentRef.current + 1) % cards.length;

    cards.forEach((card, i) => {
      if (card === topCard) return;
      const pos = ((i - currentRef.current) % cards.length + cards.length) % cards.length;
      gsap.to(card, {
        x:        pos === 0 ? 0  : pos === 1 ? 24 : pos === 2 ? 44 : 58,
        y:        pos === 0 ? 0  : pos === 1 ? -12 : pos === 2 ? -22 : -28,
        rotation: pos === 0 ? 2  : pos === 1 ? 7   : pos === 2 ? 12  : 15,
        scale:    pos === 0 ? 1  : pos === 1 ? 0.95 : pos === 2 ? 0.89 : 0.84,
        zIndex:   cards.length - pos,
        duration: 0.55, ease: 'power3.out',
      });
    });
  };

  useEffect(() => {
    timerRef.current = setInterval(advanceCard, 2800);
    return () => clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      initDeck();
      const tl = gsap.timeline({ delay: 0.2 });

      tl.to('#tl-nav', { opacity: 1, duration: 0.7, ease: 'power3.out' }, 0);

      STAMP_POSITIONS.forEach((stamp, i) => {
        const fromX = stamp.left !== undefined ? -400 : 400;
        gsap.set(`#stamp-${stamp.id}`, { opacity: 0, x: fromX, rotation: stamp.rotate * 1.8 });
        tl.to(`#stamp-${stamp.id}`, {
          opacity: 0.92, x: 0, rotation: stamp.rotate,
          duration: 1.1, ease: 'back.out(1.2)',
        }, 0.05 + i * 0.08);
      });

      gsap.set(deckRef.current, { opacity: 0, y: 60 });
      tl.to(deckRef.current, { opacity: 1, y: 0, duration: 0.9, ease: 'power4.out' }, 0.3);

      gsap.set('.headline-word-inner', { y: '110%' });
      tl.to('.headline-word-inner', { y: '0%', duration: 0.85, stagger: 0.05, ease: 'power4.out' }, 0.65);

      gsap.set('#trustpilot', { opacity: 0, y: 14 });
      tl.to('#trustpilot', { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, 1.2);

      gsap.set('#cta-btn', { opacity: 0, scale: 0.82, y: 10 });
      tl.to('#cta-btn', { opacity: 1, scale: 1, y: 0, duration: 0.7, ease: 'back.out(2.2)' }, 1.4);

    }, sceneRef);
    return () => ctx.revert();
  }, []);

  const handleExplore = () => {
    clearInterval(timerRef.current);
    const tl = gsap.timeline({ onComplete: onExplore });

    tl.to('#cta-btn', { scale: 1.06, duration: 0.12, ease: 'power2.out' })
      .to('#cta-btn', { scale: 0.95, duration: 0.08, ease: 'power2.in' });

    tl.to('.headline-word-inner', { y: '110%', duration: 0.45, stagger: 0.03, ease: 'power3.in' }, 0.15)
      .to('#trustpilot',   { opacity: 0, y: -10, duration: 0.3, ease: 'power2.in' }, 0.15)
      .to('#cta-btn',      { opacity: 0, scale: 0.9, duration: 0.3, ease: 'power2.in' }, 0.22)
      .to(deckRef.current, { opacity: 0, scale: 0.85, y: -30, duration: 0.5, ease: 'power3.in' }, 0.12)
      .to(STAMP_POSITIONS.map(s => `#stamp-${s.id}`), {
        opacity: 0, scale: 0.4, duration: 0.45, stagger: 0.04, ease: 'power3.in',
      }, 0.08)
      .to('#tl-nav', { opacity: 0, duration: 0.3, ease: 'power2.in' }, 0.15);
  };

  const words = ['Explore','the','world','through','the','eyes','of','someone','who','lives','there'];

  return (
    <div ref={sceneRef} className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden select-none">

      <div className="absolute inset-0" style={{
        background: 'linear-gradient(180deg, #1c3260 0%, #162a50 30%, #101f3c 65%, #0d1829 100%)'
      }}/>

      {STAMP_POSITIONS.map(stamp => (
        <img
          key={stamp.id}
          id={`stamp-${stamp.id}`}
          src={stamp.src}
          alt={stamp.id}
          className="stamp absolute pointer-events-none"
          style={{
            width: stamp.width,
            top: stamp.top,
            left: stamp.left,
            right: stamp.right,
            transform: `rotate(${stamp.rotate}deg)`,
            zIndex: 3,
            opacity: 0,
            mixBlendMode: 'screen',
          }}
        />
      ))}

      {/* Card deck */}
      <div
        ref={deckRef}
        className="relative z-10 mb-10 cursor-pointer"
        style={{ width: 240, height: 290 }}
        onClick={advanceCard}
        title="Click to see next destination"
      >
        {ALL_CARDS.map((card, i) => (
          <div
            key={card.src}
            ref={el => { cardsRef.current[i] = el; }}
            className="absolute inset-0"
            style={{
              borderRadius: 20,
              overflow: 'hidden',
              boxShadow: '0 28px 70px rgba(0,0,0,0.65)',
              willChange: 'transform',
            }}
          >
            <img
              src={card.src}
              alt={card.label}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
                pointerEvents: 'none',
                imageRendering: 'high-quality',
              }}
            />
          </div>
        ))}
      </div>

      <h1
        className="relative text-center text-white z-10 mb-4"
        style={{
          fontFamily: 'Georgia, serif',
          fontSize: 'clamp(28px, 3.6vw, 54px)',
          lineHeight: 1.22,
          maxWidth: 740,
          letterSpacing: '-0.02em',
          fontWeight: 400,
        }}
      >
        {words.map((word, i) => (
          <span key={i} style={{ display: 'inline-block', overflow: 'hidden', marginRight: '0.26em' }}>
            <span className="headline-word-inner" style={{ display: 'inline-block' }}>{word}</span>
          </span>
        ))}
      </h1>

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

      <button id="cta-btn" className="cta-btn z-10" onClick={handleExplore}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
        Let's explore the world together
      </button>

      <p style={{ fontFamily: 'Mulish, sans-serif', color: 'rgba(255,255,255,0.25)', fontSize: 11, marginTop: 14, zIndex: 10, letterSpacing: '0.06em' }}>
        tap the cards to explore destinations
      </p>
    </div>
  );
}
