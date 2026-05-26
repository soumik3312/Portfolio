import { createContext, createElement, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { journeySections } from '../data/portfolio';

const CameraProgressContext = createContext(null);

const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));

const findClosestSection = (progress) =>
  journeySections.reduce((closest, section) => {
    const closestDistance = Math.abs(progress - closest.t);
    const sectionDistance = Math.abs(progress - section.t);
    return sectionDistance < closestDistance ? section : closest;
  }, journeySections[0]);

const isMobileViewport = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768 || window.matchMedia('(pointer: coarse)').matches;
};

export function CameraProgressProvider({ children }) {
  const progressRef = useRef(0);
  const targetProgressRef = useRef(0);
  const latestPublishedRef = useRef(0);
  const latestPublishTimeRef = useRef(0);
  const touchStateRef = useRef({
    tracking: false,
    lockedVertical: false,
    startX: 0,
    startY: 0,
    lastY: 0,
  });
  const [progress, setProgress] = useState(0);
  const [currentSection, setCurrentSection] = useState(journeySections[0]);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isMobile, setIsMobile] = useState(isMobileViewport);

  useEffect(() => {
    const handleResize = () => setIsMobile(isMobileViewport());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const setTargetProgress = useCallback((value, markInteracted = true) => {
    targetProgressRef.current = clamp(value);
    if (markInteracted) setHasInteracted(true);
  }, []);

  const jumpToSection = useCallback(
    (sectionId) => {
      const section = journeySections.find((item) => item.id === sectionId);
      if (!section) return;
      setTargetProgress(section.t);
    },
    [setTargetProgress],
  );

  const publishProgress = useCallback((value) => {
    const now = performance.now();
    const movedEnough = Math.abs(value - latestPublishedRef.current) > 0.004;
    const waitedEnough = now - latestPublishTimeRef.current > 100;
    if (!movedEnough && !waitedEnough) return;

    latestPublishedRef.current = value;
    latestPublishTimeRef.current = now;
    setProgress(value);
    setCurrentSection(findClosestSection(value));
  }, []);

  useEffect(() => {
    if (isMobile) return undefined;

    const handleWheel = (event) => {
      if (event.target instanceof Element && event.target.closest('.content-panel')) {
        return;
      }

      event.preventDefault();
      setTargetProgress(targetProgressRef.current + event.deltaY * 0.0003);
    };

    const handleKey = (event) => {
      if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
        event.preventDefault();
        setTargetProgress(targetProgressRef.current + 0.04);
      }

      if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
        event.preventDefault();
        setTargetProgress(targetProgressRef.current - 0.04);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKey);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKey);
    };
  }, [isMobile, setTargetProgress]);

  useEffect(() => {
    if (!isMobile) return undefined;

    const getInteractiveTarget = (target) => {
      if (!(target instanceof Element)) return null;
      return target.closest('button, a, input, textarea, select, .navbar, .section-content-panel');
    };

    const hasOpenBoard = () =>
      Boolean(document.querySelector('.section-content-panel.is-board-entering, .section-content-panel.is-board-open, .section-content-panel.is-board-exiting'));

    const handleTouchStart = (event) => {
      if (event.touches.length !== 1 || hasOpenBoard() || getInteractiveTarget(event.target)) {
        touchStateRef.current.tracking = false;
        return;
      }

      const touch = event.touches[0];
      touchStateRef.current = {
        tracking: true,
        lockedVertical: false,
        startX: touch.clientX,
        startY: touch.clientY,
        lastY: touch.clientY,
      };
    };

    const handleTouchMove = (event) => {
      const state = touchStateRef.current;
      if (!state.tracking || event.touches.length !== 1) return;
      if (hasOpenBoard()) {
        state.tracking = false;
        return;
      }

      const touch = event.touches[0];
      const totalX = touch.clientX - state.startX;
      const totalY = touch.clientY - state.startY;

      if (!state.lockedVertical) {
        if (Math.abs(totalX) < 8 && Math.abs(totalY) < 8) return;
        if (Math.abs(totalX) > Math.abs(totalY)) {
          state.tracking = false;
          return;
        }
        state.lockedVertical = true;
      }

      event.preventDefault();
      const deltaY = state.lastY - touch.clientY;
      state.lastY = touch.clientY;

      if (Math.abs(deltaY) > 0.35) {
        setTargetProgress(targetProgressRef.current + deltaY * 0.00125);
      }
    };

    const stopTouchTracking = () => {
      touchStateRef.current.tracking = false;
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true, capture: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false, capture: true });
    window.addEventListener('touchend', stopTouchTracking, { passive: true });
    window.addEventListener('touchcancel', stopTouchTracking, { passive: true });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart, { capture: true });
      window.removeEventListener('touchmove', handleTouchMove, { capture: true });
      window.removeEventListener('touchend', stopTouchTracking);
      window.removeEventListener('touchcancel', stopTouchTracking);
    };
  }, [isMobile, setTargetProgress, targetProgressRef]);

  const value = useMemo(
    () => ({
      progress,
      progressRef,
      targetProgressRef,
      currentSection,
      hasInteracted,
      isMobile,
      sections: journeySections,
      setTargetProgress,
      jumpToSection,
      publishProgress,
    }),
    [currentSection, hasInteracted, isMobile, jumpToSection, progress, publishProgress, setTargetProgress],
  );

  return createElement(CameraProgressContext.Provider, { value }, children);
}

export function useCameraProgress() {
  const context = useContext(CameraProgressContext);
  if (!context) {
    throw new Error('useCameraProgress must be used inside CameraProgressProvider');
  }
  return context;
}
