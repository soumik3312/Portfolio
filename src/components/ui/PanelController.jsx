import { useEffect, useMemo, useRef, useState } from 'react';
import { sectionTValues } from '../../data/portfolio';

export function usePanelSystem(progressRef) {
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
  const [activeSection, setActiveSection] = useState('hero');
  const activeSectionRef = useRef('hero');
  const dismissedSectionRef = useRef(null);

  useEffect(() => {
    let frameId;

    const updateActiveSection = () => {
      const progress = progressRef.current;
      let nearest = null;
      let nearestDistance = 0.06;
      const current = activeSectionRef.current;
      const dismissedSection = sections.find((section) => section.id === dismissedSectionRef.current);

      if (dismissedSection && Math.abs(progress - dismissedSection.t) > 0.09) {
        dismissedSectionRef.current = null;
      }

      const dismissedId = dismissedSectionRef.current;

      if (current === 'hero') {
        nearest = progress > 0.06 ? null : 'hero';
      } else if (!current && progress < 0.03 && dismissedId !== 'hero') {
        nearest = 'hero';
      } else if (current && current !== 'hero') {
        const active = sections.find((section) => section.id === current);
        nearest = active && Math.abs(progress - active.t) <= 0.08 && current !== dismissedId ? current : null;
      }

      if (nearest !== 'hero') {
        for (const section of sections) {
          if (section.id === 'hero' || section.id === dismissedId) continue;
          const distance = Math.abs(progress - section.t);
          if (distance <= nearestDistance) {
            nearestDistance = distance;
            nearest = section.id;
          }
        }
      }

      if (nearest !== activeSectionRef.current) {
        activeSectionRef.current = nearest;
        setActiveSection(nearest);
      }

      frameId = window.requestAnimationFrame(updateActiveSection);
    };

    frameId = window.requestAnimationFrame(updateActiveSection);
    return () => window.cancelAnimationFrame(frameId);
  }, [progressRef, sections]);

  useEffect(() => {
    const handleOutsideWheel = (event) => {
      if (event.target instanceof Element && event.target.closest('.content-panel')) {
        return;
      }

      const current = activeSectionRef.current;
      if (!current) return;

      dismissedSectionRef.current = current;
      activeSectionRef.current = null;
      setActiveSection(null);
    };

    window.addEventListener('wheel', handleOutsideWheel, { passive: true });
    return () => window.removeEventListener('wheel', handleOutsideWheel);
  }, []);

  return { activeSection };
}
