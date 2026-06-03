import { useRef, useState } from 'react';

const LINKS = ['Destinations', 'Inspiration', 'Trip ideas', 'How it works'];

const glass = {
  background: 'rgba(250, 248, 245, 0.40)',
  backdropFilter: 'blur(24px)',
  WebkitBackdropFilter: 'blur(24px)',
  border: '1px solid rgba(255,255,255,0.18)',
  borderRadius: 20,
};

export default function Nav() {
  const [open, setOpen] = useState(false);
  const burgerRef = useRef(null);

  const toggle = () => setOpen(o => !o);

  return (
    <>
      <style>{`
        #tl-nav-pill {
          transition: width 0.55s cubic-bezier(0.34, 1.30, 0.64, 1);
        }
        .nav-logo {
          opacity: 0;
          transform: translateX(-10px);
          transition: opacity 0.3s ease 0.25s, transform 0.3s ease 0.25s;
          pointer-events: none;
        }
        .nav-open .nav-logo {
          opacity: 1;
          transform: translateX(0);
          pointer-events: auto;
        }
        .nav-link {
          font-family: 'Mulish', sans-serif;
          font-size: 18px;
          font-weight: 400;
          line-height: 160%;
          color: rgba(255,255,255,0.9);
          text-decoration: none;
          white-space: nowrap;
          opacity: 0;
          transform: translateY(10px);
          transition: none;
        }
        .nav-open .nav-link:nth-child(1) { opacity:1; transform:translateY(0); transition: opacity 0.35s cubic-bezier(0.34,1.56,0.64,1) 0.22s, transform 0.35s cubic-bezier(0.34,1.56,0.64,1) 0.22s; }
        .nav-open .nav-link:nth-child(2) { opacity:1; transform:translateY(0); transition: opacity 0.35s cubic-bezier(0.34,1.56,0.64,1) 0.29s, transform 0.35s cubic-bezier(0.34,1.56,0.64,1) 0.29s; }
        .nav-open .nav-link:nth-child(3) { opacity:1; transform:translateY(0); transition: opacity 0.35s cubic-bezier(0.34,1.56,0.64,1) 0.36s, transform 0.35s cubic-bezier(0.34,1.56,0.64,1) 0.36s; }
        .nav-open .nav-link:nth-child(4) { opacity:1; transform:translateY(0); transition: opacity 0.35s cubic-bezier(0.34,1.56,0.64,1) 0.43s, transform 0.35s cubic-bezier(0.34,1.56,0.64,1) 0.43s; }
        .nav-link:hover { color: #fff; }
        .nav-icons {
          opacity: 0;
          transform: scale(0.8);
          transition: opacity 0.3s ease 0.38s, transform 0.3s ease 0.38s;
          pointer-events: none;
        }
        .nav-open .nav-icons {
          opacity: 1;
          transform: scale(1);
          pointer-events: auto;
        }
        .h-line {
          width: 20px;
          height: 2px;
          border-radius: 2px;
          background: rgba(255,255,255,0.9);
          transform-origin: center;
          transition: transform 0.28s cubic-bezier(0.76,0,0.24,1), opacity 0.18s ease;
        }
        .nav-open .h-line-1 { transform: rotate(45deg) translateY(7px); }
        .nav-open .h-line-2 { opacity: 0; transform: scaleX(0); }
        .nav-open .h-line-3 { transform: rotate(-45deg) translateY(-7px); }
      `}</style>

      <div style={{
        position: 'fixed',
        top: 16,
        right: 16,
        zIndex: 100,
        display: 'flex',
        justifyContent: 'flex-end',
        width: 'calc(100% - 32px)',
        maxWidth: 1206,
        left: '50%',
        transform: 'translateX(-50%)',
        pointerEvents: 'none',
      }}>
        <div
          id="tl-nav-pill"
          className={open ? 'nav-open' : ''}
          style={{
            ...glass,
            height: 80,
            width: open ? '100%' : 80,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 20px',
            overflow: 'hidden',
            position: 'relative',
            pointerEvents: 'auto',
            boxSizing: 'border-box',
            cursor: open ? 'default' : 'pointer',
          }}
          onClick={!open ? toggle : undefined}
        >
          {/* Logo — absolute left */}
          <div
            className="nav-logo"
            style={{
              position: 'absolute',
              left: 20,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <img src="/logo.svg" alt="TravelLocal" style={{ height: 46, width: 'auto', display: 'block' }} />
          </div>

          {/* Links — absolute centre */}
          <div style={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            alignItems: 'center',
            gap: 40,
          }}>
            {LINKS.map(link => (
              <a key={link} href="#" className="nav-link">{link}</a>
            ))}
          </div>

          {/* Right — icons + hamburger — absolute right */}
          <div style={{
            position: 'absolute',
            right: 20,
            display: 'flex',
            alignItems: 'center',
            gap: 16,
          }}>
            {/* Search + Globe */}
            <div className="nav-icons" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', color: 'rgba(255,255,255,0.85)' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
              </button>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', color: 'rgba(255,255,255,0.85)' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                </svg>
              </button>
            </div>

            {/* Hamburger / X */}
            <button
              ref={burgerRef}
              onClick={toggle}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 5.5,
                padding: 6,
                width: 36,
                height: 36,
                flexShrink: 0,
              }}
              aria-label={open ? 'Close menu' : 'Open menu'}
            >
              <div className={`h-line h-line-1 ${open ? 'nav-open' : ''}`} style={{ transform: open ? 'rotate(45deg) translateY(7px)' : 'none' }}/>
              <div className={`h-line h-line-2 ${open ? 'nav-open' : ''}`} style={{ opacity: open ? 0 : 1, transform: open ? 'scaleX(0)' : 'none' }}/>
              <div className={`h-line h-line-3 ${open ? 'nav-open' : ''}`} style={{ transform: open ? 'rotate(-45deg) translateY(-7px)' : 'none' }}/>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
