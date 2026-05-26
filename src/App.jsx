import { useCallback, useEffect, useRef, useState } from 'react';
import World from './components/world/World';
import MobileSections from './components/sections/MobileSections';
import ContentPanel from './components/ui/ContentPanel';
import JourneyMap from './components/ui/JourneyMap';
import LoadingScreen from './components/ui/LoadingScreen';
import MinecraftPOVOverlay from './components/ui/MinecraftPOVOverlay';
import MobileBanner from './components/ui/MobileBanner';
import Navbar from './components/ui/Navbar';
import { usePanelSystem } from './components/ui/PanelController';
import ProgressBar from './components/ui/ProgressBar';
import ProgressDots from './components/ui/ProgressDots';
import ScrollHint from './components/ui/ScrollHint';
import SectionLabel from './components/ui/SectionLabel';
import { CameraProgressProvider, useCameraProgress } from './hooks/useCameraProgress';
import { useDayNight } from './hooks/useDayNight';
import { useSound } from './hooks/useSound';

function MountainJourney() {
  const [loading, setLoading] = useState(true);
  const { mode, toggleMode } = useDayNight();
  const { enabled: soundEnabled, toggleSound, play } = useSound(mode);
  const { currentSection, progressRef, targetProgressRef, setTargetProgress, isMobile } = useCameraProgress();
  const { activeSection, boardState, exitBoard, navigateToSection, navigationTarget } = usePanelSystem({ progressRef, targetProgressRef, setTargetProgress });
  const previousBoardStateRef = useRef(boardState);
  const handleReady = useCallback(() => setLoading(false), []);
  const activeNavSection = navigationTarget || activeSection || currentSection.id;
  const isBoardVisible = Boolean(activeSection && activeSection !== 'hero' && boardState !== 'walking');
  const handleNavigate = useCallback(
    (sectionId) => {
      play('navigate');
      navigateToSection(sectionId);
    },
    [navigateToSection, play],
  );
  const handleToggleMode = useCallback(() => {
    play('chime');
    toggleMode();
  }, [play, toggleMode]);

  useEffect(() => {
    if (previousBoardStateRef.current === boardState) return;
    if (boardState === 'board-entering') play('chest');
    if (boardState === 'board-open') play('page');
    if (boardState === 'board-exiting') play('whoosh');
    previousBoardStateRef.current = boardState;
  }, [boardState, play]);

  return (
    <div className={`app-shell ${isMobile ? 'is-touch-journey' : ''}`}>
      <World mode={mode} onReady={handleReady} blurred={isBoardVisible} />
      <LoadingScreen visible={loading} />
      <ProgressBar />
      <div className={`world-board-overlay ${isBoardVisible ? 'is-visible' : ''}`} />
      <Navbar activeSection={activeNavSection} mode={mode} onToggleMode={handleToggleMode} soundEnabled={soundEnabled} onToggleSound={toggleSound} onNavigate={handleNavigate} />
      <ContentPanel activeSection={activeSection} boardState={boardState} exitBoard={exitBoard} />
      <JourneyMap activeSection={activeNavSection} boardState={boardState} onNavigate={handleNavigate} onSound={play} />
      <ProgressDots activeSection={activeNavSection} />
      <SectionLabel />
      <ScrollHint />
      <MinecraftPOVOverlay />
      <MobileBanner />
      <MobileSections />
    </div>
  );
}

export default function App() {
  return (
    <CameraProgressProvider>
      <MountainJourney />
    </CameraProgressProvider>
  );
}
