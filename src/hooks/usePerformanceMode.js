import { useEffect, useState } from 'react';

function detectLowEnd() {
  if (typeof navigator === 'undefined') return false;
  const cores = navigator.hardwareConcurrency || 8;
  const memory = navigator.deviceMemory || 8;
  return cores <= 4 || memory <= 4;
}

export function usePerformanceMode() {
  const [isLowEnd, setIsLowEnd] = useState(detectLowEnd);

  useEffect(() => {
    setIsLowEnd(detectLowEnd());
  }, []);

  return { isLowEnd };
}
