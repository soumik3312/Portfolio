import React from 'react';
import { useCameraProgress } from '../../hooks/useCameraProgress';

const ProgressDots = React.memo(function ProgressDots({ activeSection }) {
  const { jumpToSection, sections } = useCameraProgress();

  return (
    <div className="progress-dots" aria-label="Mountain progress">
      {sections.map((section) => (
        <button
          key={section.id}
          type="button"
          className={activeSection === section.id ? 'is-active' : ''}
          onClick={() => jumpToSection(section.id)}
          aria-label={`Go to ${section.label}`}
        >
          <span />
          <em>{section.label}</em>
        </button>
      ))}
    </div>
  );
});

export default ProgressDots;
