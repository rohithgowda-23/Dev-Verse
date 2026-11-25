import { useState } from 'react';
import { Shield, Terminal, KeyRound, Users, Settings, Info, ArrowRight, Lock } from 'lucide-react';

export default function LoginPage({ eventConfig, teamsCount, onTeamLogin, onAdminLogin }) {
  const [mode, setMode] = useState('agent');
  const [usernameId, setUsernameId] = useState('');
  const [password, setPassword] = useState('');
  const [adminKey, setAdminKey] = useState('');
  const [error, setError] = useState('');

  const handleAgentSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!usernameId.trim() || !password.trim()) {
      setError('Enter both Username ID and Password.');
      return;
    }
    const res = onTeamLogin(usernameId, password);
    if (!res.ok) setError(res.error);
  };

  const handleAdminSubmit = (e) => {
    e.preventDefault();
    setError('');
    const res = onAdminLogin(adminKey);
    if (!res.ok) setError(res.error);
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', padding: '8px 0 24px' }}>
      <div style={{ textAlign: 'center', maxWidth: '680px', marginBottom: '20px' }}>
        <div className="badge badge-cyan" style={{ marginBottom: '10px' }}>
          <Terminal size={14} /> {eventConfig.durationMinutes}-MINUTE CYBER ESCAPE MISSION
        </div>
        <h1
          className="font-display gradient-text"
          style={{
            margin: '0 0 8px',
            fontSize: 'clamp(1.7rem, 4.2vw, 2.55rem)',
            lineHeight: 1.15,
            fontWeight: 800,
          }}
        >
          {eventConfig.eventName}
        </h1>
        <p style={{ margin: 0, color: '#d4d4d4', fontSize: 'clamp(0.95rem, 2vw, 1.04rem)' }}>
          {eventConfig.eventSubtitle}. Complete all four investigation nodes and unlock your team’s destination word.
        </p>
      </div>

      <div className="glass-card glass-card-glow" style={{ width: '100%', maxWidth: '450px', padding: '24px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '8px',
            padding: '4px',
            background: '#000000',
            borderRadius: '12px',
            marginBottom: '20px',
            border: '1.5px solid rgba(255, 255, 255, 0.35)',
          }}
        >
          <button
            type="button"
            className={`btn ${mode === 'agent' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ minHeight: '40px', border: 'none', boxShadow: mode === 'agent' ? undefined : 'none' }}
            onClick={() => {
              setMode('agent');
              setError('');
            }}
          >
            <Users size={16} /> Team Login
          </button>
          <button
            type="button"
            className={`btn ${mode === 'admin' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ minHeight: '40px', border: 'none', boxShadow: mode === 'admin' ? undefined : 'none' }}
            onClick={() => {
              setMode('admin');
              setError('');
            }}
          >
            <Settings size={16} /> Admin Portal
          </button>
        </div>

        {mode === 'agent' ? (
          <form onSubmit={handleAgentSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label htmlFor="username-id" style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#ffffff', marginBottom: '6px' }}>
                USERNAME ID
              </label>
              <input
                id="username-id"
                type="text"
                className="input-field font-mono"
                placeholder="e.g. TEAM01"
                value={usernameId}
                onChange={(e) => setUsernameId(e.target.value.toUpperCase())}
                style={{ textTransform: 'uppercase' }}
                autoComplete="username"
              />
            </div>

            <div>
              <label htmlFor="team-password" style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#ffffff', marginBottom: '6px' }}>
                PASSWORD
              </label>
              <input
                id="team-password"
                type="password"
                className="input-field font-mono"
                placeholder="e.g. PASS01"
                value={password}
                onChange={(e) => setPassword(e.target.value.toUpperCase())}
                style={{ letterSpacing: '0.14em', textTransform: 'uppercase' }}
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div style={{ padding: '10px 12px', borderRadius: '10px', background: '#000000', border: '1.5px solid rgba(255, 255, 255, 0.55)', color: '#ffffff', fontSize: '0.88rem' }}>
                {error}
              </div>
            )}

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '4px' }}>
              <Shield size={18} /> Enter Investigation <ArrowRight size={18} />
            </button>

            <div style={{ fontSize: '0.82rem', color: '#d4d4d4', textAlign: 'center', marginTop: '2px' }}>
              Pre-Configured Teams: <strong style={{ color: '#ffffff' }}>{teamsCount}</strong> (TEAM01–TEAM33)
            </div>
          </form>
        ) : (
          <form onSubmit={handleAdminSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label htmlFor="admin-key" style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#ffffff', marginBottom: '6px' }}>
                ADMIN ACCESS KEY
              </label>
              <input
                id="admin-key"
                type="password"
                className="input-field font-mono"
                placeholder="Enter admin key (default: ADMIN2026)"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
              />
            </div>

            {error && (
              <div style={{ padding: '10px 12px', borderRadius: '10px', background: '#000000', border: '1.5px solid rgba(255, 255, 255, 0.55)', color: '#ffffff', fontSize: '0.88rem' }}>
                {error}
              </div>
            )}

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              <KeyRound size={18} /> Open Admin Portal
            </button>

            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px',
                padding: '10px 12px',
                borderRadius: '10px',
                background: '#000000',
                border: '1.5px solid rgba(255, 255, 255, 0.25)',
                color: '#d4d4d4',
                fontSize: '0.8rem',
              }}
            >
              <Lock size={15} style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>
                Frontend-only demonstration mode: credentials and answer keys are stored locally in this browser.
              </span>
            </div>
          </form>
        )}
      </div>

      <div
        className="glass-card"
        style={{
          marginTop: '16px',
          maxWidth: '620px',
          width: '100%',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '10px',
          fontSize: '0.82rem',
          color: '#d4d4d4',
        }}
      >
        <Info size={18} color="#ffffff" style={{ flexShrink: 0, marginTop: '2px' }} />
        <span>
          <strong style={{ color: '#ffffff' }}>Device-Local Storage:</strong> All team data, timers, and progress are stored locally in this browser’s LocalStorage & IndexedDB and do not sync across different phones.
        </span>
      </div>
    </div>
  );
}
