import { useRef } from 'react';

const COUNTRY_CARDS = {
  'Australia':  { src: '/cards/australia.png',  accent: '#C4613A' },
  'Costa Rica': { src: '/cards/costarica.png',  accent: '#E8A020' },
  'Egypt':      { src: '/cards/egypt.png',       accent: '#3D5A80' },
  'Germany':    { src: '/cards/germany.png',     accent: '#E8A020' },
  'Greece':     { src: '/cards/greece.png',      accent: '#C4613A' },
  'India':      { src: '/cards/india.png',       accent: '#8B7355' },
  'Indonesia':  { src: '/cards/indonesia.png',   accent: '#B8956A' },
  'Italy':      { src: '/cards/italy.png',       accent: '#C4613A' },
  'Laos':       { src: '/cards/laos.png',        accent: '#C4613A' },
  'Morocco':    { src: '/cards/morocco.png',     accent: '#E8A020' },
  'Peru':       { src: '/cards/peru.png',        accent: '#3D5A80' },
  'Portugal':   { src: '/cards/portugal.png',    accent: '#C4613A' },
  'Scotland':   { src: '/cards/scotland.png',    accent: '#B8956A' },
  'Thailand':   { src: '/cards/thailand.png',    accent: '#C4613A' },
};

export { COUNTRY_CARDS };

export default function CountryPopup({ country, x, y, onExplore, onMouseEnter, onMouseLeave }) {
  if (!country) return null;

  const card   = COUNTRY_CARDS[country];
  const accent = card?.accent || '#2ab5a0';

  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const W  = 200;
  const H  = card ? 290 : 180;
  const PAD = 16;

  let left = x + 20;
  let top  = y - H / 2;
  if (left + W > vw - PAD) left = x - W - 20;
  if (top < PAD) top = PAD;
  if (top + H > vh - PAD) top = vh - H - PAD;

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        position: 'absolute',
        left, top,
        width: W,
        zIndex: 30,
        pointerEvents: 'auto',
        animation: 'popupIn 0.2s cubic-bezier(0.34,1.56,0.64,1)',
        cursor: 'default',
      }}
    >
      <div style={{
        background: 'rgba(13,24,41,0.97)',
        border: `2px solid ${accent}`,
        borderRadius: 16,
        overflow: 'hidden',
        boxShadow: `0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px ${accent}33`,
      }}>
        {/* Header */}
        <div style={{
          padding: '10px 14px 8px',
          display: 'flex', alignItems: 'center', gap: 7,
          background: `${accent}22`,
          borderBottom: `1px solid ${accent}44`,
        }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2.5" strokeLinecap="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          <span style={{
            fontFamily: 'Mulish, sans-serif', fontSize: 13, fontWeight: 700,
            color: 'white', letterSpacing: '0.02em',
          }}>
            {country}
          </span>
        </div>

        {/* Image — card PNG if available, fallback colour block */}
        <div style={{ width: '100%', height: card ? 180 : 100, overflow: 'hidden', position: 'relative' }}>
          {card ? (
            <img
              src={card.src}
              alt={country}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          ) : (
            <div style={{ width: '100%', height: '100%', background: `${accent}44` }}/>
          )}
        </div>

        {/* Explore CTA */}
        <button
          onClick={onExplore}
          style={{
            display: 'block', width: '100%',
            padding: '12px 14px',
            fontFamily: 'Mulish, sans-serif', fontSize: 13, fontWeight: 700,
            color: 'white', textAlign: 'left',
            background: 'none', border: 'none',
            borderTop: `1px solid ${accent}44`,
            cursor: 'pointer',
            transition: 'background 0.15s',
            letterSpacing: '0.01em',
          }}
          onMouseEnter={e => e.currentTarget.style.background = `${accent}22`}
          onMouseLeave={e => e.currentTarget.style.background = 'none'}
        >
          Explore {country} →
        </button>
      </div>
    </div>
  );
}
