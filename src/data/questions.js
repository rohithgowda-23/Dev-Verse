import { GAME_TYPES, buildAll75Questions } from './uniqueQuestionsBank';

export { GAME_TYPES };

export const GAME_TYPE_LABELS = {
  [GAME_TYPES.SCRAMBLED_WORD]: 'Scrambled Word Arrangement',
  [GAME_TYPES.PAIR_MATCHING]: 'Pair Matching Protocol',
  [GAME_TYPES.CLICK_INVESTIGATION]: 'Click-Based Scene Inspection',
  [GAME_TYPES.SUSPICIOUS_ROOM]: '3D Suspicious Room Investigation',
  [GAME_TYPES.ODD_ONE_OUT]: 'Odd One Out — Investigation',
  [GAME_TYPES.COMPUTER_ASSEMBLY]: 'Computer Assembly Investigation',
  [GAME_TYPES.MEMORY_GAME]: 'Encrypted Memory Match',
  [GAME_TYPES.DUMMY_DECOY]: 'Dummy / Decoy Evidence Audit',
  [GAME_TYPES.PACKET_ROUTING]: 'Packet Routing Challenge',
  [GAME_TYPES.ARRANGE_PROCESS]: 'Arrange the Process',
  [GAME_TYPES.GLASS_BOMB]: 'Glass Bomb — Find the Safe Glass',
};

export const LANE_DEFINITIONS = [
  { lane: 1, internalName: 'Lane 1 — Decryption & Signals' },
  { lane: 2, internalName: 'Lane 2 — Hardware & Evidence' },
  { lane: 3, internalName: 'Lane 3 — Spatial & Scene Forensics' },
  { lane: 4, internalName: 'Lane 4 — Matrix & Memory Protocols' },
];

export const QUESTIONS_BANK = buildAll75Questions();

export function getQuestionById(questionId) {
  return QUESTIONS_BANK.find((q) => q.id === questionId) || null;
}

export function getQuestionsByLane(laneNumber) {
  return QUESTIONS_BANK.filter((q) => q.lane === laneNumber);
}
