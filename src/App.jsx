import { Component, lazy, Suspense, useEffect } from 'react';
import './styles/theme.css';
import CyberBackground from './components/CyberBackground';
import InvestigationFrame from './components/InvestigationFrame';
import LoginPage from './pages/LoginPage';
import { useEventStore } from './hooks/useEventStore';

class AppErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div
          className="glass-card glass-card-glow"
          style={{
            margin: '48px auto',
            padding: '28px 24px',
            maxWidth: '540px',
            textAlign: 'center',
            color: '#ffffff',
          }}
        >
          <h2 className="font-display" style={{ margin: '0 0 10px', fontSize: '1.25rem' }}>
            SESSION RECOVERY REQUIRED
          </h2>
          <p className="font-mono" style={{ fontSize: '0.85rem', color: '#d4d4d4', marginBottom: '18px', wordBreak: 'break-word' }}>
            {this.state.error?.message || 'Unexpected render error.'}
          </p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              window.localStorage.clear();
              window.location.reload();
            }}
          >
            Reset Session &amp; Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const AdminDashboard = lazy(() => import('./admin/AdminDashboard'));
const AgentDashboard = lazy(() => import('./agent/AgentDashboard'));

function ViewFallback() {
  return (
    <div
      className="glass-card"
      style={{
        margin: '48px auto',
        padding: '32px 24px',
        maxWidth: '420px',
        textAlign: 'center',
        color: '#d4d4d4',
        fontFamily: 'var(--font-mono)',
      }}
    >
      Initializing workspace...
    </div>
  );
}

export default function App() {
  const {
    state,
    session,
    activeTeam,
    loginTeam,
    loginAdmin,
    logout,
    updateTeamDestinationCode,
    recordQuestionOutcome,
    submitElevation,
    clearElevationView,
    stopTeamInvestigation,
    restartTeamInvestigation,
  } = useEventStore();

  // Ensure initial load and login/logout transitions always start at the top
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [session?.role, session?.teamId]);

  return (
    <>
      <CyberBackground intensity="normal" />
      <div className="cyber-grid-overlay" />
      <InvestigationFrame>
        <AppErrorBoundary>
          <Suspense fallback={<ViewFallback />}>
            {session?.role === 'admin' ? (
              <AdminDashboard
                state={state}
                onLogout={logout}
                onUpdateDestinationCode={updateTeamDestinationCode}
              />
            ) : session?.role === 'agent' && activeTeam ? (
              <AgentDashboard
                eventConfig={state.eventConfig}
                team={activeTeam}
                onLogout={logout}
                onRecordOutcome={recordQuestionOutcome}
                onSubmitElevation={submitElevation}
                onClearElevationView={clearElevationView}
                onStopTeam={stopTeamInvestigation}
                onRestartTeam={restartTeamInvestigation}
              />
            ) : (
              <LoginPage
                eventConfig={state.eventConfig}
                teamsCount={state.teams.length}
                onTeamLogin={loginTeam}
                onAdminLogin={loginAdmin}
              />
            )}
          </Suspense>
        </AppErrorBoundary>
      </InvestigationFrame>
    </>
  );
}
