import React from 'react';
import { ArrowDown } from 'lucide-react';
import { useCameraProgress } from '../../hooks/useCameraProgress';

const ScrollHint = React.memo(function ScrollHint() {
  const { hasInteracted, progress, isMobile } = useCameraProgress();
  if (hasInteracted || progress > 0.02 || isMobile) return null;

  return (
    <div className="scroll-hint">
      <ArrowDown size={14} />
      <span>Scroll to explore | Arrow keys also work</span>
    </div>
  );
});

export default ScrollHint;
