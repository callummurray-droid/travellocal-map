import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function IrisTransition({ active, onComplete, ctaPosition }) {
  const svgRef = useRef(null);
  const circleRef = useRef(null);

  useEffect(() => {
    if (!active) return;
    const maxR = Math.sqrt(window.innerWidth ** 2 + window.innerHeight ** 2);
    const cx = ctaPosition?.x || window.innerWidth / 2;
    const cy = ctaPosition?.y || window.innerHeight / 2;

    if (circleRef.current) {
      gsap.fromTo(circleRef.current,
        { attr: { r: 0, cx, cy } },
        {
          attr: { r: maxR },
          duration: 1.1,
          ease: 'power3.inOut',
          onComplete,
        }
      );
    }
  }, [active]);

  if (!active) return null;

  return (
    <svg
      ref={svgRef}
      id="iris-overlay"
      style={{
        position: 'fixed', inset: 0,
        width: '100vw', height: '100vh',
        pointerEvents: 'none', zIndex: 200,
      }}
    >
      <defs>
        <mask id="iris-mask">
          <rect width="100%" height="100%" fill="white"/>
          <circle ref={circleRef} r="0" fill="black"/>
        </mask>
      </defs>
      <rect
        width="100%" height="100%"
        fill="#0d1829"
        mask="url(#iris-mask)"
      />
    </svg>
  );
}
