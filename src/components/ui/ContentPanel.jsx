import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Check, ChevronDown, Download, GitFork, Github, Linkedin, Mail, Send, Star } from 'lucide-react';
import { portfolioAssets, portfolioData, sectionTValues } from '../../data/portfolio';
import { useCameraProgress } from '../../hooks/useCameraProgress';

const panelHeaders = {
  about: { label: '01 / About Me', heading: 'More Than Just a Developer' },
  skills: { label: '02 / Skills', heading: 'What I Build With' },
  projects: { label: '03 / Projects', heading: 'Proof That Systems Ship' },
  ai: { label: '04 / AI & Machine Learning', heading: 'Apps That Think' },
  timeline: { label: '05 / Journey', heading: 'The Road Here' },
  github: { label: '06 / GitHub', heading: 'Open Source Activity' },
  contact: { label: '07 / Contact', heading: "Let's Build Something" },
};

const buildingPhrases = portfolioData.about.cyclingBuilds;

function PanelHeader({ section }) {
  const header = panelHeaders[section];

  return (
    <header className="content-panel-header">
      <span>{header.label}</span>
      <i />
      <h2>{header.heading}</h2>
    </header>
  );
}

function Tag({ children }) {
  return <span className="panel-tag">{children}</span>;
}

function HeroPanel() {
  const { setTargetProgress } = useCameraProgress();
  const data = portfolioData.personal;

  return (
    <div className="hero-panel-content">
      <figure className="hero-panel-photo">
        <img src={portfolioAssets.photo} alt={data.name} />
      </figure>
      <span className="hero-panel-label">{data.degree} · Open to Opportunities</span>
      <h1>{data.name}</h1>
      <p className="hero-panel-role">{data.title}</p>
      <p className="hero-panel-subtitle">{data.subtitle}</p>
      <strong>{data.tagline}</strong>
      <div className="panel-availability">
        <i />
        {data.availability}
      </div>
      <div className="hero-panel-actions">
        <button type="button" onClick={() => setTargetProgress(sectionTValues.about)}>
          View My Work
          <ArrowRight size={16} />
        </button>
        <a href={portfolioAssets.resume} download>
          Download Resume
          <Download size={16} />
        </a>
      </div>
    </div>
  );
}

function CyclingBuild() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setIndex((current) => (current + 1) % buildingPhrases.length);
    }, 2500);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <div className="currently-building">
      <span>Currently building →</span>
      <AnimatePresence mode="wait">
        <motion.b
          key={buildingPhrases[index]}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
        >
          {buildingPhrases[index]}
        </motion.b>
      </AnimatePresence>
    </div>
  );
}

function AboutPanel() {
  const data = portfolioData.personal;
  const stats = portfolioData.stats.panel;

  return (
    <>
      <PanelHeader section="about" />
      <div className="about-copy-stack">
        {portfolioData.about.paragraphs.map((paragraph) => (
          <p key={paragraph} className="panel-body-copy">
            {paragraph}
          </p>
        ))}
      </div>
      <div className="detail-pills">
        <Tag>🎓 {data.degree}</Tag>
        <Tag>📍 {data.location}</Tag>
        <Tag>📅 {data.year}</Tag>
      </div>
      <CyclingBuild />
      <div className="panel-divider" />
      <div className="stats-grid">
        {stats.map(({ value, label }) => (
          <section key={label}>
            <strong>{value}</strong>
            <span>{label}</span>
          </section>
        ))}
      </div>
    </>
  );
}

function SkillGroup({ title, skills }) {
  return (
    <section className="skill-group">
      <h3>{title}</h3>
      <div className="tag-grid">
        {skills.map((skill) => (
          <Tag key={skill}>{skill}</Tag>
        ))}
      </div>
    </section>
  );
}

function SkillsPanel() {
  return (
    <>
      <PanelHeader section="skills" />
      <SkillGroup title="MOBILE DEVELOPMENT" skills={portfolioData.skills.mobile} />
      <div className="panel-divider" />
      <SkillGroup title="AI & MACHINE LEARNING" skills={portfolioData.skills.aiml} />
      <div className="panel-divider" />
      <SkillGroup title="FULL STACK & BACKEND" skills={portfolioData.skills.fullstack} />
    </>
  );
}

