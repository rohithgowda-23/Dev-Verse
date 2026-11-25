import { useState } from 'react';
import { Network, RotateCcw, Send } from 'lucide-react';
import GameResultBanner from '../../components/GameResultBanner';

export default function PacketRoutingGame({
  question,
  slotNumber,
  slotState,
  onOutcome,
}) {
  const { prompt, nodes, validRoute } = question.payload;
  const isSolved = Boolean(slotState?.solved);
  const [route, setRoute] = useState([]);
  const [feedback, setFeedback] = useState(null);

  const toggleNode = (nodeId) => {
    if (isSolved) return;
    setFeedback(null);
    setRoute((prev) =>
      prev.includes(nodeId) ? prev.filter((id) => id !== nodeId) : [...prev, nodeId]
    );
  };

  const handleSubmit = () => {
    if (isSolved || route.length === 0) return;
    const isMatch =
      route.length === validRoute.length &&
      route.every((id, idx) => id === validRoute[idx]);
    if (isMatch) {
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
        <span className="badge badge-cyan">QUESTION 0{slotNumber} // PACKET ROUTING</span>
        <span className="badge badge-cyan">
          <Network size={13} /> {route.length} Nodes Selected
        </span>
      </div>

      <p style={{ color: '#ffffff', marginBottom: '16px', fontSize: '1rem', fontWeight: 500 }}>{prompt}</p>

      {/* Network Topology Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(175px, 1fr))', gap: '10px', marginBottom: '16px' }}>
        {nodes.map((node) => {
          const orderIdx = route.indexOf(node.id);
          const selected = orderIdx !== -1;
          return (
            <button
              key={node.id}
              type="button"
              disabled={isSolved}
              onClick={() => toggleNode(node.id)}
              style={{
                padding: '12px',
                borderRadius: '12px',
                textAlign: 'left',
                cursor: isSolved ? 'default' : 'pointer',
                background: selected ? '#ffffff' : '#000000',
                border: `1.5px solid ${selected ? '#ffffff' : 'rgba(255,255,255,0.42)'}`,
                color: selected ? '#000000' : '#ffffff',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ fontSize: '0.9rem' }}>{node.label}</strong>
                {selected && (
                  <span className="font-mono" style={{ fontSize: '0.75rem', fontWeight: 800 }}>
                    #{orderIdx + 1}
                  </span>
                )}
              </div>
              <div className="font-mono" style={{ fontSize: '0.76rem', color: selected ? '#262626' : '#a3a3a3', marginTop: '4px' }}>
                {node.info}
              </div>
            </button>
          );
        })}
      </div>

      {/* Current Route Display */}
      <div
        className="font-mono"
        style={{
          padding: '10px 14px',
          borderRadius: '10px',
          background: '#000000',
          border: '1.5px solid rgba(255,255,255,0.32)',
          fontSize: '0.84rem',
          color: '#d4d4d4',
          marginBottom: '16px',
        }}
      >
        Selected Path:{' '}
        <strong style={{ color: '#ffffff' }}>
          {route.length
            ? route.map((id) => nodes.find((n) => n.id === id)?.label || id).join(' → ')
            : 'Click nodes in order from Source to Destination'}
        </strong>
      </div>

      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button
          type="button"
          className="btn btn-secondary"
          disabled={isSolved}
          onClick={() => {
            setRoute([]);
            setFeedback(null);
          }}
        >
          <RotateCcw size={16} /> Clear Route
        </button>
        <button type="button" className="btn btn-primary" disabled={isSolved || route.length === 0} onClick={handleSubmit}>
          <Send size={16} /> Transmit Packet
        </button>
      </div>

      <GameResultBanner solved={isSolved} feedback={feedback} />
    </div>
  );
}
