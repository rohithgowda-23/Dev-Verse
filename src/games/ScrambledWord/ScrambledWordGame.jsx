import { useState } from 'react';
import { RotateCcw, Check } from 'lucide-react';
import GameResultBanner from '../../components/GameResultBanner';

export default function ScrambledWordGame({
  question,
  slotNumber,
  slotState,
  onOutcome,
}) {
  const { scrambledLetters, answer, hint } = question.payload;
  const [pool, setPool] = useState(() =>
    scrambledLetters.map((char, idx) => ({ id: idx, char }))
  );
  const [slots, setSlots] = useState(() => Array(answer.length).fill(null));
  const [feedback, setFeedback] = useState(null);
  const [dragItem, setDragItem] = useState(null);

  const isSolved = Boolean(slotState?.solved);

  const placeLetter = (letterObj, targetIndex = null) => {
    if (isSolved) return;
    setFeedback(null);
    const idx =
      targetIndex !== null
        ? targetIndex
        : slots.findIndex((s) => s === null);
    if (idx === -1) return;

    setSlots((prev) => {
      const next = [...prev];
      const existing = next[idx];
      next[idx] = letterObj;
      if (existing) {
        setPool((p) => [...p, existing]);
      }
      return next;
    });
    setPool((prev) => prev.filter((item) => item.id !== letterObj.id));
  };

  const removeSlotLetter = (slotIndex) => {
    if (isSolved) return;
    const item = slots[slotIndex];
    if (!item) return;
    setFeedback(null);
    setSlots((prev) => prev.map((s, i) => (i === slotIndex ? null : s)));
    setPool((prev) => [...prev, item]);
  };

  const handleReset = () => {
    if (isSolved) return;
    setPool(scrambledLetters.map((char, idx) => ({ id: idx, char })));
    setSlots(Array(answer.length).fill(null));
    setFeedback(null);
  };

  const handleSubmit = () => {
    if (isSolved) return;
    if (slots.some((s) => s === null)) {
      setFeedback(true);
      return;
    }
    const word = slots.map((s) => s.char).join('').toUpperCase();
    if (word === answer.toUpperCase()) {
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
        <span className="badge badge-cyan">QUESTION 0{slotNumber} // SCRAMBLED WORD</span>
        <span style={{ fontSize: '0.84rem', color: '#a3a3a3' }}>Tap or drag letters into slots</span>
      </div>

      <p style={{ color: '#d4d4d4', marginBottom: '18px', fontSize: '0.95rem' }}>
        <strong style={{ color: '#ffffff' }}>Clue:</strong> {hint}
      </p>

      {/* Answer Slots */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '10px',
          marginBottom: '22px',
          padding: '16px',
          borderRadius: '12px',
          background: '#000000',
          border: '1px solid rgba(255, 255, 255, 0.16)',
        }}
      >
        {slots.map((item, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => removeSlotLetter(idx)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => {
              if (dragItem) {
                placeLetter(dragItem, idx);
                setDragItem(null);
              }
            }}
            className="font-display"
            style={{
              width: '48px',
              height: '54px',
              borderRadius: '10px',
              border: `2px dashed ${item ? '#ffffff' : 'rgba(255, 255, 255, 0.25)'}`,
              background: item ? 'rgba(255, 255, 255, 0.14)' : '#000000',
              color: '#ffffff',
              fontSize: '1.35rem',
              fontWeight: 800,
              cursor: item && !isSolved ? 'pointer' : 'default',
            }}
          >
            {item ? item.char : ''}
          </button>
        ))}
      </div>

      {/* Letter Pool */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px', marginBottom: '22px', minHeight: '56px' }}>
        {pool.map((item) => (
          <button
            key={item.id}
            type="button"
            draggable={!isSolved}
            onDragStart={() => setDragItem(item)}
            onClick={() => placeLetter(item)}
            className="font-display"
            style={{
              width: '48px',
              height: '52px',
              borderRadius: '10px',
              border: '1px solid rgba(255, 255, 255, 0.35)',
              background: 'linear-gradient(135deg, #0a0a0a, #000000)',
              color: '#ffffff',
              fontSize: '1.25rem',
              fontWeight: 700,
              cursor: isSolved ? 'default' : 'grab',
            }}
          >
            {item.char}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
        <button type="button" className="btn btn-secondary" onClick={handleReset} disabled={isSolved}>
          <RotateCcw size={16} /> Reset Letters
        </button>
        <button type="button" className="btn btn-primary" onClick={handleSubmit} disabled={isSolved}>
          <Check size={16} /> Submit Word
        </button>
      </div>

      <GameResultBanner solved={isSolved} feedback={feedback} />
    </div>
  );
}
