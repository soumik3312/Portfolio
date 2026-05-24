import { Award, BriefcaseBusiness, Code2, GraduationCap, Trophy, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { portfolio } from '../../data/portfolio';

const iconMap = {
  education: GraduationCap,
  project: Code2,
  experience: BriefcaseBusiness,
  hackathon: Trophy,
  leadership: Users,
  achievement: Award,
};

export default function Timeline() {
  return (
    <section id="timeline" className="section" aria-label="Experience and timeline">
      <div className="section-inner">
        <motion.div
          className="mb-14 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
        >
          <span className="section-label">Experience Pass</span>
          <h2 className="font-heading text-4xl font-extrabold text-white md:text-6xl">A steady climb through learning and leadership.</h2>
          <p className="mx-auto mt-4 max-w-3xl text-lg leading-8 text-slate-300">
            From academics and hackathons to leadership and shipped products, the path shows a developer who keeps expanding the system.
          </p>
        </motion.div>

        <div className="relative">
          <span className="timeline-line" />
          <div className="space-y-6">
            {portfolio.timeline.map((event, index) => {
              const Icon = iconMap[event.type] || Code2;
              const isLeft = index % 2 === 0;
              return (
                <motion.article
                  key={`${event.year}-${event.title}`}
                  className={`relative flex ${isLeft ? 'justify-start lg:pr-[52%]' : 'justify-start lg:justify-end lg:pl-[52%]'}`}
                  initial={{ opacity: 0, x: isLeft ? -80 : 80 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-90px' }}
                  transition={{ duration: 0.65, ease: 'easeOut' }}
                >
                  <span className="absolute left-0 top-6 z-10 grid h-8 w-8 place-items-center rounded-full border border-cyan-300/40 bg-white text-cyan-200 shadow-neon lg:left-1/2 lg:-translate-x-1/2">
                    <Icon size={15} />
                  </span>
                  <div className="glass-card ml-12 w-full p-5 lg:ml-0">
                    <p className="mono mb-2 text-sm text-cyan-200">{event.year}</p>
                    <h3 className="mb-2 font-heading text-xl font-extrabold text-white">{event.title}</h3>
                    <p className="text-sm leading-6 text-slate-300">{event.description}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {event.tags.map((tag) => (
                        <span key={tag} className="pill text-[0.68rem]">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
