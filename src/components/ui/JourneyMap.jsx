import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Compass, MapPin, X } from 'lucide-react';
import { journeySections } from '../../data/portfolio';

const stopIntel = {
  hero: {
    terrain: 'Spawn Ridge',
    detail: 'Entry point with the headline, quick identity, resume path, and first jump into the portfolio trail.',
    loot: 'Intro, role, resume',
    x: '10%',
    y: '76%',
  },
  about: {
    terrain: 'Pine Clearing',
    detail: 'Personal background, education, current focus, and the builder story behind the work.',
    loot: 'Bio, education, goals',
    x: '23%',
    y: '64%',
  },
  skills: {
    terrain: 'Tool Forge',
    detail: 'Flutter, AI/ML, backend, database, and platform skills grouped by practical build areas.',
    loot: 'Tech stack, tools',
    x: '36%',
    y: '55%',
  },
  projects: {
    terrain: 'Build Quarry',
    detail: 'Shipped product work with problems, solutions, features, results, and repository links.',
    loot: 'Case studies, repos',
    x: '50%',
    y: '43%',
  },
  ai: {
    terrain: 'Signal Tower',
    detail: 'Applied AI systems, NLP workflows, assistant architecture, metrics, and model notes.',
    loot: 'AI systems, metrics',
    x: '64%',
    y: '34%',
  },
  timeline: {
    terrain: 'Milestone Pass',
    detail: 'The journey route through projects, internship leadership, certifications, achievements, and hackathons.',
    loot: 'Timeline, awards',
    x: '76%',
    y: '25%',
  },
  github: {
    terrain: 'Repo Camp',
    detail: 'GitHub activity, public repository count, language spread, stars, and pinned project highlights.',
    loot: 'Stats, pinned repos',
    x: '87%',
    y: '38%',
  },
  contact: {
    terrain: 'Beacon Cliff',
    detail: 'Contact form, direct channels, social links, location details, and availability.',
    loot: 'Email, phone, socials',
    x: '92%',
    y: '16%',
  },
};

const JourneyMap = React.memo(function JourneyMap({ activeSection, onNavigate, onSound, boardState = 'walking' }) {
  const [expanded, setExpanded] = useState(false);
  const activeIndex = useMemo(() => Math.max(0, journeySections.findIndex((section) => section.id === activeSection)), [activeSection]);
  const activeStop = journeySections[activeIndex] || journeySections[0];
  const activeIntel = stopIntel[activeStop.id] || stopIntel.hero;
  const activePercent = (activeIndex / (journeySections.length - 1)) * 100;

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
        <Compass size={18} />
        <span>Map</span>
      </button>

      <AnimatePresence>
        {expanded ? (
          <motion.div
            className="journey-map-modal-layer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          >
            <button type="button" className="journey-map-backdrop" onClick={toggleMap} aria-label="Close journey map" />
            <motion.aside
              className="journey-map-panel"
              role="dialog"
              aria-modal="true"
              aria-label="Trail map"
              initial={{ opacity: 0, y: 18, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.96 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <header>
                <span>
                  <Compass size={15} />
                  Trail Compass
                </span>
                <button type="button" onClick={toggleMap} aria-label="Close journey map">
                  <X size={16} />
                </button>
              </header>

              <div className="journey-map-layout">
                <div className="journey-map-board" aria-label="Portfolio trail overview">
                  <span className="journey-map-compass-rose" aria-hidden="true">
                    <Compass size={34} />
                  </span>
                  <div className="journey-map-path-line" aria-hidden="true" />
                  {journeySections.map((section, index) => {
                    const details = stopIntel[section.id] || stopIntel.hero;
                    return (
                      <button
                        key={section.id}
                        type="button"
                        className={`journey-map-node ${section.id === activeStop.id ? 'is-active' : ''}`}
                        style={{ '--stop-x': details.x, '--stop-y': details.y }}
                        onClick={() => goToStop(section.id)}
                        onMouseEnter={() => onSound?.('hover')}
                        aria-label={`Go to ${section.navLabel}`}
                      >
                        <MapPin size={18} />
                        <span>{index + 1}</span>
                      </button>
                    );
                  })}
                </div>

                <aside className="journey-map-intel">
                  <span>Current Marker</span>
                  <h3>{activeStop.navLabel}</h3>
                  <p>{activeIntel.detail}</p>
                  <div>
                    <small>Terrain</small>
                    <strong>{activeIntel.terrain}</strong>
                  </div>
                  <div>
                    <small>Loot</small>
                    <strong>{activeIntel.loot}</strong>
                  </div>
                  <div>
                    <small>Progress</small>
                    <strong>{Math.round(activePercent)}%</strong>
                  </div>
                </aside>
              </div>

              <div className="journey-map-route" style={{ '--active-percent': `${activePercent}%` }}>
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
                      <em>{(stopIntel[section.id] || stopIntel.hero).terrain}</em>
                    </span>
                  </button>
                ))}
              </div>
            </motion.aside>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
});

export default JourneyMap;
