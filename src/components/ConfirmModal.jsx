import { AlertTriangle } from 'lucide-react';

export default function ConfirmModal({ open, title, message, confirmLabel = 'Confirm', onConfirm, onCancel }) {
  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        background: 'rgba(2, 2, 2, 0.84)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
    >
      <div
        className="glass-card glass-card-glow"
        style={{
          maxWidth: '460px',
          width: '100%',
          padding: '24px',
          border: '2px solid rgba(255, 255, 255, 0.78)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#ffffff', marginBottom: '10px' }}>
          <AlertTriangle size={22} />
          <h3 className="font-display" style={{ margin: 0, fontSize: '1.15rem' }}>{title}</h3>
        </div>
        <p style={{ color: '#d4d4d4', fontSize: '0.96rem', marginBottom: '22px' }}>{message}</p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', flexWrap: 'wrap' }}>
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button type="button" className="btn btn-primary" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
