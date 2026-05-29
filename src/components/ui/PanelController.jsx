import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { sectionTValues } from '../../data/portfolio';

const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const BOARD_ENTER_MS = 600;
const BOARD_EXIT_MS = 500;
const MOBILE_BOARD_ENTER_MS = 420;
const MOBILE_BOARD_EXIT_MS = 340;
const DESKTOP_BOARD_EXIT_OFFSET = 0.07;
const MOBILE_BOARD_EXIT_OFFSET = 0.04;

export function usePanelSystem({ progressRef, targetProgressRef, setTargetProgress, isMobile = false }) {
  const sections = useMemo(
    () => [
      { id: 'hero', t: sectionTValues.hero },
      { id: 'about', t: sectionTValues.about },
      { id: 'skills', t: sectionTValues.skills },
      { id: 'projects', t: sectionTValues.projects },
      { id: 'ai', t: sectionTValues.ai },
      { id: 'timeline', t: sectionTValues.timeline },
      { id: 'github', t: sectionTValues.github },
      { id: 'contact', t: sectionTValues.contact },
    ],
    [],
  );
  const boardSections = useMemo(() => sections.filter((section) => section.id !== 'hero'), [sections]);
  const [activeSection, setActiveSection] = useState('hero');
  const [boardState, setBoardState] = useState('walking');
  const [navigationTarget, setNavigationTarget] = useState(null);
  const activeSectionRef = useRef('hero');
  const boardStateRef = useRef('walking');
  const lockedSectionRef = useRef(null);
  const dismissedSectionRef = useRef(null);
  const pendingNavigationRef = useRef(null);
  const timersRef = useRef([]);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((timerId) => window.clearTimeout(timerId));
    timersRef.current = [];
  }, []);

  const setActive = useCallback((sectionId) => {
    if (activeSectionRef.current === sectionId) return;
    activeSectionRef.current = sectionId;
    setActiveSection(sectionId);
  }, []);

  const setState = useCallback((nextState) => {
    if (boardStateRef.current === nextState) return;
    boardStateRef.current = nextState;
    setBoardState(nextState);
  }, []);

  const beginBoard = useCallback(
    (section) => {
      clearTimers();
      pendingNavigationRef.current = null;
      setNavigationTarget(null);
      lockedSectionRef.current = section;
      setTargetProgress(section.t, false);
      setActive(section.id);
      setState('board-entering');

      const enterTimer = window.setTimeout(() => {
        if (lockedSectionRef.current?.id === section.id && boardStateRef.current === 'board-entering') {
          setState('board-open');
        }
      }, isMobile ? MOBILE_BOARD_ENTER_MS : BOARD_ENTER_MS);

      timersRef.current.push(enterTimer);
    },
    [clearTimers, isMobile, setActive, setState, setTargetProgress],
  );

  const exitBoard = useCallback(
    (direction = 'forward') => {
      const section = lockedSectionRef.current || sections.find((item) => item.id === activeSectionRef.current);
      if (!section || section.id === 'hero') return;

      clearTimers();
      pendingNavigationRef.current = null;
      setNavigationTarget(null);
      dismissedSectionRef.current = section.id;
      setState('board-exiting');
      const exitOffset = isMobile ? MOBILE_BOARD_EXIT_OFFSET : DESKTOP_BOARD_EXIT_OFFSET;
      setTargetProgress(clamp(section.t + (direction === 'forward' ? exitOffset : -exitOffset)), true);

      const exitTimer = window.setTimeout(() => {
        lockedSectionRef.current = null;
        setActive(null);
        setState('walking');
      }, isMobile ? MOBILE_BOARD_EXIT_MS : BOARD_EXIT_MS);

      timersRef.current.push(exitTimer);
    },
    [clearTimers, isMobile, sections, setActive, setState, setTargetProgress],
  );

  const navigateToSection = useCallback(
    (sectionId) => {
      const section = sections.find((item) => item.id === sectionId);
      if (!section) return;

      clearTimers();
      lockedSectionRef.current = null;
      dismissedSectionRef.current = null;
      pendingNavigationRef.current = section;
      setNavigationTarget(section.id);
      setState('walking');
      setActive(sectionId === 'hero' ? 'hero' : null);
      setTargetProgress(section.t, true);
    },
    [clearTimers, sections, setActive, setState, setTargetProgress],
  );

  useEffect(() => {
    let frameId;

    const updateActiveSection = () => {
      const progress = progressRef.current;
      const dismissedSection = boardSections.find((section) => section.id === dismissedSectionRef.current);

      if (dismissedSection && Math.abs(progress - dismissedSection.t) > 0.09) {
        dismissedSectionRef.current = null;
      }

      if ((boardStateRef.current === 'board-entering' || boardStateRef.current === 'board-open') && lockedSectionRef.current) {
        targetProgressRef.current = lockedSectionRef.current.t;
      }

      if (boardStateRef.current === 'walking') {
        const pendingNavigation = pendingNavigationRef.current;

        if (pendingNavigation) {
          if (pendingNavigation.id === 'hero') {
            if (progress < 0.03) {
              pendingNavigationRef.current = null;
              setNavigationTarget(null);
              setActive('hero');
            } else if (activeSectionRef.current === 'hero' && progress > 0.06) {
              setActive(null);
            }

            frameId = window.requestAnimationFrame(updateActiveSection);
            return;
          }

          if (activeSectionRef.current === 'hero' && progress > 0.06) {
            setActive(null);
          }

          if (Math.abs(progress - pendingNavigation.t) <= 0.05) {
            beginBoard(pendingNavigation);
          }

          frameId = window.requestAnimationFrame(updateActiveSection);
          return;
        }

        if (progress < 0.03) {
          setActive('hero');
        } else if (activeSectionRef.current === 'hero' && progress > 0.06) {
          setActive(null);
        }

        let nearest = null;
        let nearestDistance = 0.05;
        const dismissedId = dismissedSectionRef.current;

        for (const section of boardSections) {
          if (section.id === dismissedId) continue;
          const distance = Math.abs(progress - section.t);
          if (distance <= nearestDistance) {
            nearest = section;
            nearestDistance = distance;
          }
        }

        if (nearest) {
          beginBoard(nearest);
        }
      }

      frameId = window.requestAnimationFrame(updateActiveSection);
    };

    frameId = window.requestAnimationFrame(updateActiveSection);
    return () => {
      window.cancelAnimationFrame(frameId);
      clearTimers();
    };
  }, [beginBoard, boardSections, clearTimers, progressRef, setActive, targetProgressRef]);

  return { activeSection, boardState, exitBoard, navigateToSection, navigationTarget };
}
