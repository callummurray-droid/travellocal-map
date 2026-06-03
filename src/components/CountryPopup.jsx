import { FLAG_COLOURS, getFlagGradient, getPrimaryColour } from '../data/flagColours';

export default function CountryPopup({ country, x, y, config, onExplore, onMouseEnter, onMouseLeave }) {
  if (!country) return null;

  const primary  = getPrimaryColour(country);
  const gradient = getFlagGradient(country, '135deg');
  const colours  = FLAG_COLOURS[country] || [primary];
  const isMulti  = colours.length > 1;

  const W = 200, PAD = 16;
  const H = config?.images?.[0] ? 190 : 80;
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  let left = x + 42;
  let top  = y - H / 2;
  if (left + W > vw - PAD) left = x - W - 42;
  if (top < PAD) top = PAD;
  if (top + H > vh - PAD) top = vh - H - PAD;

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        position: 'absolute', left, top, width: W,
        zIndex: 30, pointerEvents: 'auto',
        animation: 'popupIn 0.2s cubic-bezier(0.34,1.56,0.64,1)',
      }}
    >
      {/* Gradient border wrapper */}
      <div style={{
        padding: isMulti ? 2 : 0,
        background: isMulti ? gradient : 'none',
        borderRadius: 16,
        boxShadow: `0 16px 48px rgba(0,0,0,0.5)`,
      }}>
        <div style={{
          background: 'rgba(13,24,41,0.97)',
          border: isMulti ? 'none' : `2px solid ${primary}`,
          borderRadius: isMulti ? 14 : 16,
          overflow: 'hidden',
        }}>
          {/* Header */}
          <div style={{ padding: '9px 12px 7px', display: 'flex', alignItems: 'center', gap: 7 }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={primary} strokeWidth="2.5" strokeLinecap="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            <span style={{ fontFamily: 'Mulish, sans-serif', fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.9)' }}>
              {country}
            </span>
          </div>

          {/* Image */}
          {config?.images?.[0] && (
            <div style={{ width: '100%', height: 108, overflow: 'hidden' }}>
              <img src={config.images[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}/>
            </div>
          )}

          {/* Explore button */}
          <button
            onClick={onExplore}
            style={{
              display: 'block', width: '100%', padding: '10px 12px',
              fontFamily: 'Mulish, sans-serif', fontSize: 13, fontWeight: 700,
              color: 'white', textAlign: 'left', background: 'none', border: 'none',
              borderTop: `1px solid ${primary}33`, cursor: 'none',
              letterSpacing: '0.01em',
            }}
            onMouseEnter={e => e.currentTarget.style.background = `${primary}22`}
            onMouseLeave={e => e.currentTarget.style.background = 'none'}
          >
            Explore {country} →
          </button>
        </div>
      </div>
    </div>
  );
}
