import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

const LINKS = ['Destinations', 'Inspiration', 'Trip ideas', 'How it works'];

// Shared glass — rgba(250,248,245,0.40) from Figma
const glass = {
  background: 'rgba(250, 248, 245, 0.40)',
  backdropFilter: 'blur(24px)',
  WebkitBackdropFilter: 'blur(24px)',
  border: '1px solid rgba(255,255,255,0.15)',
  borderRadius: 20, // 1.25rem
};

// Text style: Mulish Regular 18px, line-height 160%
const navLinkStyle = {
  fontFamily: 'Mulish, sans-serif',
  fontWeight: 400,
  fontSize: 18,
  lineHeight: '160%',
  letterSpacing: '0%',
  color: 'rgba(255,255,255,0.9)',
  textDecoration: 'none',
  whiteSpace: 'nowrap',
  opacity: 0,
  display: 'block',
  transition: 'color 0.2s',
};

export default function Nav() {
  const [open, setOpen] = useState(false);
  const navRef   = useRef(null);
  const tlRef    = useRef(null);
  const line1Ref = useRef(null);
  const line2Ref = useRef(null);
  const line3Ref = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({ paused: true });

    tl.fromTo(navRef.current,
      { scaleX: 0, opacity: 0, transformOrigin: 'right center' },
      { scaleX: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.3)' },
      0
    );
    tl.fromTo('.nav-link',
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.4, stagger: 0.07, ease: 'back.out(1.7)' },
      0.2
    );
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

  return (
    <>
      {/* Nav pill — max 1206px, centred */}
      <nav
        ref={navRef}
        id="tl-nav"
        style={{
          position: 'fixed',
          top: 16,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 100,
          opacity: 0,
          width: 'calc(100% - 32px)',
          maxWidth: 1206,
          paddingRight: 96, // clearance for hamburger which sits outside
          ...glass,
          height: 80,
          display: 'flex',
          alignItems: 'center',
          padding: '0 24px',
          boxSizing: 'border-box',
        }}
      >
        {/* Logo — TravelLocal SVG icon */}
        <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
          <img src="/logo.svg" alt="TravelLocal" style={{ height: 48, width: 'auto', display: 'block' }} />
        </div>

        {/* Links — centred absolutely */}
        <div style={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          alignItems: 'center',
          gap: 40,
        }}>
          {LINKS.map(link => (
            <a
              key={link}
              href="#"
              className="nav-link"
              style={navLinkStyle}
              onMouseEnter={e => { e.target.style.color = '#ffffff'; }}
              onMouseLeave={e => { e.target.style.color = 'rgba(255,255,255,0.9)'; }}
            >
              {link}
            </a>
          ))}
        </div>

        {/* Right icons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginLeft: 'auto' }}>
          {[
            <svg key="s" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>,
            <svg key="g" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="10"/>
              <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
          ].map((icon, i) => (
            <button
              key={i}
              className="nav-icon"
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', padding: 4, opacity: 0,
              }}
            >
              {icon}
            </button>
          ))}
        </div>
      </nav>

      {/* Hamburger — same glass style, positioned at right edge of nav max-width */}
      <button
        onClick={toggleMenu}
        style={{
          position: 'fixed',
          top: 16,
          right: 'max(16px, calc((100vw - 1206px) / 2))',
          zIndex: 101,
          width: 80,
          height: 80,
          ...glass,
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 5.5,
          padding: 0,
        }}
      >
        {[line1Ref, line2Ref, line3Ref].map((ref, i) => (
          <div
            key={i}
            ref={ref}
            style={{
              width: 22,
              height: 2.5,
              borderRadius: 2,
              background: '#152238',
              transformOrigin: 'center',
              flexShrink: 0,
            }}
          />
        ))}
      </button>
    </>
  );
}
