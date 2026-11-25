import { useState } from 'react';
import { Cpu, RotateCcw, CheckCircle2 } from 'lucide-react';
import GameResultBanner from '../../components/GameResultBanner';
import HardwareIcon from './HardwareIcon';

const DEFAULT_SLOTS = [
  { id: 'mobo', label: 'ATX BOARD TRAY', x: '6%', y: '7%', w: '88%', h: '12%' },
  { id: 'cpu', label: 'SOCKET LGA', x: '6%', y: '23%', w: '42%', h: '18%' },
  { id: 'ram', label: 'DIMM BANK', x: '52%', y: '23%', w: '42%', h: '18%' },
  { id: 'cooler', label: 'THERMAL MOUNT', x: '6%', y: '45%', w: '42%', h: '16%' },
  { id: 'ssd', label: 'M.2 NVMe BAY', x: '52%', y: '45%', w: '42%', h: '16%' },
  { id: 'gpu', label: 'PCIe x16 LANE', x: '6%', y: '65%', w: '88%', h: '13%' },
  { id: 'psu', label: 'ATX POWER BAY', x: '6%', y: '82%', w: '54%', h: '13%' },
];

export default function ComputerAssemblyGame({
  question,
  slotNumber,
  slotState,
  onOutcome,
}) {
  const {
    components,
    slots = DEFAULT_SLOTS,
    blueprintTitle = 'ATX CHASSIS BLUEPRINT',
    instructionText = 'Drag a component from the left tray onto its matching chassis position on the right—or tap a component, then tap the target slot.',
  } = question.payload;
  const isSolved = Boolean(slotState?.solved);

  // Every assembly question starts with ALL components unassigned
  const [placed, setPlaced] = useState(() => {
    if (isSolved) {
      const map = {};
      slots.forEach((s) => {
        map[s.id] = s.id;
      });
      return map;
    }
    return {};
  });
  const [selectedCompId, setSelectedCompId] = useState(null);
  const [dragCompId, setDragCompId] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const placedIds = Object.values(placed);
  const remainingComponents = components.filter((c) => !placedIds.includes(c.id));

  const tryPlace = (slotId, compId) => {
    if (isSolved || !compId || placed[slotId]) return;
    if (slotId === compId) {
      const nextPlaced = { ...placed, [slotId]: compId };
      setPlaced(nextPlaced);
      setSelectedCompId(null);
      setFeedback(null);
      if (Object.keys(nextPlaced).length === slots.length) {
        onOutcome({ isCorrect: true });
      }
    } else {
      setFeedback(true);
      setSelectedCompId(null);
      onOutcome({ isCorrect: false });
    }
  };

  // Reset completely clears every placement, selection, and temporary feedback
  const handleReset = () => {
    if (isSolved) return;
    setPlaced({});
    setSelectedCompId(null);
    setDragCompId(null);
    setFeedback(null);
  };

  return (
    <div className="glass-card glass-card-glow" style={{ padding: '24px', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '12px' }}>
        <span className="badge badge-cyan">QUESTION 0{slotNumber} // COMPUTER ASSEMBLY</span>
        <span className="badge badge-cyan">
          <Cpu size={14} /> {Object.keys(placed).length} / {slots.length} Installed
        </span>
      </div>

      <p style={{ color: '#d4d4d4', marginBottom: '18px', fontSize: '0.96rem' }}>
        {instructionText}
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px', alignItems: 'start' }}>
        {/* LEFT PANEL */}
        <div
          style={{
            padding: '16px',
            borderRadius: '14px',
            background: '#000000',
            border: '1.5px solid rgba(255, 255, 255, 0.35)',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#ffffff' }}>HARDWARE TRAY</span>
            <button
              type="button"
              className="btn btn-secondary"
              style={{ minHeight: '32px', padding: '4px 10px', fontSize: '0.78rem' }}
              onClick={handleReset}
              disabled={isSolved}
            >
              <RotateCcw size={13} /> Reset
            </button>
          </div>

          {remainingComponents.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', color: '#ffffff', fontSize: '0.92rem' }}>
              All required hardware components installed.
            </div>
          ) : (
            remainingComponents.map((comp) => {
              const active = selectedCompId === comp.id;
              return (
                <button
                  key={comp.id}
                  type="button"
                  draggable={!isSolved}
                  onDragStart={() => setDragCompId(comp.id)}
                  onClick={() => {
                    setSelectedCompId(active ? null : comp.id);
                    setFeedback(null);
                  }}
                  style={{
                    padding: '10px 12px',
                    borderRadius: '12px',
                    textAlign: 'left',
                    cursor: isSolved ? 'default' : 'grab',
                    background: active ? '#ffffff' : 'linear-gradient(135deg, #0a0a0a, #000000)',
                    border: `1.5px solid ${active ? '#ffffff' : 'rgba(255, 255, 255, 0.4)'}`,
                    boxShadow: '0 6px 14px rgba(0,0,0,0.45)',
                    color: active ? '#000000' : '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                  }}
                >
                  <HardwareIcon id={comp.iconId || comp.id} dark={active} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{comp.name}</div>
                    <div style={{ fontSize: '0.76rem', color: active ? '#404040' : '#a3a3a3' }}>{comp.short}</div>
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* RIGHT PANEL */}
        <div
          style={{
            padding: '16px',
            borderRadius: '16px',
            background: '#000000',
            border: '2px solid rgba(255, 255, 255, 0.45)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#ffffff', fontFamily: 'var(--font-mono)' }}>
              {blueprintTitle}
            </span>
            <span style={{ fontSize: '0.74rem', color: '#a3a3a3', fontFamily: 'var(--font-mono)' }}>
              {slots.length} SLOTS
            </span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(145px, 1fr))',
              gap: '10px',
            }}
          >
            {slots.map((slot) => {
              const isFilled = Boolean(placed[slot.id]);
              const comp = components.find((c) => c.id === slot.id);

              return (
                <button
                  key={slot.id}
                  type="button"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => {
                    if (dragCompId) {
                      tryPlace(slot.id, dragCompId);
                      setDragCompId(null);
                    }
                  }}
                  onClick={() => {
                    if (selectedCompId) {
                      tryPlace(slot.id, selectedCompId);
                    }
                  }}
                  style={{
                    minHeight: '72px',
                    borderRadius: '10px',
                    border: `1.5px ${isFilled ? 'solid #ffffff' : 'dashed rgba(255, 255, 255, 0.5)'}`,
                    background: isFilled
                      ? '#ffffff'
                      : selectedCompId
                      ? 'rgba(255, 255, 255, 0.1)'
                      : '#000000',
                    color: isFilled ? '#000000' : '#d4d4d4',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: isFilled || isSolved ? 'default' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    gap: '6px',
                    padding: '8px 10px',
                  }}
                >
                  {isFilled ? (
                    <>
                      <CheckCircle2 size={15} /> {comp?.name || slot.label}
                    </>
                  ) : (
                    slot.label
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <GameResultBanner solved={isSolved} feedback={feedback} />
    </div>
  );
}
