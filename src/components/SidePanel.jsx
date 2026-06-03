import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

const DIVIDER = () => (
  <div style={{ height: 1, background: '#e5e0d5', margin: '28px 0' }}/>
);

const TRIP_CATEGORIES = ['Adventure', 'Wildlife', 'Mountains', 'Beaches', 'Relaxation', 'Culture', 'Food & Wine'];

// Pre-designed trips per country — Italy as the full example
const TRIPS = {
  Italy: [
    { title: 'Dolomites hiking & alpine villages', days: 7, price: '£2,800', img: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=400&q=80' },
    { title: 'Rome, Florence & the Amalfi Coast', days: 10, price: '£3,400', img: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=400&q=80' },
    { title: 'Sicily — food, history & volcanoes', days: 8, price: '£2,600', img: 'https://images.unsplash.com/photo-1534445867742-43195f401b6c?w=400&q=80' },
  ],
};

const LOCAL_EXPERTS = {
  Italy: [
    { name: 'Marco', role: 'Rome & Lazio', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80' },
    { name: 'Elena', role: 'Tuscany',       img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80' },
    { name: 'Luca',  role: 'Dolomites',     img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80' },
  ],
};

const DEFAULT_EXPERT_QUOTE = (country) =>
  `"Every corner of ${country} has a story — I can't wait to share mine with you. Let me show you the places that most visitors never find."`;

const ITALY_QUOTE = `"You're going to love this one. Seceda is one of our favourite spots in the Dolomites — a ridgeline that looks like it's been pulled straight from a dream. Those jagged peaks you see? They're even more breathtaking when you're standing right there, with the valley stretching out below you."`;

export default function SidePanel({ country, config, onClose }) {
  const panelRef    = useRef(null);
  const [imgIdx, setImgIdx]         = useState(0);
  const [wishlisted, setWishlisted] = useState(false);
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
        width: 480, zIndex: 50,
        transform: 'translateX(100%)',
        display: 'flex', flexDirection: 'column',
        fontFamily: 'Mulish, sans-serif',
        boxShadow: '-8px 0 40px rgba(0,0,0,0.25)',
      }}
    >
      {/* Floating header buttons */}
      <div style={{
        position: 'absolute', top: 16, left: 16, right: 16,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        zIndex: 10, pointerEvents: 'auto',
      }}>
        {/* Close */}
        <button onClick={handleClose} style={{
          width: 36, height: 36, borderRadius: '50%',
          background: 'rgba(255,255,255,0.92)', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          backdropFilter: 'blur(8px)',
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#152238" strokeWidth="2.5" strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>

        {/* Wishlist */}
        <button onClick={toggleWishlist} style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '8px 14px', borderRadius: 20,
          background: 'rgba(255,255,255,0.92)', border: 'none', cursor: 'pointer',
          backdropFilter: 'blur(8px)', color: '#152238',
          fontFamily: 'Mulish, sans-serif', fontSize: 13, fontWeight: 600,
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
      <div style={{ position: 'relative', flexShrink: 0, height: 260, overflow: 'hidden' }}>
        <img
          src={images[imgIdx]} alt={country}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'opacity 0.4s' }}
        />
        {/* Location label */}
        <div style={{
          position: 'absolute', bottom: 12, right: 12,
          background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(6px)',
          borderRadius: 6, padding: '4px 10px',
          fontFamily: 'Mulish, sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.9)',
        }}>
          {config.region || country}
        </div>
        {/* Carousel dots */}
        {images.length > 1 && (
          <div style={{ position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 6 }}>
            {images.map((_, i) => (
              <button key={i} onClick={() => setImgIdx(i)} style={{
                width: i === imgIdx ? 20 : 7, height: 7,
                borderRadius: 4, border: 'none', cursor: 'pointer',
                background: i === imgIdx ? 'white' : 'rgba(255,255,255,0.45)',
                transition: 'width 0.3s, background 0.3s', padding: 0,
              }}/>
            ))}
          </div>
        )}
      </div>

      {/* Scrollable body */}
      <div style={{
        flex: 1, overflowY: 'auto', background: '#faf8f4',
        padding: '28px 28px 48px',
      }}>

        {/* Coordinates */}
        <p style={{ fontSize: 11, letterSpacing: '0.14em', color: '#8a9aaa', marginBottom: 6, textTransform: 'uppercase' }}>
          {config.capital} — {config.coordinates}
        </p>

        {/* Title */}
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 26, fontWeight: 400, color: '#152238', marginBottom: 12, lineHeight: 1.2 }}>
          Welcome to {country}
        </h2>

        {/* Description */}
        <p style={{ fontSize: 14, color: '#3d4f5c', lineHeight: 1.75, marginBottom: 0 }}>
          {config.description}
        </p>

        <DIVIDER />

        {/* Best time to visit */}
        <h3 style={{ fontFamily: 'Georgia, serif', fontSize: 18, fontWeight: 400, color: '#152238', marginBottom: 14 }}>
          Best time to visit
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 0 }}>
          {config.bestTime?.map((item, i) => (
            <p key={i} style={{ fontSize: 14, color: '#3d4f5c', lineHeight: 1.6, margin: 0 }}>
              <strong style={{ color: '#152238' }}>{item.label}:</strong>{' '}{item.value}
            </p>
          ))}
        </div>

        <DIVIDER />

        {/* Destination highlights */}
        <h3 style={{ fontFamily: 'Georgia, serif', fontSize: 18, fontWeight: 400, color: '#152238', marginBottom: 14 }}>
          Destination highlights
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 0 }}>
          {config.highlights?.map((item, i) => (
            <p key={i} style={{ fontSize: 14, color: '#3d4f5c', lineHeight: 1.6, margin: 0, paddingLeft: 0 }}>
              {item}
            </p>
          ))}
        </div>

        <DIVIDER />

        {/* How much */}
        <h3 style={{ fontFamily: 'Georgia, serif', fontSize: 18, fontWeight: 400, color: '#152238', marginBottom: 12 }}>
          How much is a trip to {country}?
        </h3>
        <p style={{ fontSize: 14, color: '#3d4f5c', lineHeight: 1.75, margin: 0 }}>
          Trips can be tailored to suit a range of budgets — from simple cultural getaways to luxury adventures.
          On average, we find our travellers spend{' '}
          <strong style={{ color: '#152238' }}>£{config.avgCost || '2,800'} per person</strong>{' '}
          for a 7-day {country} experience.
        </p>

        <DIVIDER />

        {/* Pre-designed trips card */}
        <div style={{
          background: 'white', borderRadius: 16, padding: '20px 20px 24px',
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
        }}>
          <h3 style={{ fontFamily: 'Georgia, serif', fontSize: 18, fontWeight: 400, color: '#152238', marginBottom: 10 }}>
            Pre-designed trips
          </h3>
          <p style={{ fontSize: 13, color: '#3d4f5c', lineHeight: 1.65, marginBottom: 16 }}>
            You're all about <strong>wildlife</strong>, <u>hiking in the mountains</u>, and winding down by the <u>beach</u>.
            I'm picturing mornings on the trail, spotting incredible animals, and afternoons with your feet in the sand.
          </p>

          {/* Category pills */}
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4, marginBottom: 16 }}>
            {TRIP_CATEGORIES.map((cat, i) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(i)}
                style={{
                  padding: '6px 14px', borderRadius: 20, border: 'none', cursor: 'pointer',
                  fontFamily: 'Mulish, sans-serif', fontSize: 12, fontWeight: 600,
                  whiteSpace: 'nowrap', flexShrink: 0,
                  background: i === activeCategory ? '#152238' : 'transparent',
                  color: i === activeCategory ? 'white' : '#3d4f5c',
                  outline: i === activeCategory ? 'none' : '1px solid #d4d8c8',
                  transition: 'all 0.2s',
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Trip cards horizontal scroll */}
          <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 4 }}>
            {trips.map((trip, i) => (
              <div key={i} style={{
                flexShrink: 0, width: 160, borderRadius: 12, overflow: 'hidden',
                background: '#faf8f4', border: '1px solid #e5e0d5',
              }}>
                <div style={{ position: 'relative' }}>
                  <img src={trip.img} alt={trip.title}
                    style={{ width: '100%', height: 100, objectFit: 'cover', display: 'block' }}/>
                  <button style={{
                    position: 'absolute', top: 8, right: 8,
                    background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%',
                    width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer',
                  }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#152238" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                  </button>
                </div>
                <div style={{ padding: '10px 10px 12px' }}>
                  <p style={{ fontSize: 12, fontWeight: 600, color: '#152238', lineHeight: 1.4, marginBottom: 6 }}>{trip.title}</p>
                  <p style={{ fontSize: 11, color: '#8a9aaa', margin: 0 }}>{trip.days} days</p>
                  <p style={{ fontSize: 11, color: '#3d4f5c', fontWeight: 700, margin: '2px 0 0' }}>from {trip.price} per person</p>
                </div>
              </div>
            ))}
            {/* Plan your own */}
            <div style={{
              flexShrink: 0, width: 120, borderRadius: 12,
              border: '1.5px dashed #d4d8c8', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              padding: 12, cursor: 'pointer',
            }}>
              <p style={{ fontSize: 12, color: '#8a9aaa', textAlign: 'center', fontWeight: 600, margin: 0 }}>
                Plan your own
              </p>
            </div>
          </div>
        </div>

        <DIVIDER />

        {/* Local experts */}
        <h3 style={{ fontFamily: 'Georgia, serif', fontSize: 18, fontWeight: 400, color: '#152238', marginBottom: 16 }}>
          From our local experts in {country}
        </h3>

        {/* Expert photos */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6, marginBottom: 16 }}>
          {experts.map((expert, i) => (
            <div key={i} style={{ borderRadius: 12, overflow: 'hidden', aspectRatio: '1', position: 'relative' }}>
              <img src={expert.img} alt={expert.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}/>
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                background: 'linear-gradient(transparent, rgba(0,0,0,0.6))',
                padding: '12px 8px 6px',
              }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: 'white', margin: 0 }}>{expert.name}</p>
                <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.75)', margin: 0 }}>{expert.role}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Expert quote */}
        <p style={{ fontSize: 14, color: '#3d4f5c', lineHeight: 1.75, fontStyle: 'italic', margin: 0 }}>
          {quote}
        </p>

        <DIVIDER />

        {/* CTA */}
        <button style={{
          width: '100%', padding: '16px 0', borderRadius: 12,
          background: '#152238', border: 'none', cursor: 'pointer',
          fontFamily: 'Mulish, sans-serif', fontSize: 15, fontWeight: 700,
          color: 'white', letterSpacing: '0.01em',
        }}
          onMouseEnter={e => e.currentTarget.style.background = '#1e3356'}
          onMouseLeave={e => e.currentTarget.style.background = '#152238'}
        >
          Explore trips to {country} →
        </button>
        <p style={{ textAlign: 'center', fontSize: 12, color: '#8a9aaa', marginTop: 10 }}>
          Speak with a local expert · No commitment required
        </p>
      </div>
    </div>
  );
}
