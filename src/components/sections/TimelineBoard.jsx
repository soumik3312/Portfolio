import React from 'react';
import { portfolio } from '../../data/portfolio';

const timelineItems = [
  portfolio.timeline[2],
  portfolio.timeline[5],
  portfolio.timeline[8],
  portfolio.timeline[9],
  portfolio.timeline[12],
];

const TimelineBoard = React.memo(function TimelineBoard() {
  return (
    <article className="board-content timeline-board">
      <header>
        <span>Journey</span>
        <i />
      </header>
      <div className="mini-timeline">
        {timelineItems.map((item) => (
          <section key={`${item.year}-${item.title}`}>
            <time>{item.year}</time>
            <p>{item.title}</p>
          </section>
        ))}
      </div>
    </article>
  );
});

export default TimelineBoard;
