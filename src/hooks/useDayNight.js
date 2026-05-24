import { useCallback, useEffect, useState } from 'react';
import gsap from 'gsap';

const themeVars = {
  day: {
    '--color-bg': '#ffffff',
    '--color-surface': '#fafaf8',
    '--color-border': '#e8e2d9',
    '--color-text-primary': '#1a1a1a',
    '--color-text-secondary': '#6b6b6b',
    '--color-text-muted': '#9a9a9a',
    '--color-accent': '#2d6a4f',
    '--color-accent-light': '#e8f5ee',
  },
  night: {
    '--color-bg': '#1a1a2e',
    '--color-surface': '#202038',
    '--color-border': '#34344f',
    '--color-text-primary': '#f0f0f0',
    '--color-text-secondary': '#c7cada',
    '--color-text-muted': '#8e94aa',
    '--color-accent': '#8dd7ad',
    '--color-accent-light': '#203b2e',
  },
};

export function useDayNight() {
  const [mode, setMode] = useState('day');

  useEffect(() => {
    document.documentElement.dataset.theme = mode;
    gsap.set(':root', themeVars[mode]);
  }, [mode]);

  const toggleMode = useCallback(() => {
    setMode((current) => {
      const next = current === 'night' ? 'day' : 'night';
      document.documentElement.dataset.theme = next;
      gsap.to(':root', {
        ...themeVars[next],
        duration: 2,
        ease: 'power3.inOut',
      });
      return next;
    });
  }, []);

  return { mode, isNight: mode === 'night', toggleMode };
}
