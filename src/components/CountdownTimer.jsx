import { useEffect, useState } from 'react';
import { Clock, AlertTriangle, PauseCircle } from 'lucide-react';
import { formatRemainingMs } from '../utils/time';

export default function CountdownTimer({ deadline, isStopped = false, frozenRemainingMs = null, onExpire }) {
  const [remainingMs, setRemainingMs] = useState(() =>
    deadline ? Math.max(0, deadline - Date.now()) : 0
  );

  useEffect(() => {
    if (isStopped || !deadline) return undefined;
    const tick = () => {
      const next = Math.max(0, deadline - Date.now());
      setRemainingMs(next);
      if (next <= 0 && onExpire) {
        onExpire();
      }
    };
    tick();
    const interval = window.setInterval(tick, 1000);
    return () => window.clearInterval(interval);
  }, [deadline, isStopped, onExpire]);

  const displayMs = isStopped && frozenRemainingMs !== null ? frozenRemainingMs : remainingMs;
  const isCritical = !isStopped && displayMs > 0 && displayMs <= 120000;
  const isExpired = !isStopped && deadline && displayMs <= 0;

  return (
    <div
      className="font-mono"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 14px',
        borderRadius: '12px',
        background: isExpired || isCritical ? '#ffffff' : '#000000',
        border: '1.5px solid rgba(255, 255, 255, 0.6)',
        color: isExpired || isCritical ? '#050505' : '#ffffff',
        fontWeight: 700,
        fontSize: '1.05rem',
      }}
    >
      {isStopped ? (
        <PauseCircle size={18} />
      ) : isExpired || isCritical ? (
        <AlertTriangle size={18} />
      ) : (
        <Clock size={18} />
      )}
      <span>{isStopped ? `${formatRemainingMs(displayMs)} (STOPPED)` : deadline ? formatRemainingMs(displayMs) : '--:--'}</span>
    </div>
  );
}
