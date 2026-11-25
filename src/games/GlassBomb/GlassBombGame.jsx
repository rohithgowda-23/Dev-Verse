import { useState, useEffect } from 'react';
import { Lock, AlertTriangle, Bomb, ShieldCheck, RotateCcw } from 'lucide-react';
import GameResultBanner from '../../components/GameResultBanner';
import { formatRemainingMs } from '../../utils/time';

function pickRandomBombIndex(glassCount, safeIndex) {
  const candidates = [];
  for (let i = 0; i < glassCount; i += 1) {
    if (i !== safeIndex) candidates.push(i);
  }
  return candidates[Math.floor(Math.random() * candidates.length)];
}

export default function GlassBombGame({
  question,
  slotNumber,
  slotState,
  onOutcome,
}) {
  const {
    glassCount = 15,
    safeIndex,
    clueText,
    lockoutDurationSeconds = 120,
  } = question.payload;

  const isSolved = Boolean(slotState?.solved);
  const [bombIndex, setBombIndex] = useState(() => pickRandomBombIndex(glassCount, safeIndex));
  const [opened, setOpened] = useState(() => (isSolved ? [safeIndex] : []));
  const [now, setNow] = useState(() => Date.now());
  const [feedback, setFeedback] = useState(null);

  const lockoutDeadline = slotState?.lockoutDeadline || null;
  const isLockedOut = Boolean(lockoutDeadline && lockoutDeadline > now);
  const mistakeStreak = slotState?.mistakeStreak || 0;

  useEffect(() => {
    if (!lockoutDeadline || lockoutDeadline <= Date.now()) return undefined;
    const interval = window.setInterval(() => {
      setNow(Date.now());
    }, 500);
    return () => window.clearInterval(interval);
  }, [lockoutDeadline]);

  const handleGlassClick = (idx) => {
    if (isSolved || isLockedOut || opened.includes(idx)) return;

    const nextOpened = [...opened, idx];
    setOpened(nextOpened);

    if (idx === safeIndex) {
      setFeedback(null);
      onOutcome({ isCorrect: true, mistakeStreak: 0, lockoutDeadline: null });
      return;
    }

    const nextStreak = mistakeStreak + 1;
    if (nextStreak >= 4) {
      const deadline = Date.now() + lockoutDurationSeconds * 1000;
      setNow(Date.now());
      setFeedback(true);
      onOutcome({ isCorrect: false, mistakeStreak: 0, lockoutDeadline: deadline });
    } else {
      setFeedback(true);
      onOutcome({ isCorrect: false, mistakeStreak: nextStreak, lockoutDeadline: null });
    }
  };

  const handleShuffleRound = () => {
    if (isSolved || isLockedOut) return;
    setOpened([]);
    setBombIndex(pickRandomBombIndex(glassCount, safeIndex));
    setFeedback(null);
  };

  return (
    <div className="glass-card glass-card-glow" style={{ padding: '24px', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '12px' }}>
        <span className="badge badge-cyan">QUESTION 0{slotNumber} // GLASS BOMB — FIND THE SAFE GLASS</span>
        <span className="badge badge-cyan">
          <AlertTriangle size={13} /> Mistakes: {mistakeStreak} / 4
        </span>
      </div>

      <div
        style={{
          padding: '14px 16px',
          borderRadius: '12px',
          background: '#000000',
          border: '1.5px solid rgba(255, 255, 255, 0.38)',
          marginBottom: '18px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '10px',
        }}
      >
        <div style={{ color: '#ffffff', fontSize: '0.96rem', flex: 1, minWidth: '220px' }}>
          <strong>Clue:</strong> {clueText}
        </div>
        <button
          type="button"
          className="btn btn-secondary"
          disabled={isSolved || isLockedOut}
          onClick={handleShuffleRound}
          style={{ minHeight: '36px', padding: '6px 12px', fontSize: '0.8rem' }}
        >
          <RotateCcw size={14} /> Reset Glasses
        </button>
      </div>

      {isLockedOut && (
        <div
          style={{
            padding: '18px',
            borderRadius: '14px',
            background: '#ffffff',
            border: '2px solid #ffffff',
            textAlign: 'center',
            marginBottom: '20px',
            color: '#000000',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', fontWeight: 700, marginBottom: '6px' }}>
            <Lock size={20} /> LOCKED FOR 2 MINUTES (4 INCORRECT SELECTIONS)
          </div>
          <div className="font-mono" style={{ fontSize: '1.6rem', fontWeight: 800 }}>
            {formatRemainingMs(lockoutDeadline - now)}
          </div>
          <div style={{ fontSize: '0.84rem', marginTop: '4px' }}>
            All glasses are sealed until the lockout timer expires.
          </div>
        </div>
      )}

      {/* 15 Glasses Per Row Grid (identical before click; horizontal scroll on small screens) */}
      <div style={{ overflowX: 'auto', paddingBottom: '8px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(15, minmax(56px, 1fr))',
            gap: '8px',
            minWidth: '940px',
          }}
        >
        {Array.from({ length: glassCount }).map((_, idx) => {
          const isOpen = opened.includes(idx) || (isSolved && idx === safeIndex);
          const isSafe = isOpen && idx === safeIndex;
          const isBomb = isOpen && idx === bombIndex;

          return (
            <button
              key={idx}
              type="button"
              disabled={isSolved || isLockedOut || isOpen}
              onClick={() => handleGlassClick(idx)}
              style={{
                height: '92px',
                borderRadius: '14px',
                border: `1.5px solid ${
                  isSafe
                    ? '#ffffff'
                    : isBomb
                    ? '#ef4444'
                    : isOpen
                    ? 'rgba(255,255,255,0.28)'
                    : 'rgba(255,255,255,0.5)'
                }`,
                background: isSafe
                  ? '#ffffff'
                  : isBomb
                  ? 'rgba(239, 68, 68, 0.18)'
                  : isOpen
                  ? '#000000'
                  : 'linear-gradient(160deg, rgba(255,255,255,0.16) 0%, #000000 100%)',
                color: isSafe ? '#000000' : isBomb ? '#fca5a5' : '#ffffff',
                cursor: isSolved || isLockedOut || isOpen ? 'default' : 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                transition: 'transform 0.2s ease, background 0.25s ease',
                transform: isOpen ? 'scale(0.97)' : 'scale(1)',
              }}
            >
              {isSafe ? (
                <>
                  <ShieldCheck size={22} />
                  <span className="font-mono" style={{ fontSize: '0.72rem', fontWeight: 800 }}>SAFE</span>
                </>
              ) : isBomb ? (
                <>
                  <Bomb size={22} />
                  <span className="font-mono" style={{ fontSize: '0.72rem', fontWeight: 800 }}>BOMB</span>
                </>
              ) : isOpen ? (
                <span className="font-mono" style={{ fontSize: '0.72rem', color: '#a3a3a3' }}>EMPTY</span>
              ) : (
                <>
                  <svg width="24" height="28" viewBox="0 0 24 28" aria-hidden="true">
                    <path d="M4 3 L20 3 L18 25 L6 25 Z" fill="rgba(255,255,255,0.08)" stroke="#ffffff" strokeWidth="1.6" />
                    <line x1="7" y1="8" x2="17" y2="8" stroke="rgba(255,255,255,0.45)" strokeWidth="1.2" />
                  </svg>
                  <span className="font-mono" style={{ fontSize: '0.74rem', fontWeight: 700 }}>#{idx + 1}</span>
                </>
              )}
            </button>
          );
        })}
        </div>
      </div>

      <GameResultBanner solved={isSolved} feedback={!isLockedOut ? feedback : null} />
    </div>
  );
}
