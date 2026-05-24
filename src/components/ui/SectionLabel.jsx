import React from 'react';
import { useCameraProgress } from '../../hooks/useCameraProgress';

const SectionLabel = React.memo(function SectionLabel() {
  const { currentSection } = useCameraProgress();
  return (
    <aside className="section-label-indicator" aria-live="polite">
      <span>↑ {currentSection.label}</span>
    </aside>
  );
});

export default SectionLabel;
