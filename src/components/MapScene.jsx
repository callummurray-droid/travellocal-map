import { useEffect, useRef, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import { gsap } from 'gsap';
import { MAPBOX_TOKEN, EXPERT_COUNTRIES, COUNTRY_CONFIG } from '../data/countries';
import SidePanel from './SidePanel';
import CountryPopup from './CountryPopup';

// Country card images from Act 1 marquee — used for hover popups
const COUNTRY_CARDS = {
  'Australia':  '/cards/australia.png',
  'Costa Rica': '/cards/costarica.png',
  'Egypt':      '/cards/egypt.png',
  'Germany':    '/cards/germany.png',
  'Greece':     '/cards/greece.png',
  'India':      '/cards/india.png',
  'Indonesia':  '/cards/indonesia.png',
  'Italy':      '/cards/italy.png',
  'Laos':       '/cards/laos.png',
  'Morocco':    '/cards/morocco.png',
  'Peru':       '/cards/peru.png',
  'Portugal':   '/cards/portugal.png',
  'Scotland':   '/cards/scotland.png',
  'Thailand':   '/cards/thailand.png',
};


mapboxgl.accessToken = MAPBOX_TOKEN;

const EXPERT_PINS = [
  // Europe
  { name: 'Tirana, Albania',        coords: [19.8189,  41.3275] },
  { name: 'Vienna, Austria',        coords: [16.3738,  48.2082] },
  { name: 'Sofia, Bulgaria',        coords: [23.3219,  42.6977] },
  { name: 'Zagreb, Croatia',        coords: [15.9819,  45.8150] },
  { name: 'Prague, Czech Republic', coords: [14.4378,  50.0755] },
  { name: 'Tallinn, Estonia',       coords: [24.7536,  59.4370] },
  { name: 'Helsinki, Finland',      coords: [24.9354,  60.1699] },
  { name: 'Tbilisi, Georgia',       coords: [44.8271,  41.6938] },
  { name: 'Berlin, Germany',        coords: [13.4050,  52.5200] },
  { name: 'Athens, Greece',         coords: [23.7275,  37.9838] },
  { name: 'Reykjavik, Iceland',     coords: [-21.9426, 64.1466] },
  { name: 'Rome, Italy',            coords: [12.4964,  41.9028] },
  { name: 'Riga, Latvia',           coords: [24.1052,  56.9496] },
  { name: 'Vilnius, Lithuania',     coords: [25.2797,  54.6872] },
  { name: 'Valletta, Malta',        coords: [14.5146,  35.8997] },
  { name: 'Podgorica, Montenegro',  coords: [19.2636,  42.4304] },
  { name: 'Oslo, Norway',           coords: [10.7522,  59.9139] },
  { name: 'Warsaw, Poland',         coords: [21.0122,  52.2297] },
  { name: 'Lisbon, Portugal',       coords: [-8.6291,  38.7223] },
  { name: 'Bucharest, Romania',     coords: [26.1025,  44.4268] },
  { name: 'Ljubljana, Slovenia',    coords: [14.5058,  46.0569] },
  { name: 'Madrid, Spain',          coords: [-3.7038,  40.4168] },
  { name: 'Stockholm, Sweden',      coords: [18.0686,  59.3293] },
  { name: 'Zurich, Switzerland',    coords: [8.5417,   47.3769] },
  // Middle East & Africa
  { name: 'Amman, Jordan',          coords: [35.9106,  31.9539] },
  { name: 'Marrakech, Morocco',     coords: [-7.9811,  31.6295] },
  { name: 'Windhoek, Namibia',      coords: [17.0658, -22.5609] },
  { name: 'Gaborone, Botswana',     coords: [25.9201, -24.6282] },
  { name: 'Muscat, Oman',           coords: [58.5922,  23.5880] },
  { name: 'Kigali, Rwanda',         coords: [30.0616,  -1.9441] },
  { name: 'Dar es Salaam, Tanzania',coords: [39.2083,  -6.7924] },
  { name: 'Tunis, Tunisia',         coords: [10.1815,  36.8065] },
  { name: 'Istanbul, Turkey',       coords: [28.9784,  41.0082] },
  { name: 'Dubai, United Arab Emirates', coords: [55.2708, 25.2048] },
  { name: 'Cairo, Egypt',           coords: [31.2357,  30.0444] },
  { name: 'Accra, Ghana',           coords: [-0.1870,   5.6037] },
  { name: 'Nairobi, Kenya',         coords: [36.8219,  -1.2921] },
  { name: 'Antananarivo, Madagascar',coords:[47.5079, -18.8792] },
  { name: 'Cape Town, South Africa',coords: [18.4241, -33.9249] },
  { name: 'Kampala, Uganda',        coords: [32.5825,   0.3476] },
  { name: 'Harare, Zimbabwe',       coords: [31.0522, -17.8292] },
  // Asia
  { name: 'Phnom Penh, Cambodia',   coords: [104.9282, 11.5564] },
  { name: 'Thimphu, Bhutan',        coords: [89.6390,  27.4728] },
  { name: 'Beijing, China',         coords: [116.4074, 39.9042] },
  { name: 'New Delhi, India',       coords: [77.2090,  28.6139] },
  { name: 'Bali, Indonesia',        coords: [115.0920,  -8.3405] },
  { name: 'Tokyo, Japan',           coords: [139.6503, 35.6762] },
  { name: 'Bishkek, Kyrgyzstan',    coords: [74.5698,  42.8746] },
  { name: 'Vientiane, Laos',        coords: [102.6331, 17.9757] },
  { name: 'Kuala Lumpur, Malaysia', coords: [101.6869,  3.1390] },
  { name: 'Ulaanbaatar, Mongolia',  coords: [106.9057, 47.8864] },
  { name: 'Kathmandu, Nepal',       coords: [85.3240,  27.7172] },
  { name: 'Islamabad, Pakistan',    coords: [73.0479,  33.6844] },
  { name: 'Manila, Philippines',    coords: [120.9842, 14.5995] },
  { name: 'Colombo, Sri Lanka',     coords: [79.8612,   6.9271] },
  { name: 'Bangkok, Thailand',      coords: [100.5018, 13.7563] },
  { name: 'Tashkent, Uzbekistan',   coords: [69.2401,  41.2995] },
  { name: 'Hanoi, Vietnam',         coords: [105.8342, 21.0278] },
  // Americas
  { name: 'Buenos Aires, Argentina',coords: [-58.3816,-34.6037] },
  { name: 'Belmopan, Belize',       coords: [-88.7590, 17.2514] },
  { name: 'La Paz, Bolivia',        coords: [-68.1193,-16.5000] },
  { name: 'Brasilia, Brazil',       coords: [-47.9292,-15.7801] },
  { name: 'Ottawa, Canada',         coords: [-75.6972, 45.4215] },
  { name: 'Santiago, Chile',        coords: [-70.6693,-33.4489] },
  { name: 'Bogota, Colombia',       coords: [-74.0721,  4.7110] },
  { name: 'San José, Costa Rica',   coords: [-84.0907,  9.9281] },
  { name: 'Havana, Cuba',           coords: [-82.3666, 23.1136] },
  { name: 'Quito, Ecuador',         coords: [-78.4678, -0.1807] },
  { name: 'Guatemala City',         coords: [-90.5328, 14.6349] },
  { name: 'Mexico City, Mexico',    coords: [-99.1332, 19.4326] },
  { name: 'Managua, Nicaragua',     coords: [-86.2819, 12.1364] },
  { name: 'Panama City, Panama',    coords: [-79.5197,  8.9936] },
  { name: 'Lima, Peru',             coords: [-77.0428,-12.0464] },
  // Oceania
  { name: 'Sydney, Australia',      coords: [151.2093,-33.8688] },
  { name: 'Nuuku, Azores',          coords: [-25.6619, 37.7412] },
  { name: 'Nuuk, Greenland',        coords: [-51.7214, 64.1814] },
  { name: 'Wellington, New Zealand',coords: [174.7762,-41.2865] },
];

export default function MapScene({ visible }) {
  const mapContainer  = useRef(null);
  const mapRef        = useRef(null);
  const markersRef    = useRef([]);
  const pulseRafRef   = useRef(null);
  const popupHovered  = useRef(false);
  const cursorRef     = useRef(null);
  const hideTimerRef  = useRef(null);
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

      // Expert pins — GeoJSON circle layer rendered by WebGL
      // Never disappears on zoom, always pixel-perfect on coordinates
      map.addSource('expert-pins', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: EXPERT_PINS.map(pin => ({
            type: 'Feature',
            geometry: { type: 'Point', coordinates: pin.coords },
            properties: { name: pin.name },
          })),
        },
      });

      // Outer pulse ring layer
      map.addLayer({
        id: 'expert-pins-ring',
        type: 'circle',
        source: 'expert-pins',
        paint: {
          'circle-radius': 10,
          'circle-color': 'transparent',
          'circle-stroke-width': 1.5,
          'circle-stroke-color': 'rgba(42,181,160,0.45)',
          'circle-opacity': 0,
          'circle-stroke-opacity': 0,
        },
      });

      // Inner dot layer
      map.addLayer({
        id: 'expert-pins-dot',
        type: 'circle',
        source: 'expert-pins',
        paint: {
          'circle-radius': [
            'interpolate', ['linear'], ['zoom'],
            2, 3,
            5, 5,
            10, 7,
          ],
          'circle-color': '#2ab5a0',
          'circle-stroke-width': 2,
          'circle-stroke-color': 'rgba(255,255,255,0.85)',
          'circle-opacity': 0,
          'circle-stroke-opacity': 0,
        },
      });

      // Hover state — enlarge dot
      map.on('mouseenter', 'expert-pins-dot', () => {
        map.getCanvas().style.cursor = 'pointer';
        map.setPaintProperty('expert-pins-dot', 'circle-radius', [
          'interpolate', ['linear'], ['zoom'],
          2, 5,
          5, 8,
          10, 11,
        ]);
      });

      map.on('mouseleave', 'expert-pins-dot', () => {
        map.getCanvas().style.cursor = '';
        map.setPaintProperty('expert-pins-dot', 'circle-radius', [
          'interpolate', ['linear'], ['zoom'],
          2, 3,
          5, 5,
          10, 7,
        ]);
      });

      // Fade pins in after map loads, then start pulse loop
      setTimeout(() => {
        map.setPaintProperty('expert-pins-dot',  'circle-opacity', 1);
        map.setPaintProperty('expert-pins-dot',  'circle-stroke-opacity', 1);
        map.setPaintProperty('expert-pins-ring', 'circle-stroke-opacity', 0);

        // RAF pulse loop — animates ring radius and opacity
        let startTime = null;
        const PULSE_DURATION = 2000; // ms per cycle

        function pulse(ts) {
          if (!startTime) startTime = ts;
          const t = ((ts - startTime) % PULSE_DURATION) / PULSE_DURATION; // 0→1 repeating

          // Ring grows from 5 → 18px and fades from 0.7 → 0
          const radius  = 5 + t * 13;
          const opacity = 0.7 * (1 - t);

          try {
            map.setPaintProperty('expert-pins-ring', 'circle-radius', radius);
            map.setPaintProperty('expert-pins-ring', 'circle-stroke-opacity', opacity);
          } catch(e) {}

          pulseRafRef.current = requestAnimationFrame(pulse);
        }

        pulseRafRef.current = requestAnimationFrame(pulse);
      }, 600);

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

        // Convert lng/lat to screen pixel position for popup anchoring
        const point = map.project(e.lngLat);
        setHoveredCountry({ name, x: point.x, y: point.y });

        // Expand cursor over countries
        const cur = cursorRef.current;
        if (cur) { cur.style.width = '60px'; cur.style.height = '60px'; }
      });

      map.on('mouseleave', 'country-fills', () => {
        if (hoveredIdRef.current !== null) {
          map.setFeatureState({ source: 'countries', sourceLayer: 'country_boundaries', id: hoveredIdRef.current }, { hovered: false });
        }
        hoveredIdRef.current = null;
        map.getCanvas().style.cursor = '';
        // Shrink cursor back
        const cur = cursorRef.current;
        if (cur) { cur.style.width = '12px'; cur.style.height = '12px'; }
        // Delay hiding popup so user can move onto it
        hideTimerRef.current = setTimeout(() => {
          if (!popupHovered.current) setHoveredCountry(null);
        }, 120);
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

    return () => {
      if (pulseRafRef.current) cancelAnimationFrame(pulseRafRef.current);
      map.remove();
    };
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

  // Custom cursor tracking for map scene
  useEffect(() => {
    if (!visible) return;
    const cursor = cursorRef.current;
    const onMove = (e) => {
      if (cursor) {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top  = e.clientY + 'px';
      }
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-10" style={{ cursor: 'none' }}>
      {/* Map */}
      <div ref={mapContainer} className="absolute inset-0" />

      {/* Country hover popup — sticky, clean dark card */}
      {hoveredCountry && !panelOpen && (
        <CountryPopup
          country={hoveredCountry.name}
          x={hoveredCountry.x}
          y={hoveredCountry.y}
          config={COUNTRY_CONFIG[hoveredCountry.name]}
          onExplore={() => {
            const config = COUNTRY_CONFIG[hoveredCountry.name];
            if (config) selectCountry(hoveredCountry.name, null);
          }}
          onMouseEnter={() => {
            popupHovered.current = true;
            clearTimeout(hideTimerRef.current);
            // Expand cursor when over popup
            const cur = cursorRef.current;
            if (cur) { cur.style.width = '60px'; cur.style.height = '60px'; }
          }}
          onMouseLeave={() => {
            popupHovered.current = false;
            setHoveredCountry(null);
            const cur = cursorRef.current;
            if (cur) { cur.style.width = '12px'; cur.style.height = '12px'; }
          }}
        />
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

      {/* Custom teal cursor */}
      <div
        ref={cursorRef}
        style={{
          position: 'fixed',
          width: 12, height: 12,
          borderRadius: '50%',
          background: '#2ab5a0',
          boxShadow: '0 0 20px 8px rgba(42,181,160,0.35), 0 0 0 1px rgba(42,181,160,0.5)',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          zIndex: 99999,
          transition: 'width 0.3s cubic-bezier(0.34,1.56,0.64,1), height 0.3s cubic-bezier(0.34,1.56,0.64,1)',
          left: -100, top: -100,
        }}
      />
    </div>
  );
}
