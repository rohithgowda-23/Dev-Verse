import { AlertOctagon, LogOut, CheckCircle2, XCircle } from 'lucide-react';

export default function TimeExpiredScreen({ team, onLogout }) {
  const solvedCount = [0, 1, 2, 3].filter((slot) => team.progress?.questionStates?.[slot]?.solved).length;

  return (
    <div
      className="glass-card"
      style={{
        maxWidth: '640px',
        margin: '32px auto',
        padding: '32px 24px',
        textAlign: 'center',
        borderColor: 'rgba(255, 255, 255, 0.35)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '14px', color: '#ffffff' }}>
        <AlertOctagon size={48} />
      </div>
      <h1 className="font-display" style={{ margin: '0 0 8px', color: '#ffffff', fontSize: '1.8rem' }}>
        TIME EXPIRED — SESSION LOCKED
      </h1>
      <p style={{ color: '#a3a3a3', marginBottom: '24px' }}>
        The investigation countdown for <strong style={{ color: '#ffffff' }}>{team.teamName}</strong> has reached 00:00. Your final recorded status is locked below.
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '10px',
          marginBottom: '24px',
        }}
      >
        {[0, 1, 2, 3].map((slot) => {
          const solved = Boolean(team.progress?.questionStates?.[slot]?.solved);
          return (
            <div
              key={slot}
              style={{
                padding: '14px 8px',
                borderRadius: '12px',
                background: solved ? 'rgba(255, 255, 255, 0.14)' : '#000000',
                border: `1px solid ${solved ? '#ffffff' : 'rgba(255, 255, 255, 0.2)'}`,
              }}
            >
              <div style={{ fontSize: '0.75rem', color: '#a3a3a3', marginBottom: '6px' }}>Q{slot + 1}</div>
              <div style={{ color: solved ? '#ffffff' : '#737373', display: 'flex', justifyContent: 'center' }}>
                {solved ? <CheckCircle2 size={22} /> : <XCircle size={22} />}
              </div>
            </div>
          );
        })}
      </div>

      <p style={{ color: '#a3a3a3', fontSize: '0.95rem', marginBottom: '24px' }}>
        Final Questions Completed: <strong style={{ color: '#ffffff' }}>{solvedCount} / 4</strong>
      </p>

      <button type="button" className="btn btn-secondary" onClick={onLogout}>
        <LogOut size={16} /> Return to Login
      </button>
    </div>
  );
}
