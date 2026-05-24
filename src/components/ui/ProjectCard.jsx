import { Github, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProjectCard({ project, onSound }) {
  return (
    <motion.article
      layout
      className="glass-card group flex min-h-[420px] flex-col p-5 transition duration-300 hover:-translate-y-3 hover:border-cyan-300/50"
      whileHover={{ y: -12 }}
      onMouseEnter={() => onSound?.('hover')}
    >
      <div className={`relative mb-5 grid h-32 place-items-center overflow-hidden rounded-2xl bg-gradient-to-br ${project.gradient || 'from-cyan-400/30 to-violet-500/20'}`}>
        <div className="absolute h-24 w-24 rounded-full bg-white/20 blur-2xl" />
        <p className="relative px-4 text-center font-heading text-3xl font-extrabold text-white/55">{project.name}</p>
        <span className="absolute right-3 top-3 rounded-full bg-white/70 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.08em] text-slate-700">
          Project preview
        </span>
      </div>
      <div className="mb-3 flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-cyan-200">
        <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-neon" />
        <span className="mono">{project.category}</span>
      </div>
      <h3 className="mb-3 font-heading text-2xl font-extrabold text-white transition group-hover:text-cyan-200">{project.name}</h3>
      <p className="mb-5 text-sm leading-6 text-slate-300">{project.short}</p>
      <div className="mb-5 grid gap-3 text-sm">
        <div className="rounded-2xl border border-white/35 bg-white/40 p-3">
          <p className="mb-1 font-semibold text-slate-700">Challenge</p>
          <p className="leading-6 text-slate-300">{project.challenges?.[0] || project.problem || 'Project challenge coming soon.'}</p>
        </div>
        <div className="rounded-2xl border border-white/35 bg-white/40 p-3">
          <p className="mb-1 font-semibold text-slate-700">Outcome</p>
          <p className="leading-6 text-slate-300">{project.results?.[0] || 'Measurable outcome coming soon.'}</p>
        </div>
      </div>
      <div className="mb-5 flex flex-wrap gap-2">
        {project.tech.slice(0, 4).map((tech) => (
          <span key={tech} className="pill border-cyan-300/10 text-[0.68rem]">
            {tech}
          </span>
        ))}
        {project.tech.length > 4 ? <span className="pill text-[0.68rem]">+{project.tech.length - 4} more</span> : null}
      </div>
      <div className="mt-auto flex gap-3">
        <a
          href={project.github}
          target="_blank"
          rel="noreferrer"
          aria-label={`Open ${project.name} on GitHub`}
          className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5 text-slate-200 transition hover:border-cyan-300/40 hover:text-cyan-200"
        >
          <Github size={17} />
        </a>
        {!project.demo?.includes('unavailable') && !project.demo?.startsWith('N/A') ? (
          <a
            href={project.demo}
            target="_blank"
            rel="noreferrer"
            aria-label={`Open ${project.name} live demo`}
            className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5 text-slate-200 transition hover:border-cyan-300/40 hover:text-cyan-200"
          >
            <ExternalLink size={17} />
          </a>
        ) : (
          <span className="pill text-[0.68rem] text-slate-400">Demo unavailable</span>
        )}
      </div>
    </motion.article>
  );
}