function ProjectsPanel() {
  const [filter, setFilter] = useState('All');
  const tabs = ['All', 'Flutter', 'AI/ML', 'Integrated'];
  const projects = useMemo(() => {
    if (filter === 'All') return portfolioData.projects;
    if (filter === 'Flutter') return portfolioData.projects.filter((project) => project.tech.includes('Flutter'));
    return portfolioData.projects.filter((project) => project.category === filter);
  }, [filter]);

  return (
    <>
      <PanelHeader section="projects" />
      <div className="filter-tabs">
        {tabs.map((tab) => (
          <button key={tab} type="button" className={filter === tab ? 'is-active' : ''} onClick={() => setFilter(tab)}>
            {tab}
          </button>
        ))}
      </div>
      <div className="project-card-list">
        {projects.map((project) => (
          <motion.article key={project.name} className="panel-project-card" whileHover={{ y: -2 }}>
            <div className="panel-project-topline">
              <span>{project.category}</span>
              {project.featured ? (
                <em>
                  <Star size={11} />
                  Featured
                </em>
              ) : null}
            </div>
            <h3>{project.name}</h3>
            <p>{project.description}</p>
            <div className="panel-tech-row">
              {project.tech.map((tech) => (
                <Tag key={tech}>{tech}</Tag>
              ))}
            </div>
            <div className="panel-link-row">
              <a href={project.github} target="_blank" rel="noreferrer">
                GitHub →
              </a>
              {project.live ? (
                <a href={project.live} target="_blank" rel="noreferrer">
                  Live Demo →
                </a>
              ) : null}
            </div>
          </motion.article>
        ))}
      </div>
    </>
  );
}

function CountUpValue({ value }) {
  const [display, setDisplay] = useState('0');
  const textValue = String(value);
  const parsed = useMemo(() => textValue.match(/^(\d+(?:\.\d+)?)(.*)$/), [textValue]);

  useEffect(() => {
    if (!parsed) {
      setDisplay(textValue);
      return undefined;
    }

    const target = Number(parsed[1]);
    const suffix = parsed[2];
    const start = performance.now();
    let frameId;

    const tick = (now) => {
      const progress = Math.min((now - start) / 900, 1);
      const eased = 1 - (1 - progress) ** 3;
      const current = Math.round(target * eased);
      setDisplay(`${current}${suffix}`);
      if (progress < 1) frameId = window.requestAnimationFrame(tick);
    };

    frameId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frameId);
  }, [parsed, textValue]);

  return display;
}

function AIPanel() {
  const aiProjects = portfolioData.projects.filter((project) => project.metrics);

  return (
    <>
      <PanelHeader section="ai" />
      <p className="ai-intro">Most Flutter devs don't have this.</p>
      {aiProjects.map((project) => (
        <article key={project.name} className="ai-project-card">
          <span>AI SYSTEM</span>
          <h3>{project.name}</h3>
          <p>{project.description}</p>
          <div className="metrics-grid">
            {Object.entries(project.metrics).map(([label, value]) => (
              <section key={label}>
                <span>{label}</span>
                <strong>
                  <CountUpValue value={value} />
                </strong>
              </section>
            ))}
          </div>
          <div className="architecture-flow-panel">
            <small>mini architecture</small>
            <div>
              {project.tech.map((tech, index) => (
                <span key={tech}>
                  <Tag>{tech}</Tag>
                  {index < project.tech.length - 1 ? <b>→</b> : null}
                </span>
              ))}
            </div>
          </div>
        </article>
      ))}
      <div className="panel-divider" />
      <div className="ai-statement">
        <strong>Flutter meets AI.</strong>
        <em>I build apps that think.</em>
      </div>
    </>
  );
}

