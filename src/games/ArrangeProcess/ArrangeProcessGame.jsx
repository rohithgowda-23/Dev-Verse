import { useState } from 'react';
import { ArrowUp, ArrowDown, Check, ListOrdered } from 'lucide-react';
import GameResultBanner from '../../components/GameResultBanner';

export default function ArrangeProcessGame({
  question,
  slotNumber,
  slotState,
  onOutcome,
}) {
  const { prompt, shuffledSteps, correctOrderIds } = question.payload;
  const isSolved = Boolean(slotState?.solved);
  const [steps, setSteps] = useState(() => shuffledSteps);
  const [dragIdx, setDragIdx] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const moveStep = (fromIdx, toIdx) => {
    if (isSolved || toIdx < 0 || toIdx >= steps.length) return;
    setFeedback(null);
    setSteps((prev) => {
      const next = [...prev];
      const [moved] = next.splice(fromIdx, 1);
      next.splice(toIdx, 0, moved);
      return next;
    });
  };

  const handleSubmit = () => {
    if (isSolved) return;
    const isCorrect = steps.every((s, idx) => s.id === correctOrderIds[idx]);
    if (isCorrect) {
      setFeedback(null);
      onOutcome({ isCorrect: true });
    } else {
      setFeedback(true);
      onOutcome({ isCorrect: false });
    }
  };

  return (
    <div className="glass-card glass-card-glow" style={{ padding: '24px', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '12px' }}>
        <span className="badge badge-cyan">QUESTION 0{slotNumber} // ARRANGE THE PROCESS</span>
        <span className="badge badge-cyan">
          <ListOrdered size={13} /> DRAG OR REORDER
        </span>
      </div>

      <p style={{ color: '#ffffff', marginBottom: '16px', fontSize: '1rem', fontWeight: 500 }}>{prompt}</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '18px' }}>
        {steps.map((step, idx) => (
          <div
            key={step.id}
            draggable={!isSolved}
            onDragStart={() => setDragIdx(idx)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => {
              if (dragIdx !== null && dragIdx !== idx) {
                moveStep(dragIdx, idx);
                setDragIdx(null);
              }
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '10px',
              padding: '12px 14px',
              borderRadius: '12px',
              background: '#000000',
              border: '1.5px solid rgba(255,255,255,0.42)',
              cursor: isSolved ? 'default' : 'grab',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span className="font-mono" style={{ fontWeight: 800, color: '#ffffff', minWidth: '26px' }}>
                {idx + 1}.
              </span>
              <span style={{ color: '#ffffff', fontSize: '0.94rem' }}>{step.label}</span>
            </div>

            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                type="button"
                className="btn btn-secondary"
                disabled={isSolved || idx === 0}
                onClick={() => moveStep(idx, idx - 1)}
                aria-label={`Move step ${idx + 1} up`}
                style={{ minHeight: '34px', padding: '4px 8px' }}
              >
                <ArrowUp size={14} />
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                disabled={isSolved || idx === steps.length - 1}
                onClick={() => moveStep(idx, idx + 1)}
                aria-label={`Move step ${idx + 1} down`}
                style={{ minHeight: '34px', padding: '4px 8px' }}
              >
                <ArrowDown size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <button type="button" className="btn btn-primary" disabled={isSolved} onClick={handleSubmit}>
        <Check size={16} /> Verify Sequence
      </button>

      <GameResultBanner solved={isSolved} feedback={feedback} />
    </div>
  );
}
