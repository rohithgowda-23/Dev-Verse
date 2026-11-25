import { QUESTIONS_BANK, getQuestionsByLane, getQuestionById } from '../data/questions';
import { DEFAULT_TEAMS_CONFIG } from '../data/defaultTeams';
import { saveStateToIndexedDB } from './indexedDb';

const STORAGE_KEY = 'devverse_techroom_escape_v9';
const SESSION_KEY = 'devverse_techroom_session_v9';

export const MAX_TEAMS = 33;
export const DEFAULT_DURATION_MINUTES = 20;
export const DEFAULT_ADMIN_PASSWORD = 'ADMIN2026';

export function normalizeCodeLetter(letter) {
  const clean = String(letter || 'A')
    .trim()
    .toUpperCase()
    .replace(/[^A-Z]/g, '');
  return clean ? clean[0] : 'A';
}

export function createEmptyProgress() {
  return {
    timerDeadline: null,
    startedAt: null,
    submittedAt: null,
    completedAt: null,
    isStopped: false,
    stoppedAt: null,
    frozenRemainingMs: null,
    restartNonce: 0,
    questionStates: {
      0: { solved: false, attempts: 0, submittedLetter: null, lastResult: null, mistakeStreak: 0, lockoutDeadline: null },
      1: { solved: false, attempts: 0, submittedLetter: null, lastResult: null, mistakeStreak: 0, lockoutDeadline: null },
      2: { solved: false, attempts: 0, submittedLetter: null, lastResult: null, mistakeStreak: 0, lockoutDeadline: null },
      3: { solved: false, attempts: 0, submittedLetter: null, lastResult: null, mistakeStreak: 0, lockoutDeadline: null },
    },
    elevationResult: null,
  };
}

export function buildLaneAssignments(teamIndex = 0, destinationWord = 'HACK') {
  const letters = destinationWord.toUpperCase().split('');
  const usedIds = new Set();
  const usedTypes = new Set();

  return [1, 2, 3, 4].map((lane, idx) => {
    const laneQuestions = getQuestionsByLane(lane);
    const baseOffset = (teamIndex * 3 + idx * 5) % laneQuestions.length;

    let chosen = null;
    for (let step = 0; step < laneQuestions.length; step += 1) {
      const candidate = laneQuestions[(baseOffset + step) % laneQuestions.length];
      if (!usedIds.has(candidate.id) && !usedTypes.has(candidate.gameType)) {
        chosen = candidate;
        break;
      }
    }
    if (!chosen) {
      chosen =
        laneQuestions.find((q) => !usedIds.has(q.id)) ||
        laneQuestions[baseOffset] ||
        QUESTIONS_BANK[0];
    }

    usedIds.add(chosen.id);
    usedTypes.add(chosen.gameType);

    return {
      lane,
      questionId: chosen.id,
      codeLetter: normalizeCodeLetter(letters[idx] || 'A'),
    };
  });
}

export function createDefaultState() {
  const teams = DEFAULT_TEAMS_CONFIG.map((cfg, idx) => {
    const assignedQuestions = buildLaneAssignments(idx, cfg.destinationWord);
    return {
      id: `team-${String(idx + 1).padStart(2, '0')}`,
      teamName: cfg.usernameId,
      password: cfg.password,
      group: cfg.group,
      commonLastLetter: cfg.commonLastLetter,
      destinationCode: cfg.destinationWord.split(''),
      assignedQuestions,
      progress: createEmptyProgress(),
    };
  });

  return {
    version: 2,
    eventConfig: {
      eventName: 'DEVVERSE – TECH ROOM ESCAPE',
      eventSubtitle: 'College Technical Cyber-Investigation Challenge',
      durationMinutes: DEFAULT_DURATION_MINUTES,
      maxTeams: MAX_TEAMS,
      adminPassword: DEFAULT_ADMIN_PASSWORD,
      createdAt: Date.now(),
    },
    teams,
  };
}

export function loadEventState() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = createDefaultState();
      saveEventState(initial);
      return initial;
    }
    const parsed = JSON.parse(raw);
    if (!parsed || !parsed.eventConfig || !Array.isArray(parsed.teams) || parsed.teams.length !== MAX_TEAMS) {
      const fallback = createDefaultState();
      saveEventState(fallback);
      return fallback;
    }
    let repaired = false;
    const teams = parsed.teams.map((team, idx) => {
      const hasValidQuestions =
        Array.isArray(team.assignedQuestions) &&
        team.assignedQuestions.length === 4 &&
        team.assignedQuestions.every((aq) => Boolean(getQuestionById(aq.questionId)));
      if (hasValidQuestions) return team;
      repaired = true;
      const word = Array.isArray(team.destinationCode) ? team.destinationCode.join('') : 'HACK';
      return {
        ...team,
        assignedQuestions: buildLaneAssignments(idx, word),
      };
    });
    if (repaired) {
      const next = { ...parsed, teams };
      saveEventState(next);
      return next;
    }
    return parsed;
  } catch {
    return createDefaultState();
  }
}

export function saveEventState(state) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage quota errors
  }
  saveStateToIndexedDB(state);
}

export function loadSession() {
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveSession(session) {
  try {
    if (!session) {
      window.localStorage.removeItem(SESSION_KEY);
    } else {
      window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    }
  } catch {
    // Ignore storage errors
  }
}
