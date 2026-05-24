import { BrainCircuit, GitBranch, ScanText, Workflow } from 'lucide-react';
import { motion } from 'framer-motion';
import { portfolio } from '../../data/portfolio';

const layers = [
  { label: 'Input', x: 9, nodes: [24, 50, 76], color: '#00d4ff' },
  { label: 'Features', x: 35, nodes: [14, 32, 50, 68, 86], color: '#7c3aed' },
  { label: 'Reasoning', x: 63, nodes: [22, 42, 62, 82], color: '#a78bfa' },
  { label: 'Output', x: 90, nodes: [36, 64], color: '#10b981' },
];

const connections = layers.slice(0, -1).flatMap((layer, layerIndex) =>
  layer.nodes.flatMap((y1) =>
    layers[layerIndex + 1].nodes.map((y2) => ({
      x1: layer.x,
      y1,
      x2: layers[layerIndex + 1].x,
      y2,
      color: layers[layerIndex + 1].color,
    })),
  ),
);

export default function AIShowcase() {
  return (
    <section id="ai-showcase" className="section" aria-label="AI and machine learning showcase">
      <div className="section-inner">
        <motion.div
          className="mb-8 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
        >
          <span className="section-label">AI Research Peak</span>
          <h2 className="gradient-text font-heading text-5xl font-extrabold md:text-7xl">Applied AI with measurable outcomes.</h2>
          <p className="mx-auto mt-4 max-w-3xl text-lg leading-8 text-slate-300">
            Flutter interfaces connected to OCR, language models, speech systems, and useful workflows, presented with the metrics recruiters look for first.
          </p>
        </motion.div>

        <motion.div
          className="glass-card mb-8 p-4 md:p-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
        >
          <svg viewBox="0 0 100 100" className="h-[360px] w-full overflow-visible" role="img" aria-label="Animated neural network">
            {connections.map((connection, index) => (
              <line
                key={`${connection.x1}-${connection.y1}-${connection.x2}-${connection.y2}`}
                x1={connection.x1}
                y1={connection.y1}
                x2={connection.x2}
                y2={connection.y2}
                stroke={connection.color}
                strokeOpacity="0.22"
                strokeWidth="0.22"
                strokeDasharray="3 7"
                style={{ animation: `signalTravel ${2.4 + (index % 8) * 0.2}s linear infinite` }}
              />
            ))}
            {layers.map((layer) => (
              <g key={layer.label}>
                <text x={layer.x} y="5" textAnchor="middle" fill={layer.color} fontSize="3.4" fontFamily="JetBrains Mono">
                  {layer.label}
                </text>
                {layer.nodes.map((y, index) => (
                  <circle
                    key={`${layer.label}-${y}`}
                    cx={layer.x}
                    cy={y}
                    r="3.2"
                    fill="#050a0e"
                    stroke={layer.color}
                    strokeWidth="0.8"
                    style={{ animation: `breathe ${2.8 + index * 0.2}s ease-in-out infinite` }}
                  />
                ))}
              </g>
            ))}
          </svg>
        </motion.div>

        <div className="mb-10 flex snap-x gap-5 overflow-x-auto pb-4">
          {portfolio.aiShowcase.map((project, index) => (
            <motion.article
              key={project.name}
              className="glass-card min-w-[82vw] snap-center p-6 md:min-w-[540px]"
              initial={{ opacity: 0, x: 70 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ delay: index * 0.12, duration: 0.65 }}
            >
              <div className="mb-5 flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-violet-400/15 text-violet-200">
                  {index === 0 ? <ScanText /> : <BrainCircuit />}
                </div>
                <div>
                  <p className="mono text-xs uppercase tracking-[0.16em] text-violet-200">AI system</p>
                  <h3 className="font-heading text-2xl font-extrabold text-white">{project.name}</h3>
                </div>
              </div>
              <p className="mb-5 text-slate-300">{project.problem}</p>
              <div className="mb-5 grid gap-3 sm:grid-cols-3">
                <div className="overflow-hidden rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-4">
                  <p className="mono text-xs text-cyan-200">accuracy</p>
                  <p className="font-heading font-extrabold text-white" style={{ fontSize: 'clamp(22px, 2.5vw, 42px)' }}>{project.accuracy}</p>
                </div>
                <div className="overflow-hidden rounded-2xl border border-violet-300/20 bg-violet-300/10 p-4">
                  <p className="mono text-xs text-violet-200">precision</p>
                  <p className="font-heading font-extrabold text-white" style={{ fontSize: 'clamp(22px, 2.5vw, 42px)' }}>{project.precision}</p>
                </div>
                <div className="overflow-hidden rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-4">
                  <p className="mono text-xs text-emerald-200">dataset</p>
                  <p className="text-sm text-white">{project.datasetSize}</p>
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/45 p-4">
                <p className="mono mb-3 flex items-center gap-2 text-xs text-cyan-100">
                  <Workflow size={14} />
                  mini architecture
                </p>
                <div className="flex flex-wrap items-center gap-2 text-sm text-slate-200">
                  <span className="pill">Input</span>
                  <GitBranch size={14} />
                  <span className="pill">OCR / Speech / Text</span>
                  <GitBranch size={14} />
                  <span className="pill">Transformer Pipeline</span>
                  <GitBranch size={14} />
                  <span className="pill">Flutter UX</span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
        >
          <p className="font-heading text-4xl font-extrabold text-white md:text-7xl">Flutter meets AI.</p>
          <p className="gradient-text mt-2 font-heading text-4xl font-extrabold md:text-7xl">I build apps that think.</p>
        </motion.div>
      </div>
    </section>
  );
}
