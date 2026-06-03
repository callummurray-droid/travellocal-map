import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { gsap } from 'gsap';
import { MAPBOX_TOKEN, EXPERT_COUNTRIES, COUNTRY_CONFIG } from '../data/countries';
import SidePanel from './SidePanel';

mapboxgl.accessToken = MAPBOX_TOKEN;

const EXPERT_PINS = [
  { name: 'London, UK',       coords: [-0.1276, 51.5074] },
  { name: 'Dublin, Ireland',  coords: [-6.2603, 53.3498] },
  { name: 'Paris, France',    coords: [2.3522,  48.8566] },
  { name: 'Amsterdam',        coords: [4.9041,  52.3676] },
  { name: 'Berlin, Germany',  coords: [13.4050, 52.5200] },
  { name: 'Madrid, Spain',    coords: [-3.7038, 40.4168] },
  { name: 'Barcelona',        coords: [2.1734,  41.3851] },
  { name: 'Rome, Italy',      coords: [12.4964, 41.9028] },
  { name: 'Athens, Greece',   coords: [23.7275, 37.9838] },
  { name: 'Lisbon, Portugal', coords: [-9.1393, 38.7223] },
  { name: 'Warsaw, Poland',   coords: [21.0122, 52.2297] },
  { name: 'Prague',           coords: [14.4378, 50.0755] },
  { name: 'Vienna, Austria',  coords: [16.3738, 48.2082] },
  { name: 'Zurich',           coords: [8.5417,  47.3769] },
  { name: 'Oslo, Norway',     coords: [10.7522, 59.9139] },
  { name: 'Stockholm',        coords: [18.0686, 59.3293] },
  { name: 'Helsinki',         coords: [24.9354, 60.1699] },
  { name: 'Tokyo, Japan',     coords: [139.6503, 35.6762] },
  { name: 'Marrakech',        coords: [-7.9811, 31.6295] },
  { name: 'Cairo, Egypt',     coords: [31.2357, 30.0444] },
  { name: 'Nairobi, Kenya',   coords: [36.8219, -1.2921] },
  { name: 'Cape Town',        coords: [18.4241, -33.9249] },
  { name: 'Mumbai, India',    coords: [72.8777, 19.0760] },
  { name: 'Bangkok',          coords: [100.5018, 13.7563] },
  { name: 'Bali, Indonesia',  coords: [115.0920, -8.3405] },
  { name: 'Sydney, Australia',coords: [151.2093, -33.8688] },
  { name: 'Lima, Peru',       coords: [-77.0428, -12.0464] },
  { name: 'Buenos Aires',     coords: [-58.3816, -34.6037] },
  { name: 'Mexico City',      coords: [-99.1332, 19.4326] },
  { name: 'Havana, Cuba',     coords: [-82.3666, 23.1136] },
];

