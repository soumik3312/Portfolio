import { BrainCircuit, Server, Smartphone } from 'lucide-react';
import { motion } from 'framer-motion';
import { portfolio } from '../../data/portfolio';

const iconMap = {
  Smartphone,
  BrainCircuit,
  Server,
};

const clusters = [
  { ...portfolio.skills.mobile, title: 'Mobile Development Peak' },
  { ...portfolio.skills.ai, title: 'AI / ML Peak' },
  { ...portfolio.skills.fullStack, title: 'Full Stack Peak' },
];

export default function Skills({ onSound }) {
  return (
    <section id="skills" className="section" aria-label="Skills">
      <div className="section-inner">
        <motion.div
          className="mb-12 max-w-3xl"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
        >
          <span className="section-label">Skills Summit</span>
          <h2 className="font-heading text-4xl font-extrabold text-white md:text-6xl">Three peaks of product engineering.</h2>
          <p className="mt-4 text-lg leading-8 text-slate-300">
            Mobile development, applied AI, and backend systems combine into one practical strength: building complete products from idea to deployment.
          </p>
        </motion.div>

        <div className="grid gap-5 lg:grid-cols-3">
          {clusters.map((cluster, clusterIndex) => {
            const Icon = iconMap[cluster.icon];
            return (
              <motion.article
                key={cluster.title}
                className="glass-card relative p-6"
                initial={{ opacity: 0, y: 36 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ delay: clusterIndex * 0.12, duration: 0.6, ease: 'easeOut' }}
              >
                <div
                  className="mb-5 grid h-14 w-14 place-items-center rounded-2xl border bg-white/70"
                  style={{ borderColor: `${cluster.color}55` }}
                >
                  <Icon size={28} color={cluster.color} />
                </div>
                <h3 className="font-heading text-2xl font-extrabold text-white">{cluster.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-300">{cluster.summary}</p>

                <div className="mt-6 flex flex-wrap gap-2">
                  {cluster.items.slice(0, 8).map((skill, index) => (
                    <button
                      key={skill}
                      type="button"
                      onMouseEnter={() => onSound?.('hover')}
                      className="pill transition hover:-translate-y-1"
                      style={{
                        borderColor: `${cluster.color}55`,
                        transitionDelay: `${index * 8}ms`,
                      }}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </motion.article>
            );
          })}
        </div>

        <motion.div
          className="mt-6 grid gap-4 md:grid-cols-3"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
        >
          <div className="glass-card p-5">
            <p className="mono mb-3 text-cyan-200">databases</p>
            <div className="flex flex-wrap gap-2">{portfolio.skills.databases.map((item) => <span key={item} className="pill">{item}</span>)}</div>
          </div>
          <div className="glass-card p-5">
            <p className="mono mb-3 text-violet-200">languages</p>
            <div className="flex flex-wrap gap-2">{portfolio.skills.languages.map((item) => <span key={item} className="pill">{item}</span>)}</div>
          </div>
          <div className="glass-card p-5">
            <p className="mono mb-3 text-emerald-200">tools</p>
            <div className="flex flex-wrap gap-2">{portfolio.skills.tools.map((item) => <span key={item} className="pill">{item}</span>)}</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
