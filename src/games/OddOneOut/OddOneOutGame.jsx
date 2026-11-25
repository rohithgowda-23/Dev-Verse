import { useState } from 'react';
import { SearchCheck } from 'lucide-react';
import GameResultBanner from '../../components/GameResultBanner';

export default function OddOneOutGame({
  question,
  slotNumber,
  slotState,
  onOutcome,
}) {
  const { prompt, items, correctItemId } = question.payload;
  const isSolved = Boolean(slotState?.solved);
  const [selectedId, setSelectedId] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const handleSubmit = () => {
    if (isSolved || !selectedId) return;
    if (selectedId === correctItemId) {
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
        <span className="badge badge-cyan">QUESTION 0{slotNumber} // ODD ONE OUT</span>
      </div>

      <p style={{ color: '#e5e5e5', marginBottom: '20px', fontSize: '0.98rem' }}>{prompt}</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(185px, 1fr))', gap: '12px', marginBottom: '22px' }}>
        {items.map((item) => {
          const active = selectedId === item.id;
          return (
            <button
              key={item.id}
              type="button"
              disabled={isSolved}
              onClick={() => {
                setSelectedId(item.id);
                setFeedback(null);
              }}
              style={{
                padding: '16px',
                borderRadius: '14px',
                textAlign: 'left',
                cursor: isSolved ? 'default' : 'pointer',
                background: active ? '#ffffff' : '#000000',
                border: `1.5px solid ${active ? '#ffffff' : 'rgba(255, 255, 255, 0.2)'}`,
                color: active ? '#050505' : '#ffffff',
              }}
            >
              <div style={{ fontWeight: 700, fontSize: '1.02rem', marginBottom: '4px' }}>{item.label}</div>
              <div style={{ fontSize: '0.84rem', color: active ? '#404040' : '#a3a3a3' }}>{item.detail}</div>
            </button>
          );
        })}
      </div>

      <button type="button" className="btn btn-primary" disabled={isSolved || !selectedId} onClick={handleSubmit}>
        <SearchCheck size={16} /> Verify Selection
      </button>

      <GameResultBanner solved={isSolved} feedback={feedback} />
    </div>
  );
}
