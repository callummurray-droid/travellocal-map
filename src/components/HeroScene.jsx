import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const ALL_CARDS = [
  { src: '/heroes/hero1.png', label: 'August – October', flag: '🇺🇸' },
  { src: '/heroes/hero2.png', label: 'April – July',     flag: '🇲🇽' },
  { src: '/heroes/hero3.png', label: 'June – August',    flag: '🇨🇦' },
  { src: '/heroes/hero4.png', label: 'Year round',       flag: '🇮🇩' },
  { src: '/heroes/hero5.png', label: 'March – October',  flag: '🇵🇪' },
  { src: '/heroes/hero6.png', label: 'May – October',    flag: '🇬🇷' },
  { src: '/heroes/hero7.png', label: 'September – June', flag: '🇮🇳' },
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

  // Build card deck order — fan of 3 visible, rest stacked behind
  const initDeck = () => {
    const cards = cardsRef.current;
    if (!cards.length) return;
    cards.forEach((card, i) => {
      const offset = i - currentRef.current;
      const pos = ((offset % cards.length) + cards.length) % cards.length;
      const isTop    = pos === 0;
      const isSecond = pos === 1;
      const isThird  = pos === 2;

      gsap.set(card, {
        zIndex:   cards.length - pos,
        x:        isTop ? 0 : isSecond ? 28 : isThird ? 50 : 60,
        y:        isTop ? 0 : isSecond ? -14 : isThird ? -24 : -30,
        rotation: isTop ? 2 : isSecond ? 8 : isThird ? 13 : 16,
        scale:    isTop ? 1 : isSecond ? 0.94 : isThird ? 0.88 : 0.84,
        opacity:  pos < 4 ? 1 : 0,
      });
    });
  };

  const advanceCard = () => {
    const cards = cardsRef.current;
    if (!cards.length) return;

    const topCard = cards[currentRef.current];

    // Fly top card off to the left
    gsap.to(topCard, {
      x: -500,
      y: -80,
      rotation: -25,
      opacity: 0,
      duration: 0.65,
      ease: 'power3.in',
      onComplete: () => {
        // Reset it to back of stack position instantly
        gsap.set(topCard, { x: 65, y: -32, rotation: 18, scale: 0.82, zIndex: 0, opacity: 0 });
        // Fade it back in at the back
        gsap.to(topCard, { opacity: 1, duration: 0.3, delay: 0.1 });
      },
    });

    // Advance all other cards forward
    currentRef.current = (currentRef.current + 1) % cards.length;
    const nextCards = cards.filter((_, i) => i !== cards.indexOf(topCard));

    cards.forEach((card, i) => {
      if (card === topCard) return;
      const offset = ((i - currentRef.current) % cards.length + cards.length) % cards.length;
      const isTop    = offset === 0;
      const isSecond = offset === 1;
      const isThird  = offset === 2;

      gsap.to(card, {
        x:        isTop ? 0 : isSecond ? 28 : isThird ? 50 : 60,
        y:        isTop ? 0 : isSecond ? -14 : isThird ? -24 : -30,
        rotation: isTop ? 2 : isSecond ? 8 : isThird ? 13 : 16,
        scale:    isTop ? 1 : isSecond ? 0.94 : isThird ? 0.88 : 0.84,
        zIndex:   cards.length - offset,
        duration: 0.6,
        ease: 'power3.out',
      });
    });
  };

  useEffect(() => {
    // Start auto-cycling after initial animation
    timerRef.current = setInterval(advanceCard, 2800);
    return () => clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Set initial deck positions
      initDeck();

      const tl = gsap.timeline({ delay: 0.2 });

      // Nav
      tl.to('#tl-nav', { opacity: 1, duration: 0.7, ease: 'power3.out' }, 0);

      // Stamps fly in from off-screen
      STAMP_POSITIONS.forEach((stamp, i) => {
        const el = `#stamp-${stamp.id}`;
        const fromX = stamp.left !== undefined ? -400 : 400;
        gsap.set(el, { opacity: 0, x: fromX, rotation: stamp.rotate * 1.8 });
        tl.to(el, {
          opacity: 0.92,
          x: 0,
          rotation: stamp.rotate,
          duration: 1.1,
          ease: 'back.out(1.2)',
        }, 0.05 + i * 0.08);
      });

      // Card deck rises up
      gsap.set(deckRef.current, { opacity: 0, y: 60 });
      tl.to(deckRef.current, {
        opacity: 1, y: 0,
        duration: 0.9,
        ease: 'power4.out',
      }, 0.3);

      // Headline words slide up
      gsap.set('.headline-word-inner', { y: '110%' });
      tl.to('.headline-word-inner', {
        y: '0%',
        duration: 0.85,
        stagger: 0.05,
        ease: 'power4.out',
      }, 0.65);

      // Trustpilot
      gsap.set('#trustpilot', { opacity: 0, y: 14 });
      tl.to('#trustpilot', { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, 1.2);

      // CTA
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
      .to('#trustpilot', { opacity: 0, y: -10, duration: 0.3, ease: 'power2.in' }, 0.15)
      .to('#cta-btn',    { opacity: 0, scale: 0.9, y: 10, duration: 0.3, ease: 'power2.in' }, 0.22)
      .to(deckRef.current, { opacity: 0, scale: 0.85, y: -30, duration: 0.5, ease: 'power3.in' }, 0.12)
      .to(STAMP_POSITIONS.map(s => `#stamp-${s.id}`), {
        opacity: 0, scale: 0.4, duration: 0.45, stagger: 0.04, ease: 'power3.in',
      }, 0.08)
      .to('#tl-nav', { opacity: 0, duration: 0.3, ease: 'power2.in' }, 0.15);
  };

  const words = ['Explore','the','world','through','the','eyes','of','someone','who','lives','there'];

  return (
    <div ref={sceneRef} className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden select-none">

      {/* Vertical gradient matching Figma */}
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(180deg, #1c3260 0%, #162a50 30%, #101f3c 65%, #0d1829 100%)'
      }}/>

      {/* Stamps — screen blend removes black backgrounds */}
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
        style={{ width: 240, height: 280 }}
        onClick={() => advanceCard()}
      >
        {ALL_CARDS.map((card, i) => (
          <div
            key={card.src}
            ref={el => cardsRef.current[i] = el}
            className="absolute inset-0"
            style={{
              borderRadius: 20,
              overflow: 'hidden',
              boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
              willChange: 'transform',
            }}
          >
            <img
              src={card.src}
              alt={card.label}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', pointerEvents: 'none' }}
            />
          </div>
        ))}
      </div>

      {/* Headline */}
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

      {/* Tap hint */}
      <p style={{ fontFamily: 'Mulish, sans-serif', color: 'rgba(255,255,255,0.25)', fontSize: 11, marginTop: 16, zIndex: 10, letterSpacing: '0.06em' }}>
        tap the cards to explore
      </p>
    </div>
  );
}
