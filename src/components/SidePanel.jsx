import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

export default function SidePanel({ country, config, onClose }) {
  const panelRef = useRef(null);
  const [imgIdx, setImgIdx] = useState(0);
  const [wishlisted, setWishlisted] = useState(false);

  useEffect(() => {
    if (!country) return;
    setImgIdx(0);
    gsap.fromTo(panelRef.current,
      { x: '100%' },
      { x: '0%', duration: 0.55, ease: 'power4.out' }
    );
  }, [country]);

  const handleClose = () => {
    gsap.to(panelRef.current, {
      x: '100%', duration: 0.4, ease: 'power3.in',
      onComplete: onClose,
    });
  };

  const toggleWishlist = () => {
    setWishlisted(w => !w);
    gsap.fromTo(`#wishlist-heart`,
      { scale: 1 },
      { scale: 1.4, duration: 0.15, yoyo: true, repeat: 1, ease: 'power2.out' }
    );
  };

  if (!country || !config) return null;

  const images = config.images || [];

  return (
    <div
      ref={panelRef}
      className="side-panel fixed right-0 top-0 bottom-0 z-40 flex flex-col"
      style={{ width: '45%', minWidth: 480, transform: 'translateX(100%)' }}
    >
      {/* Header controls */}
      <div className="flex items-center justify-between px-6 py-4 absolute top-0 left-0 right-0 z-10">
        <button onClick={handleClose}
          className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
          style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#152238" strokeWidth="2.5" strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
        <button
          onClick={toggleWishlist}
          className="flex items-center gap-2 px-4 py-2 rounded-full font-body text-sm font-semibold transition-all duration-200 hover:scale-105"
          style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)', color: '#152238' }}
        >
          <svg id="wishlist-heart" width="16" height="16" viewBox="0 0 24 24"
            fill={wishlisted ? '#e86030' : 'none'}
            stroke={wishlisted ? '#e86030' : '#152238'} strokeWidth="2" strokeLinecap="round"
            style={{ display: 'inline', transition: 'fill 0.2s, stroke 0.2s' }}
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          Wishlist
        </button>
      </div>

      {/* Hero image carousel */}
      <div className="relative flex-shrink-0" style={{ height: 320 }}>
        <img
          src={images[imgIdx]}
          alt={country}
          className="w-full h-full object-cover"
          style={{ transition: 'opacity 0.4s ease' }}
        />
        {/* Image overlay info */}
        <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full font-body text-sm"
            style={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)', color: '#152238' }}>
            <span>{config.flag}</span>
            <span className="font-semibold">{config.region}</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full font-body text-sm"
            style={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)', color: '#152238' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#152238" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            <span className="font-semibold">{config.season}</span>
          </div>
        </div>
        {/* Carousel dots */}
        {images.length > 1 && (
          <div className="absolute bottom-14 left-0 right-0 flex justify-center gap-2">
            {images.map((_, i) => (
              <button key={i} onClick={() => setImgIdx(i)}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === imgIdx ? 20 : 8, height: 8,
                  background: i === imgIdx ? 'white' : 'rgba(255,255,255,0.4)',
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto side-panel-scroll px-8 py-6" style={{ background: '#f5f0e8' }}>

        {/* Coordinates */}
        <p className="font-body text-xs tracking-widest mb-2" style={{ color: '#8a9aaa', letterSpacing: '0.15em' }}>
          {config.capital?.toUpperCase()} — {config.coordinates}
        </p>

        {/* Title */}
        <h2 className="font-heading mb-3" style={{ fontSize: 28, color: '#152238', fontWeight: 600, lineHeight: 1.25 }}>
          Welcome to {country}
        </h2>

        {/* Description */}
        <p className="font-body mb-6" style={{ fontSize: 14, color: '#3d4f5c', lineHeight: 1.7 }}>
          {config.description}
        </p>

        {/* Divider */}
        <div style={{ height: 1, background: '#d4d8c8', marginBottom: 24 }}/>

        {/* Best time */}
        <h3 className="font-heading mb-4" style={{ fontSize: 18, color: '#152238', fontWeight: 600 }}>
          Best time to visit
        </h3>
        <div className="mb-6 space-y-2">
          {config.bestTime?.map((item, i) => (
            <p key={i} className="font-body text-sm" style={{ color: '#3d4f5c', lineHeight: 1.6 }}>
              <span style={{ fontWeight: 700, color: '#152238' }}>{item.label}:</span>{' '}
              {item.value}
            </p>
          ))}
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: '#d4d8c8', marginBottom: 24 }}/>

        {/* Highlights */}
        <h3 className="font-heading mb-4" style={{ fontSize: 18, color: '#152238', fontWeight: 600 }}>
          Destination highlights
        </h3>
        <ul className="mb-8 space-y-2">
          {config.highlights?.map((item, i) => (
            <li key={i} className="font-body text-sm flex items-start gap-3" style={{ color: '#3d4f5c', lineHeight: 1.6 }}>
              <span style={{ color: '#2ab5a0', marginTop: 4, flexShrink: 0 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
              </span>
              {item}
            </li>
          ))}
        </ul>

        {/* CTA */}
        <button
          className="w-full py-4 rounded-xl font-body font-bold text-white text-base transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
          style={{ background: '#152238', fontSize: 15 }}
        >
          Explore trips to {country} →
        </button>
        <p className="text-center font-body text-xs mt-3" style={{ color: '#8a9aaa' }}>
          Speak with a local expert · No commitment required
        </p>
      </div>
    </div>
  );
}
