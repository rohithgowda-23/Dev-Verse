import { LogOut, Info } from 'lucide-react';

export default function AdminDashboard({
  state,
  onLogout,
  onUpdateDestinationCode,
}) {
  const { eventConfig, teams } = state;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', paddingBottom: '32px' }}>
      <header
        className="glass-card"
        style={{
          padding: '16px 20px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
        }}
      >
        <div>
          <span className="badge badge-cyan" style={{ marginBottom: '6px' }}>ADMIN PORTAL</span>
          <h1 className="font-display gradient-text" style={{ margin: 0, fontSize: 'clamp(1.15rem, 3vw, 1.5rem)' }}>
            {eventConfig.eventName}
          </h1>
        </div>
        <button type="button" className="btn btn-secondary" onClick={onLogout}>
          <LogOut size={16} /> Exit Admin
        </button>
      </header>

      <div
        className="glass-card"
        style={{
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '10px',
          fontSize: '0.83rem',
          color: '#a3a3a3',
        }}
      >
        <Info size={17} color="#ffffff" style={{ flexShrink: 0, marginTop: '2px' }} />
        <span>
          All 40 teams are pre-created locally in this browser’s LocalStorage & IndexedDB. Changes made on this device do not automatically sync to other devices.
        </span>
      </div>

      {/* Strict 3-Column Admin Table: Username ID | Password | Destination Code */}
      <section className="glass-card glass-card-glow" style={{ padding: '20px', overflowX: 'auto' }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            minWidth: '420px',
            fontSize: '0.94rem',
            border: '1.5px solid rgba(255, 255, 255, 0.45)',
          }}
        >
          <thead>
            <tr style={{ borderBottom: '2px solid rgba(255, 255, 255, 0.55)', textAlign: 'left', color: '#ffffff', background: 'rgba(255,255,255,0.08)' }}>
              <th style={{ padding: '12px 14px', borderRight: '1px solid rgba(255, 255, 255, 0.28)' }}>Username ID</th>
              <th style={{ padding: '12px 14px', borderRight: '1px solid rgba(255, 255, 255, 0.28)' }}>Password</th>
              <th style={{ padding: '12px 14px' }}>Destination Code</th>
            </tr>
          </thead>
          <tbody>
            {teams.map((team) => (
              <tr key={team.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.24)' }}>
                <td className="font-display" style={{ padding: '10px 14px', fontWeight: 700, color: '#ffffff', borderRight: '1px solid rgba(255, 255, 255, 0.2)' }}>
                  {team.teamName}
                </td>
                <td className="font-mono" style={{ padding: '10px 14px', color: '#e5e5e5', borderRight: '1px solid rgba(255, 255, 255, 0.2)' }}>
                  {team.password}
                </td>
                <td style={{ padding: '8px 14px' }}>
                  <input
                    aria-label={`${team.teamName} destination code`}
                    maxLength={4}
                    className="input-field font-mono"
                    style={{
                      width: '110px',
                      minHeight: '36px',
                      padding: '6px 10px',
                      fontWeight: 800,
                      color: '#ffffff',
                      letterSpacing: '0.18em',
                      textAlign: 'center',
                      textTransform: 'uppercase',
                    }}
                    value={team.destinationCode.join('')}
                    onChange={(e) => {
                      const val = e.target.value.toUpperCase().replace(/[^A-Z]/g, '');
                      if (val.length === 4) {
                        onUpdateDestinationCode(team.id, val);
                      }
                    }}
                    onBlur={(e) => {
                      const val = e.target.value.toUpperCase().replace(/[^A-Z]/g, '');
                      if (val.length !== 4) {
                        e.target.value = team.destinationCode.join('');
                      }
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
