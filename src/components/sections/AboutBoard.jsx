import React from 'react';
import { portfolio } from '../../data/portfolio';

const AboutBoard = React.memo(function AboutBoard() {
  const stats = ['10+ Projects', '2 Domains', portfolio.about.details[0]];
  return (
    <article className="board-content about-board">
      <header>
        <span>{portfolio.about.title}</span>
        <i />
      </header>
      <p>{portfolio.person.shortIntro}</p>
      <small>{portfolio.education[0].institution} | {portfolio.education[0].score}</small>
      <strong>Currently building: {portfolio.about.building}</strong>
      <div className="board-pills">
        {stats.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
    </article>
  );
});

export default AboutBoard;
