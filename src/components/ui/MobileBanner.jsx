import React from 'react';
import { useCameraProgress } from '../../hooks/useCameraProgress';

const MobileBanner = React.memo(function MobileBanner() {
  const { isMobile } = useCameraProgress();
  if (!isMobile) return null;

  return <div className="mobile-banner">Best experienced on desktop</div>;
});

export default MobileBanner;
