export function formatRemainingMs(ms) {
  const clamped = Math.max(0, Math.floor(ms / 1000));
  const mins = Math.floor(clamped / 60);
  const secs = clamped % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}
