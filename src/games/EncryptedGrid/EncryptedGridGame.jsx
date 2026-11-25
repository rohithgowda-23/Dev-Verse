import { useState, useEffect } from 'react';
import { Lock, AlertTriangle, Grid } from 'lucide-react';
import GameResultBanner from '../../components/GameResultBanner';
import { formatRemainingMs } from '../../utils/time';

export default function EncryptedGridGame({
  question,
  slotNumber,
  slotState,
  onOutcome,
}) {
  const { clues, correctIndex, gridSize = 5, lockoutDurationSeconds = 120 } = question.payload;
  const isSolved = Boolean(slotState?.solved);

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

  const handleBoxClick = (idx) => {
    if (isSolved || isLockedOut) return;

    if (idx === correctIndex) {
      setFeedback(null);
      onOutcome({ isCorrect: true, mistakeStreak: 0, lockoutDeadline: null });
    } else {
      const nextStreak = mistakeStreak + 1;
      if (nextStreak >= 3) {
        const deadline = Date.now() + lockoutDurationSeconds * 1000;
        setNow(Date.now());
        setFeedback(true);
        onOutcome({ isCorrect: false, mistakeStreak: 0, lockoutDeadline: deadline });
      } else {
        setFeedback(true);
        onOutcome({ isCorrect: false, mistakeStreak: nextStreak, lockoutDeadline: null });
      }
    }
  };

  return (
    <div className="glass-card glass-card-glow" style={{ padding: '24px', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '12px' }}>
        <span className="badge badge-cyan">QUESTION 0{slotNumber} // ENCRYPTED {gridSize}×{gridSize} GRID</span>
        <span className="badge badge-cyan">
          <AlertTriangle size={13} /> Mistakes: {mistakeStreak} / 3
        </span>
      </div>

      <div
        style={{
          padding: '14px 16px',
          borderRadius: '12px',
          background: '#000000',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          marginBottom: '20px',
        }}
      >
        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#ffffff', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Grid size={14} /> COORDINATE CLUES (ROWS 1–{gridSize} TOP TO BOTTOM, COLS 1–{gridSize} LEFT TO RIGHT)
        </div>
        <ul style={{ margin: 0, paddingLeft: '18px', color: '#d4d4d4', fontSize: '0.92rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {clues.map((c, i) => (
            <li key={i}>{c}</li>
          ))}
        </ul>
      </div>

      {isLockedOut && (
        <div
          style={{
            padding: '18px',
            borderRadius: '14px',
            background: '#ffffff',
            border: '1.5px solid #ffffff',
            textAlign: 'center',
            marginBottom: '20px',
            color: '#050505',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', fontWeight: 700, marginBottom: '6px' }}>
            <Lock size={20} /> VAULT LOCKED (3 CONSECUTIVE MISTAKES)
          </div>
          <div className="font-mono" style={{ fontSize: '1.6rem', fontWeight: 800 }}>
            {formatRemainingMs(lockoutDeadline - now)}
          </div>
          <div style={{ fontSize: '0.84rem', marginTop: '4px' }}>
            Wait for the lockout timer to expire before attempting another box.
          </div>
        </div>
      )}

      {/* Dynamic NxN Uniform Grid — zero visual hints on any cell */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${gridSize}, minmax(36px, 68px))`,
          justifyContent: 'center',
          gap: '8px',
        }}
      >
        {Array.from({ length: gridSize * gridSize }).map((_, idx) => {
          const row = Math.floor(idx / gridSize) + 1;
          const col = (idx % gridSize) + 1;
          const isSolvedTarget = isSolved && idx === correctIndex;
          return (
            <button
              key={idx}
              type="button"
              disabled={isSolved || isLockedOut}
              onClick={() => handleBoxClick(idx)}
              className="font-mono"
              style={{
                aspectRatio: '1 / 1',
                borderRadius: '12px',
                border: `1.5px solid ${
                  isSolvedTarget ? '#ffffff' : 'rgba(255, 255, 255, 0.22)'
                }`,
                background: isSolvedTarget
                  ? '#ffffff'
                  : '#000000',
                color: isSolvedTarget ? '#050505' : '#e5e5e5',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: isSolved || isLockedOut ? 'not-allowed' : 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span>R{row}C{col}</span>
            </button>
          );
        })}
      </div>

      <GameResultBanner
        solved={isSolved}
        feedback={!isLockedOut ? feedback : null}
      />
    </div>
  );
}
