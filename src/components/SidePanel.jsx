import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

const DIVIDER = () => (
  <div style={{ height: 1, background: '#e5e0d5', margin: '28px 0' }}/>
);

const TRIP_CATEGORIES = ['Adventure', 'Wildlife', 'Mountains', 'Beaches', 'Relaxation', 'Culture', 'Food & Wine'];

// POI-specific content — overrides country panel when diving into a location
const POI_CONTENT = {
  'Colosseum, Rome': {
    title: 'Rome',
    subtitle: 'The Eternal City',
    region: 'Lazio, Italy',
    coordinates: '41.8902° N, 12.4922° E',
    description: 'Nearly 2,000 years old and still the most awe-inspiring structure ever built — the Colosseum is Rome in one monument. Beyond it lies the Forum, the Palatine Hill, and an entire city that feels like an open-air museum. Rome rewards those who wander.',
    bestTime: [
      { label: 'Best weather', value: 'April – June, September – October' },
      { label: 'Fewer crowds', value: 'November – March' },
      { label: 'Avoid', value: 'August — locals leave, it gets very hot' },
    ],
    highlights: [
      'Colosseum and Roman Forum at dawn — before the crowds',
      'Trastevere neighbourhood at night — best cacio e pepe in the city',
      'Vatican Museums and the Sistine Chapel',
      'Gelato from Fatamorgana — the most creative flavours in Rome',
      'Throw a coin in the Trevi Fountain at midnight',
    ],
    images: [
      'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&q=80',
      'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=800&q=80',
    ],
    imageLabels: ['Colosseum, Rome', 'Roman Forum'],
    expert: { name: 'Marco', role: 'Rome & Lazio expert', img: '/experts/expert1.png' },
    quote: '"The Colosseum looks incredible in photos but nothing prepares you for standing in front of it at golden hour. I\'ll take you underground through the hypogeum — where gladiators waited — and then up to the top tier where the view over Rome is simply breathtaking."',
    trips: [
      { title: 'Rome in depth — 5 days with a local', days: 5, price: '£1,800', img: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400&q=80' },
      { title: 'Ancient Rome & the Vatican', days: 3, price: '£1,200', img: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=400&q=80' },
      { title: 'Rome, Orvieto & hill towns', days: 7, price: '£2,400', img: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=400&q=80' },
    ],
  },
  'Florence': {
    title: 'Florence',
    subtitle: 'The Cradle of the Renaissance',
    region: 'Tuscany, Italy',
    coordinates: '43.7696° N, 11.2558° E',
    description: 'Michelangelo\'s David. Botticelli\'s Birth of Venus. Brunelleschi\'s dome rising above terracotta rooftops. Florence holds more Renaissance masterpieces per square metre than anywhere on earth — and the bistecca is extraordinary.',
    bestTime: [
      { label: 'Ideal', value: 'April – May and September – October' },
      { label: 'Summer', value: 'Busy but beautiful — book everything ahead' },
    ],
    highlights: [
      'Uffizi Gallery — book weeks in advance',
      'Climbing the Duomo dome for the view',
      'Sunset from Piazzale Michelangelo',
      'Day trip to San Gimignano and Siena',
      'Florentine steak at Buca Mario',
    ],
    images: [
      'https://images.unsplash.com/photo-1543429257-3eb0b9bfdbf0?w=800&q=80',
      'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=800&q=80',
    ],
    imageLabels: ['Florence, Tuscany', 'Tuscan countryside'],
    expert: { name: 'Sofia', role: 'Tuscany expert', img: '/experts/expert3.png' },
    quote: '"Most visitors spend two days in Florence and leave thinking they\'ve seen it. I like to slow things right down — a morning with the Uffizi curator, lunch in the Oltrarno where the artisans still work, and an evening on a hilltop farm with a glass of Chianti."',
    trips: [
      { title: 'Florence & the Tuscan countryside', days: 6, price: '£2,200', img: 'https://images.unsplash.com/photo-1543429257-3eb0b9bfdbf0?w=400&q=80' },
      { title: 'Renaissance art deep dive', days: 4, price: '£1,600', img: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400&q=80' },
    ],
  },
  'Venice': {
    title: 'Venice',
    subtitle: 'The Floating City',
    region: 'Veneto, Italy',
    coordinates: '45.4408° N, 12.3155° E',
    description: 'Built on 118 islands, connected by 400 bridges, with no roads — Venice is the most improbable city ever constructed. Away from St Mark\'s Square, it\'s a labyrinth of quiet canals, neighbourhood bakeries and locals who\'ve lived here for generations.',
    bestTime: [
      { label: 'Best', value: 'October – November, February – March' },
      { label: 'Carnival', value: 'February — spectacular but very busy' },
      { label: 'Avoid', value: 'July–August — hot, extremely crowded' },
    ],
    highlights: [
      'Getting lost in Castello and Cannaregio — the real Venice',
      'Sunset gondola through the backwater canals',
      'Cicchetti bar crawl through the bacari',
      'Day trip to Murano for glassblowing',
      'Rowing lesson with a local gondolier',
    ],
    images: [
      'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=800&q=80',
    ],
    imageLabels: ['Grand Canal, Venice'],
    expert: { name: 'Marco', role: 'Rome & Lazio expert', img: '/experts/expert1.png' },
    quote: '"Everyone comes to Venice and walks straight to the Rialto. I take people through the back streets of Cannaregio before the city wakes up — just locals, cats, and the smell of fresh bread. That\'s the Venice I fell in love with."',
    trips: [
      { title: 'Venice beyond the tourist trail', days: 4, price: '£1,900', img: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=400&q=80' },
      { title: 'Venice, Verona & the Veneto', days: 7, price: '£2,600', img: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=400&q=80' },
    ],
  },
  'Amalfi': {
    title: 'Amalfi Coast',
    subtitle: 'Where Mountains Meet the Sea',
    region: 'Campania, Italy',
    coordinates: '40.6340° N, 14.6026° E',
    description: 'Vertical cliffs tumbling into turquoise water, lemon groves scenting the air, coloured villages clinging to rock faces — the Amalfi Coast is one of the world\'s great drives and an even better slow walk.',
    bestTime: [
      { label: 'Sweet spot', value: 'May – June and September – October' },
      { label: 'Lemon season', value: 'May — groves in full bloom' },
    ],
    highlights: [
      'Path of the Gods hiking trail above Positano',
      'Boat trip to the Blue Grotto at Capri',
      'Limoncello tasting at a family grove',
      'Swimming at Fiordo di Furore',
      'Fresh catch at Da Adolfo on the beach',
    ],
    images: [
      'https://images.unsplash.com/photo-1534445867742-43195f401b6c?w=800&q=80',
    ],
    imageLabels: ['Amalfi Coast, Campania'],
    expert: { name: 'Isabelle', role: 'Amalfi & Sicily expert', img: '/experts/expert4.png' },
    quote: '"The coast road gets all the attention but the real magic is on foot. The Path of the Gods above Positano — you\'re looking down at the sea with nothing but terraced lemon groves around you. I\'ve done it dozens of times and it still takes my breath away."',
    trips: [
      { title: 'Amalfi, Positano & Capri', days: 6, price: '£2,800', img: 'https://images.unsplash.com/photo-1534445867742-43195f401b6c?w=400&q=80' },
      { title: 'Southern Italy: Naples to Amalfi', days: 8, price: '£3,000', img: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=400&q=80' },
    ],
  },
  'Dolomites': {
    title: 'The Dolomites',
    subtitle: 'The Pale Mountains',
    region: 'South Tyrol & Veneto, Italy',
    coordinates: '46.5000° N, 11.8000° E',
    description: 'UNESCO World Heritage and one of the most dramatic mountain landscapes on earth — the Dolomites turn pink and gold at sunset (Enrosadira) in a way that seems almost supernatural. Summer hiking and winter skiing are world-class.',
    bestTime: [
      { label: 'Hiking', value: 'June – September' },
      { label: 'Skiing', value: 'December – March' },
      { label: 'Enrosadira', value: 'Best in June & September — clearest skies' },
    ],
    highlights: [
      'Seceda Ridgeline — the iconic jagged skyline',
      'Tre Cime di Lavaredo sunrise hike',
      'Alta Via 1 — multi-day hut-to-hut trail',
      'Rifugio Lagazuoi — lunch at 2,752m',
      'Alpe di Siusi — Europe\'s largest alpine meadow',
    ],
    images: [
      'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=800&q=80',
    ],
    imageLabels: ['Seceda, Dolomites'],
    expert: { name: 'Luca', role: 'Dolomites expert', img: '/experts/expert2.png' },
    quote: '"People think the Dolomites are just for serious mountaineers. I take families, couples, solo travellers — everyone finds their level here. There\'s a hike for every ability and a rifugio at the top of each one serving the best Kaiserschmarrn you\'ve ever tasted."',
    trips: [
      { title: 'Dolomites hut-to-hut — 7 days', days: 7, price: '£2,800', img: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=400&q=80' },
      { title: 'Dolomites highlights — 4 days', days: 4, price: '£1,600', img: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=400&q=80' },
    ],
  },
};

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

export default function SidePanel({ country, config, activePOI, onClose }) {
  const panelRef    = useRef(null);
  const [imgIdx, setImgIdx]                 = useState(0);
  const [wishlisted, setWishlisted]         = useState(false);
  const [activeCategory, setActiveCategory] = useState(0);

  // Determine if we have POI-specific content
  const poiKey = activePOI?.name;
  const poi    = poiKey ? POI_CONTENT[poiKey] : null;

  // Use POI content when in 3D, otherwise country content
  const title       = poi?.title       || country;
  const subtitle    = poi?.subtitle    || config?.tagline || '';
  const region      = poi?.region      || config?.region  || country;
  const coordinates = poi?.coordinates || config?.coordinates || '';
  const description = poi?.description || config?.description || '';
  const bestTime    = poi?.bestTime    || config?.bestTime    || [];
  const highlights  = poi?.highlights  || config?.highlights  || [];
  const images      = poi?.images      || config?.images      || [];
  const imageLabels = poi?.imageLabels || config?.imageLabels || [];
  const trips       = poi?.trips       || TRIPS[country]      || TRIPS.Italy;
  const experts     = poi
    ? [poi.expert, ...LOCAL_EXPERTS.Italy.filter(e => e.name !== poi.expert.name).slice(0, 1)]
    : LOCAL_EXPERTS[country] || LOCAL_EXPERTS.Italy;
  const quote       = poi?.quote       || `"Every corner of ${title} has a story — I can't wait to share mine with you."`;

  useEffect(() => {
    if (!country) return;
    setImgIdx(0);
    setActiveCategory(0);
    if (panelRef.current) {
      gsap.fromTo(panelRef.current,
        { x: '100%' },
        { x: '0%', duration: 0.55, ease: 'power4.out' }
      );
    }
  }, [country]);

  // Smoothly update content when POI changes without re-animating the panel
  useEffect(() => {
    setImgIdx(0);
  }, [poiKey]);

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

  return (
    <div
      ref={panelRef}
      style={{
        position: 'fixed', right: 0, top: 0, bottom: 0,
        width: 560, zIndex: 50,
        transform: 'translateX(100%)',
        display: 'flex', flexDirection: 'column',
        fontFamily: 'Mulish, sans-serif',
        boxShadow: '-8px 0 48px rgba(0,0,0,0.3)',
        cursor: 'none',
      }}
    >
      {/* Header buttons */}
      <div style={{
        position: 'absolute', top: 16, left: 16, right: 16,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10,
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
        {images[imgIdx] ? (
          <img src={images[imgIdx]} alt={title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'opacity 0.4s' }}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', background: '#1a2e4a' }}/>
        )}
        <div style={{
          position: 'absolute', bottom: 14, right: 14,
          background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(6px)',
          borderRadius: 6, padding: '4px 10px',
          fontFamily: 'Mulish, sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.92)',
        }}>
          {imageLabels[imgIdx] || region}
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

      {/* Body */}
      <div style={{ flex: 1, overflowY: 'auto', background: '#faf8f4', padding: '32px 32px 56px' }} className="hide-scrollbar">

        {/* Breadcrumb when in POI mode */}
        {poi && (
          <p style={{ fontSize: 11, color: '#2ab5a0', margin: '0 0 6px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Italy › {title}
          </p>
        )}

        <p style={{ fontSize: 11, letterSpacing: '0.14em', color: '#8a9aaa', margin: '0 0 8px', textTransform: 'uppercase' }}>
          {coordinates}
        </p>

        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 28, fontWeight: 400, color: '#152238', margin: '0 0 4px', lineHeight: 1.2 }}>
          Welcome to {title}
        </h2>
        {subtitle && (
          <p style={{ fontFamily: 'Georgia, serif', fontSize: 15, color: '#8a9aaa', fontStyle: 'italic', margin: '0 0 14px' }}>
            {subtitle}
          </p>
        )}

        <p style={{ fontSize: 14, color: '#3d4f5c', lineHeight: 1.8, margin: 0 }}>{description}</p>

        <DIVIDER />

        <h3 style={{ fontFamily: 'Georgia, serif', fontSize: 19, fontWeight: 400, color: '#152238', margin: '0 0 16px' }}>
          Best time to visit
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {bestTime.map((item, i) => (
            <p key={i} style={{ fontSize: 14, color: '#3d4f5c', lineHeight: 1.6, margin: 0 }}>
              <strong style={{ color: '#152238' }}>{item.label}:</strong>{' '}{item.value}
            </p>
          ))}
        </div>

        <DIVIDER />

        <h3 style={{ fontFamily: 'Georgia, serif', fontSize: 19, fontWeight: 400, color: '#152238', margin: '0 0 16px' }}>
          {poi ? `What to do in ${title}` : 'Destination highlights'}
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {highlights.map((item, i) => (
            <p key={i} style={{ fontSize: 14, color: '#3d4f5c', lineHeight: 1.6, margin: 0 }}>{item}</p>
          ))}
        </div>

        <DIVIDER />

        <h3 style={{ fontFamily: 'Georgia, serif', fontSize: 19, fontWeight: 400, color: '#152238', margin: '0 0 12px' }}>
          How much is a trip to {title}?
        </h3>
        <p style={{ fontSize: 14, color: '#3d4f5c', lineHeight: 1.8, margin: 0 }}>
          Trips can be tailored to suit a range of budgets.
          On average, we find our travellers spend{' '}
          <strong style={{ color: '#152238' }}>£{config.avgCost || '2,800'} per person</strong>{' '}
          for a week in {title}.
        </p>

        <DIVIDER />

        {/* Pre-designed trips */}
        <div style={{ background: 'white', borderRadius: 20, padding: '24px 24px 28px', boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
          <h3 style={{ fontFamily: 'Georgia, serif', fontSize: 19, fontWeight: 400, color: '#152238', margin: '0 0 10px' }}>
            {poi ? `Trips to ${title}` : 'Pre-designed trips'}
          </h3>
          <p style={{ fontSize: 13, color: '#3d4f5c', lineHeight: 1.7, margin: '0 0 18px' }}>
            Curated by our local experts — each trip is fully personalised to your pace and interests.
          </p>
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
              }}>{cat}</button>
            ))}
          </div>
          <div className="trips-scroll" style={{ display: 'flex', gap: 14, paddingBottom: 2 }}>
            {trips.map((trip, i) => (
              <div key={i} style={{ flexShrink: 0, width: 172, borderRadius: 14, overflow: 'hidden', background: '#faf8f4', border: '1px solid #e5e0d5', cursor: 'none' }}>
                <div style={{ position: 'relative' }}>
                  <img src={trip.img} alt={trip.title} style={{ width: '100%', height: 110, objectFit: 'cover', display: 'block' }}/>
                  <button style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(255,255,255,0.92)', border: 'none', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'none' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#152238" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                  </button>
                </div>
                <div style={{ padding: '12px 12px 14px' }}>
                  <p style={{ fontSize: 12, fontWeight: 600, color: '#152238', lineHeight: 1.4, margin: '0 0 6px' }}>{trip.title}</p>
                  <p style={{ fontSize: 11, color: '#8a9aaa', margin: 0 }}>{trip.days} days</p>
                  <p style={{ fontSize: 11, color: '#3d4f5c', fontWeight: 700, margin: '3px 0 0' }}>from {trip.price} per person</p>
                </div>
              </div>
            ))}
            <div style={{ flexShrink: 0, width: 130, borderRadius: 14, border: '2px dashed #d4d8c8', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 16, cursor: 'none', gap: 8 }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#f0ece4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8a9aaa" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
              </div>
              <p style={{ fontSize: 12, color: '#8a9aaa', textAlign: 'center', fontWeight: 600, margin: 0, lineHeight: 1.4 }}>Plan your own</p>
            </div>
          </div>
        </div>

        <DIVIDER />

        {/* Expert section — always show full grid */}
        <h3 style={{ fontFamily: 'Georgia, serif', fontSize: 19, fontWeight: 400, color: '#152238', margin: '0 0 20px' }}>
          From our local experts in Italy
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 22 }}>
          {(LOCAL_EXPERTS[country] || LOCAL_EXPERTS.Italy).map((expert, i) => (
            <div key={i} style={{ borderRadius: 16, overflow: 'hidden', position: 'relative', aspectRatio: '4/5' }}>
              <img src={expert.img} alt={expert.name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', display: 'block' }}/>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 50%, rgba(13,24,41,0.75) 100%)' }}/>
              <div style={{ position: 'absolute', bottom: 12, left: 14, right: 14 }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: 'white', margin: '0 0 2px', fontFamily: 'Georgia, serif' }}>{expert.name}</p>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.75)', margin: 0 }}>{expert.role}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: 'white', borderRadius: 16, padding: '20px 22px', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', borderLeft: '3px solid #2ab5a0' }}>
          <p style={{ fontSize: 14, color: '#3d4f5c', lineHeight: 1.8, fontStyle: 'italic', margin: 0, whiteSpace: 'pre-line' }}>{quote}</p>
        </div>

        <DIVIDER />

        <h3 style={{ fontFamily: 'Georgia, serif', fontSize: 19, fontWeight: 400, color: '#152238', margin: '0 0 6px' }}>
          {poi ? `Plan your trip to ${title}` : `Explore more of ${country}`}
        </h3>
        <p style={{ fontSize: 13, color: '#8a9aaa', margin: '0 0 20px', lineHeight: 1.6 }}>
          Speak with {poi ? poi.expert.name : 'one of our local experts'} and start planning — no commitment required.
        </p>

        <button style={{ width: '100%', padding: '17px 0', borderRadius: 14, marginBottom: 10, background: '#152238', border: 'none', cursor: 'none', fontFamily: 'Mulish, sans-serif', fontSize: 15, fontWeight: 700, color: 'white', transition: 'background 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.background = '#1e3356'}
          onMouseLeave={e => e.currentTarget.style.background = '#152238'}>
          Start planning your trip to {title} →
        </button>

        <button style={{ width: '100%', padding: '15px 0', borderRadius: 14, background: 'transparent', border: '1.5px solid #d4d8c8', cursor: 'none', fontFamily: 'Mulish, sans-serif', fontSize: 14, fontWeight: 600, color: '#152238', transition: 'border-color 0.2s, background 0.2s' }}
          onMouseEnter={e => { e.currentTarget.style.background = '#f0ece4'; e.currentTarget.style.borderColor = '#b0a898'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = '#d4d8c8'; }}>
          Browse all {poi ? 'Italy' : country} trips
        </button>

        <p style={{ textAlign: 'center', fontSize: 12, color: '#8a9aaa', marginTop: 12 }}>
          No commitment required · Speak with a local expert
        </p>
      </div>
    </div>
  );
}
