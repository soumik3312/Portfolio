import { useEffect, useState } from 'react';
import { Brain, GraduationCap, MapPin, Rocket, Target, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { portfolio } from '../../data/portfolio';

const icons = [Rocket, Brain, Trophy, Target];

export default function About() {
  const [buildIndex, setBuildIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setBuildIndex((index) => (index + 1) % portfolio.about.cyclingBuilds.length);
    }, 2500);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <section id="about" className="section" aria-label="About Soumik">
      <div className="section-inner grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <motion.div
          className="glass-card p-7 md:p-10"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <span className="section-label">About Ridge</span>
          <h2 className="mb-5 font-heading text-4xl font-extrabold text-white md:text-6xl">{portfolio.about.heading}</h2>
          <div className="space-y-4 text-base leading-8 text-slate-300">
            {portfolio.about.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <p className="font-medium text-cyan-100">{portfolio.about.difference}</p>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {portfolio.about.details.map((detail, index) => {
              const Icon = [GraduationCap, MapPin, Target, Brain][index] || Target;
              return (
                <span key={detail} className="pill">
                  <Icon size={14} />
                  {detail}
                </span>
              );
            })}
          </div>
          <div className="mt-7 rounded-2xl border border-cyan-300/15 bg-white/45 p-5">
            <p className="mono text-sm text-slate-300">Currently building and learning</p>
            <AnimatePresence mode="wait">
              <motion.p
                key={portfolio.about.cyclingBuilds[buildIndex]}
                className="gradient-text mt-2 font-heading text-2xl font-extrabold"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                transition={{ duration: 0.35 }}
              >
                {portfolio.about.cyclingBuilds[buildIndex]}
              </motion.p>
            </AnimatePresence>
          </div>
          <p className="mt-5 text-sm leading-7 text-slate-400">{portfolio.person.funFact}</p>
        </motion.div>

        <div className="grid grid-cols-2 gap-4">
          {portfolio.stats.slice(0, 4).map((stat, index) => {
            const Icon = icons[index] || Rocket;
            return (
              <motion.div
                key={stat.label}
                className="glass-card p-6"
                initial={{ opacity: 0, y: 40, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ delay: index * 0.1, duration: 0.65, ease: 'easeOut' }}
                style={{ animation: 'floatSoft 4s ease-in-out infinite', animationDelay: `${index * 0.25}s` }}
              >
                <Icon className="mb-5 text-cyan-200" />
                <p className="font-heading text-4xl font-extrabold text-white">{stat.value}</p>
                <p className="mt-2 text-sm text-slate-300">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
