import { useEffect, useRef, useState } from 'react';
import {
  tryAcquireAnimation,
  updateAnimationRect,
  releaseAnimation,
  getActiveReservation,
  isAnyOtherAnimationActive,
  rectsIntersect,
} from '../utils/animationCoordinator';

const ENV_WIDTH = 228;
const ENV_HEIGHT = 112;
const SEQUENCE_DURATION_MS = 6400;

/**
 * Second independent red toy character carrying an envelope to the user's cursor,
 * opening it to reveal "BRO DO IT BRO", then smoothly fading away.
 * Uses the shared AnimationCoordinator with live DOM bounding-box collision checks.
 */
export default function EnvelopeCourierOverlay() {
  const [phase, setPhase] = useState('idle'); // 'idle' | 'entering' | 'open' | 'exiting'
  const [pos, setPos] = useState({ x: 260, y: 160 });
  const envelopeNodeRef = useRef(null);
  const cursorRef = useRef({
    x: typeof window !== 'undefined' ? Math.min(window.innerWidth - 260, window.innerWidth * 0.78) : 260,
    y: 140,
  });
  const activeRef = useRef(false);
  const posRef = useRef({ x: 260, y: 160 });

  useEffect(() => {
    const updateCursor = (e) => {
      const clientX = e.touches ? e.touches[0]?.clientX : e.clientX;
      const clientY = e.touches ? e.touches[0]?.clientY : e.clientY;
      if (typeof clientX !== 'number' || typeof clientY !== 'number') return;
      cursorRef.current = { x: clientX, y: clientY };
    };

    window.addEventListener('mousemove', updateCursor, { passive: true });
    window.addEventListener('touchstart', updateCursor, { passive: true });
    return () => {
      window.removeEventListener('mousemove', updateCursor);
      window.removeEventListener('touchstart', updateCursor);
    };
  }, []);

  useEffect(() => {
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return undefined;

    let retryTimer = null;
    let monitorTimer = null;
    const timeouts = [];

    const clearAllTimeouts = () => {
      while (timeouts.length) {
        window.clearTimeout(timeouts.pop());
      }
    };

    const computeSafePosition = () => {
      const vw = window.innerWidth || 800;
      const vh = window.innerHeight || 600;
      const rawX = cursorRef.current.x + 36;
      const rawY = cursorRef.current.y - 118;

      let candidate = {
        x: Math.max(16, Math.min(vw - ENV_WIDTH - 16, rawX)),
        y: Math.max(16, Math.min(vh - ENV_HEIGHT - 16, rawY)),
      };

      const envRect = {
        left: candidate.x,
        top: candidate.y,
        right: candidate.x + ENV_WIDTH,
        bottom: candidate.y + ENV_HEIGHT,
      };

      // Avoid covering the central question stage or active bomb reservation
      const questionStage = document.querySelector('[data-question-stage="true"]');
      const stageRect = questionStage ? questionStage.getBoundingClientRect() : null;
      const bombRes = getActiveReservation('bomb-stage');

      const overlapsStage = stageRect && rectsIntersect(envRect, stageRect, 12);
      const overlapsBomb = bombRes && rectsIntersect(envRect, bombRes.rect, 28);

      if (overlapsStage || overlapsBomb) {
        // Safe fallback in top-right or bottom-right viewport gutter
        candidate = {
          x: Math.max(16, vw - ENV_WIDTH - 20),
          y: 18,
        };
      }

      return candidate;
    };

    const abortToIdle = () => {
      clearAllTimeouts();
      if (monitorTimer) {
        window.clearInterval(monitorTimer);
        monitorTimer = null;
      }
      activeRef.current = false;
      releaseAnimation('envelope-courier');
      setPhase('idle');
    };

    const runSequence = () => {
      if (document.hidden || activeRef.current) return;

      const target = computeSafePosition();
      const targetRect = {
        left: target.x,
        top: target.y,
        right: target.x + ENV_WIDTH,
        bottom: target.y + ENV_HEIGHT,
      };

      if (
        isAnyOtherAnimationActive('envelope-courier') ||
        !tryAcquireAnimation('envelope-courier', targetRect, SEQUENCE_DURATION_MS)
      ) {
        if (!retryTimer) {
          retryTimer = window.setTimeout(() => {
            retryTimer = null;
            runSequence();
          }, 2000);
        }
        return;
      }

      activeRef.current = true;
      const vw = window.innerWidth || 800;
      const startPos = { x: Math.min(vw - 60, target.x + 180), y: target.y };
      posRef.current = startPos;
      setPos(startPos);
      setPhase('entering');

      timeouts.push(
        window.setTimeout(() => {
          const nextTarget = computeSafePosition();
          posRef.current = nextTarget;
          setPos(nextTarget);
          updateAnimationRect('envelope-courier', {
            left: nextTarget.x,
            top: nextTarget.y,
            right: nextTarget.x + ENV_WIDTH,
            bottom: nextTarget.y + ENV_HEIGHT,
          });
        }, 60)
      );

      // Continuous 60ms live DOM collision guard during movement, scrolling & resizing
      monitorTimer = window.setInterval(() => {
        if (!activeRef.current) return;
        const bombRes = getActiveReservation('bomb-stage');
        const liveNode = envelopeNodeRef.current;
        const liveRect = liveNode
          ? liveNode.getBoundingClientRect()
          : {
              left: posRef.current.x,
              top: posRef.current.y,
              right: posRef.current.x + ENV_WIDTH,
              bottom: posRef.current.y + ENV_HEIGHT,
            };

        if (bombRes && rectsIntersect(liveRect, bombRes.rect, 24)) {
          abortToIdle();
          return;
        }
        updateAnimationRect('envelope-courier', {
          left: liveRect.left,
          top: liveRect.top,
          right: liveRect.right,
          bottom: liveRect.bottom,
        });
      }, 60);

      timeouts.push(
        window.setTimeout(() => {
          setPhase('open');
        }, 1750)
      );

      timeouts.push(
        window.setTimeout(() => {
          setPhase('exiting');
        }, 5400)
      );

      timeouts.push(
        window.setTimeout(() => {
          abortToIdle();
        }, SEQUENCE_DURATION_MS)
      );
    };

    const initialTimer = window.setTimeout(runSequence, 20000);
    const interval = window.setInterval(runSequence, 45000);

    return () => {
      window.clearTimeout(initialTimer);
      window.clearInterval(interval);
      if (retryTimer) window.clearTimeout(retryTimer);
      abortToIdle();
    };
  }, []);

  if (phase === 'idle') return null;

  const isOpen = phase === 'open';
  const isExiting = phase === 'exiting';

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 25,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      <div
        ref={envelopeNodeRef}
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          transform: `translate3d(${pos.x}px, ${pos.y}px, 0) scale(${isExiting ? 0.88 : 1})`,
          opacity: isExiting ? 0 : 1,
          transition: 'transform 1.5s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.85s ease',
          display: 'flex',
          alignItems: 'flex-end',
          gap: '10px',
          willChange: 'transform, opacity',
        }}
      >
        <svg width="64" height="84" viewBox="0 0 64 84" style={{ filter: 'drop-shadow(0 8px 14px rgba(0,0,0,0.65))' }}>
          <defs>
            <radialGradient id="redHeadGrad" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#991b1b" />
            </radialGradient>
            <linearGradient id="redBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#dc2626" />
              <stop offset="100%" stopColor="#7f1d1d" />
            </linearGradient>
          </defs>
          <line x1="32" y1="6" x2="32" y2="14" stroke="#d4d4d4" strokeWidth="2.5" />
          <circle cx="32" cy="5" r="3.5" fill="#ef4444" />
          <circle cx="32" cy="28" r="15" fill="url(#redHeadGrad)" />
          <rect x="20" y="22" width="24" height="9" rx="4" fill="#171717" />
          <circle cx="27" cy="26.5" r="2.2" fill="#ffffff" />
          <circle cx="37" cy="26.5" r="2.2" fill="#ffffff" />
          <rect x="21" y="44" width="22" height="22" rx="6" fill="url(#redBodyGrad)" />
          <rect x="13" y="46" width="7" height="16" rx="3.5" fill="#ef4444" />
          <rect x="44" y="45" width="8" height="15" rx="3.5" fill="#ef4444" transform="rotate(-24 44 45)" />
          <rect x="23" y="67" width="7" height="12" rx="3.5" fill="#262626" />
          <rect x="34" y="67" width="7" height="12" rx="3.5" fill="#262626" />
        </svg>

        <div style={{ position: 'relative', width: '154px', height: '98px', perspective: '500px' }}>
          <div
            style={{
              position: 'absolute',
              left: '8px',
              right: '8px',
              bottom: isOpen ? '42px' : '10px',
              padding: '8px 10px',
              borderRadius: '8px',
              background: '#ffffff',
              color: '#050505',
              border: '1.5px solid #dc2626',
              boxShadow: '0 8px 20px rgba(0, 0, 0, 0.55)',
              textAlign: 'center',
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: '0.88rem',
              letterSpacing: '0.04em',
              opacity: isOpen ? 1 : 0,
              transition: 'bottom 0.55s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.4s ease',
              zIndex: 2,
            }}
          >
            BRO DO IT BRO
          </div>

          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              height: '58px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #262626 0%, #141414 100%)',
              border: '1.5px solid rgba(255, 255, 255, 0.45)',
              boxShadow: '0 10px 24px rgba(0, 0, 0, 0.65)',
              zIndex: 3,
              overflow: 'hidden',
            }}
          >
            <svg width="154" height="58" viewBox="0 0 154 58" style={{ display: 'block' }}>
              <polyline points="0,0 77,34 154,0" fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="1.5" />
            </svg>
          </div>

          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: '26px',
              height: '32px',
              transformOrigin: 'top center',
              transform: isOpen ? 'rotateX(165deg)' : 'rotateX(0deg)',
              transition: 'transform 0.5s ease',
              zIndex: isOpen ? 1 : 4,
            }}
          >
            <svg width="154" height="32" viewBox="0 0 154 32" style={{ display: 'block' }}>
              <polygon points="0,0 154,0 77,30" fill="#dc2626" stroke="rgba(255,255,255,0.45)" strokeWidth="1.2" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
