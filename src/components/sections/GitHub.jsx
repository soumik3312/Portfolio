import { useMemo } from 'react';
import { Code2, GitFork, Github, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { portfolio } from '../../data/portfolio';

function makeHeatmap() {
  return Array.from({ length: 52 * 7 }, (_, index) => {
    const wave = Math.sin(index * 0.37) + Math.cos(index * 0.11);
    const projectBursts = index % 29 < 7 ? 1 : 0;
    const level = Math.max(0, Math.min(4, Math.floor(wave + projectBursts + 2)));
    return { id: index, level };
  });
}

const levelColor = ['#0d1117', '#0e4429', '#006d32', '#26a641', '#39d353'];

export default function GitHub() {
  const cells = useMemo(makeHeatmap, []);

  return (
    <section id="github" className="section" aria-label="GitHub and open source">
      <div className="section-inner">
        <motion.div
          className="mb-10 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
        >
          <span className="section-label">Open Source</span>
          <h2 className="font-heading text-4xl font-extrabold text-white md:text-6xl">Repository work behind the products.</h2>
          <p className="mx-auto mt-4 max-w-3xl text-lg leading-8 text-slate-300">
            Public repositories, languages, and pinned builds that support the projects shown above.
          </p>
        </motion.div>

        <motion.div
          className="glass-card mb-6 overflow-x-auto p-5"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
        >
          <div className="grid w-max grid-flow-col grid-rows-7 gap-[3px]">
            {cells.map((cell, index) => (
              <motion.span
                key={cell.id}
                title={`Activity level ${cell.level}`}
                className="heat-cell"
                style={{ background: levelColor[cell.level] }}
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: (index % 52) * 0.006, duration: 0.2 }}
              />
            ))}
          </div>
        </motion.div>

        <div className="mb-6 grid gap-4 md:grid-cols-4">
          {portfolio.github.stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="glass-card p-5"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ delay: index * 0.08 }}
            >
              <Code2 className="mb-4 text-cyan-200" />
              <p className="font-heading text-3xl font-extrabold text-white">{stat.value}</p>
              <p className="mt-1 text-sm text-slate-300">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {portfolio.github.pinnedRepos.map((repo, index) => (
            <motion.a
              key={repo.name}
              href={repo.url}
              target="_blank"
              rel="noreferrer"
              className="glass-card block p-5 transition hover:-translate-y-2 hover:border-cyan-300/45"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ delay: index * 0.08 }}
            >
              <div className="mb-4 flex items-center justify-between">
                <Github className="text-cyan-200" />
                <span className="pill text-[0.68rem]">{repo.language}</span>
              </div>
              <h3 className="mb-2 font-heading text-2xl font-extrabold text-white">{repo.name}</h3>
              <p className="mb-5 text-sm leading-6 text-slate-300">{repo.description}</p>
              <div className="flex gap-3 text-sm text-slate-300">
                <span className="flex items-center gap-1">
                  <Star size={14} />
                  {repo.stars}
                </span>
                <span className="flex items-center gap-1">
                  <GitFork size={14} />
                  {repo.forks}
                </span>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
