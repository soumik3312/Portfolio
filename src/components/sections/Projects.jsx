import { useMemo, useState } from 'react';
import { ExternalLink, Filter, Github, Star } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { portfolio } from '../../data/portfolio';
import ProjectCard from '../ui/ProjectCard';

export default function Projects({ onSound }) {
  const categories = useMemo(() => ['All Projects', ...new Set(portfolio.projects.map((project) => project.category))], []);
  const [active, setActive] = useState('All Projects');
  const featured = portfolio.projects.find((project) => project.featured);
  const filtered = active === 'All Projects' ? portfolio.projects : portfolio.projects.filter((project) => project.category === active);

  return (
    <section id="projects" className="section" aria-label="Projects">
      <div className="section-inner">
        <motion.div
          className="mb-8 flex flex-col justify-between gap-6 lg:flex-row lg:items-end"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-3xl">
            <span className="section-label">Project Valley</span>
            <h2 className="font-heading text-4xl font-extrabold text-white md:text-6xl">Products with real engineering depth.</h2>
            <p className="mt-4 text-lg leading-8 text-slate-300">
              The largest part of the portfolio: Flutter apps, AI systems, full-stack backends, and integrated products with clear problems, solutions, and outcomes.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => {
                  onSound?.('click');
                  setActive(category);
                }}
                className={`pill transition ${active === category ? 'border-cyan-300/60 bg-cyan-300/15 text-cyan-100 shadow-neon' : 'text-slate-300'}`}
              >
                <Filter size={13} />
                {category}
              </button>
            ))}
          </div>
        </motion.div>

        {featured ? (
          <motion.article
            className="glass-card mb-6 grid min-h-[54vh] overflow-hidden lg:grid-cols-[0.95fr_1.05fr]"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7 }}
          >
            <div
              className="relative min-h-[300px] overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #0a0a1f 0%, #1a0a2e 50%, #0a1520 100%)',
                backgroundSize: '200% 200%',
                animation: 'gradientShift 4s ease infinite',
              }}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_40%,rgba(47,128,237,0.26),transparent_30%),radial-gradient(circle_at_70%_70%,rgba(36,147,110,0.22),transparent_28%)]" />
              <div className="absolute inset-0 grid place-items-center">
                <p className="font-heading text-6xl font-extrabold text-white/10 md:text-8xl">{featured.name}</p>
              </div>
              <div className="absolute left-8 top-8 rounded-full border border-cyan-300/30 bg-slate-950/40 px-4 py-2 text-sm text-cyan-100 backdrop-blur-xl">
                <Star className="mr-2 inline" size={16} />
                Featured
              </div>
              <div className="absolute right-8 top-8 rounded-full border border-white/40 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-slate-700 backdrop-blur-xl">
                Project preview
              </div>
              <div className="absolute bottom-8 left-8 right-8 rounded-3xl border border-white/10 bg-slate-950/50 p-5 backdrop-blur-xl">
                <p className="mono text-xs uppercase tracking-[0.2em] text-cyan-200">Featured product build</p>
                <p className="mt-2 font-heading text-3xl font-extrabold text-white">{portfolio.featuredProject.mainStatistic}</p>
              </div>
            </div>
            <div className="p-7 md:p-10">
              <span className="pill mb-5 border-cyan-300/30 bg-cyan-300/10 text-cyan-100">{featured.category}</span>
              <h3 className="mb-4 font-heading text-4xl font-extrabold text-white">{featured.name}</h3>
              <p className="mb-5 text-lg leading-8 text-slate-300">{portfolio.featuredProject.reason}</p>
              <p className="mb-6 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-emerald-100">
                {portfolio.featuredProject.achievement}
              </p>
              <div className="mb-7 flex flex-wrap gap-2">
                {featured.tech.map((tech) => (
                  <span key={tech} className="pill">
                    {tech}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                <a className="magnetic-btn primary" href={featured.github} target="_blank" rel="noreferrer">
                  GitHub
                  <Github size={18} />
                </a>
                {featured.demo?.includes('unavailable') || featured.demo?.startsWith('N/A') ? (
                  <span className="magnetic-btn secondary text-slate-300">Live demo unavailable</span>
                ) : (
                  <a className="magnetic-btn secondary" href={featured.demo} target="_blank" rel="noreferrer">
                    Live Demo
                    <ExternalLink size={18} />
                  </a>
                )}
              </div>
            </div>
          </motion.article>
        ) : null}

        <motion.div layout className="project-grid">
          <AnimatePresence mode="popLayout">
            {filtered.map((project) => (
              <ProjectCard key={project.name} project={project} onSound={onSound} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
