import React from 'react';
import { portfolio } from '../../data/portfolio';

const AIBoard = React.memo(function AIBoard() {
  return (
    <article className="board-content ai-board">
      <header>
        <span>AI / ML</span>
        <i />
      </header>
      <div className="ai-card-grid">
        {portfolio.aiShowcase.slice(0, 2).map((project) => (
          <section key={project.name}>
            <h3>{project.name.replace(' - Desktop AI Assistant', '')}</h3>
            <strong>{project.accuracy}</strong>
            <p>{project.features[0]}</p>
          </section>
        ))}
      </div>
      <div className="architecture-flow">Input -&gt; Process -&gt; Output</div>
    </article>
  );
});

export default AIBoard;
