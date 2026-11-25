import { useState, useCallback, useEffect } from 'react';
import {
  loadEventState,
  saveEventState,
  loadSession,
  saveSession,
  normalizeCodeLetter,
  createEmptyProgress,
} from '../storage/storage';

export function useEventStore() {
  const [state, setState] = useState(() => loadEventState());
  const [session, setSession] = useState(() => loadSession());

  const commitState = useCallback((updater) => {
    setState((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      saveEventState(next);
      return next;
    });
  }, []);

  const updateSession = useCallback((nextSession) => {
    saveSession(nextSession);
    setSession(nextSession);
  }, []);

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === 'devverse_techroom_escape_v9' && e.newValue) {
        try {
          setState(JSON.parse(e.newValue));
        } catch {
          // ignore
        }
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const loginTeam = useCallback(
    (usernameInput, passwordInput) => {
      const cleanName = String(usernameInput || '').trim().toUpperCase();
      const cleanPass = String(passwordInput || '').trim().toUpperCase();
      const found = state.teams.find(
        (t) => t.teamName.toUpperCase() === cleanName && t.password.toUpperCase() === cleanPass
      );
      if (!found) {
        return { ok: false, error: 'Invalid Username ID or Password.' };
      }

      if (!found.progress?.timerDeadline) {
        const durationMs = (state.eventConfig.durationMinutes || 20) * 60 * 1000;
        const now = Date.now();
        commitState((prev) => ({
          ...prev,
          teams: prev.teams.map((t) =>
            t.id === found.id
              ? {
                  ...t,
                  progress: {
                    ...t.progress,
                    startedAt: now,
                    timerDeadline: now + durationMs,
                  },
                }
              : t
          ),
        }));
      }

      updateSession({ role: 'agent', teamId: found.id });
      return { ok: true, teamId: found.id };
    },
    [state.teams, state.eventConfig.durationMinutes, commitState, updateSession]
  );

  const loginAdmin = useCallback(
    (passwordInput) => {
      if (String(passwordInput || '').trim() !== state.eventConfig.adminPassword) {
        return { ok: false, error: 'Invalid organizer access key.' };
      }
      updateSession({ role: 'admin' });
      return { ok: true };
    },
    [state.eventConfig.adminPassword, updateSession]
  );

  const logout = useCallback(() => {
    updateSession(null);
  }, [updateSession]);

  // Preserves destination word editing while syncing all 4 question code letters
  const updateTeamDestinationCode = useCallback(
    (teamId, newWord) => {
      const clean = String(newWord || '')
        .trim()
        .toUpperCase()
        .replace(/[^A-Z]/g, '');
      if (clean.length !== 4) return { ok: false, error: 'Destination word must be 4 letters.' };

      const normalized = clean.split('').map((ch) => normalizeCodeLetter(ch));
      commitState((prev) => ({
        ...prev,
        teams: prev.teams.map((t) => {
          if (t.id !== teamId) return t;
          return {
            ...t,
            destinationCode: normalized,
            assignedQuestions: t.assignedQuestions.map((aq, idx) => ({
              ...aq,
              codeLetter: normalized[idx],
            })),
          };
        }),
      }));
      return { ok: true };
    },
    [commitState]
  );

  const recordQuestionOutcome = useCallback(
    (teamId, slotIndex, { isCorrect, lockoutDeadline = null, mistakeStreak = 0 }) => {
      commitState((prev) => ({
        ...prev,
        teams: prev.teams.map((t) => {
          if (t.id !== teamId) return t;
          const currentSlot = t.progress.questionStates[slotIndex] || {};
          const assigned = t.assignedQuestions[slotIndex];
          const nextSlotState = {
            ...currentSlot,
            attempts: (currentSlot.attempts || 0) + 1,
            solved: isCorrect ? true : currentSlot.solved,
            submittedLetter: isCorrect ? assigned.codeLetter : null,
            lastResult: isCorrect ? 'correct' : 'incorrect',
            mistakeStreak: isCorrect ? 0 : mistakeStreak,
            lockoutDeadline: isCorrect ? null : lockoutDeadline,
            lastUpdated: Date.now(),
          };
          return {
            ...t,
            progress: {
              ...t.progress,
              questionStates: {
                ...t.progress.questionStates,
                [slotIndex]: nextSlotState,
              },
            },
          };
        }),
      }));
    },
    [commitState]
  );

  const submitElevation = useCallback(
    (teamId) => {
      commitState((prev) => ({
        ...prev,
        teams: prev.teams.map((t) => {
          if (t.id !== teamId) return t;
          const results = [0, 1, 2, 3].map((slot) => {
            const qState = t.progress.questionStates[slot] || {};
            const expectedLetter = t.destinationCode[slot];
            const solved = Boolean(qState.solved && qState.submittedLetter === expectedLetter);
            return {
              slot,
              solved,
              letter: solved ? expectedLetter : '_',
            };
          });
          const allCorrect = results.every((r) => r.solved);
          return {
            ...t,
            progress: {
              ...t.progress,
              submittedAt: Date.now(),
              completedAt: allCorrect ? Date.now() : t.progress.completedAt,
              elevationResult: {
                submittedAt: Date.now(),
                results,
                allCorrect,
              },
            },
          };
        }),
      }));
    },
    [commitState]
  );

  const clearElevationView = useCallback(
    (teamId) => {
      commitState((prev) => ({
        ...prev,
        teams: prev.teams.map((t) =>
          t.id === teamId
            ? {
                ...t,
                progress: {
                  ...t.progress,
                  elevationResult: null,
                },
              }
            : t
        ),
      }));
    },
    [commitState]
  );

  // STOP: stops only the current team's timer & investigation while preserving all existing progress
  const stopTeamInvestigation = useCallback(
    (teamId) => {
      const now = Date.now();
      commitState((prev) => ({
        ...prev,
        teams: prev.teams.map((t) => {
          if (t.id !== teamId) return t;
          const remaining = t.progress?.timerDeadline
            ? Math.max(0, t.progress.timerDeadline - now)
            : 0;
          return {
            ...t,
            progress: {
              ...t.progress,
              isStopped: true,
              stoppedAt: now,
              frozenRemainingMs: remaining,
            },
          };
        }),
      }));
    },
    [commitState]
  );

  // RESTART: resets ONLY the current team's progress, answers, lockouts, elevation & fresh 20-min timer
  const restartTeamInvestigation = useCallback(
    (teamId) => {
      const now = Date.now();
      const durationMs = (state.eventConfig.durationMinutes || 20) * 60 * 1000;
      commitState((prev) => ({
        ...prev,
        teams: prev.teams.map((t) => {
          if (t.id !== teamId) return t;
          const fresh = createEmptyProgress();
          return {
            ...t,
            progress: {
              ...fresh,
              startedAt: now,
              timerDeadline: now + durationMs,
              restartNonce: (t.progress?.restartNonce || 0) + 1,
            },
          };
        }),
      }));
    },
    [commitState, state.eventConfig.durationMinutes]
  );

  const activeTeam =
    session?.role === 'agent'
      ? state.teams.find((t) => t.id === session.teamId) || null
      : null;

  return {
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
  };
}
