import { useState, useMemo } from 'react';
import { Link2 } from 'lucide-react';
import GameResultBanner from '../../components/GameResultBanner';

export default function PairMatchingGame({
  question,
  slotNumber,
  slotState,
  onOutcome,
}) {
  const { pairs } = question.payload;
  const isSolved = Boolean(slotState?.solved);

  const shuffledDescriptions = useMemo(() => {
    const list = pairs.map((p) => ({ id: p.id, text: p.match }));
    return [...list].sort((a, b) => a.text.localeCompare(b.text));
  }, [pairs]);

  const [selectedLeft, setSelectedLeft] = useState(null);
  const [matchedIds, setMatchedIds] = useState(() => (isSolved ? pairs.map((p) => p.id) : []));
  const [feedback, setFeedback] = useState(null);

  const handleRightClick = (rightId) => {
    if (isSolved || matchedIds.includes(rightId) || !selectedLeft) return;

    if (selectedLeft === rightId) {
      const nextMatched = [...matchedIds, rightId];
      setMatchedIds(nextMatched);
      setSelectedLeft(null);
      setFeedback(null);
      if (nextMatched.length === pairs.length) {
        onOutcome({ isCorrect: true });
      }
    } else {
      setFeedback(true);
      setSelectedLeft(null);
      onOutcome({ isCorrect: false });
    }
  };

  return (
    <div className="glass-card glass-card-glow" style={{ padding: '24px', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '12px' }}>
        <span className="badge badge-cyan">QUESTION 0{slotNumber} // PAIR MATCHING</span>
        <span className="badge badge-cyan">
          <Link2 size={14} /> {matchedIds.length} / {pairs.length} Linked
        </span>
      </div>

      <p style={{ color: '#a3a3a3', marginBottom: '20px', fontSize: '0.94rem' }}>
        Tap a technical term on the left, then tap its matching description on the right.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#ffffff', letterSpacing: '0.06em' }}>TERMS</div>
          {pairs.map((p) => {
            const matched = matchedIds.includes(p.id);
            const active = selectedLeft === p.id;
            return (
              <button
                key={p.id}
                type="button"
                disabled={matched || isSolved}
                onClick={() => {
                  setSelectedLeft(p.id);
                  setFeedback(null);
                }}
                style={{
                  minHeight: '54px',
                  padding: '12px 14px',
                  borderRadius: '12px',
                  textAlign: 'left',
                  cursor: matched || isSolved ? 'default' : 'pointer',
                  background: matched
                    ? '#ffffff'
                    : active
                    ? 'rgba(255, 255, 255, 0.2)'
                    : '#000000',
                  border: `1.5px solid ${
                    matched || active ? '#ffffff' : 'rgba(255, 255, 255, 0.2)'
                  }`,
                  color: matched ? '#050505' : '#ffffff',
                  fontWeight: 700,
                }}
              >
                {p.term}
              </button>
            );
          })}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#d4d4d4', letterSpacing: '0.06em' }}>DESCRIPTIONS</div>
          {shuffledDescriptions.map((item) => {
            const matched = matchedIds.includes(item.id);
            return (
              <button
                key={item.id}
                type="button"
                disabled={matched || isSolved}
                onClick={() => handleRightClick(item.id)}
                style={{
                  minHeight: '54px',
                  padding: '12px 14px',
                  borderRadius: '12px',
                  textAlign: 'left',
                  cursor: matched || isSolved ? 'default' : 'pointer',
                  background: matched ? '#ffffff' : '#000000',
                  border: `1.5px solid ${
                    matched
                      ? '#ffffff'
                      : selectedLeft
                      ? 'rgba(255, 255, 255, 0.45)'
                      : 'rgba(255, 255, 255, 0.18)'
                  }`,
                  color: matched ? '#050505' : '#e5e5e5',
                  fontSize: '0.9rem',
                }}
              >
                {item.text}
              </button>
            );
          })}
        </div>
      </div>

      <GameResultBanner solved={isSolved} feedback={feedback} />
    </div>
  );
}
