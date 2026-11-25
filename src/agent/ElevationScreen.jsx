import { ArrowLeft, CheckCircle2, XCircle, ShieldCheck, Lock, RotateCcw } from 'lucide-react';

export default function ElevationScreen({
  teamName,
  elevationResult,
  onBackToQuestion,
}) {
  const { results, allCorrect } = elevationResult;
  const firstIncorrectSlot = results.find((r) => !r.solved)?.slot ?? 0;
  const verifiedCount = results.filter((r) => r.solved).length;

  return (
    <div
      className="glass-card glass-card-glow"
      style={{
        maxWidth: '720px',
        width: '100%',
        margin: '12px auto',
        padding: '32px 24px',
        textAlign: 'center',
        borderColor: allCorrect ? 'rgba(16, 185, 129, 0.55)' : 'rgba(255, 255, 255, 0.25)',
      }}
    >
      <div style={{ marginBottom: '14px' }}>
        <span
          className="badge"
          style={{
            fontSize: '0.78rem',
            padding: '5px 14px',
            background: allCorrect ? 'rgba(16, 185, 129, 0.14)' : 'rgba(255, 255, 255, 0.08)',
            color: allCorrect ? '#6ee7b7' : '#e5e5e5',
            border: `1px solid ${allCorrect ? 'rgba(16, 185, 129, 0.45)' : 'rgba(255, 255, 255, 0.22)'}`,
          }}
        >
          {allCorrect ? <ShieldCheck size={15} /> : <Lock size={15} />}
          {allCorrect ? 'MISSION RESULT // VERIFIED' : `MISSION RESULT // ${verifiedCount} OF 4 VERIFIED`}
        </span>
      </div>

      <h2
        className="font-display"
        style={{
          margin: '0 0 6px',
          fontSize: 'clamp(1.35rem, 3.2vw, 1.85rem)',
          fontWeight: 700,
          letterSpacing: '0.08em',
          color: '#ffffff',
        }}
      >
        DESTINATION VERIFICATION
      </h2>
      <p style={{ color: '#a3a3a3', margin: '0 0 26px', fontSize: '0.94rem' }}>
        Team <strong style={{ color: '#ffffff' }}>{teamName}</strong>
      </p>

      {/* 4-Letter Verification Tiles */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, minmax(64px, 118px))',
          justifyContent: 'center',
          gap: '12px',
          marginBottom: '26px',
        }}
      >
        {results.map((item) => {
          const isGreen = item.solved;
          return (
            <div
              key={item.slot}
              className="elevation-tile-reveal"
              style={{
                animationDelay: `${item.slot * 110}ms`,
                padding: '16px 8px',
                borderRadius: '14px',
                background: isGreen ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                border: `1.5px solid ${isGreen ? '#10b981' : '#ef4444'}`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#d4d4d4', letterSpacing: '0.08em' }}>
                Q{item.slot + 1}
              </span>
              <span
                className="font-display"
                style={{
                  fontSize: 'clamp(1.9rem, 5vw, 2.5rem)',
                  fontWeight: 700,
                  color: isGreen ? '#34d399' : '#f87171',
                  lineHeight: 1,
                }}
              >
                {isGreen ? item.letter : '_'}
              </span>
              <span
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  color: isGreen ? '#6ee7b7' : '#fca5a5',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                {isGreen ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
                {isGreen ? 'VERIFIED' : 'INCORRECT'}
              </span>

              {!isGreen && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ minHeight: '30px', padding: '4px 8px', fontSize: '0.72rem', width: '100%' }}
                  onClick={() => onBackToQuestion(item.slot)}
                >
                  <RotateCcw size={12} /> Retry Q{item.slot + 1}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {allCorrect ? (
        <div
          className="elevation-tile-reveal"
          style={{
            animationDelay: '460ms',
            padding: '16px 18px',
            borderRadius: '12px',
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            color: '#d1fae5',
            marginBottom: '22px',
            fontSize: '0.94rem',
          }}
        >
          <strong style={{ display: 'block', fontSize: '1.04rem', marginBottom: '4px', color: '#ffffff' }}>
            Escape Sequence Confirmed
          </strong>
          All four destination letters have been verified. Present your destination code to the event coordinator.
        </div>
      ) : (
        <div
          style={{
            padding: '14px 16px',
            borderRadius: '12px',
            background: '#000000',
            border: '1px solid rgba(239, 68, 68, 0.35)',
            color: '#e5e5e5',
            marginBottom: '22px',
            fontSize: '0.92rem',
          }}
        >
          Positions marked with <strong style={{ color: '#f87171' }}>_</strong> require another attempt. All verified green letters remain saved—return to any incorrect question and resubmit to recalculate.
        </div>
      )}

      <button
        type="button"
        className="btn btn-primary"
        onClick={() => onBackToQuestion(firstIncorrectSlot)}
      >
        <ArrowLeft size={17} /> BACK TO QUESTION
      </button>
    </div>
  );
}
