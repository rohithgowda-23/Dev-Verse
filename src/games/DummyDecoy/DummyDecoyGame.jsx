import { useState } from 'react';
import { FileWarning, ShieldAlert } from 'lucide-react';
import GameResultBanner from '../../components/GameResultBanner';

export default function DummyDecoyGame({
  question,
  slotNumber,
  slotState,
  onOutcome,
}) {
  const { prompt, evidenceCards, decoyId } = question.payload;
  const isSolved = Boolean(slotState?.solved);
  const [inspectedId, setInspectedId] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const selectedCard = evidenceCards.find((c) => c.id === inspectedId) || null;

  const handleSubmit = () => {
    if (isSolved || !selectedCard) return;
    if (selectedCard.id === decoyId) {
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
        <span className="badge badge-cyan">QUESTION 0{slotNumber} // DUMMY / DECOY INVESTIGATION</span>
        <span className="badge badge-cyan">
          <FileWarning size={13} /> EVIDENCE AUDIT
        </span>
      </div>

      <p style={{ color: '#ffffff', marginBottom: '16px', fontSize: '1rem', fontWeight: 500 }}>{prompt}</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '10px', marginBottom: '16px' }}>
        {evidenceCards.map((card) => {
          const active = inspectedId === card.id;
          return (
            <button
              key={card.id}
              type="button"
              disabled={isSolved}
              onClick={() => {
                setInspectedId(card.id);
                setFeedback(null);
              }}
              style={{
                padding: '13px 14px',
                borderRadius: '12px',
                textAlign: 'left',
                cursor: isSolved ? 'default' : 'pointer',
                background: active ? '#ffffff' : '#000000',
                border: `1.5px solid ${active ? '#ffffff' : 'rgba(255,255,255,0.42)'}`,
                color: active ? '#000000' : '#ffffff',
              }}
            >
              <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>{card.title}</div>
              <div className="font-mono" style={{ fontSize: '0.78rem', color: active ? '#262626' : '#a3a3a3', marginTop: '4px' }}>
                {card.summary}
              </div>
            </button>
          );
        })}
      </div>

      {/* Inspection Readout */}
      <div
        style={{
          padding: '14px 16px',
          borderRadius: '12px',
          background: '#000000',
          border: '1.5px solid rgba(255,255,255,0.35)',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <div style={{ flex: 1, minWidth: '220px' }}>
          <div style={{ fontWeight: 700, color: '#ffffff', marginBottom: '4px' }}>
            {selectedCard ? selectedCard.title : 'Select an evidence card above to inspect details'}
          </div>
          <div className="font-mono" style={{ fontSize: '0.84rem', color: '#d4d4d4' }}>
            {selectedCard
              ? selectedCard.detail
              : 'Compare timestamps, addresses, and technical metadata to spot the planted decoy.'}
          </div>
        </div>

        <button type="button" className="btn btn-primary" disabled={isSolved || !selectedCard} onClick={handleSubmit}>
          <ShieldAlert size={16} /> Flag as Dummy / Decoy
        </button>
      </div>

      <GameResultBanner solved={isSolved} feedback={feedback} />
    </div>
  );
}
