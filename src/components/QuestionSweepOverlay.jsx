import { useEffect, useState } from 'react';

/**
 * Decorative monochrome scanning beam + 3D-styled geometric reticle that travels
 * smoothly across the question section from left to right every 30 seconds.
 */
export default function QuestionSweepOverlay() {
  const [sweepKey, setSweepKey] = useState(1);

  useEffect(() => {
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return undefined;

    const interval = window.setInterval(() => {
      if (!document.hidden) {
        setSweepKey((k) => k + 1);
      }
    }, 30000);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        borderRadius: '16px',
      }}
    >
      <div
        key={sweepKey}
        className="cyber-sweep-active"
        style={{
          position: 'absolute',
          top: '18%',
          left: 0,
          width: '120px',
          height: '64%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          willChange: 'transform, opacity',
        }}
      >
        {/* Top Holographic Reticle */}
        <svg width="42" height="42" viewBox="0 0 42 42" style={{ opacity: 0.55 }}>
          <polygon points="21,2 40,21 21,40 2,21" fill="none" stroke="#ffffff" strokeWidth="1.5" />
          <polygon points="21,9 33,21 21,33 9,21" fill="rgba(255,255,255,0.12)" stroke="#a3a3a3" strokeWidth="1" />
          <circle cx="21" cy="21" r="2.5" fill="#ffffff" />
        </svg>

        {/* Vertical Monochrome Scanning Beam */}
        <div
          style={{
            flex: 1,
            width: '2px',
            margin: '6px 0',
            background: 'linear-gradient(180deg, transparent, rgba(255,255,255,0.45), transparent)',
            boxShadow: '0 0 18px rgba(255,255,255,0.25)',
          }}
        />

        {/* Bottom Geometric Node */}
        <div
          className="font-mono"
          style={{
            fontSize: '0.68rem',
            letterSpacing: '0.14em',
            color: 'rgba(255, 255, 255, 0.45)',
          }}
        >
          SCAN // 30S
        </div>
      </div>
    </div>
  );
}
