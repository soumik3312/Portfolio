import { createContext, createElement, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { journeySections } from '../data/portfolio';

const CameraProgressContext = createContext(null);

const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const MOBILE_AXIS_LOCK_PX = 9;
const MOBILE_SWIPE_THRESHOLD_PX = 42;
const MOBILE_WORLD_STEP = 0.075;
const MOBILE_OPEN_RANGE = 0.066;
const MOBILE_APPROACH_GAP = 0.058;
const MOBILE_STEP_COOLDOWN_MS = 180;
const mobileBoardSections = journeySections.filter((section) => section.id !== 'hero');

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

const isInteractiveJourneyTarget = (target) => {
  if (!(target instanceof Element)) return false;
  return Boolean(target.closest('button, a, input, textarea, select, [contenteditable], .navbar, .content-panel, .journey-map'));
};

export function CameraProgressProvider({ children }) {
  const progressRef = useRef(0);
  const targetProgressRef = useRef(0);
  const latestPublishedRef = useRef(0);
  const latestPublishTimeRef = useRef(0);
  const latestMobileStepTimeRef = useRef(0);
  const touchStateRef = useRef({
    tracking: false,
    lockedVertical: false,
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
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

  const stepMobileJourney = useCallback(
    (direction) => {
      const now = performance.now();
      if (now - latestMobileStepTimeRef.current < MOBILE_STEP_COOLDOWN_MS) return;
      latestMobileStepTimeRef.current = now;

      const current = targetProgressRef.current;
      let nextTarget = current;

      if (direction === 'forward') {
        const nextBoard = mobileBoardSections.find((section) => section.t > current + 0.006);
        if (!nextBoard) {
          nextTarget = 1;
        } else {
          const distance = nextBoard.t - current;
          nextTarget = distance <= MOBILE_OPEN_RANGE ? nextBoard.t : Math.min(current + MOBILE_WORLD_STEP, nextBoard.t - MOBILE_APPROACH_GAP);
        }
      } else {
        const previousBoard = [...mobileBoardSections].reverse().find((section) => section.t < current - 0.006);
        if (!previousBoard) {
          nextTarget = 0;
        } else {
          const distance = current - previousBoard.t;
          nextTarget = distance <= MOBILE_OPEN_RANGE ? previousBoard.t : Math.max(current - MOBILE_WORLD_STEP, previousBoard.t + MOBILE_APPROACH_GAP);
        }
      }

      setTargetProgress(nextTarget, true);
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
      if (isInteractiveJourneyTarget(event.target) || (event.target instanceof Element && event.target.closest('.content-panel'))) {
        return;
      }

      event.preventDefault();
      setTargetProgress(targetProgressRef.current + event.deltaY * 0.0003);
    };

    const handleKey = (event) => {
      if (isInteractiveJourneyTarget(event.target)) return;

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

    const hasOpenBoard = () =>
      Boolean(document.querySelector('.section-content-panel.is-board-entering, .section-content-panel.is-board-open, .section-content-panel.is-board-exiting'));

    const handleTouchStart = (event) => {
      if (event.touches.length !== 1 || hasOpenBoard() || isInteractiveJourneyTarget(event.target)) {
        touchStateRef.current.tracking = false;
        return;
      }

      const touch = event.touches[0];
      touchStateRef.current = {
        tracking: true,
        lockedVertical: false,
        startX: touch.clientX,
        startY: touch.clientY,
        currentX: touch.clientX,
        currentY: touch.clientY,
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
      state.currentX = touch.clientX;
      state.currentY = touch.clientY;

      if (!state.lockedVertical) {
        if (Math.abs(totalX) < MOBILE_AXIS_LOCK_PX && Math.abs(totalY) < MOBILE_AXIS_LOCK_PX) return;
        if (Math.abs(totalX) > Math.abs(totalY)) {
          state.tracking = false;
          return;
        }
        state.lockedVertical = true;
      }

      event.preventDefault();
    };

    const stopTouchTracking = (event) => {
      const state = touchStateRef.current;
      if (!state.tracking) return;

      const touch = event.changedTouches?.[0];
      const endX = touch?.clientX ?? state.currentX;
      const endY = touch?.clientY ?? state.currentY;
      const totalX = endX - state.startX;
      const totalY = state.startY - endY;
      state.tracking = false;

      if (Math.abs(totalY) < MOBILE_SWIPE_THRESHOLD_PX || Math.abs(totalY) < Math.abs(totalX) * 1.15) return;
      stepMobileJourney(totalY > 0 ? 'forward' : 'backward');
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
  }, [isMobile, stepMobileJourney, targetProgressRef]);

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
