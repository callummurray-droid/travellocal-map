import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

const DIVIDER = () => (
  <div style={{ height: 1, background: '#e5e0d5', margin: '28px 0' }}/>
);

const TRIP_CATEGORIES = ['Adventure', 'Wildlife', 'Mountains', 'Beaches', 'Relaxation', 'Culture', 'Food & Wine'];

const TRIPS = {
  Italy: [
    { title: 'Dolomites hiking & alpine villages', days: 7, price: '£2,800', img: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=400&q=80' },
    { title: 'Rome, Florence & the Amalfi Coast', days: 10, price: '£3,400', img: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=400&q=80' },
    { title: 'Sicily — food, history & volcanoes', days: 8, price: '£2,600', img: 'https://images.unsplash.com/photo-1534445867742-43195f401b6c?w=400&q=80' },
  ],
};

const LOCAL_EXPERTS = {
  Italy: [
    { name: 'Marco',   role: 'Rome & Lazio',  img: '/experts/expert1.png' },
    { name: 'Luca',    role: 'Dolomites',      img: '/experts/expert2.png' },
    { name: 'Sofia',   role: 'Tuscany',        img: '/experts/expert3.png' },
    { name: 'Isabelle',role: 'Amalfi & Sicily',img: '/experts/expert4.png' },
  ],
};

const DEFAULT_EXPERT_QUOTE = (country) =>
  `"Every corner of ${country} has a story — I can't wait to share mine with you. Let me show you the places that most visitors never find."`;

const ITALY_QUOTE = `"You're going to love this one. Seceda is one of our favourite spots in the Dolomites — a ridgeline that looks like it's been pulled straight from a dream. Those jagged peaks you see? They're even more breathtaking when you're standing right there, with the valley stretching out below you.

If you're up for a hike, I'll take you along trails where the air is crisp, the meadows are dotted with wildflowers in summer, and you might spot marmots or eagles if we're lucky."`;

export default function SidePanel({ country, config, onClose }) {
  const panelRef    = useRef(null);
  const [imgIdx, setImgIdx]                 = useState(0);
  const [wishlisted, setWishlisted]         = useState(false);
  const [activeCategory, setActiveCategory] = useState(0);

  useEffect(() => {
    if (!country) return;
    setImgIdx(0);
    setActiveCategory(0);
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
    gsap.fromTo('#wishlist-heart',
      { scale: 1 },
      { scale: 1.5, duration: 0.15, yoyo: true, repeat: 1, ease: 'power2.out' }
    );
  };

  if (!country || !config) return null;

  const images  = config.images || [];
  const trips   = TRIPS[country] || TRIPS.Italy;
  const experts = LOCAL_EXPERTS[country] || LOCAL_EXPERTS.Italy;
  const quote   = country === 'Italy' ? ITALY_QUOTE : DEFAULT_EXPERT_QUOTE(country);

  return (
    <div
      ref={panelRef}
      style={{
        position: 'fixed', right: 0, top: 0, bottom: 0,
        width: 560,
        zIndex: 50,
        transform: 'translateX(100%)',
        display: 'flex', flexDirection: 'column',
        fontFamily: 'Mulish, sans-serif',
        boxShadow: '-8px 0 48px rgba(0,0,0,0.3)',
        cursor: 'none',
      }}
    >
      {/* Floating header buttons */}
      <div style={{
        position: 'absolute', top: 16, left: 16, right: 16,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        zIndex: 10,
      }}>
        <button onClick={handleClose} style={{
          width: 38, height: 38, borderRadius: '50%',
          background: 'rgba(255,255,255,0.92)', border: 'none', cursor: 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          backdropFilter: 'blur(8px)', boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#152238" strokeWidth="2.5" strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>

        <button onClick={toggleWishlist} style={{
          display: 'flex', alignItems: 'center', gap: 7,
          padding: '8px 16px', borderRadius: 20,
          background: 'rgba(255,255,255,0.92)', border: 'none', cursor: 'none',
          backdropFilter: 'blur(8px)', color: '#152238',
          fontFamily: 'Mulish, sans-serif', fontSize: 13, fontWeight: 600,
          boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
        }}>
          Wishlist
          <svg id="wishlist-heart" width="14" height="14" viewBox="0 0 24 24"
            fill={wishlisted ? '#e86030' : 'none'}
            stroke={wishlisted ? '#e86030' : '#152238'} strokeWidth="2" strokeLinecap="round"
            style={{ transition: 'fill 0.2s, stroke 0.2s' }}
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
      </div>

      {/* Hero image */}
      <div style={{ position: 'relative', flexShrink: 0, height: 280, overflow: 'hidden' }}>
        <img src={images[imgIdx]} alt={country}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'opacity 0.4s' }}
        />
        <div style={{
          position: 'absolute', bottom: 14, right: 14,
          background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(6px)',
          borderRadius: 6, padding: '4px 10px',
          fontFamily: 'Mulish, sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.92)',
        }}>
          {config.imageLabels?.[imgIdx] || config.region || country}
        </div>
        {images.length > 1 && (
          <div style={{ position: 'absolute', bottom: 14, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 6 }}>
            {images.map((_, i) => (
              <button key={i} onClick={() => setImgIdx(i)} style={{
                width: i === imgIdx ? 22 : 7, height: 7, borderRadius: 4,
                border: 'none', cursor: 'none', padding: 0,
                background: i === imgIdx ? 'white' : 'rgba(255,255,255,0.45)',
                transition: 'width 0.3s, background 0.3s',
              }}/>
            ))}
          </div>
        )}
      </div>

      {/* Scrollable body — hidden scrollbar */}
      <div style={{
        flex: 1, overflowY: 'auto', background: '#faf8f4',
        padding: '32px 32px 56px',
        scrollbarWidth: 'none', msOverflowStyle: 'none',
      }}
        className="hide-scrollbar"
      >
        {/* Coordinates */}
        <p style={{ fontSize: 11, letterSpacing: '0.14em', color: '#8a9aaa', marginBottom: 8, textTransform: 'uppercase', margin: '0 0 8px' }}>
          {config.capital} — {config.coordinates}
        </p>

        {/* Title */}
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 28, fontWeight: 400, color: '#152238', margin: '0 0 14px', lineHeight: 1.2 }}>
          Welcome to {country}
        </h2>

        {/* Description */}
        <p style={{ fontSize: 14, color: '#3d4f5c', lineHeight: 1.8, margin: 0 }}>
          {config.description}
        </p>

        <DIVIDER />

        {/* Best time */}
        <h3 style={{ fontFamily: 'Georgia, serif', fontSize: 19, fontWeight: 400, color: '#152238', margin: '0 0 16px' }}>
          Best time to visit
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {config.bestTime?.map((item, i) => (
            <p key={i} style={{ fontSize: 14, color: '#3d4f5c', lineHeight: 1.6, margin: 0 }}>
              <strong style={{ color: '#152238' }}>{item.label}:</strong>{' '}{item.value}
            </p>
          ))}
        </div>

        <DIVIDER />

        {/* Highlights */}
        <h3 style={{ fontFamily: 'Georgia, serif', fontSize: 19, fontWeight: 400, color: '#152238', margin: '0 0 16px' }}>
          Destination highlights
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {config.highlights?.map((item, i) => (
            <p key={i} style={{ fontSize: 14, color: '#3d4f5c', lineHeight: 1.6, margin: 0, paddingLeft: 0 }}>
              {item}
            </p>
          ))}
        </div>

        <DIVIDER />

        {/* How much */}
        <h3 style={{ fontFamily: 'Georgia, serif', fontSize: 19, fontWeight: 400, color: '#152238', margin: '0 0 12px' }}>
          How much is a trip to {country}?
        </h3>
        <p style={{ fontSize: 14, color: '#3d4f5c', lineHeight: 1.8, margin: 0 }}>
          Trips can be tailored to suit a range of budgets — from simple cultural getaways to luxury adventures.
          On average, we find our travellers spend{' '}
          <strong style={{ color: '#152238' }}>£{config.avgCost || '2,800'} per person</strong>{' '}
          for a 7-day {country} experience.
        </p>

        <DIVIDER />

        {/* Pre-designed trips */}
        <div style={{
          background: 'white', borderRadius: 20, padding: '24px 24px 28px',
          boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
        }}>
          <h3 style={{ fontFamily: 'Georgia, serif', fontSize: 19, fontWeight: 400, color: '#152238', margin: '0 0 10px' }}>
            Pre-designed trips
          </h3>
          <p style={{ fontSize: 13, color: '#3d4f5c', lineHeight: 1.7, margin: '0 0 18px' }}>
            You're all about <strong>wildlife</strong>, <u>hiking in the mountains</u>, and winding down by the <u>beach</u>.
            I'm picturing mornings on the trail and afternoons with your feet in the sand.
          </p>

          {/* Category pills — no scrollbar */}
          <div className="pills-scroll" style={{ display: 'flex', gap: 8, paddingBottom: 2, margin: '0 0 18px' }}>
            {TRIP_CATEGORIES.map((cat, i) => (
              <button key={cat} onClick={() => setActiveCategory(i)} style={{
                padding: '7px 16px', borderRadius: 20, border: 'none', cursor: 'none',
                fontFamily: 'Mulish, sans-serif', fontSize: 12, fontWeight: 600,
                whiteSpace: 'nowrap', flexShrink: 0,
                background: i === activeCategory ? '#152238' : 'transparent',
                color: i === activeCategory ? 'white' : '#3d4f5c',
                outline: i === activeCategory ? 'none' : '1px solid #d4d8c8',
                transition: 'all 0.2s',
              }}>
                {cat}
              </button>
            ))}
          </div>

          {/* Trip cards — no scrollbar */}
          <div className="trips-scroll" style={{ display: 'flex', gap: 14, paddingBottom: 2 }}>
            {trips.map((trip, i) => (
              <div key={i} style={{
                flexShrink: 0, width: 172, borderRadius: 14, overflow: 'hidden',
                background: '#faf8f4', border: '1px solid #e5e0d5',
                cursor: 'none',
              }}>
                <div style={{ position: 'relative' }}>
                  <img src={trip.img} alt={trip.title}
                    style={{ width: '100%', height: 110, objectFit: 'cover', display: 'block' }}/>
                  <button style={{
                    position: 'absolute', top: 8, right: 8,
                    background: 'rgba(255,255,255,0.92)', border: 'none', borderRadius: '50%',
                    width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'none',
                  }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#152238" strokeWidth="2">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                  </button>
                </div>
                <div style={{ padding: '12px 12px 14px' }}>
                  <p style={{ fontSize: 12, fontWeight: 600, color: '#152238', lineHeight: 1.4, margin: '0 0 6px' }}>{trip.title}</p>
                  <p style={{ fontSize: 11, color: '#8a9aaa', margin: 0 }}>{trip.days} days</p>
                  <p style={{ fontSize: 11, color: '#3d4f5c', fontWeight: 700, margin: '3px 0 0' }}>from {trip.price} per person</p>
                </div>
              </div>
            ))}
            {/* Plan your own */}
            <div style={{
              flexShrink: 0, width: 130, borderRadius: 14,
              border: '2px dashed #d4d8c8',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              padding: 16, cursor: 'none', gap: 8,
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: '#f0ece4', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8a9aaa" strokeWidth="2" strokeLinecap="round">
                  <path d="M12 5v14M5 12h14"/>
                </svg>
              </div>
              <p style={{ fontSize: 12, color: '#8a9aaa', textAlign: 'center', fontWeight: 600, margin: 0, lineHeight: 1.4 }}>
                Plan your own
              </p>
            </div>
          </div>
        </div>

        <DIVIDER />

        {/* Local experts */}
        <h3 style={{ fontFamily: 'Georgia, serif', fontSize: 19, fontWeight: 400, color: '#152238', margin: '0 0 20px' }}>
          From our local experts in {country}
        </h3>

        {/* 2x2 expert grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 22 }}>
          {experts.map((expert, i) => (
            <div key={i} style={{ borderRadius: 16, overflow: 'hidden', position: 'relative', aspectRatio: '4/5' }}>
              <img src={expert.img} alt={expert.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', display: 'block' }}/>
              {/* Gradient overlay */}
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to bottom, transparent 50%, rgba(13,24,41,0.75) 100%)',
              }}/>
              {/* Name + role */}
              <div style={{ position: 'absolute', bottom: 12, left: 14, right: 14 }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: 'white', margin: '0 0 2px', fontFamily: 'Georgia, serif' }}>
                  {expert.name}
                </p>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.75)', margin: 0, fontFamily: 'Mulish, sans-serif' }}>
                  {expert.role}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Expert quote */}
        <div style={{
          background: 'white', borderRadius: 16, padding: '20px 22px',
          boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
          borderLeft: '3px solid #2ab5a0',
        }}>
          <p style={{ fontSize: 14, color: '#3d4f5c', lineHeight: 1.8, fontStyle: 'italic', margin: 0, whiteSpace: 'pre-line' }}>
            {quote}
          </p>
        </div>

        <DIVIDER />

        {/* Explore more */}
        <h3 style={{ fontFamily: 'Georgia, serif', fontSize: 19, fontWeight: 400, color: '#152238', margin: '0 0 6px' }}>
          Explore more of {country}
        </h3>
        <p style={{ fontSize: 13, color: '#8a9aaa', margin: '0 0 20px', lineHeight: 1.6 }}>
          Speak with one of our local experts and start planning your perfect trip — no commitment required.
        </p>

        {/* Primary CTA */}
        <button
          style={{
            width: '100%', padding: '17px 0', borderRadius: 14, marginBottom: 10,
            background: '#152238', border: 'none', cursor: 'none',
            fontFamily: 'Mulish, sans-serif', fontSize: 15, fontWeight: 700,
            color: 'white', letterSpacing: '0.01em', transition: 'background 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#1e3356'}
          onMouseLeave={e => e.currentTarget.style.background = '#152238'}
        >
          Start planning your trip to {country} →
        </button>

        {/* Secondary CTA */}
        <button
          style={{
            width: '100%', padding: '15px 0', borderRadius: 14,
            background: 'transparent',
            border: '1.5px solid #d4d8c8', cursor: 'none',
            fontFamily: 'Mulish, sans-serif', fontSize: 14, fontWeight: 600,
            color: '#152238', transition: 'border-color 0.2s, background 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#f0ece4'; e.currentTarget.style.borderColor = '#b0a898'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = '#d4d8c8'; }}
        >
          Browse all {country} trips
        </button>

        <p style={{ textAlign: 'center', fontSize: 12, color: '#8a9aaa', marginTop: 12 }}>
          No commitment required · Speak with a local expert
        </p>
      </div>
    </div>
  );
}
