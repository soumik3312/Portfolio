import React from 'react';
import { portfolioData } from '../../data/portfolio';

const MobileSections = React.memo(function MobileSections() {
  return (
    <main className="mobile-sections">
      <section>
        <h2>About Me</h2>
        <p>{portfolioData.about.paragraphs[0]}</p>
      </section>
      <section>
        <h2>Skills</h2>
        <div className="mobile-tags">
          {[...portfolioData.skills.mobile.slice(0, 5), ...portfolioData.skills.aiml.slice(0, 5), ...portfolioData.skills.fullstack.slice(0, 5)].map((skill) => (
            <span key={skill}>{skill}</span>
          ))}
        </div>
      </section>
      <section>
        <h2>Projects</h2>
        {portfolioData.projects.slice(0, 4).map((project) => (
          <a key={project.name} href={project.github} target="_blank" rel="noreferrer" className="mobile-card">
            <b>{project.name}</b>
            <p>{project.description}</p>
          </a>
        ))}
      </section>
      <section>
        <h2>AI / ML</h2>
        {portfolioData.projects.filter((project) => project.metrics).map((project) => (
          <div key={project.name} className="mobile-card">
            <b>{project.name}</b>
            <p>{project.metrics.accuracy} | {project.tech[0]}</p>
          </div>
        ))}
      </section>
      <section>
        <h2>Journey</h2>
        {portfolioData.timeline.slice(-5).map((item) => (
          <div key={`${item.year}-${item.title}`} className="mobile-timeline-row">
            <time>{item.year}</time>
            <p>{item.title}</p>
          </div>
        ))}
      </section>
      <section>
        <h2>GitHub</h2>
        <a href={portfolioData.github.url} target="_blank" rel="noreferrer" className="mobile-card">
          <b>@{portfolioData.github.username}</b>
          <p>{Object.values(portfolioData.github.stats).join(' | ')}</p>
        </a>
      </section>
      <section>
        <h2>Contact</h2>
        <p>{portfolioData.contact.availability}</p>
        <a href={`mailto:${portfolioData.contact.email}`} className="mobile-primary-link">{portfolioData.contact.email}</a>
      </section>
    </main>
  );
});

export default MobileSections;
