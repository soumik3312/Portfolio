import React from 'react';
import { ArrowDown, Download } from 'lucide-react';
import { portfolio } from '../../data/portfolio';
import { useCameraProgress } from '../../hooks/useCameraProgress';

const HeroOverlay = React.memo(function HeroOverlay() {
  const { progress, setTargetProgress } = useCameraProgress();
  const visible = progress < 0.1;
  const projectsTarget = 0.43;

  return (
    <section className={`hero-overlay ${visible ? 'is-visible' : ''}`} aria-label="Hero">
      <div className="hero-cardless-layout">
        <figure className="hero-portrait">
          <img src={portfolio.assets.photo} alt={portfolio.person.displayName} />
        </figure>
        <div className="hero-copy">
          <span className="hero-kicker">{portfolio.person.title}</span>
          <h1>{portfolio.person.displayName}</h1>
          <p>{portfolio.hero.description}</p>
          <strong>{portfolio.person.tagline}</strong>
          <div className="availability-badge">
            <i />
            {portfolio.hero.availability}
          </div>
          <div className="hero-actions">
            <button type="button" onClick={() => setTargetProgress(projectsTarget)}>
              <ArrowDown size={16} />
              View My Work
            </button>
            <a href={portfolio.assets.resume} download>
              <Download size={16} />
              Download Resume
            </a>
          </div>
        </div>
      </div>
    </section>
  );
});

export default HeroOverlay;
