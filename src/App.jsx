import { useState, useRef } from 'react';
import Nav from './components/Nav';
import HeroScene from './components/HeroScene';
import MapScene from './components/MapScene';
import ParticleTransition from './components/ParticleTransition';

export default function App() {
  const [phase, setPhase] = useState('hero');
  const [particleActive, setParticleActive] = useState(false);

  const handleExplore = () => {
    setPhase('transitioning');
    setTimeout(() => setParticleActive(true), 400);
  };

  const handleParticleComplete = () => {
    setParticleActive(false);
    setPhase('map'); // map only mounts AFTER particles finish
  };

  return (
    <div className="w-screen h-screen overflow-hidden relative" style={{ background: '#0d1829' }}>
      <Nav />

      {/* Hero — shown during hero + transitioning phases */}
      {(phase === 'hero' || phase === 'transitioning') && (
        <div className="absolute inset-0" style={{ zIndex: 20 }}>
          <HeroScene onExplore={handleExplore} />
        </div>
      )}

      {/* Map — only mounts after particles complete */}
      {phase === 'map' && <MapScene visible={true} />}

      {/* Particles — sit above everything */}
      <ParticleTransition
        active={particleActive}
        onComplete={handleParticleComplete}
      />
    </div>
  );
}
