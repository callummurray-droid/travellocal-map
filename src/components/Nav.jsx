export default function Nav() {
  return (
    <nav
      id="tl-nav"
      className="nav-glass fixed top-6 left-1/2 z-50 rounded-2xl px-6 py-3 flex items-center gap-8"
      style={{
        minWidth: 680,
        opacity: 0,
        transform: 'translateX(-50%)',
      }}
    >
      <div style={{ fontFamily: 'Georgia, serif', color: 'white', fontWeight: 600, fontSize: 14, lineHeight: 1.25, marginRight: 8 }}>
        Travel<br/>Local
      </div>
      <div className="flex-1 flex items-center justify-center gap-8">
        {['Destinations','Inspiration','Trip ideas','How it works'].map(link => (
          <a key={link} href="#"
            style={{ fontFamily: 'Mulish, sans-serif', color: 'rgba(255,255,255,0.75)', fontSize: 14, textDecoration: 'none', whiteSpace: 'nowrap', transition: 'color 0.2s' }}
            onMouseEnter={e => e.target.style.color = 'white'}
            onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.75)'}
          >
            {link}
          </a>
        ))}
      </div>
      <div className="flex items-center gap-3" style={{ marginLeft: 8 }}>
        <button style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
        </button>
        <button style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
          </svg>
        </button>
      </div>
    </nav>
  );
}