function TimelinePanel() {
  return (
    <>
      <PanelHeader section="timeline" />
      <motion.div className="journey-timeline" initial="hidden" animate="visible">
        {portfolioData.timeline.map((item, index) => (
          <motion.article
            key={`${item.year}-${item.title}`}
            variants={{
              hidden: { opacity: 0, y: 14 },
              visible: { opacity: 1, y: 0, transition: { delay: index * 0.06 } },
            }}
          >
            <time>{item.year}</time>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <div>
              {item.tags.map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </div>
          </motion.article>
        ))}
      </motion.div>
    </>
  );
}

function makeHeatmap() {
  return Array.from({ length: 52 * 7 }, (_, index) => {
    const weeklyWave = Math.sin(index * 0.29) + Math.cos(index * 0.13);
    const burst = index % 37 < 9 || index % 61 < 12 ? 1.4 : 0;
    const quietWeekend = index % 7 > 4 ? -0.9 : 0;
    const level = Math.max(0, Math.min(4, Math.floor(weeklyWave + burst + quietWeekend + 2)));
    return { id: index, level };
  });
}

function GitHubPanel() {
  const cells = useMemo(makeHeatmap, []);
  const stats = [
    [portfolioData.github.stats.commits, 'Total Commits'],
    [portfolioData.github.stats.repos, 'Public Repos'],
    [portfolioData.github.stats.languages, 'Languages'],
    [portfolioData.github.stats.stars, 'Stars Earned'],
  ];

  return (
    <>
      <PanelHeader section="github" />
      <div className="github-stat-grid">
        {stats.map(([value, label]) => (
          <section key={label}>
            <strong>{value}</strong>
            <span>{label}</span>
          </section>
        ))}
      </div>
      <div className="panel-divider" />
      <section className="github-heatmap-block">
        <h3>Contribution Activity</h3>
        <div className="github-heatmap">
          {cells.map((cell, index) => (
            <motion.span
              key={cell.id}
              data-level={cell.level}
              initial={{ opacity: 0, scale: 0.2 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.002, duration: 0.16 }}
            />
          ))}
        </div>
      </section>
      <div className="panel-divider" />
      <div className="pinned-repos">
        {portfolioData.github.pinned.map((repo) => (
          <article key={repo.name}>
            <div>
              <h3>
                <Github size={15} />
                {repo.name}
              </h3>
              <Tag>{repo.language}</Tag>
            </div>
            <p>{repo.description}</p>
            <footer>
              <span>
                <Star size={13} />
                {repo.stars}
              </span>
              <span>
                <GitFork size={13} />
                {repo.forks}
              </span>
            </footer>
          </article>
        ))}
      </div>
    </>
  );
}

function ContactPanel() {
  const [status, setStatus] = useState('idle');
  const firstName = portfolioData.personal.name.split(' ')[0];

  const handleSubmit = (event) => {
    event.preventDefault();
    setStatus('sending');
    window.setTimeout(() => setStatus('sent'), 700);
  };

  return (
    <>
      <PanelHeader section="contact" />
      <p className="panel-body-copy contact-subtext">For roles, internships, freelance projects, or product collaboration.</p>
      <form className="contact-form" onSubmit={handleSubmit}>
        <label>
          Your name
          <input type="text" placeholder={`${firstName}'s future teammate`} required />
        </label>
        <label>
          Your email
          <input type="email" placeholder="you@company.com" required />
        </label>
        <label>
          Message
          <textarea placeholder="Tell me what we are building..." required />
        </label>
        <button type="submit" disabled={status === 'sending'}>
          {status === 'sending' ? (
            'Sending...'
          ) : status === 'sent' ? (
            <>
              <Check size={16} />
              Message sent!
            </>
          ) : (
            <>
              <Send size={16} />
              Send Message
            </>
          )}
        </button>
      </form>
      <div className="panel-divider" />
      <section className="direct-channels">
        <h3>Direct Channels</h3>
        <a href={`mailto:${portfolioData.contact.email}`}>
          <Mail size={15} />
          {portfolioData.contact.email}
        </a>
        <div>
          <a href={portfolioData.contact.linkedin} target="_blank" rel="noreferrer">
            <Linkedin size={15} />
            LinkedIn
          </a>
          <a href={portfolioData.contact.github} target="_blank" rel="noreferrer">
            <Github size={15} />
            GitHub
          </a>
        </div>
      </section>
      <aside className="availability-card">
        <i />
        {portfolioData.contact.availability}
      </aside>
    </>
  );
}

function renderPanel(section) {
  if (section === 'hero') return <HeroPanel />;
  if (section === 'about') return <AboutPanel />;
  if (section === 'skills') return <SkillsPanel />;
  if (section === 'projects') return <ProjectsPanel />;
  if (section === 'ai') return <AIPanel />;
  if (section === 'timeline') return <TimelinePanel />;
  if (section === 'github') return <GitHubPanel />;
  if (section === 'contact') return <ContactPanel />;
  return null;
}

export default function ContentPanel({ activeSection }) {
  const isHero = activeSection === 'hero';
  const contentRef = useRef(null);

  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0 });
  }, [activeSection]);

  return (
    <AnimatePresence mode="wait">
      {activeSection ? (
        <motion.aside
          key={activeSection}
          className={`content-panel wood-panel ${isHero ? 'hero-content-panel' : 'section-content-panel'}`}
          initial={isHero ? { x: '-100%', y: '-50%', opacity: 0 } : { x: '-50%', y: '-44%', scale: 0.92, opacity: 0 }}
          animate={isHero ? { x: 0, y: '-50%', opacity: 1 } : { x: '-50%', y: '-50%', scale: 1, opacity: 1 }}
          exit={isHero ? { x: '-100%', y: '-50%', opacity: 0 } : { x: '-50%', y: '-60%', scale: 1.08, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          aria-live="polite"
        >
          <div ref={contentRef} className="content-panel-inner">{renderPanel(activeSection)}</div>
          {!isHero ? (
            <button
              type="button"
              className="wood-scroll-tab"
              onClick={() => contentRef.current?.scrollBy({ top: 280, behavior: 'smooth' })}
              aria-label="Scroll inside wooden board"
            >
              <span>Scroll</span>
              <ChevronDown size={15} />
            </button>
          ) : null}
        </motion.aside>
      ) : null}
    </AnimatePresence>
  );
}
