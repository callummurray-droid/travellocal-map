import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

const LINKS = ['Destinations', 'Inspiration', 'Trip ideas', 'How it works'];

export default function Nav() {
  const [open, setOpen]   = useState(false);
  const navRef            = useRef(null);
  const tlRef             = useRef(null);
  const line1Ref          = useRef(null);
  const line2Ref          = useRef(null);
  const line3Ref          = useRef(null);

  useEffect(() => {
    // Build the open timeline once
    const tl = gsap.timeline({ paused: true });

    // Nav pill expands — width grows from hamburger position
    tl.fromTo(navRef.current,
      { scaleX: 0, opacity: 0, transformOrigin: 'right center' },
      { scaleX: 1, opacity: 1, duration: 0.55, ease: 'back.out(1.4)' },
      0
    );

    // Links stagger in from below
    tl.fromTo('.nav-link',
      { opacity: 0, y: 14 },
      {
        opacity: 1, y: 0,
        duration: 0.45,
        stagger: 0.07,
        ease: 'back.out(1.7)',
      },
      0.2
    );

    // Icons fade in
    tl.fromTo('.nav-icon',
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 0.35, stagger: 0.06, ease: 'back.out(2)' },
      0.4
    );

    tlRef.current = tl;
  }, []);

  const toggleMenu = () => {
    const tl = tlRef.current;
    if (!tl) return;

    if (!open) {
      setOpen(true);
      tl.play();
      // Hamburger → X
      gsap.to(line1Ref.current, { rotation: 45,  y: 7,  duration: 0.35, ease: 'power3.inOut' });
      gsap.to(line2Ref.current, { opacity: 0,         duration: 0.2 });
      gsap.to(line3Ref.current, { rotation: -45, y: -7, duration: 0.35, ease: 'power3.inOut' });
    } else {
      setOpen(false);
      // Use easeReverse concept — reverse the timeline with a different feel
      tl.reverse();
      // X → hamburger
      gsap.to(line1Ref.current, { rotation: 0, y: 0, duration: 0.35, ease: 'power3.inOut' });
      gsap.to(line2Ref.current, { opacity: 1,        duration: 0.25, delay: 0.1 });
      gsap.to(line3Ref.current, { rotation: 0, y: 0, duration: 0.35, ease: 'power3.inOut' });
    }
  };

  return (
    <>
      {/* Full nav pill — hidden by default, revealed on hamburger click */}
      <nav
        ref={navRef}
        id="tl-nav"
        style={{
          position: 'fixed',
          top: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 100,
          opacity: 0,
          width: 'calc(100% - 64px)',
          maxWidth: 1200,
          background: 'rgba(55, 58, 64, 0.92)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 14,
          padding: '14px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: 0,
        }}
      >
        {/* Logo — bracket corner style from Figma */}
        <div style={{ flexShrink: 0, marginRight: 'auto' }}>
          <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
            {/* Top-left bracket */}
            <path d="M4 12 L4 4 L12 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            {/* Bottom-right bracket */}
            <path d="M32 40 L40 40 L40 32" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            <text x="8" y="20" fill="white" fontSize="9" fontFamily="Georgia, serif" fontWeight="600">Travel</text>
            <text x="8" y="31" fill="white" fontSize="9" fontFamily="Georgia, serif" fontWeight="600">Local</text>
          </svg>
        </div>

        {/* Centre links */}
        <div style={{
          position: 'absolute', left: '50%', transform: 'translateX(-50%)',
          display: 'flex', alignItems: 'center', gap: 40,
        }}>
          {LINKS.map(link => (
            <a
              key={link}
              href="#"
              className="nav-link"
              style={{
                fontFamily: 'Mulish, sans-serif',
                color: 'rgba(255,255,255,0.8)',
                fontSize: 15,
                textDecoration: 'none',
                whiteSpace: 'nowrap',
                letterSpacing: '-0.01em',
                opacity: 0,
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => e.target.style.color = 'white'}
              onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.8)'}
            >
              {link}
            </a>
          ))}
        </div>

        {/* Right icons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginLeft: 'auto' }}>
          {[
            // Search icon
            <svg key="search" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>,
            // Globe icon
            <svg key="globe" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="10"/>
              <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
          ].map((icon, i) => (
            <button
              key={i}
              className="nav-icon"
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', padding: 4,
                opacity: 0,
                transition: 'opacity 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.querySelector('svg').style.stroke = 'white'}
              onMouseLeave={e => e.currentTarget.querySelector('svg').style.stroke = 'rgba(255,255,255,0.7)'}
            >
              {icon}
            </button>
          ))}
        </div>
      </nav>

      {/* Hamburger button — always visible */}
      <button
        onClick={toggleMenu}
        style={{
          position: 'fixed',
          top: 20,
          right: 32,
          zIndex: 101,
          width: 52,
          height: 52,
          borderRadius: 12,
          background: 'rgba(55, 58, 64, 0.92)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.06)',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 5,
          padding: 0,
        }}
      >
        {[line1Ref, line2Ref, line3Ref].map((ref, i) => (
          <div
            key={i}
            ref={ref}
            style={{
              width: 22,
              height: 2,
              borderRadius: 2,
              background: '#1a2e4a',
              transformOrigin: 'center',
            }}
          />
        ))}
      </button>
    </>
  );
}
