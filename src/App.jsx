import { useState, useRef } from 'react';
import Nav from './components/Nav';
import HeroScene from './components/HeroScene';
import MapScene from './components/MapScene';
import ParticleTransition from './components/ParticleTransition';

export default function App() {
  const [phase, setPhase]               = useState('hero');
  const [particleActive, setParticleActive] = useState(false);
  const capturedCardsRef                = useRef([]);

  // HeroScene calls this with the real card positions captured at click time
  const handleExplore = (capturedCards) => {
    capturedCardsRef.current = capturedCards;
    setPhase('transitioning');
    // Small delay so hero fade-out starts first, then canvas takes over
    setTimeout(() => setParticleActive(true), 300);
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

      {phase === 'map' && <MapScene visible={true} />}

      <ParticleTransition
        active={particleActive}
        capturedCards={capturedCardsRef.current}
        onComplete={handleParticleComplete}
      />
    </div>
  );
}
