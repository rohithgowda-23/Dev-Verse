import { lazy, Suspense } from 'react';
import { GAME_TYPES } from '../data/questions';
import ScrambledWordGame from './ScrambledWord/ScrambledWordGame';
import PairMatchingGame from './PairMatching/PairMatchingGame';
import OddOneOutGame from './OddOneOut/OddOneOutGame';
import MemoryGame from './MemoryGame/MemoryGame';
import DummyDecoyGame from './DummyDecoy/DummyDecoyGame';
import PacketRoutingGame from './PacketRouting/PacketRoutingGame';
import ArrangeProcessGame from './ArrangeProcess/ArrangeProcessGame';
import GlassBombGame from './GlassBomb/GlassBombGame';

const ClickInvestigationGame = lazy(() => import('./ClickInvestigation/ClickInvestigationGame'));
const SuspiciousRoomGame = lazy(() => import('./SuspiciousRoom/SuspiciousRoomGame'));
const ComputerAssemblyGame = lazy(() => import('./ComputerAssembly/ComputerAssemblyGame'));

function GameLoadingFallback() {
  return (
    <div
      className="glass-card"
      style={{
        padding: '48px 24px',
        textAlign: 'center',
        color: '#d4d4d4',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.9rem',
      }}
    >
      Loading investigation module...
    </div>
  );
}

export default function GameRouter({
  question,
  slotNumber,
  slotState,
  onOutcome,
}) {
  const commonProps = {
    question,
    slotNumber,
    slotState,
    onOutcome,
  };

  let gameElement = null;

  switch (question.gameType) {
    case GAME_TYPES.SCRAMBLED_WORD:
      gameElement = <ScrambledWordGame {...commonProps} />;
      break;
    case GAME_TYPES.PAIR_MATCHING:
      gameElement = <PairMatchingGame {...commonProps} />;
      break;
    case GAME_TYPES.CLICK_INVESTIGATION:
      gameElement = <ClickInvestigationGame {...commonProps} />;
      break;
    case GAME_TYPES.SUSPICIOUS_ROOM:
      gameElement = <SuspiciousRoomGame {...commonProps} />;
      break;
    case GAME_TYPES.ODD_ONE_OUT:
      gameElement = <OddOneOutGame {...commonProps} />;
      break;
    case GAME_TYPES.COMPUTER_ASSEMBLY:
      gameElement = <ComputerAssemblyGame {...commonProps} />;
      break;
    case GAME_TYPES.MEMORY_GAME:
      gameElement = <MemoryGame {...commonProps} />;
      break;
    case GAME_TYPES.DUMMY_DECOY:
      gameElement = <DummyDecoyGame {...commonProps} />;
      break;
    case GAME_TYPES.PACKET_ROUTING:
      gameElement = <PacketRoutingGame {...commonProps} />;
      break;
    case GAME_TYPES.ARRANGE_PROCESS:
      gameElement = <ArrangeProcessGame {...commonProps} />;
      break;
    case GAME_TYPES.GLASS_BOMB:
      gameElement = <GlassBombGame {...commonProps} />;
      break;
    default:
      gameElement = (
        <div className="glass-card" style={{ padding: '24px' }}>
          Unsupported game type: {question.gameType}
        </div>
      );
  }

  return <Suspense fallback={<GameLoadingFallback />}>{gameElement}</Suspense>;
}
