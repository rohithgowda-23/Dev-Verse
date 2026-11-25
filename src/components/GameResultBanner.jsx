import { CheckCircle2, XCircle } from 'lucide-react';

export default function GameResultBanner({ solved, feedback }) {
  if (!solved && !feedback) return null;

  return (
    <div
      style={{
        marginTop: '20px',
        padding: '15px 18px',
        borderRadius: '12px',
        background: solved ? 'rgba(255, 255, 255, 0.12)' : '#000000',
        border: `1px solid ${solved ? 'rgba(255, 255, 255, 0.6)' : 'rgba(255, 255, 255, 0.25)'}`,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: '12px',
      }}
    >
      {solved ? (
        <CheckCircle2 size={22} color="#ffffff" />
      ) : (
        <XCircle size={22} color="#a3a3a3" />
      )}
      <div>
        <div style={{ fontWeight: 700, color: '#ffffff' }}>
          {solved ? 'Correct! Stage completed.' : 'Incorrect answer. Try again.'}
        </div>
        <div style={{ fontSize: '0.86rem', color: '#a3a3a3' }}>
          {solved
            ? 'Encrypted destination letters remain hidden until all four questions are submitted.'
            : 'Review the briefing and clues above before submitting again.'}
        </div>
      </div>
    </div>
  );
}
