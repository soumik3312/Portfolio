import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Compass, Map, MapPin, X } from 'lucide-react';
import { journeySections } from '../../data/portfolio';

const JourneyMap = React.memo(function JourneyMap({ activeSection, onNavigate, onSound, boardState = 'walking' }) {
  const [expanded, setExpanded] = useState(false);
  const activeIndex = useMemo(() => Math.max(0, journeySections.findIndex((section) => section.id === activeSection)), [activeSection]);
  const activeStop = journeySections[activeIndex] || journeySections[0];

  const toggleMap = () => {
    onSound?.('map');
    setExpanded((current) => !current);
  };

  const goToStop = (sectionId) => {
    onNavigate?.(sectionId);
    setExpanded(false);
  };

  return (
    <div className={`journey-map ${expanded ? 'is-expanded' : ''} ${boardState !== 'walking' ? 'is-board-visible' : ''}`}>
      <button type="button" className="journey-map-toggle" onClick={toggleMap} aria-expanded={expanded} aria-label="Open journey map">
        <Map size={18} />
        <span>{activeStop.navLabel}</span>
      </button>

      <AnimatePresence>
        {expanded ? (
          <motion.aside
            className="journey-map-panel"
            initial={{ opacity: 0, y: 18, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          >
            <header>
              <span>
                <Compass size={15} />
                Trail Map
              </span>
              <button type="button" onClick={toggleMap} aria-label="Close journey map">
                <X size={16} />
              </button>
            </header>

            <div className="journey-map-route" style={{ '--active-percent': `${(activeIndex / (journeySections.length - 1)) * 100}%` }}>
              {journeySections.map((section, index) => (
                <button
                  key={section.id}
                  type="button"
                  className={section.id === activeStop.id ? 'is-active' : ''}
                  style={{ '--stop-index': index }}
                  onClick={() => goToStop(section.id)}
                  onMouseEnter={() => onSound?.('hover')}
                >
                  <i>
                    <MapPin size={13} />
                  </i>
                  <span>
                    <strong>{section.navLabel}</strong>
                    <small>{section.title}</small>
                  </span>
                </button>
              ))}
            </div>
          </motion.aside>
        ) : null}
      </AnimatePresence>
    </div>
  );
});

export default JourneyMap;
