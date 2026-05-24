import React from 'react';
import { useCameraProgress } from '../../hooks/useCameraProgress';

const ProgressBar = React.memo(function ProgressBar() {
  const { progress } = useCameraProgress();
  return (
    <div className="journey-progress" aria-hidden="true">
      <span style={{ transform: `scaleX(${progress})` }} />
    </div>
  );
});

export default ProgressBar;
