export default function Nav() {
  return (
    <nav
      id="tl-nav"
      style={{
        position: 'fixed',
        top: 24,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 100,
        opacity: 0,
        minWidth: 700,
        maxWidth: 900,
        width: 'calc(100% - 80px)',
        background: 'rgba(21, 34, 56, 0.55)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 16,
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: 32,
      }}
    >
      {/* Logo */}
      <div style={{
        fontFamily: 'Georgia, serif', color: 'white',
        fontWeight: 600, fontSize: 13, lineHeight: 1.25,
        marginRight: 8, flexShrink: 0,
      }}>
        Travel<br/>Local
      </div>

      {/* Links */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 32 }}>
        {['Destinations','Inspiration','Trip ideas','How it works'].map(link => (
          <a
            key={link} href="#"
            style={{
              fontFamily: 'Mulish, sans-serif', color: 'rgba(255,255,255,0.75)',
              fontSize: 14, textDecoration: 'none', whiteSpace: 'nowrap',
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => e.target.style.color = 'white'}
            onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.75)'}
          >
            {link}
          </a>
        ))}
      </div>

      {/* Icons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginLeft: 8, flexShrink: 0 }}>
        <button style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.65)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 0 }}
          onMouseEnter={e => e.currentTarget.style.color = 'white'}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.65)'}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
        </button>
        <button style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.65)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 0 }}
          onMouseEnter={e => e.currentTarget.style.color = 'white'}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.65)'}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
          </svg>
        </button>
      </div>
    </nav>
  );
}
