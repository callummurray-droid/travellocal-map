import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

const LINKS = ['Destinations', 'Inspiration', 'Trip ideas', 'How it works'];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const pillRef      = useRef(null);
  const linksRef     = useRef(null);
  const iconsRef     = useRef(null);
  const logoRef      = useRef(null);
  const tlRef        = useRef(null);
  const line1Ref     = useRef(null);
  const line2Ref     = useRef(null);
  const line3Ref     = useRef(null);

  useEffect(() => {
    // Start as collapsed hamburger — small square pill top right
    gsap.set(pillRef.current, {
      width: 80,
      borderRadius: 20,
    });
    gsap.set(linksRef.current, { opacity: 0, display: 'none' });
    gsap.set(logoRef.current,  { opacity: 0, display: 'none' });
    gsap.set(iconsRef.current, { opacity: 0, display: 'none' });

    // Build expand timeline
    const tl = gsap.timeline({ paused: true });

    // Pill expands from right to full width
    tl.to(pillRef.current, {
      width: '100%',
      borderRadius: 20,
      duration: 0.55,
      ease: 'back.out(1.2)',
    }, 0);

    // Logo fades in from left
    tl.set(logoRef.current, { display: 'flex' }, 0.1);
    tl.fromTo(logoRef.current,
      { opacity: 0, x: -16 },
      { opacity: 1, x: 0, duration: 0.35, ease: 'power3.out' },
      0.2
    );

    // Links stagger in
    tl.set(linksRef.current, { display: 'flex' }, 0.15);
    tl.fromTo('.nav-link',
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.4, stagger: 0.07, ease: 'back.out(1.7)' },
      0.25
    );

    // Icons fade in
    tl.set(iconsRef.current, { display: 'flex' }, 0.3);
    tl.fromTo('.nav-icon',
      { opacity: 0, scale: 0.7 },
      { opacity: 1, scale: 1, duration: 0.3, stagger: 0.06, ease: 'back.out(2)' },
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
      // Lines → X
      gsap.to(line1Ref.current, { rotation: 45,  y: 7,  duration: 0.3, ease: 'power3.inOut' });
      gsap.to(line2Ref.current, { opacity: 0,          duration: 0.15 });
      gsap.to(line3Ref.current, { rotation: -45, y: -7, duration: 0.3, ease: 'power3.inOut' });
    } else {
      setOpen(false);
      // Reverse — collapse back to hamburger square
      tl.reverse();
      // X → lines
      gsap.to(line1Ref.current, { rotation: 0, y: 0, duration: 0.3, ease: 'power3.inOut' });
      gsap.to(line2Ref.current, { opacity: 1,        duration: 0.25, delay: 0.1 });
      gsap.to(line3Ref.current, { rotation: 0, y: 0, duration: 0.3, ease: 'power3.inOut' });
      // Hide content after collapse
      setTimeout(() => {
        if (linksRef.current) linksRef.current.style.display = 'none';
        if (logoRef.current)  logoRef.current.style.display  = 'none';
        if (iconsRef.current) iconsRef.current.style.display = 'none';
      }, 500);
    }
  };

  const glass = {
    background: 'rgba(250, 248, 245, 0.40)',
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    border: '1px solid rgba(255,255,255,0.15)',
  };

  return (
    // Container — fixed top right, expands leftward
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 16,
        right: 16,
        zIndex: 100,
        display: 'flex',
        justifyContent: 'flex-end',
        // Max width matches nav design width when open
        maxWidth: 'calc(100% - 32px)',
        width: 'calc(100% - 32px)',
        pointerEvents: 'none',
      }}
    >
      {/* The single morphing pill */}
      <div
        ref={pillRef}
        onClick={!open ? toggleMenu : undefined}
        style={{
          ...glass,
          borderRadius: 20,
          height: 80,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 20px',
          overflow: 'hidden',
          cursor: open ? 'default' : 'pointer',
          pointerEvents: 'auto',
          // Expands from right side
          marginLeft: 'auto',
          position: 'relative',
          maxWidth: 1206,
          width: 80, // starts collapsed
          boxSizing: 'border-box',
        }}
      >
        {/* Logo — hidden when collapsed */}
        <div
          ref={logoRef}
          style={{ display: 'none', alignItems: 'center', flexShrink: 0 }}
        >
          <img src="/logo.svg" alt="TravelLocal" style={{ height: 46, width: 'auto', display: 'block' }} />
        </div>

        {/* Nav links — hidden when collapsed */}
        <div
          ref={linksRef}
          style={{
            display: 'none',
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            alignItems: 'center',
            gap: 40,
          }}
        >
          {LINKS.map(link => (
            <a
              key={link}
              href="#"
              className="nav-link"
              style={{
                fontFamily: 'Mulish, sans-serif',
                fontWeight: 400,
                fontSize: 18,
                lineHeight: '160%',
                letterSpacing: 0,
                color: 'rgba(255,255,255,0.9)',
                textDecoration: 'none',
                whiteSpace: 'nowrap',
                opacity: 0,
              }}
              onMouseEnter={e => { e.target.style.color = '#fff'; }}
              onMouseLeave={e => { e.target.style.color = 'rgba(255,255,255,0.9)'; }}
            >
              {link}
            </a>
          ))}
        </div>

        {/* Right side — search + globe (hidden) + hamburger/X (always visible) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginLeft: 'auto', flexShrink: 0 }}>

          {/* Search + globe — hidden when collapsed */}
          <div
            ref={iconsRef}
            style={{ display: 'none', alignItems: 'center', gap: 16 }}
          >
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
                style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: 4, opacity: 0 }}
              >
                {icon}
              </button>
            ))}
          </div>

          {/* Hamburger / X — always visible, click to toggle */}
          <button
            onClick={toggleMenu}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 5.5,
              padding: 8,
              flexShrink: 0,
              width: 40,
              height: 40,
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
        </div>
      </div>
    </div>
  );
}
