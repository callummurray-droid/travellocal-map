export default function Nav({ visible = true, onMap = false }) {
  return (
    <nav
      id="tl-nav"
      className="nav-glass fixed top-6 left-1/2 -translate-x-1/2 z-50 rounded-2xl px-6 py-3 flex items-center gap-8"
      style={{ minWidth: 680, opacity: 0 }}
    >
      <div className="flex items-center gap-2 mr-4">
        <div className="font-heading text-white font-semibold leading-tight text-sm">
          Travel<br/>Local
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center gap-8">
        {['Destinations','Inspiration','Trip ideas','How it works'].map(link => (
          <a key={link} href="#" className="text-white/70 hover:text-white text-sm font-body transition-colors duration-200 whitespace-nowrap">
            {link}
          </a>
        ))}
      </div>
      <div className="flex items-center gap-3 ml-4">
        <button className="text-white/70 hover:text-white transition-colors" aria-label="Search">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
        </button>
        <button className="text-white/70 hover:text-white transition-colors" aria-label="Language">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
          </svg>
        </button>
      </div>
    </nav>
  );
}
