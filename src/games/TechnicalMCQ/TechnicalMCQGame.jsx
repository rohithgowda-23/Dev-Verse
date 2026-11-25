import { useState } from 'react';
import { Check } from 'lucide-react';
import GameResultBanner from '../../components/GameResultBanner';

export default function TechnicalMCQGame({
  question,
  slotNumber,
  slotState,
  onOutcome,
}) {
  const { question: prompt, options, correctOptionId } = question.payload;
  const isSolved = Boolean(slotState?.solved);
  const [selectedId, setSelectedId] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const handleSubmit = () => {
    if (isSolved || !selectedId) return;
    if (selectedId === correctOptionId) {
      setFeedback(null);
      onOutcome({ isCorrect: true });
    } else {
      setFeedback(true);
      onOutcome({ isCorrect: false });
    }
  };

  return (
    <div className="glass-card glass-card-glow" style={{ padding: '24px', width: '100%' }}>
      <div style={{ marginBottom: '12px' }}>
        <span className="badge badge-cyan">QUESTION 0{slotNumber} // TECHNICAL MCQ</span>
      </div>

      <p style={{ fontSize: '1.05rem', color: '#ffffff', marginBottom: '20px', fontWeight: 500 }}>{prompt}</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
        {options.map((opt) => {
          const active = selectedId === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              disabled={isSolved}
              onClick={() => {
                setSelectedId(opt.id);
                setFeedback(null);
              }}
              style={{
                minHeight: '50px',
                padding: '12px 16px',
                borderRadius: '12px',
                textAlign: 'left',
                cursor: isSolved ? 'default' : 'pointer',
                background: active ? '#ffffff' : '#000000',
                border: `1.5px solid ${active ? '#ffffff' : 'rgba(255, 255, 255, 0.2)'}`,
                color: active ? '#050505' : '#ffffff',
                fontSize: '0.96rem',
                fontWeight: active ? 700 : 400,
              }}
            >
              <strong style={{ marginRight: '10px' }}>{opt.id.toUpperCase()}.</strong>
              {opt.label}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        className="btn btn-primary"
        disabled={isSolved || !selectedId}
        onClick={handleSubmit}
      >
        <Check size={16} /> Submit Answer
      </button>

      <GameResultBanner solved={isSolved} feedback={feedback} />
    </div>
  );
}
