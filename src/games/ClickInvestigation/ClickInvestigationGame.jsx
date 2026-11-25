import { useState } from 'react';
import { Eye, ShieldAlert } from 'lucide-react';
import GameResultBanner from '../../components/GameResultBanner';

export default function ClickInvestigationGame({
  question,
  slotNumber,
  slotState,
  onOutcome,
}) {
  const { sceneTitle } = question.payload;
  const objects = question.payload.objects || question.payload.targets || [];
  const isSolved = Boolean(slotState?.solved);

  const [inspectedId, setInspectedId] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const selectedObj = objects.find((o) => o.id === inspectedId) || null;

  const handleFlagEvidence = () => {
    if (isSolved || !selectedObj) return;
    if (selectedObj.isSuspicious) {
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
        <span className="badge badge-cyan">QUESTION 0{slotNumber} // SCENE INSPECTION</span>
        <span style={{ fontSize: '0.84rem', color: '#a3a3a3' }}>{sceneTitle}</span>
      </div>

      <p style={{ color: '#a3a3a3', marginBottom: '16px', fontSize: '0.94rem' }}>
        Tap the subtle markers on the workstation scene to inspect each object, then flag the suspicious hardware.
      </p>

      {/* Monochrome SVG Cyber-Lab Desk Scene */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '16 / 9',
          minHeight: '260px',
          borderRadius: '14px',
          overflow: 'hidden',
          border: '1px solid rgba(255, 255, 255, 0.24)',
          background: '#000000',
          marginBottom: '18px',
        }}
      >
        <svg viewBox="0 0 800 450" style={{ width: '100%', height: '100%', display: 'block' }}>
          <rect x="0" y="0" width="800" height="310" fill="#0a0a0a" />
          <polygon points="40,310 760,310 800,450 0,450" fill="#171717" stroke="#333333" strokeWidth="2" />
          {/* Monitor */}
          <rect x="275" y="75" width="230" height="145" rx="8" fill="#050505" stroke="#a3a3a3" strokeWidth="2.5" />
          <rect x="288" y="88" width="204" height="118" fill="#141414" />
          <line x1="305" y1="115" x2="430" y2="115" stroke="#ffffff" strokeWidth="3" />
          <line x1="305" y1="135" x2="465" y2="135" stroke="#a3a3a3" strokeWidth="2" opacity="0.7" />
          <line x1="305" y1="155" x2="395" y2="155" stroke="#737373" strokeWidth="2" opacity="0.7" />
          <rect x="372" y="220" width="36" height="45" fill="#262626" />
          <rect x="338" y="265" width="104" height="10" rx="4" fill="#404040" />

          {/* Keyboard */}
          <polygon points="270,295 490,295 510,335 250,335" fill="#262626" stroke="#525252" strokeWidth="2" />

          {/* Coffee Mug */}
          <rect x="135" y="268" width="44" height="52" rx="6" fill="#262626" stroke="#737373" strokeWidth="2" />
          <path d="M179,280 Q196,280 196,294 Q196,308 179,308" fill="none" stroke="#737373" strokeWidth="4" />

          {/* Lab Patch Switch */}
          <rect x="575" y="105" width="130" height="54" rx="6" fill="#141414" stroke="#737373" strokeWidth="2" />
          <circle cx="595" cy="132" r="4" fill="#ffffff" />
          <circle cx="612" cy="132" r="4" fill="#d4d4d4" />
          <circle cx="629" cy="132" r="4" fill="#a3a3a3" />

          {/* PC Tower + Uniform Monochrome USB Dongle */}
          <rect x="560" y="215" width="95" height="145" rx="6" fill="#141414" stroke="#525252" strokeWidth="2" />
          <rect x="578" y="242" width="28" height="12" rx="2" fill="#d4d4d4" />
          <line x1="606" y1="248" x2="645" y2="262" stroke="#a3a3a3" strokeWidth="2" strokeDasharray="4 2" />
        </svg>

        {objects.map((obj) => {
          const active = inspectedId === obj.id;
          return (
            <button
              key={obj.id}
              type="button"
              title={obj.name}
              onClick={() => {
                setInspectedId(obj.id);
                setFeedback(null);
              }}
              aria-label={`Inspect ${obj.name}`}
              style={{
                position: 'absolute',
                left: `${obj.x}%`,
                top: `${obj.y}%`,
                transform: 'translate(-50%, -50%)',
                width: '38px',
                height: '38px',
                borderRadius: '999px',
                border: `2px solid ${active ? '#ffffff' : 'rgba(255, 255, 255, 0.55)'}`,
                background: active ? '#ffffff' : '#000000',
                color: active ? '#050505' : '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <Eye size={16} />
            </button>
          );
        })}
      </div>

      <div
        style={{
          padding: '16px',
          borderRadius: '12px',
          background: '#000000',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <div style={{ flex: 1, minWidth: '220px' }}>
          <div style={{ fontWeight: 700, color: '#ffffff', marginBottom: '4px' }}>
            {selectedObj ? selectedObj.name : 'Select a marker above to inspect'}
          </div>
          <div style={{ fontSize: '0.9rem', color: '#a3a3a3' }}>
            {selectedObj
              ? selectedObj.description
              : 'Examine all five workstation items carefully before flagging the threat.'}
          </div>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          disabled={isSolved || !selectedObj}
          onClick={handleFlagEvidence}
        >
          <ShieldAlert size={16} /> Flag as Suspicious Evidence
        </button>
      </div>

      <GameResultBanner solved={isSolved} feedback={feedback} />
    </div>
  );
}
