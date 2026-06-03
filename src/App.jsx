import { useState, useRef } from 'react';
import Nav from './components/Nav';
import HeroScene from './components/HeroScene';
import MapScene from './components/MapScene';
import IrisTransition from './components/IrisTransition';
import ParticleTransition from './components/ParticleTransition';

export default function App() {
  const [phase, setPhase] = useState('hero');
  const [particleActive, setParticleActive] = useState(false);
  const ctaBounds = useRef(null);

  const handleExplore = () => {
    const cta = document.getElementById('cta-btn');
    if (cta) {
      const r = cta.getBoundingClientRect();
      ctaBounds.current = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    }
    setPhase('transitioning');
    setTimeout(() => setParticleActive(true), 350);
  };

  const handleParticleComplete = () => {
    setParticleActive(false);
    setPhase('map');
  };

  return (
    <div className="w-screen h-screen overflow-hidden relative" style={{ background: '#0d1829' }}>
      <Nav />

      {(phase === 'hero' || phase === 'transitioning') && (
        <div className="absolute inset-0" style={{ zIndex: 20 }}>
          <HeroScene onExplore={handleExplore} />
        </div>
      )}

      <MapScene visible={phase === 'map' || phase === 'transitioning'} />

      <ParticleTransition
        active={particleActive}
        onComplete={handleParticleComplete}
      />
    </div>
  );
}
