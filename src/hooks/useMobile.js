import { useEffect, useState } from 'react';

const getIsMobile = () => {
  if (typeof window === 'undefined') return false;
  return /Android|iPhone|iPad/i.test(window.navigator.userAgent) || window.innerWidth < 768;
};

export function useMobile() {
  const [isMobile, setIsMobile] = useState(getIsMobile);

  useEffect(() => {
    const onResize = () => setIsMobile(getIsMobile());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return isMobile;
}
