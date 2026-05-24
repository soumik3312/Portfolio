import React from 'react';
import { portfolio } from '../../data/portfolio';

const heat = Array.from({ length: 35 }, (_, index) => (index * 7 + 3) % 5);

const GitHubBoard = React.memo(function GitHubBoard() {
  return (
    <article className="board-content github-board">
      <header>
        <span>GitHub</span>
        <i />
      </header>
      <div className="contribution-grid" aria-hidden="true">
        {heat.map((level, index) => (
          <span key={`${level}-${index}`} data-level={level} />
        ))}
      </div>
      <div className="repo-stack">
        {portfolio.github.pinnedRepos.map((repo) => (
          <a key={repo.name} href={repo.url} target="_blank" rel="noreferrer">
            <b>{repo.name}</b>
            <small>{repo.language}</small>
          </a>
        ))}
      </div>
      <div className="github-stats">
        {portfolio.github.stats.slice(0, 3).map((stat) => (
          <span key={stat.label}>
            <b>{stat.value}</b>
            {stat.label}
          </span>
        ))}
      </div>
    </article>
  );
});

export default GitHubBoard;
