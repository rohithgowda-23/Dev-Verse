import { useState, useCallback } from 'react';
import {
  Shield,
  LogOut,
  CheckCircle2,
  CircleDot,
  Lock,
  ArrowLeft,
  ArrowRight,
  Send,
  PauseCircle,
  RotateCcw,
  SlidersHorizontal,
} from 'lucide-react';
import CountdownTimer from '../components/CountdownTimer';
import QuestionBriefing from '../components/QuestionBriefing';
import BombCharacterStage from '../components/BombCharacterStage';
import EnvelopeCourierOverlay from '../components/EnvelopeCourierOverlay';
import ConfirmModal from '../components/ConfirmModal';
import ElevationScreen from './ElevationScreen';
import TimeExpiredScreen from './TimeExpiredScreen';
import GameRouter from '../games/GameRouter';
import { getQuestionById, QUESTIONS_BANK } from '../data/questions';

export default function AgentDashboard({
  eventConfig,
  team,
  onLogout,
  onRecordOutcome,
  onSubmitElevation,
  onClearElevationView,
  onStopTeam,
  onRestartTeam,
}) {
  const [activeSlot, setActiveSlot] = useState(0);
  const [devverseMenuOpen, setDevverseMenuOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null); // null | 'stop' | 'restart'
  const [now] = useState(() => Date.now());
  const [isExpired, setIsExpired] = useState(() => {
    const dl = team.progress?.timerDeadline;
    return Boolean(!team.progress?.isStopped && dl && Date.now() >= dl);
  });

  const handleTimerExpire = useCallback(() => {
    if (!team.progress?.isStopped) {
      setIsExpired(true);
    }
  }, [team.progress?.isStopped]);

  const isStopped = Boolean(team.progress?.isStopped);
  const restartNonce = team.progress?.restartNonce || 0;

  const questionStates = team.progress?.questionStates || {};
  const completedCount = [0, 1, 2, 3].filter((slot) => questionStates[slot]?.solved).length;
  const attemptedAll = [0, 1, 2, 3].every((slot) => (questionStates[slot]?.attempts || 0) > 0);
  const elevationResult = team.progress?.elevationResult;

  const renderPageTitle = () => (
    <div style={{ textAlign: 'center', marginBottom: '10px' }}>
      <h1
        className="font-display gradient-text"
        style={{
          margin: 0,
          fontSize: 'clamp(1.45rem, 3.6vw, 2.15rem)',
          fontWeight: 800,
          letterSpacing: '0.12em',
        }}
      >
        TECH ROOM ESCAPE
      </h1>
    </div>
  );

  const renderHeader = () => (
    <header
      className="glass-card"
      style={{
        padding: '14px 18px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Shield size={20} color="#050505" />
        </div>
        <div>
          <div style={{ fontSize: '0.72rem', color: '#a3a3a3', fontWeight: 700, letterSpacing: '0.08em' }}>
            {eventConfig.eventName}
          </div>
          <div className="font-display" style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff' }}>
            {team.teamName}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
        <span className="badge badge-cyan">{completedCount} / 4 COMPLETED</span>
        <CountdownTimer
          deadline={team.progress?.timerDeadline}
          isStopped={isStopped}
          frozenRemainingMs={team.progress?.frozenRemainingMs ?? null}
          onExpire={handleTimerExpire}
        />
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onLogout}
          style={{ minHeight: '40px', padding: '8px 12px' }}
        >
          <LogOut size={16} /> Logout
        </button>
      </div>
    </header>
  );

  const renderDevverseControl = () => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', marginTop: '8px' }}>
      <button
        type="button"
        className="btn btn-secondary"
        onClick={() => setDevverseMenuOpen((prev) => !prev)}
        style={{
          minWidth: '180px',
          border: '2px solid rgba(255, 255, 255, 0.78)',
          letterSpacing: '0.1em',
          fontWeight: 700,
        }}
      >
        <SlidersHorizontal size={16} /> DEVVERSE
      </button>

      {devverseMenuOpen && (
        <div
          role="menu"
          className="glass-card glass-card-glow"
          style={{
            padding: '12px',
            display: 'flex',
            gap: '12px',
            flexWrap: 'wrap',
            justifyContent: 'center',
            maxWidth: '380px',
            width: '100%',
          }}
        >
          <button
            type="button"
            role="menuitem"
            className="btn btn-secondary"
            disabled={isStopped}
            onClick={() => {
              setDevverseMenuOpen(false);
              setConfirmAction('stop');
            }}
            style={{ flex: 1, minWidth: '140px' }}
          >
            <PauseCircle size={16} /> STOP
          </button>
          <button
            type="button"
            role="menuitem"
            className="btn btn-primary"
            onClick={() => {
              setDevverseMenuOpen(false);
              setConfirmAction('restart');
            }}
            style={{ flex: 1, minWidth: '140px' }}
          >
            <RotateCcw size={16} /> RESTART
          </button>
        </div>
      )}

      <ConfirmModal
        open={confirmAction === 'stop'}
        title="Stop Current Investigation?"
        message={`This will immediately stop ${team.teamName}'s investigation and freeze the countdown timer. All existing progress and solved questions will be preserved, and no further answers can be submitted unless you restart.`}
        confirmLabel="Confirm STOP"
        onCancel={() => setConfirmAction(null)}
        onConfirm={() => {
          onStopTeam(team.id);
          setConfirmAction(null);
        }}
      />

      <ConfirmModal
        open={confirmAction === 'restart'}
        title="Restart Team Investigation?"
        message={`All progress, submitted answers, destination-letter states, lockouts, and game states for ${team.teamName} will be completely reset, and the 20-minute timer will start fresh from Question 1. Other teams are not affected.`}
        confirmLabel="Confirm RESTART"
        onCancel={() => setConfirmAction(null)}
        onConfirm={() => {
          onRestartTeam(team.id);
          setIsExpired(false);
          setActiveSlot(0);
          setConfirmAction(null);
        }}
      />
    </div>
  );

  // Time Expired View
  if (isExpired && !isStopped && !team.progress?.elevationResult?.allCorrect) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '28px' }}>
        <TimeExpiredScreen team={team} onLogout={onLogout} />
        {renderDevverseControl()}
      </div>
    );
  }

  // Stopped Team View (persists across refreshes, preserves existing progress, blocks submissions)
  if (isStopped) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '28px' }}>
        {renderPageTitle()}
        {renderHeader()}

        <section
          className="glass-card glass-card-glow"
          style={{
            padding: '32px 24px',
            textAlign: 'center',
            maxWidth: '720px',
            width: '100%',
            margin: '8px auto',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
            <PauseCircle size={44} color="#ffffff" />
          </div>
          <h2 className="font-display" style={{ margin: '0 0 10px', fontSize: '1.5rem', color: '#ffffff' }}>
            INVESTIGATION STOPPED
          </h2>
          <p style={{ color: '#d4d4d4', margin: '0 auto 18px', maxWidth: '540px', fontSize: '0.98rem' }}>
            Team <strong style={{ color: '#ffffff' }}>{team.teamName}</strong>’s investigation has been stopped and the countdown timer is halted. Your existing progress ({completedCount} / 4 questions completed) is preserved.
          </p>
          <p style={{ color: '#a3a3a3', margin: '0 auto 8px', fontSize: '0.88rem' }}>
            New answer submissions and question navigation are disabled while stopped. Use the DEVVERSE button below to restart a fresh 20-minute attempt if needed.
          </p>
        </section>

        {renderDevverseControl()}
      </div>
    );
  }

  if (elevationResult) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', paddingBottom: '28px' }}>
        {renderPageTitle()}
        {renderHeader()}
        <ElevationScreen
          teamName={team.teamName}
          elevationResult={elevationResult}
          onBackToQuestion={(targetSlot) => {
            onClearElevationView(team.id);
            setActiveSlot(typeof targetSlot === 'number' ? targetSlot : 0);
          }}
        />
        {renderDevverseControl()}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '28px' }}>
      {/* 1. TECH ROOM ESCAPE Heading */}
      {renderPageTitle()}

      {/* 2. Team and Countdown Information */}
      {renderHeader()}

      {/* 3. Four-Question Progress Indicator */}
      <section className="glass-card" style={{ padding: '14px 16px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
          <span style={{ fontSize: '0.86rem', fontWeight: 700, color: '#ffffff' }}>
            QUESTION {activeSlot + 1} OF 4
          </span>
          <span style={{ fontSize: '0.84rem', color: '#a3a3a3' }}>
            Encrypted destination letters remain hidden until all four questions are submitted.
          </span>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '8px',
          }}
        >
          {[0, 1, 2, 3].map((slotIdx) => {
            const qState = questionStates[slotIdx] || {};
            const isActive = activeSlot === slotIdx;
            const isSolved = Boolean(qState.solved);
            const isAttempted = (qState.attempts || 0) > 0;
            const isLocked = Boolean(qState.lockoutDeadline && qState.lockoutDeadline > now);

            return (
              <button
                key={slotIdx}
                type="button"
                onClick={() => setActiveSlot(slotIdx)}
                style={{
                  minHeight: '48px',
                  padding: '8px 10px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '3px',
                  background: isActive
                    ? '#ffffff'
                    : isSolved
                    ? 'rgba(255, 255, 255, 0.16)'
                    : '#000000',
                  border: `2px solid ${
                    isActive
                      ? '#ffffff'
                      : isSolved
                      ? 'rgba(255, 255, 255, 0.72)'
                      : 'rgba(255, 255, 255, 0.35)'
                  }`,
                  color: isActive ? '#050505' : '#ffffff',
                }}
              >
                <span className="font-display" style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                  Q{slotIdx + 1}
                </span>
                <span
                  style={{
                    fontSize: '0.72rem',
                    color: isActive ? '#262626' : '#d4d4d4',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  {isSolved ? (
                    <>
                      <CheckCircle2 size={12} /> DONE
                    </>
                  ) : isLocked ? (
                    <>
                      <Lock size={12} /> LOCKED
                    </>
                  ) : isAttempted ? (
                    <>
                      <CircleDot size={12} /> RETRY
                    </>
                  ) : (
                    'PENDING'
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 4. Question Briefing Box + 5. Question/Game Box with overlapping 60s 3D Toy/Bomb/DEVVERSE Overlay */}
      <EnvelopeCourierOverlay />
      <div data-question-stage="true" style={{ position: 'relative', overflow: 'visible' }}>
        <BombCharacterStage />

        <div style={{ position: 'relative', zIndex: 2 }}>
          {team.assignedQuestions.map((aq, slotIdx) => {
            const question = getQuestionById(aq.questionId) || QUESTIONS_BANK[slotIdx] || QUESTIONS_BANK[0];
            const slotState = questionStates[slotIdx] || {};
            const isActive = activeSlot === slotIdx;

            return (
              <div key={`${aq.questionId}-${slotIdx}-${restartNonce}`} style={{ display: isActive ? 'block' : 'none' }}>
                <QuestionBriefing
                  question={question}
                  slotNumber={slotIdx + 1}
                  isSolved={Boolean(slotState.solved)}
                />

                <GameRouter
                  question={question}
                  slotNumber={slotIdx + 1}
                  slotState={slotState}
                  onOutcome={(outcome) => onRecordOutcome(team.id, slotIdx, outcome)}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. Previous and Next Navigation + Final Submission */}
      <footer
        className="glass-card"
        style={{
          padding: '14px 18px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="button"
            className="btn btn-secondary"
            disabled={activeSlot === 0}
            onClick={() => setActiveSlot((s) => Math.max(0, s - 1))}
          >
            <ArrowLeft size={16} /> PREVIOUS
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            disabled={activeSlot === 3}
            onClick={() => setActiveSlot((s) => Math.min(3, s + 1))}
          >
            NEXT <ArrowRight size={16} />
          </button>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          disabled={!attemptedAll}
          onClick={() => onSubmitElevation(team.id)}
          title={
            attemptedAll
              ? 'Submit all four answers to view your Destination Code'
              : 'Attempt all 4 questions before final submission'
          }
        >
          <Send size={16} /> Submit All 4 Answers
        </button>
      </footer>

      {/* 7. Bottom DEVVERSE Control Button (STOP & RESTART for current team only) */}
      {renderDevverseControl()}
    </div>
  );
}
