import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import DayNightToggle from './DayNightToggle';
import { portfolioAssets, portfolioData, sectionTValues } from '../../data/portfolio';
import { useCameraProgress } from '../../hooks/useCameraProgress';

const navLinks = [
  { label: 'Home', id: 'hero' },
  { label: 'About', id: 'about' },
  { label: 'Skills', id: 'skills' },
  { label: 'Projects', id: 'projects' },
  { label: 'AI', id: 'ai' },
  { label: 'Timeline', id: 'timeline' },
  { label: 'GitHub', id: 'github' },
  { label: 'Contact', id: 'contact' },
];

const Navbar = React.memo(function Navbar({ activeSection, mode, onToggleMode, soundEnabled, onToggleSound, onNavigate }) {
  const { setTargetProgress } = useCameraProgress();

  const goToSection = (sectionId) => {
    if (onNavigate) {
      onNavigate(sectionId);
      return;
    }
    setTargetProgress(sectionTValues[sectionId]);
  };

  return (
    <header className="navbar">
      <nav>
        <button type="button" className="brand-mark" onClick={() => goToSection('hero')} aria-label="Go to home">
          <span />
          {portfolioData.personal.displayName}
        </button>

        <div className="nav-links">
          {navLinks.map((section) => (
            <button
              key={section.id}
              type="button"
              className={activeSection === section.id ? 'is-active' : ''}
              onClick={() => goToSection(section.id)}
            >
              <span>{section.label}</span>
            </button>
          ))}
        </div>

        <div className="nav-tools">
          <DayNightToggle mode={mode} onToggle={onToggleMode} />
          <button type="button" className="icon-button" onClick={onToggleSound} aria-label="Toggle sound" aria-pressed={soundEnabled} title="Sound">
            {soundEnabled ? <Volume2 size={17} /> : <VolumeX size={17} />}
          </button>
          <a className="navbar-resume-link" href={portfolioAssets.resume} download>
            Resume
          </a>
        </div>
      </nav>
    </header>
  );
});

export default Navbar;
