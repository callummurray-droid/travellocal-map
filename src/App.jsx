import { useState, useRef } from 'react';
import Nav from './components/Nav';
import HeroScene from './components/HeroScene';
import MapScene from './components/MapScene';
import ParticleTransition from './components/ParticleTransition';
import { gsap } from 'gsap';

export default function App() {
  const [phase, setPhase]                   = useState('hero');
  const [particleActive, setParticleActive] = useState(false);
  const capturedCardsRef                    = useRef([]);
  const heroWrapRef                         = useRef(null);

  const handleExplore = (capturedCards) => {
    capturedCardsRef.current = capturedCards;
    setPhase('transitioning');

    // Fade hero wrapper out gently while canvas fades in
    if (heroWrapRef.current) {
      gsap.to(heroWrapRef.current, {
        opacity: 0,
        duration: 0.5,
        ease: 'power2.in',
        delay: 0.25,
      });
    }

    // Start particles — slight delay so hero fade starts first
    setTimeout(() => setParticleActive(true), 200);
  };

  const handleParticleComplete = () => {
    setParticleActive(false);
    setPhase('map');
  };

  return (
    <div className="w-screen h-screen overflow-hidden relative" style={{ background: '#0d1829' }}>
      <Nav />

      {(phase === 'hero' || phase === 'transitioning') && (
        <div
          ref={heroWrapRef}
          className="absolute inset-0"
          style={{ zIndex: 20 }}
        >
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
