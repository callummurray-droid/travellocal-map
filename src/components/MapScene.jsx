import { useEffect, useRef, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import { gsap } from 'gsap';
import { MAPBOX_TOKEN, EXPERT_COUNTRIES, COUNTRY_CONFIG } from '../data/countries';
import { EXTRA_COUNTRY_CONFIG } from '../data/countries';
import SidePanel from './SidePanel';
import CountryPopup from './CountryPopup';

// Merge all configs
const ALL_CONFIG = { ...COUNTRY_CONFIG, ...EXTRA_COUNTRY_CONFIG };

// Map Mapbox name_en values → our config keys
const NAME_MAP = {
  'United Kingdom':        'United Kingdom',
  'Scotland':              'United Kingdom',
  'Wales':                 'United Kingdom',
  'England':               'United Kingdom',
  'Northern Ireland':      'United Kingdom',
  'Ecuador':               'Ecuador and Galapagos',
  'Czech Republic':        'Czech Republic',
  'Czechia':               'Czech Republic',
  'United Arab Emirates':  'United Arab Emirates',
  'South Africa':          'South Africa',
  'New Zealand':           'New Zealand',
  'Costa Rica':            'Costa Rica',
  'Sri Lanka':             'Sri Lanka',
  'Azores':                'Azores',
};

function resolveCountryName(mapboxName) {
  if (!mapboxName) return null;
  if (NAME_MAP[mapboxName]) return NAME_MAP[mapboxName];
  if (ALL_CONFIG[mapboxName]) return mapboxName;
  return null;
}

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
  { name: 'Paris, France',          coords: [2.3522,   48.8566] },
  { name: 'London, United Kingdom', coords: [-0.1276,  51.5074] },
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

// Points of interest per country — shown when country is selected
const COUNTRY_POIS = {
  Italy:      [{ name: 'Rome',     coords: [12.4964, 41.9028] }, { name: 'Florence',  coords: [11.2558, 43.7696] }, { name: 'Venice',    coords: [12.3155, 45.4408] }, { name: 'Amalfi',   coords: [14.6026, 40.6340] }, { name: 'Dolomites', coords: [11.8000, 46.5000] }],
  Japan:      [{ name: 'Tokyo',    coords: [139.6917, 35.6895] }, { name: 'Kyoto',  coords: [135.7681, 35.0116] }, { name: 'Osaka',    coords: [135.5022, 34.6937] }, { name: 'Mt Fuji',  coords: [138.7274, 35.3606] }],
  Morocco:    [{ name: 'Marrakech',coords: [-7.9811, 31.6295] },  { name: 'Fes',    coords: [-5.0000, 34.0333] },  { name: 'Sahara',   coords: [-4.0000, 30.0000] },  { name: 'Essaouira',coords: [-9.7600, 31.5085] }],
  Spain:      [{ name: 'Barcelona',coords: [2.1734, 41.3851] },   { name: 'Madrid', coords: [-3.7038, 40.4168] },  { name: 'Seville',  coords: [-5.9845, 37.3891] },  { name: 'Granada',  coords: [-3.5986, 37.1773] }],
  France:     [{ name: 'Paris',    coords: [2.3522, 48.8566] },   { name: 'Nice',   coords: [7.2620, 43.7102] },   { name: 'Bordeaux', coords: [-0.5792, 44.8378] },  { name: 'Lyon',     coords: [4.8357, 45.7640] }],
  Greece:     [{ name: 'Athens',   coords: [23.7275, 37.9838] },  { name: 'Santorini',coords: [25.4615, 36.3932] },{ name: 'Mykonos', coords: [25.3293, 37.4415] },  { name: 'Crete',    coords: [24.8093, 35.2401] }],
  Portugal:   [{ name: 'Lisbon',   coords: [-9.1393, 38.7223] },  { name: 'Porto',  coords: [-8.6291, 41.1579] },  { name: 'Algarve', coords: [-8.1237, 37.0179] },  { name: 'Sintra',   coords: [-9.3880, 38.7977] }],
  Peru:       [{ name: 'Lima',     coords: [-77.0428,-12.0464] }, { name: 'Cusco',  coords: [-71.9785,-13.5320] }, { name: 'Machu Picchu',coords:[-72.5450,-13.1631]}, { name: 'Arequipa', coords: [-71.5375,-16.4090] }],
  Germany:    [{ name: 'Berlin',   coords: [13.4050, 52.5200] },  { name: 'Munich', coords: [11.5820, 48.1351] },  { name: 'Hamburg',  coords: [9.9937, 53.5511] },   { name: 'Cologne',  coords: [6.9603, 50.9333] }],
  India:      [{ name: 'New Delhi',coords: [77.2090, 28.6139] },  { name: 'Jaipur', coords: [75.7873, 26.9124] },  { name: 'Mumbai',   coords: [72.8777, 19.0760] },  { name: 'Varanasi', coords: [82.9739, 25.3176] }],
};

// Fly-to zoom config per country
const COUNTRY_FLY = {
  Italy:    { center: [12.5, 42.5], zoom: 5.5 },
  Japan:    { center: [137.0, 36.5], zoom: 5.0 },
  Morocco:  { center: [-6.0, 31.5], zoom: 5.5 },
  Spain:    { center: [-3.5, 40.0], zoom: 5.0 },
  France:   { center: [2.5, 46.5], zoom: 5.0 },
  Greece:   { center: [22.5, 39.0], zoom: 5.5 },
  Portugal: { center: [-8.0, 39.5], zoom: 6.0 },
  Peru:     { center: [-74.0, -10.0], zoom: 5.0 },
  Germany:  { center: [10.5, 51.5], zoom: 5.5 },
  India:    { center: [79.0, 22.0], zoom: 4.5 },
  default:  { center: null, zoom: 5 },
};

export default function MapScene({ visible }) {
  const mapContainer  = useRef(null);
  const mapRef        = useRef(null);
  const markersRef    = useRef([]);
  const pulseRafRef   = useRef(null);
  const popupHovered  = useRef(false);
  const cursorRef     = useRef(null);
  const hideTimerRef  = useRef(null);
  const poiMarkersRef = useRef([]);
  const is3DRef       = useRef(false);
  const [mode3D, setMode3D]         = useState(false);
  const [activePOI, setActivePOI]   = useState(null);
  const audioRef      = useRef(null);
  const audioFadeRef  = useRef(null);
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
      maxZoom: 18,
      projection: 'mercator',
    });

    mapRef.current = map;

    map.on('load', () => {
      // Style overrides to match design
      map.setPaintProperty('background', 'background-color', '#0d1829');
      map.setPaintProperty('water', 'fill-color', '#0a1525');

      // 3D terrain — Mapbox DEM elevation source
      map.addSource('mapbox-dem', {
        type: 'raster-dem',
        url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
        tileSize: 512,
        maxzoom: 14,
      });
      // Terrain off by default — enabled on POI dive-in
      // map.setTerrain({ source: 'mapbox-dem', exaggeration: 1.8 });

      // 3D buildings layer
      map.addLayer({
        id: 'buildings-3d',
        source: 'composite',
        'source-layer': 'building',
        filter: ['==', 'extrude', 'true'],
        type: 'fill-extrusion',
        minzoom: 12,
        paint: {
          'fill-extrusion-color': '#1a2e4a',
          'fill-extrusion-height': ['interpolate', ['linear'], ['zoom'], 12, 0, 12.5, ['get', 'height']],
          'fill-extrusion-base': ['interpolate', ['linear'], ['zoom'], 12, 0, 12.5, ['get', 'min_height']],
          'fill-extrusion-opacity': 0.7,
        },
      });

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
            ['boolean', ['feature-state', 'selected'], false], '#2ab5a0',
            ['boolean', ['feature-state', 'hovered'], false],  '#ffffff',
            'rgba(0,0,0,0)',
          ],
          'fill-opacity': [
            'case',
            ['boolean', ['feature-state', 'selected'], false], 0.12,
            ['boolean', ['feature-state', 'hovered'], false],  0.06,
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
            ['boolean', ['feature-state', 'selected'], false], 2.5,
            0,
          ],
          'line-blur': 0,
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
        const raw = e.features[0]?.properties?.name_en;
        const name = resolveCountryName(raw);
        if (!name) return;

        if (hoveredIdRef.current !== null) {
          map.setFeatureState({ source: 'countries', sourceLayer: 'country_boundaries', id: hoveredIdRef.current }, { hovered: false });
        }
        hoveredIdRef.current = e.features[0].id;
        map.setFeatureState({ source: 'countries', sourceLayer: 'country_boundaries', id: hoveredIdRef.current }, { hovered: true });
        map.getCanvas().style.cursor = 'pointer';

        const point = map.project(e.lngLat);
        setHoveredCountry({ name, x: point.x, y: point.y });

        const cur = cursorRef.current;
        const arr = document.getElementById('map-cursor-arrow');
        if (cur) { cur.style.width = '60px'; cur.style.height = '60px'; }
        if (arr) arr.style.opacity = '1';
      });

      map.on('mouseleave', 'country-fills', () => {
        if (hoveredIdRef.current !== null) {
          map.setFeatureState({ source: 'countries', sourceLayer: 'country_boundaries', id: hoveredIdRef.current }, { hovered: false });
        }
        hoveredIdRef.current = null;
        map.getCanvas().style.cursor = '';
        // Shrink cursor back
        const cur = cursorRef.current;
        const arr = document.getElementById('map-cursor-arrow');
        if (cur) { cur.style.width = '12px'; cur.style.height = '12px'; }
        if (arr) arr.style.opacity = '0';
        // Delay hiding popup so user can move onto it
        hideTimerRef.current = setTimeout(() => {
          if (!popupHovered.current) setHoveredCountry(null);
        }, 120);
      });

      // Click interaction
      map.on('click', 'country-fills', (e) => {
        const raw = e.features[0]?.properties?.name_en;
        const name = resolveCountryName(raw);
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

  const clearPOIs = () => {
    poiMarkersRef.current.forEach(m => m.remove());
    poiMarkersRef.current = [];
  };

  const addPOIs = (name) => {
    clearPOIs();
    const pois = COUNTRY_POIS[name];
    if (!pois || !mapRef.current) return;

    pois.forEach(poi => {
      const el = document.createElement('div');
      el.style.cssText = `
        display: flex; flex-direction: column; align-items: center;
        cursor: pointer; pointer-events: auto;
        transition: transform 0.2s cubic-bezier(0.34,1.56,0.64,1);
        position: relative; z-index: 40;
      `;
      el.onmouseenter = () => { el.style.transform = 'scale(1.2)'; };
      el.onmouseleave = () => { el.style.transform = 'scale(1)'; };

      const dot = document.createElement('div');
      dot.style.cssText = `
        width: 10px; height: 10px; border-radius: 50%;
        background: #2ab5a0; border: 2px solid white;
        box-shadow: 0 0 0 3px rgba(42,181,160,0.3), 0 2px 8px rgba(0,0,0,0.4);
        transition: background 0.2s;
      `;

      const label = document.createElement('div');
      label.textContent = poi.name;
      label.style.cssText = `
        margin-top: 5px; padding: 3px 9px;
        background: rgba(21,34,56,0.9); color: white;
        font-family: Mulish, sans-serif; font-size: 10px; font-weight: 700;
        border-radius: 6px; white-space: nowrap;
        backdrop-filter: blur(6px);
        border: 1px solid rgba(42,181,160,0.4);
        letter-spacing: 0.03em;
      `;

      el.appendChild(dot);
      el.appendChild(label);

      // Click → 3D dive-in
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        diveIntoPOI(poi);
      });

      const marker = new mapboxgl.Marker({ element: el, anchor: 'top' })
        .setLngLat(poi.coords)
        .addTo(mapRef.current);

      poiMarkersRef.current.push(marker);
    });
  };

  const diveIntoPOI = (poi) => {
    const map = mapRef.current;
    if (!map) return;
    is3DRef.current = true;
    setMode3D(true);
    setActivePOI(poi);
    stopAudio(); // Pause music during 3D exploration

    // Switch to satellite-streets style for the 3D view
    map.setStyle('mapbox://styles/mapbox/satellite-streets-v12');

    // Re-add terrain + buildings once new style loads
    map.once('style.load', () => {
      map.addSource('mapbox-dem', {
        type: 'raster-dem',
        url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
        tileSize: 512,
        maxzoom: 14,
      });
      map.setTerrain({ source: 'mapbox-dem', exaggeration: 1.8 });

      map.addLayer({
        id: 'buildings-3d',
        source: 'composite',
        'source-layer': 'building',
        filter: ['==', 'extrude', 'true'],
        type: 'fill-extrusion',
        minzoom: 12,
        paint: {
          'fill-extrusion-color': '#aaaaaa',
          'fill-extrusion-height': ['interpolate', ['linear'], ['zoom'], 12, 0, 12.5, ['get', 'height']],
          'fill-extrusion-base': ['interpolate', ['linear'], ['zoom'], 12, 0, 12.5, ['get', 'min_height']],
          'fill-extrusion-opacity': 0.6,
        },
      });

      // Cinematic fly-in after style switch
      map.flyTo({
        center: poi.coords,
        zoom: 14.5,
        pitch: 70,
        bearing: -25,
        duration: 3500,
        essential: true,
        easing: (t) => t < 0.5 ? 2*t*t : -1+(4-2*t)*t,
      });
    });
  };

  const exit3D = () => {
    const map = mapRef.current;
    if (!map) return;

    // Capture before clearing
    const countryToRestore = selectedCountry;

    is3DRef.current = false;
    setMode3D(false);
    setActivePOI(null);

    const fly = countryToRestore
      ? (COUNTRY_FLY[countryToRestore.name] || COUNTRY_FLY.default)
      : COUNTRY_FLY.default;

    // Switch back to dark style — this wipes all layers
    map.setStyle('mapbox://styles/mapbox/dark-v11');

    map.once('style.load', () => {
      // Restore style overrides
      map.setPaintProperty('background', 'background-color', '#0d1829');
      map.setPaintProperty('water', 'fill-color', '#0a1525');

      // Re-add DEM source
      map.addSource('mapbox-dem', {
        type: 'raster-dem',
        url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
        tileSize: 512,
        maxzoom: 14,
      });

      // Re-add 3D buildings layer
      map.addLayer({
        id: 'buildings-3d',
        source: 'composite',
        'source-layer': 'building',
        filter: ['==', 'extrude', 'true'],
        type: 'fill-extrusion',
        minzoom: 12,
        paint: {
          'fill-extrusion-color': '#1a2e4a',
          'fill-extrusion-height': ['interpolate', ['linear'], ['zoom'], 12, 0, 12.5, ['get', 'height']],
          'fill-extrusion-base': ['interpolate', ['linear'], ['zoom'], 12, 0, 12.5, ['get', 'min_height']],
          'fill-extrusion-opacity': 0.7,
        },
      });

      // Re-add countries source + layers with correct subtle paint
      map.addSource('countries', {
        type: 'vector',
        url: 'mapbox://mapbox.country-boundaries-v1',
      });

      const col = countryToRestore?.config?.colour || '#2ab5a0';

      map.addLayer({
        id: 'country-fills',
        type: 'fill',
        source: 'countries',
        'source-layer': 'country_boundaries',
        filter: ['==', ['get', 'disputed'], 'false'],
        paint: {
          'fill-color': [
            'case',
            ['boolean', ['feature-state', 'selected'], false], col,
            ['boolean', ['feature-state', 'hovered'], false], '#ffffff',
            'rgba(0,0,0,0)',
          ],
          'fill-opacity': [
            'case',
            ['boolean', ['feature-state', 'selected'], false], 0.12,
            ['boolean', ['feature-state', 'hovered'], false], 0.06,
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
          'line-color': ['case', ['boolean', ['feature-state', 'selected'], false], col, 'rgba(0,0,0,0)'],
          'line-width': ['case', ['boolean', ['feature-state', 'selected'], false], 2.5, 0],
          'line-blur': 0,
        },
      });

      // Re-add expert pins WebGL layers
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
      map.addLayer({
        id: 'expert-pins-ring',
        type: 'circle',
        source: 'expert-pins',
        paint: {
          'circle-radius': 5,
          'circle-color': 'transparent',
          'circle-stroke-width': 1.5,
          'circle-stroke-color': 'rgba(42,181,160,0.45)',
          'circle-stroke-opacity': 0,
        },
      });
      map.addLayer({
        id: 'expert-pins-dot',
        type: 'circle',
        source: 'expert-pins',
        paint: {
          'circle-radius': ['interpolate', ['linear'], ['zoom'], 2, 3, 5, 5, 10, 7],
          'circle-color': '#2ab5a0',
          'circle-stroke-width': 2,
          'circle-stroke-color': 'rgba(255,255,255,0.85)',
          'circle-opacity': 1,
          'circle-stroke-opacity': 1,
        },
      });

      // Re-attach map event listeners
      map.on('mousemove', 'country-fills', (e) => {
        if (panelOpen) return;
        const raw = e.features[0]?.properties?.name_en;
        const name = resolveCountryName(raw);
        if (!name) return;
        if (hoveredIdRef.current !== null) {
          map.setFeatureState({ source: 'countries', sourceLayer: 'country_boundaries', id: hoveredIdRef.current }, { hovered: false });
        }
        hoveredIdRef.current = e.features[0].id;
        map.setFeatureState({ source: 'countries', sourceLayer: 'country_boundaries', id: hoveredIdRef.current }, { hovered: true });
        map.getCanvas().style.cursor = 'pointer';
        const point = map.project(e.lngLat);
        setHoveredCountry({ name, x: point.x, y: point.y });
        const cur = cursorRef.current;
        const arr = document.getElementById('map-cursor-arrow');
        if (cur) { cur.style.width = '60px'; cur.style.height = '60px'; }
        if (arr) arr.style.opacity = '1';
      });
      map.on('mouseleave', 'country-fills', () => {
        if (hoveredIdRef.current !== null) {
          map.setFeatureState({ source: 'countries', sourceLayer: 'country_boundaries', id: hoveredIdRef.current }, { hovered: false });
        }
        hoveredIdRef.current = null;
        map.getCanvas().style.cursor = '';
        const cur = cursorRef.current;
        const arr = document.getElementById('map-cursor-arrow');
        if (cur) { cur.style.width = '12px'; cur.style.height = '12px'; }
        if (arr) arr.style.opacity = '0';
        hideTimerRef.current = setTimeout(() => {
          if (!popupHovered.current) setHoveredCountry(null);
        }, 120);
      });
      map.on('click', 'country-fills', (e) => {
        const raw = e.features[0]?.properties?.name_en;
        const name = resolveCountryName(raw);
        if (!name) return;
        selectCountry(name, e.features[0].id);
      });
      map.on('mouseenter', 'expert-pins-dot', () => {
        map.getCanvas().style.cursor = 'pointer';
        map.setPaintProperty('expert-pins-dot', 'circle-radius', ['interpolate', ['linear'], ['zoom'], 2, 5, 5, 8, 10, 11]);
      });
      map.on('mouseleave', 'expert-pins-dot', () => {
        map.getCanvas().style.cursor = '';
        map.setPaintProperty('expert-pins-dot', 'circle-radius', ['interpolate', ['linear'], ['zoom'], 2, 3, 5, 5, 10, 7]);
      });

      // Restart pulse RAF
      if (pulseRafRef.current) cancelAnimationFrame(pulseRafRef.current);
      let pulseStart = null;
      const PULSE_DURATION = 2000;
      function pulse(ts) {
        if (!pulseStart) pulseStart = ts;
        const t = ((ts - pulseStart) % PULSE_DURATION) / PULSE_DURATION;
        try {
          map.setPaintProperty('expert-pins-ring', 'circle-radius', 5 + t * 13);
          map.setPaintProperty('expert-pins-ring', 'circle-stroke-opacity', 0.7 * (1 - t));
        } catch(e) {}
        pulseRafRef.current = requestAnimationFrame(pulse);
      }
      pulseRafRef.current = requestAnimationFrame(pulse);

      // Fly back to country view
      map.flyTo({
        center: fly.center || [12, 48],
        zoom: fly.zoom || 5,
        pitch: 0,
        bearing: 0,
        duration: 2000,
        essential: true,
      });

      // Restore selected country state + POI pins + panel + audio
      if (countryToRestore) {
        setTimeout(() => {
          addPOIs(countryToRestore.name);
          setSelectedCountry(countryToRestore);
          setPanelOpen(true);
          playCountryAudio(countryToRestore.name);
        }, 500);
      }
    });
  };

  // Country audio tracks — add MP3s to /public/audio/
  const COUNTRY_AUDIO = {
    Italy:    '/audio/italy.mp3',
    France:   '/audio/france.mp3',
    Japan:    '/audio/japan.mp3',
    Morocco:  '/audio/morocco.mp3',
    Spain:    '/audio/spain.mp3',
    Greece:   '/audio/greece.mp3',
    Portugal: '/audio/portugal.mp3',
  };

  const stopAudio = (immediate = false) => {
    const audio = audioRef.current;
    if (!audio) return;
    clearInterval(audioFadeRef.current);
    if (immediate) {
      audio.pause();
      audio.currentTime = 0;
      return;
    }
    // Fade out over 1.5s
    const startVol = audio.volume;
    const step = startVol / 30;
    audioFadeRef.current = setInterval(() => {
      if (audio.volume > step) {
        audio.volume = Math.max(0, audio.volume - step);
      } else {
        audio.pause();
        audio.currentTime = 0;
        audio.volume = 1;
        clearInterval(audioFadeRef.current);
      }
    }, 50);
  };

  const playCountryAudio = (name) => {
    const src = COUNTRY_AUDIO[name];
    if (!src) return;
    stopAudio(true);
    const audio = new Audio(src);
    audio.loop = true;
    audio.volume = 0;
    audioRef.current = audio;
    audio.play().then(() => {
      // Fade in over 2s
      clearInterval(audioFadeRef.current);
      audioFadeRef.current = setInterval(() => {
        if (audio.volume < 0.28) {
          audio.volume = Math.min(0.28, audio.volume + 0.01);
        } else {
          clearInterval(audioFadeRef.current);
        }
      }, 50);
    }).catch(() => {
      // Autoplay blocked — silently ignore
    });
  };

  const selectCountry = (name, featureId) => {
    const config = ALL_CONFIG[name];
    setSelectedCountry({ name, config, featureId });
    setPanelOpen(true);
    playCountryAudio(name);

    // Fly to country
    const fly = COUNTRY_FLY[name] || COUNTRY_FLY.default;
    if (mapRef.current) {
      // Get fly centre from config coordinates if not in COUNTRY_FLY
      let center = fly.center;
      if (!center && config?.coordinates) {
        const [lat, lng] = config.coordinates.replace(/[°NSEW]/g, '').split(',').map(Number);
        center = [lng || 0, lat || 0];
      }
      if (center) {
        mapRef.current.flyTo({ center, zoom: fly.zoom || 5, duration: 1400, essential: true });
      }
      // Add POI pins after fly completes
      setTimeout(() => addPOIs(name), 800);
    }

    // Set selected feature state
    if (mapRef.current && featureId != null) {
      mapRef.current.setFeatureState(
        { source: 'countries', sourceLayer: 'country_boundaries', id: featureId },
        { selected: true, hovered: false }
      );
      const col = config?.colour || '#2ab5a0';
      // Use country's own colour for the subtle tint + border
      mapRef.current.setPaintProperty('country-fills', 'fill-color', [
        'case',
        ['boolean', ['feature-state', 'selected'], false], col,
        ['boolean', ['feature-state', 'hovered'], false], '#ffffff',
        'rgba(0,0,0,0)',
      ]);
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
    clearPOIs();
    stopAudio();
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
    const config = ALL_CONFIG[name];
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

      {/* 3D mode overlay — POI name + controls + exit */}
      {mode3D && activePOI && (
        <>
          {/* Top bar */}
          <div style={{
            position: 'absolute', top: 20, left: '50%', transform: 'translateX(-50%)',
            zIndex: 60, display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <div style={{
              background: 'rgba(13,24,41,0.85)', backdropFilter: 'blur(16px)',
              border: '1px solid rgba(42,181,160,0.4)',
              borderRadius: 12, padding: '10px 18px',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#2ab5a0', flexShrink: 0 }}/>
              <span style={{ fontFamily: 'Mulish, sans-serif', fontSize: 13, fontWeight: 700, color: 'white' }}>
                Exploring {activePOI.name} in 3D
              </span>
            </div>
            <button onClick={exit3D} style={{
              background: 'rgba(250,248,245,0.92)', backdropFilter: 'blur(16px)',
              border: 'none', borderRadius: 10, padding: '10px 16px', cursor: 'none',
              fontFamily: 'Mulish, sans-serif', fontSize: 13, fontWeight: 700,
              color: '#152238', display: 'flex', alignItems: 'center', gap: 7,
            }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#152238" strokeWidth="2.5" strokeLinecap="round">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
              Exit 3D
            </button>
          </div>

          {/* 3D controls — right side */}
          <div style={{
            position: 'absolute', right: 24, top: '50%', transform: 'translateY(-50%)',
            zIndex: 60, display: 'flex', flexDirection: 'column', gap: 8,
          }}>
            {/* Tilt up */}
            <button
              onClick={() => mapRef.current?.setPitch(Math.min(85, (mapRef.current?.getPitch() || 0) + 10))}
              title="Tilt up"
              style={{
                width: 40, height: 40, borderRadius: 10, border: 'none', cursor: 'none',
                background: 'rgba(13,24,41,0.85)', backdropFilter: 'blur(12px)',
                color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
              }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="M18 15l-6-6-6 6"/></svg>
            </button>

            {/* Tilt down */}
            <button
              onClick={() => mapRef.current?.setPitch(Math.max(0, (mapRef.current?.getPitch() || 0) - 10))}
              title="Tilt down"
              style={{
                width: 40, height: 40, borderRadius: 10, border: 'none', cursor: 'none',
                background: 'rgba(13,24,41,0.85)', backdropFilter: 'blur(12px)',
                color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
              }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="M6 9l6 6 6-6"/></svg>
            </button>

            {/* Divider */}
            <div style={{ height: 1, background: 'rgba(255,255,255,0.1)', margin: '2px 6px' }}/>

            {/* Rotate left */}
            <button
              onClick={() => mapRef.current?.setBearing((mapRef.current?.getBearing() || 0) - 30)}
              title="Rotate left"
              style={{
                width: 40, height: 40, borderRadius: 10, border: 'none', cursor: 'none',
                background: 'rgba(13,24,41,0.85)', backdropFilter: 'blur(12px)',
                color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
              }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
            </button>

            {/* Rotate right */}
            <button
              onClick={() => mapRef.current?.setBearing((mapRef.current?.getBearing() || 0) + 30)}
              title="Rotate right"
              style={{
                width: 40, height: 40, borderRadius: 10, border: 'none', cursor: 'none',
                background: 'rgba(13,24,41,0.85)', backdropFilter: 'blur(12px)',
                color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
              }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="M21 12a9 9 0 1 1-9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>
            </button>

            {/* Divider */}
            <div style={{ height: 1, background: 'rgba(255,255,255,0.1)', margin: '2px 6px' }}/>

            {/* Zoom in */}
            <button
              onClick={() => mapRef.current?.zoomIn()}
              style={{
                width: 40, height: 40, borderRadius: 10, border: 'none', cursor: 'none',
                background: 'rgba(13,24,41,0.85)', backdropFilter: 'blur(12px)',
                color: 'white', fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
              }}>+</button>

            {/* Zoom out */}
            <button
              onClick={() => mapRef.current?.zoomOut()}
              style={{
                width: 40, height: 40, borderRadius: 10, border: 'none', cursor: 'none',
                background: 'rgba(13,24,41,0.85)', backdropFilter: 'blur(12px)',
                color: 'white', fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
              }}>−</button>
          </div>

          {/* Bottom hint */}
          <div style={{
            position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)',
            zIndex: 60,
            background: 'rgba(13,24,41,0.7)', backdropFilter: 'blur(12px)',
            borderRadius: 10, padding: '8px 16px',
            fontFamily: 'Mulish, sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.6)',
            letterSpacing: '0.05em', whiteSpace: 'nowrap',
          }}>
            Drag to pan · Right-click drag to rotate · Scroll to zoom
          </div>
        </>
      )}

      {/* Country hover popup — sticky, clean dark card */}
      {hoveredCountry && !panelOpen && (
        <CountryPopup
          country={hoveredCountry.name}
          x={hoveredCountry.x}
          y={hoveredCountry.y}
          config={ALL_CONFIG[hoveredCountry.name]}
          onExplore={() => {
            const config = ALL_CONFIG[hoveredCountry.name];
            if (config) selectCountry(hoveredCountry.name, null);
          }}
          onMouseEnter={() => {
            popupHovered.current = true;
            clearTimeout(hideTimerRef.current);
            // Expand cursor when over popup
            const cur = cursorRef.current;
            const arr = document.getElementById('map-cursor-arrow');
            if (cur) { cur.style.width = '60px'; cur.style.height = '60px'; }
            if (arr) arr.style.opacity = '1';
          }}
          onMouseLeave={() => {
            popupHovered.current = false;
            setHoveredCountry(null);
            const cur = cursorRef.current;
            const arr = document.getElementById('map-cursor-arrow');
            if (cur) { cur.style.width = '12px'; cur.style.height = '12px'; }
            if (arr) arr.style.opacity = '0';
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

      {/* Panel overlay — only covers map area, not the panel itself */}
      {panelOpen && (
        <div
          style={{
            position: 'absolute', inset: 0,
            right: 560, // leave panel width clear
            zIndex: 30,
            background: 'rgba(0,0,0,0.25)',
            pointerEvents: 'auto',
          }}
          onClick={closePanel}
        />
      )}

      {/* Side panel */}
      <SidePanel
        country={selectedCountry?.name}
        config={selectedCountry?.config}
        onClose={closePanel}
      />

      {/* Custom teal cursor with arrow on expand */}
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
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        <svg
          id="map-cursor-arrow"
          width="20" height="20" viewBox="0 0 24 24"
          fill="none" stroke="white" strokeWidth="2.5"
          strokeLinecap="round" strokeLinejoin="round"
          style={{
            opacity: 0, flexShrink: 0,
            transition: 'opacity 0.2s ease 0.1s',
          }}
        >
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </div>
    </div>
  );
}
