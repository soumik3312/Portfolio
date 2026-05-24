import React from 'react';
import { BrainCircuit, Server, Smartphone } from 'lucide-react';
import { portfolio } from '../../data/portfolio';

const groups = [
  { key: 'mobile', Icon: Smartphone },
  { key: 'ai', Icon: BrainCircuit },
  { key: 'fullStack', Icon: Server },
];

const SkillsBoard = React.memo(function SkillsBoard() {
  return (
    <article className="board-content skills-board">
      <header>
        <span>Skills</span>
        <i />
      </header>
      <div className="skill-mini-grid">
        {groups.map(({ key, Icon }) => {
          const group = portfolio.skills[key];
          return (
            <section key={key}>
              <h3>
                <Icon size={12} strokeWidth={2} />
                {group.title.replace(' Development', '')}
              </h3>
              {group.items.slice(0, 5).map((skill) => (
                <span key={skill}>{skill}</span>
              ))}
            </section>
          );
        })}
      </div>
    </article>
  );
});

export default SkillsBoard;
