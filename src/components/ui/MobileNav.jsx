import React from 'react';
import { BrainCircuit, Code2, Home, Mail, User } from 'lucide-react';

const tabs = [
  { id: 'hero', label: 'Home', Icon: Home },
  { id: 'about', label: 'About', Icon: User },
  { id: 'projects', label: 'Projects', Icon: Code2 },
  { id: 'ai', label: 'AI', Icon: BrainCircuit },
  { id: 'contact', label: 'Contact', Icon: Mail },
];

const MobileNav = React.memo(function MobileNav({ activeSection, onNavigate }) {
  const goTo = (id) => {
    if (onNavigate) {
      onNavigate(id);
    }
  };

  return (
    <nav className="mobile-nav is-visible" aria-label="Mobile navigation">
      {tabs.map((tab) => {
        const isActive = activeSection === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            className={`mobile-nav-btn ${isActive ? 'is-active' : ''}`}
            onClick={() => goTo(tab.id)}
            aria-label={tab.label}
          >
            <tab.Icon size={18} />
            <span>{tab.label}</span>
            {isActive ? <i className="mobile-nav-dot" /> : null}
          </button>
        );
      })}
    </nav>
  );
});

export default MobileNav;
