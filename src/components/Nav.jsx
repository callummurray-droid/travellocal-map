import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

const LINKS = ['Destinations', 'Inspiration', 'Trip ideas', 'How it works'];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const navRef    = useRef(null);
  const tlRef     = useRef(null);
  const line1Ref  = useRef(null);
  const line2Ref  = useRef(null);
  const line3Ref  = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({ paused: true });

    // Nav pill scales in from hamburger side
    tl.fromTo(navRef.current,
      { scaleX: 0, opacity: 0, transformOrigin: 'right center' },
      { scaleX: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.3)' },
      0
    );

    // Links stagger up with bounce
    tl.fromTo('.nav-link',
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.4, stagger: 0.07, ease: 'back.out(1.7)' },
      0.2
    );

    // Icons bounce in
    tl.fromTo('.nav-icon',
      { opacity: 0, scale: 0.7 },
      { opacity: 1, scale: 1, duration: 0.35, stagger: 0.06, ease: 'back.out(2)' },
      0.38
    );

    tlRef.current = tl;
  }, []);

  const toggleMenu = () => {
    const tl = tlRef.current;
    if (!tl) return;
    if (!open) {
      setOpen(true);
      tl.play();
      gsap.to(line1Ref.current, { rotation: 45,  y: 7,  duration: 0.3, ease: 'power3.inOut' });
      gsap.to(line2Ref.current, { opacity: 0,          duration: 0.15 });
      gsap.to(line3Ref.current, { rotation: -45, y: -7, duration: 0.3, ease: 'power3.inOut' });
    } else {
      setOpen(false);
      tl.reverse();
      gsap.to(line1Ref.current, { rotation: 0, y: 0, duration: 0.3, ease: 'power3.inOut' });
      gsap.to(line2Ref.current, { opacity: 1,        duration: 0.25, delay: 0.08 });
      gsap.to(line3Ref.current, { rotation: 0, y: 0, duration: 0.3, ease: 'power3.inOut' });
    }
  };

  // Shared glass style — from Figma dev mode
  const glassStyle = {
    background: 'rgba(250, 248, 245, 0.40)',
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    border: 'none',
  };

  return (
    <>
      {/* Full width nav pill */}
      <nav
        ref={navRef}
        id="tl-nav"
        style={{
          position: 'fixed',
          top: 16,
          left: 16,
          right: 112, // 80px hamburger + 16px gap + 16px from edge
          zIndex: 100,
          opacity: 0,
          ...glassStyle,
          borderRadius: 20, // 1.25rem
          padding: '0 24px',
          height: 80, // 5rem
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {/* Logo — bracket corner mark from Figma */}
        <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', marginRight: 'auto' }}>
          <div style={{ position: 'relative', width: 42, height: 42 }}>
            {/* Bracket corners */}
            <svg width="42" height="42" viewBox="0 0 42 42" fill="none" style={{ position: 'absolute', inset: 0 }}>
              <path d="M3 13 L3 3 L13 3"   stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M29 39 L39 39 L39 29" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {/* Text */}
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              fontFamily: 'Georgia, serif', color: 'white',
              fontSize: 9.5, fontWeight: 600, lineHeight: 1.3,
              textAlign: 'center', letterSpacing: '0.02em',
            }}>
              <span>Travel</span>
              <span>Local</span>
            </div>
          </div>
        </div>

        {/* Centred links */}
        <div style={{
          position: 'absolute', left: '50%', transform: 'translateX(-50%)',
          display: 'flex', alignItems: 'center', gap: 44,
        }}>
          {LINKS.map(link => (
            <a
              key={link}
              href="#"
              className="nav-link"
              style={{
                fontFamily: 'Mulish, sans-serif',
                color: 'rgba(255,255,255,0.9)',
                fontSize: 15,
                textDecoration: 'none',
                whiteSpace: 'nowrap',
                opacity: 0,
                display: 'block',
              }}
              onMouseEnter={e => { e.target.style.color = '#ffffff'; }}
              onMouseLeave={e => { e.target.style.color = 'rgba(255,255,255,0.9)'; }}
            >
              {link}
            </a>
          ))}
        </div>

        {/* Right — search and globe */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginLeft: 'auto' }}>
          <button
            className="nav-icon"
            style={{ background: 'none', border: 'none', cursor: 'pointer', opacity: 0, padding: 4, display: 'flex' }}
            onMouseEnter={e => e.currentTarget.style.opacity = '1'}
            onMouseLeave={e => e.currentTarget.style.opacity = '0.8'}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
          </button>
          <button
            className="nav-icon"
            style={{ background: 'none', border: 'none', cursor: 'pointer', opacity: 0, padding: 4, display: 'flex' }}
            onMouseEnter={e => e.currentTarget.style.opacity = '1'}
            onMouseLeave={e => e.currentTarget.style.opacity = '0.8'}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="10"/>
              <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
          </button>
        </div>
      </nav>

      {/* Hamburger button — always visible, same glass style */}
      <button
        onClick={toggleMenu}
        style={{
          position: 'fixed',
          top: 16,
          right: 16,
          zIndex: 101,
          width: 80,
          height: 80,
          borderRadius: 20,
          ...glassStyle,
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 5.5,
          padding: 0,
          transition: 'background 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(68, 72, 82, 0.9)'}
        onMouseLeave={e => e.currentTarget.style.background = 'rgba(58, 62, 70, 0.82)'}
      >
        {[line1Ref, line2Ref, line3Ref].map((ref, i) => (
          <div
            key={i}
            ref={ref}
            style={{
              width: 22,
              height: 2.5,
              borderRadius: 2,
              background: '#152238', // navy on light glass
              transformOrigin: 'center',
              flexShrink: 0,
            }}
          />
        ))}
      </button>
    </>
  );
}
