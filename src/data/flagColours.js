// Flag colours per country — primary colour first, then stripes/secondary
// Used for popup borders (gradient) and map hover colours
export const FLAG_COLOURS = {
  Italy:                ['#009246', '#CE2B37'],           // green, red
  Japan:                ['#BC002D'],                       // red
  Morocco:              ['#C1272D', '#006233'],            // red, green star
  Spain:                ['#AA151B', '#F1BF00'],            // red, yellow
  France:               ['#002395', '#FFFFFF', '#ED2939'], // blue, white, red
  Greece:               ['#0D5EAF', '#FFFFFF'],            // blue, white
  Portugal:             ['#006600', '#FF0000'],            // green, red
  Peru:                 ['#D91023', '#FFFFFF'],            // red, white
  'Costa Rica':         ['#002B7F', '#FFFFFF', '#CE1126'], // blue, white, red
  Egypt:                ['#CE1126', '#FFFFFF', '#000000'], // red, white, black
  India:                ['#FF9933', '#FFFFFF', '#138808'], // saffron, white, green
  Thailand:             ['#A51931', '#FFFFFF', '#2D2A4A'], // red, white, blue
  Tunisia:              ['#E70013', '#FFFFFF'],            // red, white
  Albania:              ['#E41E20', '#000000'],            // red, black eagle
  Argentina:            ['#74ACDF', '#FFFFFF'],            // blue, white
  Australia:            ['#00008B', '#FF0000'],            // navy, red
  Austria:              ['#ED2939', '#FFFFFF'],            // red, white, red
  Belize:               ['#003F87', '#CE1126'],            // blue, red
  Bhutan:               ['#FF8000', '#FF0000'],            // orange, red
  Bolivia:              ['#D52B1E', '#F4E400', '#007A3D'], // red, yellow, green
  Botswana:             ['#75AADB', '#FFFFFF', '#000000'], // blue, white, black
  Brazil:               ['#009C3B', '#FFDF00', '#002776'], // green, yellow, blue
  Bulgaria:             ['#FFFFFF', '#00966E', '#D62612'], // white, green, red
  Cambodia:             ['#032EA1', '#E00025'],            // blue, red
  Canada:               ['#FF0000', '#FFFFFF'],            // red, white
  Chile:                ['#D52B1E', '#FFFFFF', '#002D62'], // red, white, blue
  China:                ['#DE2910', '#FFDE00'],            // red, yellow
  Colombia:             ['#FCD116', '#003087', '#CE1126'], // yellow, blue, red
  Croatia:              ['#FF0000', '#FFFFFF', '#171796'], // red, white, blue
  Cuba:                 ['#002A8F', '#FFFFFF', '#CC0000'], // blue, white, red
  Czechia:              ['#D7141A', '#FFFFFF', '#11457E'], // red, white, blue
  'Czech Republic':     ['#D7141A', '#FFFFFF', '#11457E'],
  Ecuador:              ['#FFD100', '#003DA5', '#CE1126'], // yellow, blue, red
  Estonia:              ['#0072CE', '#000000', '#FFFFFF'], // blue, black, white
  Finland:              ['#003580', '#FFFFFF'],            // blue, white
  Georgia:              ['#FF0000', '#FFFFFF'],            // red, white
  Germany:              ['#000000', '#DD0000', '#FFCE00'], // black, red, gold
  Ghana:                ['#006B3F', '#FCD116', '#CE1126'], // green, gold, red
  Greenland:            ['#FFFFFF', '#009A44'],            // white, green
  Guatemala:            ['#4997D0', '#FFFFFF'],            // blue, white
  Iceland:              ['#003897', '#FFFFFF', '#DC143C'], // blue, white, red
  Indonesia:            ['#CE1126', '#FFFFFF'],            // red, white
  Jordan:               ['#007A3D', '#FFFFFF', '#000000'], // green, white, black
  Kenya:                ['#006600', '#BB0000', '#000000'], // green, red, black
  Kyrgyzstan:           ['#E8112D', '#FF8C00'],            // red, orange
  Laos:                 ['#CE1126', '#002868', '#FFFFFF'], // red, blue, white
  Latvia:               ['#9E3039', '#FFFFFF'],            // maroon, white
  Lithuania:            ['#FDB913', '#006A44', '#C1272D'], // yellow, green, red
  Madagascar:           ['#FC3D32', '#007E3A', '#FFFFFF'], // red, green, white
  Malaysia:             ['#CC0001', '#FFFFFF', '#010066'], // red, white, blue
  Malta:                ['#CF142B', '#FFFFFF'],            // red, white
  Mexico:               ['#006847', '#FFFFFF', '#CE1126'], // green, white, red
  Mongolia:             ['#C4272F', '#015197'],            // red, blue
  Montenegro:           ['#D4AF37', '#D4000D'],            // gold, red
  Namibia:              ['#003580', '#009A44', '#EF7D00'], // blue, green, orange
  Nepal:                ['#003893', '#FFFFFF', '#DC143C'], // blue, white, red
  'New Zealand':        ['#00247D', '#CC142E'],            // navy, red
  Nicaragua:            ['#3A75C4', '#FFFFFF'],            // blue, white
  Norway:               ['#EF2B2D', '#FFFFFF', '#002868'], // red, white, blue
  Oman:                 ['#DB161B', '#FFFFFF', '#008000'], // red, white, green
  Pakistan:             ['#01411C', '#FFFFFF'],            // green, white
  Panama:               ['#DA121A', '#FFFFFF', '#0033A0'], // red, white, blue
  Philippines:          ['#0038A8', '#CE1126', '#FCD116'], // blue, red, yellow
  Poland:               ['#FFFFFF', '#DC143C'],            // white, red
  Romania:              ['#002B7F', '#FCD116', '#CE1126'], // blue, yellow, red
  Rwanda:               ['#20603D', '#FAD201', '#007FFF'], // green, yellow, blue
  Slovenia:             ['#003DA5', '#FFFFFF', '#E20338'], // blue, white, red
  'South Africa':       ['#007A4D', '#FFB81C', '#002395'], // green, gold, blue
  'Sri Lanka':          ['#8D153A', '#EB6F00'],            // maroon, orange
  Switzerland:          ['#FF0000', '#FFFFFF'],            // red, white
  Tanzania:             ['#1EB53A', '#000000', '#FCD116'], // green, black, yellow
  Turkey:               ['#E30A17', '#FFFFFF'],            // red, white
  Uganda:               ['#000000', '#FCDC04', '#9CA69C'], // black, yellow, grey
  'United Arab Emirates':['#00732F','#FFFFFF','#000000'],  // green, white, black
  Uzbekistan:           ['#1EB53A', '#FFFFFF', '#0099CC'], // green, white, blue
  Vietnam:              ['#DA251D', '#FFCD00'],            // red, yellow
  Zimbabwe:             ['#006400', '#FFD200', '#DE0000'], // green, yellow, red
  'United Kingdom':     ['#FFFFFF', '#C8102E', '#012169'], // white, red, navy
  Sweden:               ['#006AA7', '#FECC02'],            // blue, yellow
  Scotland:             ['#C8102E', '#FFFFFF'],
  Wales:                ['#C8102E', '#FFFFFF'],
  England:              ['#C8102E', '#FFFFFF'],
  'Northern Ireland':   ['#C8102E', '#FFFFFF'],
};

// Get the primary (first) colour for a country
export function getPrimaryColour(name) {
  return FLAG_COLOURS[name]?.[0] || '#2ab5a0';
}

// Get a CSS gradient string for a country's flag colours
export function getFlagGradient(name, direction = '135deg') {
  const colours = FLAG_COLOURS[name];
  if (!colours || colours.length === 1) return colours?.[0] || '#2ab5a0';
  const stops = colours.map((c, i) => {
    const pct = Math.round((i / (colours.length - 1)) * 100);
    return `${c} ${pct}%`;
  }).join(', ');
  return `linear-gradient(${direction}, ${stops})`;
}

// Get the primary map hover colour (same as FLAG_COLOURS primary)
export const FLAG_COLOURS_MAP = Object.fromEntries(
  Object.entries(FLAG_COLOURS).map(([k, v]) => [k, v[0]])
);
