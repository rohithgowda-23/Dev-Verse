export default function HardwareIcon({ id, dark = false }) {
  const stroke = dark ? '#050505' : '#e5e5e5';
  const muted = dark ? '#525252' : '#737373';
  const fill = dark ? '#d4d4d4' : '#171717';

  switch (id) {
    case 'mobo':
      return (
        <svg width="42" height="42" viewBox="0 0 42 42" aria-hidden="true">
          <rect x="4" y="4" width="34" height="34" rx="3" fill={fill} stroke={stroke} strokeWidth="1.6" />
          <rect x="9" y="9" width="12" height="12" fill="none" stroke={stroke} strokeWidth="1.3" />
          <line x1="26" y1="9" x2="26" y2="21" stroke={stroke} strokeWidth="1.6" />
          <line x1="30" y1="9" x2="30" y2="21" stroke={stroke} strokeWidth="1.6" />
          <line x1="9" y1="27" x2="27" y2="27" stroke={muted} strokeWidth="2" />
          <line x1="9" y1="32" x2="27" y2="32" stroke={muted} strokeWidth="2" />
        </svg>
      );
    case 'cpu':
      return (
        <svg width="42" height="42" viewBox="0 0 42 42" aria-hidden="true">
          <rect x="10" y="10" width="22" height="22" rx="2" fill={fill} stroke={stroke} strokeWidth="1.8" />
          <rect x="15" y="15" width="12" height="12" fill="none" stroke={stroke} strokeWidth="1.2" />
          {[14, 19, 24, 28].map((pos) => (
            <g key={pos}>
              <line x1={pos} y1="5" x2={pos} y2="10" stroke={muted} strokeWidth="1.5" />
              <line x1={pos} y1="32" x2={pos} y2="37" stroke={muted} strokeWidth="1.5" />
              <line x1="5" y1={pos} x2="10" y2={pos} stroke={muted} strokeWidth="1.5" />
              <line x1="32" y1={pos} x2="37" y2={pos} stroke={muted} strokeWidth="1.5" />
            </g>
          ))}
        </svg>
      );
    case 'cooler':
      return (
        <svg width="42" height="42" viewBox="0 0 42 42" aria-hidden="true">
          <rect x="5" y="5" width="32" height="32" rx="4" fill={fill} stroke={stroke} strokeWidth="1.6" />
          <circle cx="21" cy="21" r="11" fill="none" stroke={stroke} strokeWidth="1.4" />
          <circle cx="21" cy="21" r="3" fill={stroke} />
          <path d="M21 10 C25 13 25 17 21 18 M32 21 C29 25 25 25 24 21 M21 32 C17 29 17 25 21 24 M10 21 C13 17 17 17 18 21" fill="none" stroke={stroke} strokeWidth="1.5" />
        </svg>
      );
    case 'ram':
      return (
        <svg width="42" height="42" viewBox="0 0 42 42" aria-hidden="true">
          <rect x="5" y="13" width="32" height="14" rx="2" fill={fill} stroke={stroke} strokeWidth="1.6" />
          <rect x="9" y="16" width="5" height="7" fill={muted} />
          <rect x="16" y="16" width="5" height="7" fill={muted} />
          <rect x="23" y="16" width="5" height="7" fill={muted} />
          <rect x="30" y="16" width="4" height="7" fill={muted} />
          <line x1="8" y1="29" x2="19" y2="29" stroke={stroke} strokeWidth="2" />
          <line x1="23" y1="29" x2="34" y2="29" stroke={stroke} strokeWidth="2" />
        </svg>
      );
    case 'ssd':
      return (
        <svg width="42" height="42" viewBox="0 0 42 42" aria-hidden="true">
          <rect x="6" y="14" width="30" height="14" rx="2" fill={fill} stroke={stroke} strokeWidth="1.6" />
          <rect x="12" y="17" width="8" height="8" fill={muted} />
          <rect x="23" y="17" width="9" height="8" fill={muted} />
          <line x1="6" y1="18" x2="9" y2="18" stroke={stroke} strokeWidth="1.6" />
          <line x1="6" y1="24" x2="9" y2="24" stroke={stroke} strokeWidth="1.6" />
        </svg>
      );
    case 'gpu':
      return (
        <svg width="42" height="42" viewBox="0 0 42 42" aria-hidden="true">
          <rect x="4" y="12" width="34" height="17" rx="2" fill={fill} stroke={stroke} strokeWidth="1.6" />
          <circle cx="14" cy="20.5" r="5" fill="none" stroke={stroke} strokeWidth="1.4" />
          <circle cx="28" cy="20.5" r="5" fill="none" stroke={stroke} strokeWidth="1.4" />
          <line x1="10" y1="31" x2="26" y2="31" stroke={stroke} strokeWidth="2" />
        </svg>
      );
    case 'psu':
    default:
      return (
        <svg width="42" height="42" viewBox="0 0 42 42" aria-hidden="true">
          <rect x="6" y="9" width="30" height="24" rx="3" fill={fill} stroke={stroke} strokeWidth="1.6" />
          <circle cx="18" cy="21" r="7.5" fill="none" stroke={stroke} strokeWidth="1.4" />
          <circle cx="18" cy="21" r="2" fill={stroke} />
          <rect x="29" y="14" width="4" height="14" fill="none" stroke={muted} strokeWidth="1.2" />
        </svg>
      );
  }
}
