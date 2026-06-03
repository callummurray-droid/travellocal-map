import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

export default function MusicPlayer({ country, audioRef, visible }) {
  const [playing, setPlaying]   = useState(true);
  const [volume, setVolume]     = useState(0.10);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const playerRef = useRef(null);
  const rafRef    = useRef(null);

  // Animate in/out
  useEffect(() => {
    if (!playerRef.current) return;
    if (visible) {
      gsap.fromTo(playerRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out', delay: 0.8 }
      );
    } else {
      gsap.to(playerRef.current, { y: 20, opacity: 0, duration: 0.3, ease: 'power3.in' });
    }
  }, [visible]);

  // Sync playing state and progress from the shared audio element
  useEffect(() => {
    const audio = audioRef?.current;
    if (!audio) return;

    const onPlay  = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onLoad  = () => setDuration(audio.duration || 0);

    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('loadedmetadata', onLoad);
    if (audio.duration) setDuration(audio.duration);

    // RAF progress loop
    const tick = () => {
      if (audio && !audio.paused && audio.duration) {
        setProgress(audio.currentTime / audio.duration);
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('loadedmetadata', onLoad);
      cancelAnimationFrame(rafRef.current);
    };
  }, [audioRef?.current]);

  const togglePlay = () => {
    const audio = audioRef?.current;
    if (!audio) return;
    if (audio.paused) { audio.play(); setPlaying(true); }
    else { audio.pause(); setPlaying(false); }
  };

  const handleVolume = (e) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    if (audioRef?.current) audioRef.current.volume = v;
  };

  const handleSeek = (e) => {
    const audio = audioRef?.current;
    if (!audio || !audio.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    audio.currentTime = x * audio.duration;
    setProgress(x);
  };

  const fmt = (s) => {
    if (!s || isNaN(s)) return '0:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const audio = audioRef?.current;
  const currentTime = audio ? audio.currentTime : 0;

  return (
    <div
      ref={playerRef}
      style={{
        position: 'fixed',
        bottom: 24,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 60,
        opacity: 0,
        pointerEvents: 'auto',
        cursor: 'none',
      }}
    >
      <div style={{
        background: 'rgba(13, 24, 41, 0.92)',
        backdropFilter: 'blur(24px)',
        border: '1px solid rgba(42,181,160,0.25)',
        borderRadius: 20,
        padding: '12px 18px',
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        minWidth: 320,
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      }}>
        {/* Music note icon */}
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: 'rgba(42,181,160,0.15)',
          border: '1px solid rgba(42,181,160,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2ab5a0" strokeWidth="2" strokeLinecap="round">
            <path d="M9 18V5l12-2v13"/>
            <circle cx="6" cy="18" r="3"/>
            <circle cx="18" cy="16" r="3"/>
          </svg>
        </div>

        {/* Track info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontFamily: 'Mulish, sans-serif', fontSize: 11, color: 'rgba(42,181,160,0.8)', margin: '0 0 1px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Now playing
          </p>
          <p style={{ fontFamily: 'Georgia, serif', fontSize: 13, color: 'white', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            The Mountain — Italy
          </p>
        </div>

        {/* Progress bar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, width: 100 }}>
          <div
            onClick={handleSeek}
            style={{ height: 3, background: 'rgba(255,255,255,0.12)', borderRadius: 2, cursor: 'none', position: 'relative' }}
          >
            <div style={{
              position: 'absolute', left: 0, top: 0, bottom: 0,
              width: `${progress * 100}%`,
              background: '#2ab5a0', borderRadius: 2,
              transition: 'width 0.1s linear',
            }}/>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: 'Mulish, sans-serif', fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>{fmt(currentTime)}</span>
            <span style={{ fontFamily: 'Mulish, sans-serif', fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>{fmt(duration)}</span>
          </div>
        </div>

        {/* Play/Pause */}
        <button
          onClick={togglePlay}
          style={{
            width: 34, height: 34, borderRadius: '50%',
            background: '#2ab5a0', border: 'none', cursor: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, transition: 'background 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#23a090'}
          onMouseLeave={e => e.currentTarget.style.background = '#2ab5a0'}
        >
          {playing ? (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
              <rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/>
            </svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
              <polygon points="5,3 19,12 5,21"/>
            </svg>
          )}
        </button>

        {/* Volume */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="2" strokeLinecap="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
            {volume > 0 && <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>}
            {volume > 0.5 && <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>}
          </svg>
          <input
            type="range" min="0" max="0.5" step="0.01"
            value={volume}
            onChange={handleVolume}
            style={{ width: 56, cursor: 'none', accentColor: '#2ab5a0' }}
          />
        </div>
      </div>
    </div>
  );
}
