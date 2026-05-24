import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { portfolio } from '../../data/portfolio';

const tabs = ['All', 'Flutter', 'AI/ML'];

const ProjectsBoard = React.memo(function ProjectsBoard() {
  return (
    <article className="board-content projects-board">
      <header>
        <span>Projects</span>
        <i />
      </header>
      <div className="board-tabs">
        {tabs.map((tab) => (
          <span key={tab}>{tab}</span>
        ))}
      </div>
      <div className="project-stack">
        {portfolio.projects.slice(0, 3).map((project) => (
          <a key={project.name} href={project.github} target="_blank" rel="noreferrer" className="mini-project">
            <b>{project.name}</b>
            <p>{project.short}</p>
            <em>{project.tech.slice(0, 3).join(' / ')}</em>
            <ArrowUpRight size={12} />
          </a>
        ))}
      </div>
    </article>
  );
});

export default ProjectsBoard;
