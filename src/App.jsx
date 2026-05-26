import { useCallback, useState } from 'react';
import World from './components/world/World';
import MobileSections from './components/sections/MobileSections';
import ContentPanel from './components/ui/ContentPanel';
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
  const sound = useSound();
  const { currentSection, progressRef, targetProgressRef, setTargetProgress } = useCameraProgress();
  const { activeSection, boardState, exitBoard, navigateToSection, navigationTarget } = usePanelSystem({ progressRef, targetProgressRef, setTargetProgress });
  const handleReady = useCallback(() => setLoading(false), []);
  const activeNavSection = navigationTarget || activeSection || currentSection.id;
  const isBoardVisible = Boolean(activeSection && activeSection !== 'hero' && boardState !== 'walking');

  return (
    <div className="app-shell">
      <World mode={mode} onReady={handleReady} blurred={isBoardVisible} />
      <LoadingScreen visible={loading} />
      <ProgressBar />
      <div className={`world-board-overlay ${isBoardVisible ? 'is-visible' : ''}`} />
      <Navbar activeSection={activeNavSection} mode={mode} onToggleMode={toggleMode} soundEnabled={sound.enabled} onToggleSound={sound.toggleSound} onNavigate={navigateToSection} />
      <ContentPanel activeSection={activeSection} boardState={boardState} exitBoard={exitBoard} />
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
