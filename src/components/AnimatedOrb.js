import React, { useRef, useEffect, useState } from 'react';
import './AnimatedOrb.css';

const bubbleImg = process.env.PUBLIC_URL + '/assets/Orb/Bubble/Bubble.png';

// Helper to generate a single waveform SVG path
function generateWavePath(width, height, amplitude, frequency, phase, points = 120) {
  const path = [];
  for (let i = 0; i < points; i++) {
    const t = i / (points - 1);
    const x = width * t;
    const y = height / 2 + amplitude * Math.sin(frequency * 2 * Math.PI * t + phase);
    path.push(`${i === 0 ? 'M' : 'L'}${x},${y}`);
  }
  return path.join(' ');
}

// Parameters for each layer (amplitude, frequency, phase speed, opacity, blur, strokeWidth)
const LAYERS = [
  { amp: 38, freq: 1.2, speed: 1.1, opacity: 0.32, blur: 2, width: 3 },
  { amp: 32, freq: 1.5, speed: 1.4, opacity: 0.22, blur: 4, width: 2 },
  { amp: 28, freq: 1.7, speed: 1.7, opacity: 0.18, blur: 6, width: 2 },
  { amp: 24, freq: 2.1, speed: 1.9, opacity: 0.13, blur: 8, width: 1.5 },
  { amp: 20, freq: 2.5, speed: 2.2, opacity: 0.10, blur: 10, width: 1.2 },
  { amp: 16, freq: 2.9, speed: 2.5, opacity: 0.08, blur: 12, width: 1 },
  { amp: 12, freq: 3.3, speed: 2.8, opacity: 0.07, blur: 14, width: 1 },
  { amp: 8, freq: 3.7, speed: 3.1, opacity: 0.06, blur: 16, width: 0.8 },
  { amp: 4, freq: 4.1, speed: 3.4, opacity: 0.05, blur: 18, width: 0.7 },
  { amp: 2, freq: 4.5, speed: 3.7, opacity: 0.04, blur: 20, width: 0.6 },
  // Extra layers for more organic look
  { amp: 30, freq: 1.8, speed: 1.3, opacity: 0.13, blur: 7, width: 1.2 },
  { amp: 18, freq: 2.7, speed: 2.1, opacity: 0.09, blur: 11, width: 0.9 },
  { amp: 10, freq: 3.5, speed: 2.9, opacity: 0.06, blur: 15, width: 0.7 },
  { amp: 6, freq: 4.3, speed: 3.3, opacity: 0.05, blur: 17, width: 0.6 },
  { amp: 3, freq: 4.8, speed: 3.8, opacity: 0.03, blur: 21, width: 0.5 },
];

export default function AnimatedOrb({
  orbSize = 340, // px
  breathingSpeed = 3, // seconds per cycle
}) {
  const [breath, setBreath] = useState(1);
  const [phases, setPhases] = useState(Array(LAYERS.length).fill(0));
  const requestRef = useRef();
  const startTimeRef = useRef();

  useEffect(() => {
    function animate(time) {
      if (!startTimeRef.current) startTimeRef.current = time;
      const elapsed = (time - startTimeRef.current) / 1000;
      setBreath(0.97 + 0.06 * (0.5 + 0.5 * Math.sin((2 * Math.PI * elapsed) / breathingSpeed)));
      setPhases(LAYERS.map((l, i) => elapsed * l.speed + i));
      requestRef.current = requestAnimationFrame(animate);
    }
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [breathingSpeed]);

  // Slightly less stretched waveform
  const waveWidth = orbSize * 1.45;
  const waveHeight = orbSize * 0.38;

  return (
    <div
      className="orb-outer"
      style={{ width: orbSize, height: orbSize, minWidth: orbSize, minHeight: orbSize }}
    >
      {/* Animated multi-layer waveform (SVG) */}
      <svg
        width={waveWidth}
        height={waveHeight}
        style={{
          position: 'absolute',
          left: `calc(50% - ${waveWidth / 2}px)`,
          top: `calc(50% - ${waveHeight / 2}px)`,
          zIndex: 3,
          pointerEvents: 'none',
        }}
      >
        <defs>
          <linearGradient id="wave-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1BABBE" />
            <stop offset="100%" stopColor="#A16EFF" />
          </linearGradient>
        </defs>
        {LAYERS.map((l, idx) => (
          <path
            key={idx}
            d={generateWavePath(waveWidth, waveHeight, l.amp, l.freq, phases[idx] || 0)}
            stroke="url(#wave-gradient)"
            strokeWidth={l.width}
            fill="none"
            opacity={l.opacity}
            style={{ filter: `blur(${l.blur}px)` }}
          />
        ))}
      </svg>
      {/* Breathing bubble */}
      <img
        src={bubbleImg}
        alt="orb-bubble"
        className="orb-bubble"
        style={{
          width: orbSize,
          height: orbSize,
          transform: `scale(${breath})`,
          left: 0,
          top: 0,
          zIndex: 2,
        }}
        draggable={false}
      />
    </div>
  );
} 