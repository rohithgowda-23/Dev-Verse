import { useState } from 'react';
import { Shield, Key, Cpu, Wifi, Lock, Bug, Globe, Terminal, HardDrive, Code, Sparkles } from 'lucide-react';
import GameResultBanner from '../../components/GameResultBanner';

const ICON_MAP = {
  shield: Shield,
  key: Key,
  cpu: Cpu,
  wifi: Wifi,
  lock: Lock,
  bug: Bug,
  globe: Globe,
  terminal: Terminal,
  drive: HardDrive,
  code: Code,
};

function buildShuffledDeck(cards) {
  const expanded = [];
  cards.forEach((c, idx) => {
    const faceA = c.frontA || c.label;
    const faceB = c.frontB || c.label;
    expanded.push({ uid: idx * 2, key: c.key, text: faceA, icon: c.icon || c.key });
    expanded.push({ uid: idx * 2 + 1, key: c.key, text: faceB, icon: c.icon || c.key });
  });
  for (let i = expanded.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [expanded[i], expanded[j]] = [expanded[j], expanded[i]];
  }
  return expanded;
}

export default function MemoryGame({
  question,
  slotNumber,
  slotState,
  onOutcome,
}) {
  const { cards, themeLabel = 'Memory Protocol' } = question.payload;
  const isSolved = Boolean(slotState?.solved);

  const [deck] = useState(() => buildShuffledDeck(cards));
  const [flipped, setFlipped] = useState([]);
  const [matchedKeys, setMatchedKeys] = useState(() =>
    isSolved ? cards.map((c) => c.key) : []
  );
  const [moves, setMoves] = useState(0);
  const [busy, setBusy] = useState(false);

  const handleCardClick = (uid) => {
    if (isSolved || busy || flipped.length >= 2) return;
    const card = deck.find((c) => c.uid === uid);
    if (!card || matchedKeys.includes(card.key) || flipped.includes(uid)) return;

    const nextFlipped = [...flipped, uid];
    setFlipped(nextFlipped);

    if (nextFlipped.length === 2) {
      setMoves((m) => m + 1);
      const first = deck.find((c) => c.uid === nextFlipped[0]);
      const second = deck.find((c) => c.uid === nextFlipped[1]);

      if (first.key === second.key) {
        const nextMatched = [...matchedKeys, first.key];
        setMatchedKeys(nextMatched);
        setFlipped([]);
        if (nextMatched.length === cards.length) {
          onOutcome({ isCorrect: true });
        }
      } else {
        setBusy(true);
        window.setTimeout(() => {
          setFlipped([]);
          setBusy(false);
        }, 720);
      }
    }
  };

  const remainingPairs = cards.length - matchedKeys.length;

  return (
    <div className="glass-card glass-card-glow" style={{ padding: '24px', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '12px' }}>
        <span className="badge badge-cyan">QUESTION 0{slotNumber} // MEMORY MATCHING</span>
        <span className="badge badge-cyan">
          <Sparkles size={14} /> Matched: {matchedKeys.length}/{cards.length} • Remaining: {remainingPairs} • Moves: {moves}
        </span>
      </div>

      <p style={{ color: '#d4d4d4', marginBottom: '18px', fontSize: '0.96rem' }}>
        <strong style={{ color: '#ffffff' }}>{themeLabel}:</strong> Flip two cards at a time to match all {cards.length} pairs.
      </p>

      {/* Mandatory 4 cards per row × 5 rows = 20 cards layout (scrolls horizontally on narrow screens) */}
      <div style={{ overflowX: 'auto', paddingBottom: '6px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, minmax(110px, 1fr))',
            gap: '12px',
            minWidth: '476px',
            maxWidth: '640px',
            margin: '0 auto',
          }}
        >
        {deck.map((card) => {
          const isOpen = isSolved || matchedKeys.includes(card.key) || flipped.includes(card.uid);
          const isMatch = isSolved || matchedKeys.includes(card.key);
          const IconComp = ICON_MAP[card.icon] || Shield;

          return (
            <button
              key={card.uid}
              type="button"
              disabled={isOpen}
              onClick={() => handleCardClick(card.uid)}
              className="perspective-1000"
              style={{
                height: '112px',
                background: 'transparent',
                border: 'none',
                padding: 0,
                cursor: isOpen ? 'default' : 'pointer',
              }}
            >
              <div
                className={`preserve-3d ${isOpen ? 'rotate-y-180' : ''}`}
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                  transition: 'transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)',
                }}
              >
                <div
                  className="backface-hidden font-display"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '14px',
                    background: '#000000',
                    border: '1.5px solid rgba(255, 255, 255, 0.42)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    fontSize: '1.25rem',
                    fontWeight: 800,
                  }}
                >
                  ?
                </div>

                <div
                  className="backface-hidden rotate-y-180"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '14px',
                    background: isMatch ? '#ffffff' : 'rgba(255, 255, 255, 0.16)',
                    border: '2px solid #ffffff',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    color: isMatch ? '#000000' : '#ffffff',
                    padding: '8px',
                    textAlign: 'center',
                  }}
                >
                  <IconComp size={22} />
                  <span style={{ fontSize: '0.73rem', fontWeight: 700, lineHeight: 1.2 }}>{card.text}</span>
                </div>
              </div>
            </button>
          );
        })}
        </div>
      </div>

      <GameResultBanner solved={isSolved} feedback={null} />
    </div>
  );
}