export default function MapScene({ visible }) {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [hoveredCountry, setHoveredCountry] = useState(null);
  const [searchVal, setSearchVal] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [panelOpen, setPanelOpen] = useState(false);
  const popupRef = useRef(null);
  const hoveredIdRef = useRef(null);

  useEffect(() => {
    if (!visible || mapRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [12, 48],
      zoom: 4.2,
      minZoom: 1.5,
      maxZoom: 10,
      projection: 'mercator',
    });

    mapRef.current = map;

    map.on('load', () => {
      // Style overrides to match design
      map.setPaintProperty('background', 'background-color', '#0d1829');
      map.setPaintProperty('water', 'fill-color', '#0a1525');

      // Country fill layer for hover/select
      map.addSource('countries', {
        type: 'vector',
        url: 'mapbox://mapbox.country-boundaries-v1',
      });

      map.addLayer({
        id: 'country-fills',
        type: 'fill',
        source: 'countries',
        'source-layer': 'country_boundaries',
        filter: ['==', ['get', 'disputed'], 'false'],
        paint: {
          'fill-color': [
            'case',
            ['boolean', ['feature-state', 'selected'], false], '#ffffff',
            ['boolean', ['feature-state', 'hovered'], false],  '#ffffff',
            'rgba(0,0,0,0)',
          ],
          'fill-opacity': [
            'case',
            ['boolean', ['feature-state', 'selected'], false], 0.92,
            ['boolean', ['feature-state', 'hovered'], false],  0.15,
            0,
          ],
        },
      });

      map.addLayer({
        id: 'country-borders-selected',
        type: 'line',
        source: 'countries',
        'source-layer': 'country_boundaries',
        paint: {
          'line-color': [
            'case',
            ['boolean', ['feature-state', 'selected'], false], '#e86030',
            'rgba(0,0,0,0)',
          ],
          'line-width': [
            'case',
            ['boolean', ['feature-state', 'selected'], false], 3,
            0,
          ],
          'line-blur': 1,
        },
      });

      // Expert pins
      EXPERT_PINS.forEach((pin, i) => {
        const el = document.createElement('div');
        el.className = 'expert-pin';
        el.style.cssText = `
          width: 12px; height: 12px;
          border-radius: 50%;
          background: #2ab5a0;
          border: 2px solid rgba(255,255,255,0.8);
          cursor: pointer;
          position: relative;
          opacity: 0;
          transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
        `;
        el.style.boxShadow = '0 0 0 0 rgba(42,181,160,0.4)';

        const ring = document.createElement('div');
        ring.style.cssText = `
          position: absolute;
          inset: -6px;
          border-radius: 50%;
          border: 1.5px solid rgba(42,181,160,0.5);
          animation: pin-pulse ${2 + (i % 3) * 0.5}s ease-out infinite;
          animation-delay: ${i * 0.15}s;
        `;
        el.appendChild(ring);

        el.addEventListener('mouseenter', () => {
          el.style.transform = 'scale(1.5)';
        });
        el.addEventListener('mouseleave', () => {
          el.style.transform = 'scale(1)';
        });

        const marker = new mapboxgl.Marker({ element: el })
          .setLngLat(pin.coords)
          .addTo(map);
        markersRef.current.push({ marker, el });
      });

      // Animate pins in staggered
      setTimeout(() => {
        markersRef.current.forEach(({ el }, i) => {
          setTimeout(() => {
            gsap.to(el, { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(2)' });
          }, i * 60);
        });
      }, 300);

      // Hover interaction
      map.on('mousemove', 'country-fills', (e) => {
        if (panelOpen) return;
        const name = e.features[0]?.properties?.name_en;
        if (!name) return;

        if (hoveredIdRef.current !== null) {
          map.setFeatureState({ source: 'countries', sourceLayer: 'country_boundaries', id: hoveredIdRef.current }, { hovered: false });
        }
        hoveredIdRef.current = e.features[0].id;
        map.setFeatureState({ source: 'countries', sourceLayer: 'country_boundaries', id: hoveredIdRef.current }, { hovered: true });
        map.getCanvas().style.cursor = 'pointer';
        setHoveredCountry({ name, lngLat: e.lngLat });
      });

      map.on('mouseleave', 'country-fills', () => {
        if (hoveredIdRef.current !== null) {
          map.setFeatureState({ source: 'countries', sourceLayer: 'country_boundaries', id: hoveredIdRef.current }, { hovered: false });
        }
        hoveredIdRef.current = null;
        map.getCanvas().style.cursor = '';
        setHoveredCountry(null);
      });

      // Click interaction
      map.on('click', 'country-fills', (e) => {
        const name = e.features[0]?.properties?.name_en;
        if (!name) return;
        selectCountry(name, e.features[0].id);
      });

      // Nav fade in
      gsap.to('#tl-nav', { opacity: 1, duration: 0.6, delay: 0.4, ease: 'power2.out' });
    });

    return () => map.remove();
  }, [visible]);

  const selectCountry = (name, featureId) => {
    const config = COUNTRY_CONFIG[name];
    setSelectedCountry({ name, config, featureId });
    setPanelOpen(true);

    // Set selected state on map
    if (mapRef.current && featureId != null) {
      mapRef.current.setFeatureState(
        { source: 'countries', sourceLayer: 'country_boundaries', id: featureId },
        { selected: true, hovered: false }
      );
      const col = config?.colour || '#e86030';
      mapRef.current.setPaintProperty('country-borders-selected', 'line-color', [
        'case',
        ['boolean', ['feature-state', 'selected'], false], col,
        'rgba(0,0,0,0)',
      ]);
    }
    setHoveredCountry(null);
  };

  const closePanel = () => {
    setPanelOpen(false);
    if (mapRef.current && selectedCountry?.featureId != null) {
      mapRef.current.setFeatureState(
        { source: 'countries', sourceLayer: 'country_boundaries', id: selectedCountry.featureId },
        { selected: false }
      );
    }
    setSelectedCountry(null);
  };

  const handleSearch = (val) => {
    setSearchVal(val);
    if (!val.trim()) { setSuggestions([]); return; }
    const matches = EXPERT_COUNTRIES.filter(c =>
      c.toLowerCase().startsWith(val.toLowerCase())
    ).slice(0, 6);
    setSuggestions(matches);
  };

  const flyToCountry = (name) => {
    setSuggestions([]);
    setSearchVal(name);
    const config = COUNTRY_CONFIG[name];
    if (config && mapRef.current) {
      mapRef.current.flyTo({ center: [12, 45], zoom: 5, duration: 1200 });
      setTimeout(() => selectCountry(name, null), 1300);
    }
  };

  const doSurprise = () => {
    const keys = Object.keys(COUNTRY_CONFIG);
    const pick = keys[Math.floor(Math.random() * keys.length)];
    flyToCountry(pick);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-10">
      {/* Map */}
      <div ref={mapContainer} className="absolute inset-0" />

      {/* Hover popup */}
      {hoveredCountry && !panelOpen && (
        <div
          className="country-popup absolute pointer-events-none z-30"
          style={{
            left: '50%', top: '50%',
            transform: 'translate(-50%,-50%)',
            width: 200,
          }}
        >
          <div style={{ padding: '10px 12px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <p className="font-body text-white/50 text-xs mb-1">
              <svg style={{ display: 'inline', marginRight: 4 }} width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              {hoveredCountry.name}
            </p>
            <div style={{ width: '100%', height: 90, background: '#1e3a6e', borderRadius: 8, overflow: 'hidden' }}>
              {COUNTRY_CONFIG[hoveredCountry.name]?.images?.[0] && (
                <img src={COUNTRY_CONFIG[hoveredCountry.name].images[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
              )}
            </div>
          </div>
          <button
            className="w-full font-body text-white text-sm font-semibold py-3 px-4 text-left hover:bg-white/5 transition-colors pointer-events-auto"
            onClick={() => {
              const cfg = COUNTRY_CONFIG[hoveredCountry.name];
              if (cfg) selectCountry(hoveredCountry.name, null);
            }}
          >
            Explore {hoveredCountry.name} →
          </button>
        </div>
      )}

      {/* Bottom search bar */}
      <div className="absolute bottom-8 left-8 z-20" style={{ minWidth: 260 }}>
        <div className="search-pill rounded-full px-5 py-3 flex items-center gap-3 relative">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            value={searchVal}
            onChange={e => handleSearch(e.target.value)}
            placeholder="Search for a destination"
            className="bg-transparent border-none outline-none text-white text-sm font-body w-48"
            style={{ caretColor: '#2ab5a0' }}
          />
          {suggestions.length > 0 && (
            <div className="absolute bottom-full left-0 right-0 mb-2 rounded-2xl overflow-hidden z-30"
              style={{ background: 'rgba(13,24,41,0.97)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(16px)' }}>
              {suggestions.map(s => (
                <button key={s}
                  onClick={() => flyToCountry(s)}
                  className="w-full text-left px-5 py-3 font-body text-sm text-white/80 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-3"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(42,181,160,0.7)" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 mt-3 pl-2">
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#2ab5a0' }}/>
          <span className="font-body text-white/40 text-xs">Local expert destinations</span>
        </div>
      </div>

      {/* Surprise me + zoom controls */}
      <div className="absolute bottom-8 right-8 z-20 flex flex-col items-end gap-3">
        <button onClick={doSurprise}
          className="flex items-center gap-2 px-5 py-3 rounded-full font-body text-sm font-semibold transition-all duration-200 hover:scale-105"
          style={{ background: 'rgba(42,181,160,0.15)', border: '1px solid rgba(42,181,160,0.35)', color: '#2ab5a0', backdropFilter: 'blur(12px)' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
          Surprise me
        </button>

        <div className="map-controls rounded-2xl overflow-hidden flex flex-col">
          {[
            { icon: '+', action: () => mapRef.current?.zoomIn() },
            { icon: '−', action: () => mapRef.current?.zoomOut() },
          ].map(({ icon, action }) => (
            <button key={icon} onClick={action}
              className="w-12 h-12 flex items-center justify-center text-white/60 hover:text-white text-lg transition-colors border-b border-white/5 last:border-0"
              style={{ fontFamily: 'monospace', fontSize: 20 }}
            >
              {icon}
            </button>
          ))}
        </div>
      </div>

      {/* Panel overlay */}
      {panelOpen && (
        <div className="absolute inset-0 z-30" style={{ pointerEvents: 'none' }}>
          <div
            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', pointerEvents: 'auto' }}
            onClick={closePanel}
          />
        </div>
      )}

      {/* Side panel */}
      <SidePanel
        country={selectedCountry?.name}
        config={selectedCountry?.config}
        onClose={closePanel}
      />
    </div>
  );
}
