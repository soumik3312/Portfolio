import { useCallback, useState } from 'react';
import World from './components/world/World';
import MobileSections from './components/sections/MobileSections';
import ContentPanel from './components/ui/ContentPanel';
import LoadingScreen from './components/ui/LoadingScreen';
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
  const { progressRef } = useCameraProgress();
  const { activeSection } = usePanelSystem(progressRef);
  const handleReady = useCallback(() => setLoading(false), []);

  return (
    <div className="app-shell">
      <World mode={mode} onReady={handleReady} />
      <LoadingScreen visible={loading} />
      <ProgressBar />
      <Navbar activeSection={activeSection} mode={mode} onToggleMode={toggleMode} soundEnabled={sound.enabled} onToggleSound={sound.toggleSound} />
      <ContentPanel activeSection={activeSection} />
      <ProgressDots activeSection={activeSection} />
      <SectionLabel />
      <ScrollHint />
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
