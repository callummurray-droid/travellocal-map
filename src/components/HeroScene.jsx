import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { STAMP_CONFIG } from '../data/countries';

const HERO_CARDS = [
  { src: '/heroes/hero2.png', rotate: -8,  x: -95,  y: 20,  label: 'April – July',     flag: '🇲🇽' },
  { src: '/heroes/hero1.png', rotate:  2,  x:  0,   y: 0,   label: 'August – October', flag: '🇺🇸' },
  { src: '/heroes/hero3.png', rotate:  9,  x:  88,  y: 15,  label: 'June – August',    flag: '🇨🇦' },
];

export default function HeroScene({ onExplore }) {
  const sceneRef = useRef(null);
  const ctaRef   = useRef(null);
  const tlRef    = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.2 });
      tlRef.current = tl;

      // Nav
      tl.to('#tl-nav', { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, 0);

      // Stamps fly in from off-screen
      STAMP_CONFIG.forEach((stamp, i) => {
        const el = `#stamp-${stamp.id}`;
        const fromX = stamp.style.left ? -300 : 300;
        gsap.set(el, { opacity: 0, x: fromX, rotation: stamp.style.rotate * 2 });
        tl.to(el, {
          opacity: 1, x: 0,
          rotation: stamp.style.rotate,
          duration: 0.9,
          ease: 'back.out(1.4)',
        }, 0.1 + i * 0.1);
      });

      // Hero cards fan in
      gsap.set('.hero-card', { opacity: 0, y: 60, scale: 0.85 });
      tl.to('.hero-card', {
        opacity: 1, y: 0, scale: 1,
        duration: 0.8,
        stagger: 0.12,
        ease: 'back.out(1.6)',
      }, 0.4);

      // Headline words slide up (masked reveal)
      gsap.set('.headline-word-inner', { y: '110%' });
      tl.to('.headline-word-inner', {
        y: '0%',
        duration: 0.8,
        stagger: 0.06,
        ease: 'power4.out',
      }, 0.75);

      // Trustpilot
      gsap.set('#trustpilot', { opacity: 0, y: 12 });
      tl.to('#trustpilot', { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, 1.2);

      // CTA
      gsap.set('#cta-btn', { opacity: 0, scale: 0.85, y: 10 });
      tl.to('#cta-btn', {
        opacity: 1, scale: 1, y: 0,
        duration: 0.7,
        ease: 'back.out(2)',
      }, 1.4);

    }, sceneRef);
    return () => ctx.revert();
  }, []);

  const handleExplore = () => {
    const tl = gsap.timeline({ onComplete: onExplore });

    // CTA pulse first
    tl.to('#cta-btn', { scale: 1.08, duration: 0.15, ease: 'power2.out' })
      .to('#cta-btn', { scale: 0.95, duration: 0.1, ease: 'power2.in' });

    // Simultaneous exit
    tl.to('.headline-word-inner', { y: '110%', duration: 0.5, stagger: 0.04, ease: 'power3.in' }, 0.2)
      .to('#trustpilot', { opacity: 0, y: -10, duration: 0.4, ease: 'power2.in' }, 0.2)
      .to('#cta-btn', { opacity: 0, scale: 0.9, y: 10, duration: 0.4, ease: 'power2.in' }, 0.3)
      .to('.hero-card', { opacity: 0, scale: 0.8, y: -30, stagger: 0.07, duration: 0.5, ease: 'power3.in' }, 0.2)
      .to(STAMP_CONFIG.map(s => `#stamp-${s.id}`), {
        opacity: 0, scale: 0.5,
        stagger: 0.05,
        duration: 0.5,
        ease: 'power3.in',
      }, 0.15)
      .to('#tl-nav', { opacity: 0, duration: 0.4, ease: 'power2.in' }, 0.2);
  };

  const headlineWords = ['Explore','the','world','through','the','eyes','of','someone','who','lives','there'];

  return (
    <div ref={sceneRef} className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden select-none">

      {/* Background gradient */}
      <div className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at 50% 30%, #1e3a6e 0%, #0d1829 60%)' }}
      />

      {/* Stamps */}
      {STAMP_CONFIG.map(stamp => (
        <img
          key={stamp.id}
          id={`stamp-${stamp.id}`}
          src={stamp.src}
          alt={stamp.id}
          className="stamp absolute pointer-events-auto cursor-pointer"
          style={{
            width: stamp.style.width,
            top: stamp.style.top,
            left: stamp.style.left,
            right: stamp.style.right,
            transform: `rotate(${stamp.style.rotate}deg)`,
            zIndex: stamp.style.zIndex,
            opacity: 0,
          }}
        />
      ))}

      {/* Hero photo cards */}
      <div className="relative flex items-end justify-center mb-10" style={{ height: 280, width: 420 }}>
        {HERO_CARDS.map((card, i) => (
          <div
            key={i}
            className="hero-card absolute"
            style={{
              width: 200,
              transform: `rotate(${card.rotate}deg) translateX(${card.x}px) translateY(${card.y}px)`,
              zIndex: i === 1 ? 10 : i === 0 ? 8 : 9,
              borderRadius: 16,
              overflow: 'hidden',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
            }}
          >
            <img src={card.src} alt="" style={{ width: '100%', height: 240, objectFit: 'cover', display: 'block' }} />
            <div style={{
              position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)',
              background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(8px)',
              borderRadius: 100, padding: '6px 12px',
              display: 'flex', alignItems: 'center', gap: 6,
              whiteSpace: 'nowrap',
            }}>
              <span style={{ fontSize: 14 }}>{card.flag}</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: '#152238', fontFamily: 'Mulish' }}>{card.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Headline */}
      <h1
        className="relative text-center font-heading text-white z-10 mb-4"
        style={{ fontSize: 'clamp(28px, 4vw, 54px)', lineHeight: 1.2, maxWidth: 720, letterSpacing: '-0.02em' }}
      >
        {headlineWords.map((word, i) => (
          <span key={i} className="headline-word" style={{ display: 'inline-block', overflow: 'hidden', marginRight: '0.25em' }}>
            <span className="headline-word-inner" style={{ display: 'inline-block' }}>{word}</span>
          </span>
        ))}
      </h1>

      {/* Trustpilot */}
      <div id="trustpilot" className="flex items-center gap-2 mb-6 z-10">
        <span className="font-body text-white/60 text-xs">Excellent</span>
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="tp-star">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="white">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
          ))}
        </div>
        <span className="font-body text-white/60 text-xs">2,276 reviews</span>
        <span className="font-body text-[#00b67a] text-xs font-semibold">★ Trustpilot</span>
      </div>

      {/* CTA */}
      <button id="cta-btn" ref={ctaRef} className="cta-btn z-10" onClick={handleExplore}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
        Let's explore the world together
      </button>
    </div>
  );
}
