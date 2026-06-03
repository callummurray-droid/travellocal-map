import { useState, useRef } from 'react';
import Nav from './components/Nav';
import HeroScene from './components/HeroScene';
import MapScene from './components/MapScene';
import IrisTransition from './components/IrisTransition';

export default function App() {
  const [phase, setPhase]       = useState('hero');
  const [irisActive, setIrisActive] = useState(false);
  const ctaBounds = useRef(null);

  const handleExplore = () => {
    const cta = document.getElementById('cta-btn');
    if (cta) {
      const r = cta.getBoundingClientRect();
      ctaBounds.current = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    }
    setPhase('transitioning');
    setTimeout(() => setIrisActive(true), 280);
  };

  const handleIrisComplete = () => {
    setPhase('map');
    setIrisActive(false);
  };

  return (
    <div className="w-screen h-screen overflow-hidden relative" style={{ background: '#0d1829' }}>

      {/* Nav — always rendered, hamburger always visible */}
      <Nav />

      {/* Hero */}
      {(phase === 'hero' || phase === 'transitioning') && (
        <div className="absolute inset-0" style={{ zIndex: 20 }}>
          <HeroScene onExplore={handleExplore} />
        </div>
      )}

      {/* Map */}
      <MapScene visible={phase === 'map' || phase === 'transitioning'} />

      {/* Iris */}
      <IrisTransition
        active={irisActive}
        ctaPosition={ctaBounds.current}
        onComplete={handleIrisComplete}
      />
    </div>
  );
}
