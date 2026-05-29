import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Check, Download, ExternalLink, GitFork, Github, Instagram, Linkedin, Mail, Phone, Send, Star, Terminal, Twitter, X } from 'lucide-react';
import { portfolioAssets, portfolioData, sectionTValues } from '../../data/portfolio';
import { useCameraProgress } from '../../hooks/useCameraProgress';
import { sendContactMessage } from '../../services/contactMailer';

const panelHeaders = {
  about: { label: '01 ◆ ABOUT ME', heading: 'More Than Just a Developer' },
  skills: { label: '02 ◆ SKILLS', heading: 'What I Build With' },
  projects: { label: '03 ◆ PROJECTS', heading: 'Proof That Systems Ship' },
  ai: { label: '04 ◆ AI & MACHINE LEARNING', heading: 'Apps That Think' },
  timeline: { label: '05 ◆ JOURNEY', heading: 'The Road Here' },
  github: { label: '06 ◆ GITHUB', heading: 'Open Source Activity' },
  contact: { label: '07 ◆ CONTACT', heading: "Let's Build Something" },
};

const buildingPhrases = portfolioData.about.cyclingBuilds;

const glyphFixes = [
  [/Ã—/g, '×'],
  [/Â·/g, '·'],
  [/â€”/g, '—'],
  [/â€“/g, '–'],
  [/â†’/g, '→'],
  [/â†‘/g, '↑'],
];

const displayText = (value) => {
  if (typeof value !== 'string') return value;
  return glyphFixes.reduce((text, [pattern, replacement]) => text.replace(pattern, replacement), value);
};

const isInteractiveOverlayTarget = (target) => {
  if (!(target instanceof Element)) return false;
  return Boolean(target.closest('button, a, input, textarea, select, [contenteditable], .journey-map, .navbar'));
};

const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));

const getScrollMetrics = (element) => {
  if (!element) return { scrollable: false, atBottom: false, thumbTop: 0, thumbHeight: 100 };

  const maxScroll = Math.max(element.scrollHeight - element.clientHeight, 0);
  const scrollable = maxScroll > 12;
  const thumbHeight = scrollable ? clamp((element.clientHeight / element.scrollHeight) * 100, 16, 100) : 100;
  const thumbTop = scrollable ? (element.scrollTop / maxScroll) * (100 - thumbHeight) : 0;

  return {
    scrollable,
    atBottom: !scrollable || element.scrollTop + element.clientHeight >= element.scrollHeight - 12,
    thumbTop,
    thumbHeight,
  };
};

function DiamondDivider({ compact = false }) {
  return (
    <div className={`diamond-divider ${compact ? 'is-compact' : ''}`} aria-hidden="true">
      <div className="line" />
      <div className="diamond">◆</div>
      <div className="line" />
    </div>
  );
}

function PanelDivider() {
  return <DiamondDivider />;
}

function PanelHeader({ section }) {
  const header = panelHeaders[section];

  return (
    <header className="content-panel-header">
      <span>{header.label}</span>
      <DiamondDivider />
      <h2>{header.heading}</h2>
      <DiamondDivider />
    </header>
  );
}

function Tag({ children }) {
  return <span className="panel-tag">{displayText(children)}</span>;
}

function DetailCard({ eyebrow, title, children, href }) {
  const content = (
    <>
      {eyebrow ? <span>{displayText(eyebrow)}</span> : null}
      <h3>{displayText(title)}</h3>
      {children}
    </>
  );

  if (!href) return <article className="panel-detail-card">{content}</article>;
  return (
    <a className="panel-detail-card is-link" href={href} target="_blank" rel="noreferrer">
      {content}
    </a>
  );
}

function DetailList({ items }) {
  return (
    <ul className="panel-detail-list">
      {items.map((item) => (
        <li key={item}>{displayText(item)}</li>
      ))}
    </ul>
  );
}

function BoardNails({ hero = false }) {
  const nails = hero ? ['top-right', 'bottom-right'] : ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
  return nails.map((position) => <span key={position} className={`board-nail board-nail--${position}`} aria-hidden="true" />);
}

function HeroPanel({ onSound }) {
  const [photoOpen, setPhotoOpen] = useState(false);
  const { setTargetProgress } = useCameraProgress();
  const data = portfolioData.personal;
  const [firstName, ...lastNameParts] = data.name.split(' ');
  const openPhoto = () => {
    onSound?.('profile');
    setPhotoOpen(true);
  };
  const closePhoto = () => {
    onSound?.('close');
    setPhotoOpen(false);
  };

  return (
    <div className="hero-panel-content">
      <figure className="hero-panel-photo">
        <button type="button" onClick={openPhoto} aria-label="Open profile photo">
          <img src={portfolioAssets.photo} alt={data.name} />
        </button>
      </figure>
      {typeof document !== 'undefined'
        ? createPortal(
            <AnimatePresence>
              {photoOpen ? (
                <motion.div
                  className="profile-photo-lightbox"
                  role="dialog"
                  aria-modal="true"
                  aria-label="Profile photo"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <button type="button" className="profile-photo-backdrop" onClick={closePhoto} aria-label="Close profile photo" />
                  <motion.figure
                    initial={{ opacity: 0, y: 20, scale: 0.94 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 12, scale: 0.96 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <button type="button" className="profile-photo-close" onClick={closePhoto} aria-label="Close profile photo">
                      <X size={18} />
                    </button>
                    <img src={portfolioAssets.photo} alt={data.name} />
                    <figcaption>{data.name}</figcaption>
                  </motion.figure>
                </motion.div>
              ) : null}
            </AnimatePresence>,
            document.body,
          )
        : null}
      <DiamondDivider compact />
      <span className="hero-panel-label">B.Tech CSE (AIML) · Open to Opportunities</span>
      <h1>
        <span>{firstName}</span>
        <span>{lastNameParts.join(' ')}</span>
      </h1>
      <DiamondDivider compact />
      <p className="hero-panel-role">Flutter × AI/ML Developer</p>
      <p className="hero-panel-subtitle">Full Stack Engineer</p>
      <DiamondDivider compact />
      <strong>{data.tagline}</strong>
      <div className="panel-availability">
        <i />
        {displayText(data.availability)}
      </div>
      <div className="hero-panel-actions">
        <button
          type="button"
          onClick={() => {
            onSound?.('select');
            setTargetProgress(sectionTValues.about);
          }}
        >
          View My Work
          <ArrowRight size={15} />
        </button>
        <a href={portfolioAssets.resume} download>
          Download Resume
          <Download size={15} />
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
          {displayText(buildingPhrases[index])}
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
            {displayText(paragraph)}
          </p>
        ))}
      </div>
      <DetailCard eyebrow="What Makes Me Different" title="Complete Systems, Not Just Screens">
        <p>{displayText(portfolioData.about.difference)}</p>
      </DetailCard>
      <div className="detail-pills">
        <Tag>{data.degree}</Tag>
        <Tag>{data.location}</Tag>
        <Tag>Final Year · 2027 Expected</Tag>
      </div>
      <CyclingBuild />
      <PanelDivider />
      <div className="stats-grid">
        {stats.map(({ value, label }) => (
          <section key={label}>
            <strong>{displayText(value)}</strong>
            <span>{displayText(label)}</span>
          </section>
        ))}
      </div>
      <PanelDivider />
      <div className="panel-detail-grid">
        <DetailCard eyebrow="Current Focus" title="What I Am Sharpening">
          <p>{displayText(portfolioData.about.currentFocus)}</p>
        </DetailCard>
        <DetailCard eyebrow="Learning" title="Next Technical Layer">
          <p>{displayText(portfolioData.about.currentlyLearning)}</p>
        </DetailCard>
        <DetailCard eyebrow="Building" title="Current Products">
          <p>{displayText(portfolioData.about.currentlyBuilding)}</p>
        </DetailCard>
        <DetailCard eyebrow="Goal" title="Career Direction">
          <p>{displayText(portfolioData.about.careerGoal)}</p>
        </DetailCard>
      </div>
      <PanelDivider />
      <div className="panel-detail-stack">
        <h3 className="panel-section-title">Education</h3>
        {portfolioData.education.map((item) => (
          <DetailCard key={item.institution} eyebrow={`${item.period} · ${item.location}`} title={item.institution}>
            <p>{displayText([item.degree, item.specialization, item.score].filter(Boolean).join(' · '))}</p>
            <p>{displayText(item.description)}</p>
          </DetailCard>
        ))}
      </div>
      <PanelDivider />
      <div className="panel-detail-stack">
        <h3 className="panel-section-title">Experience & Leadership</h3>
        {portfolioData.experience.map((item) => (
          <DetailCard key={item.company} eyebrow={`${item.duration} · ${item.location}`} title={`${item.role} — ${item.company}`}>
            <p>{displayText(item.summary)}</p>
            <strong>Responsibilities</strong>
            <DetailList items={item.responsibilities} />
            <strong>Achievements</strong>
            <DetailList items={item.achievements} />
            <strong>Technologies</strong>
            <div className="panel-tech-row">
              {item.technologies.map((tech) => (
                <Tag key={tech}>{tech}</Tag>
              ))}
            </div>
            <strong>Impact</strong>
            <DetailList items={item.impact} />
          </DetailCard>
        ))}
      </div>
      <PanelDivider />
      <DetailCard eyebrow="Fun Fact" title="The Iron Man Thread">
        <p>{displayText(portfolioData.about.funFact)}</p>
      </DetailCard>
      <PanelDivider />
      <div className="panel-detail-grid">
        <DetailCard eyebrow="Hobbies" title="Music">
          <p>{displayText(portfolioData.personality.hobbies)}</p>
        </DetailCard>
        <DetailCard eyebrow="Interests" title="What Pulls My Curiosity">
          <DetailList items={portfolioData.personality.interests} />
        </DetailCard>
        <DetailCard eyebrow="Favorites" title="Technologies">
          <div className="panel-tech-row">
            {portfolioData.personality.favoriteTechnologies.map((tech) => (
              <Tag key={tech}>{tech}</Tag>
            ))}
          </div>
        </DetailCard>
        <DetailCard eyebrow="Personal" title="Languages & Dream Role">
          <p>{portfolioData.personality.languages.join(', ')}</p>
          <p>{displayText(portfolioData.personality.dreamRole)}</p>
        </DetailCard>
        <DetailCard eyebrow="Book" title={portfolioData.personality.favoriteBook}>
          <p>Favorite creator: {portfolioData.personality.favoriteCreator}</p>
        </DetailCard>
        <DetailCard eyebrow="Future Goals" title="Scale The Impact">
          <p>{displayText(portfolioData.personality.futureGoals)}</p>
        </DetailCard>
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
      <PanelDivider />
      <SkillGroup title="AI & MACHINE LEARNING" skills={portfolioData.skills.aiml} />
      <PanelDivider />
      <SkillGroup title="FULL STACK & BACKEND" skills={portfolioData.skills.fullstack} />
      <PanelDivider />
      <SkillGroup title="DATABASES" skills={portfolioData.skills.databases} />
      <PanelDivider />
      <SkillGroup title="PROGRAMMING LANGUAGES" skills={portfolioData.skills.languages} />
      <PanelDivider />
      <SkillGroup title="TOOLS & PLATFORMS" skills={portfolioData.skills.tools} />
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
              <span>{displayText(project.category)}</span>
              {project.featured ? (
                <em>
                  <Star size={11} />
                  Featured
                </em>
              ) : null}
            </div>
            <h3>{displayText(project.name)}</h3>
            <p>{displayText(project.description)}</p>
            <div className="panel-project-meta">
              <Tag>{project.role}</Tag>
              <Tag>{project.duration}</Tag>
              {project.teamSize ? <Tag>Team Size: {project.teamSize}</Tag> : null}
            </div>
            <div className="project-detail-stack">
              <p>
                <strong>Problem:</strong> {displayText(project.problem)}
              </p>
              <p>
                <strong>Solution:</strong> {displayText(project.solution)}
              </p>
            </div>
            {project.features?.length ? (
              <div className="project-detail-stack">
                <strong>Core Features</strong>
                <DetailList items={project.features} />
              </div>
            ) : null}
            {project.challenges?.length ? (
              <div className="project-detail-stack">
                <strong>Technical Challenges</strong>
                <DetailList items={project.challenges} />
              </div>
            ) : null}
            {project.results?.length ? (
              <div className="project-detail-stack">
                <strong>Results</strong>
                <DetailList items={project.results} />
              </div>
            ) : null}
            {project.futureScope?.length ? (
              <div className="project-detail-stack">
                <strong>Future Scope</strong>
                <DetailList items={project.futureScope} />
              </div>
            ) : null}
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
      setDisplay(displayText(textValue));
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

function getVisibleMetrics(project) {
  const metrics = Object.entries(project.metrics || {});
  if (project.name === 'J.A.R.V.I.S') return metrics.filter(([label]) => label === 'accuracy');
  if (project.name === 'NoteGenius AI') return metrics.filter(([label]) => label !== 'dataset');
  return metrics;
}

function AIPanel() {
  const aiProjects = portfolioData.projects.filter((project) => project.metrics);

  return (
    <>
      <PanelHeader section="ai" />
      <p className="ai-intro">Most Flutter devs don't have this.</p>
      {aiProjects.map((project) => {
        const visibleMetrics = getVisibleMetrics(project);

        return (
          <article key={project.name} className="ai-project-card">
          <span>AI SYSTEM</span>
          <h3>{displayText(project.name)}</h3>
          <p>{displayText(project.description)}</p>
          <div className="metrics-grid" data-count={visibleMetrics.length}>
            {visibleMetrics.map(([label, value]) => (
              <section key={label}>
                <span>{displayText(label)}</span>
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
          {project.aiDetails ? (
            <div className="project-detail-stack">
              <strong>AI Details</strong>
              <p>Dataset: {displayText(project.aiDetails.dataset)}</p>
              {project.aiDetails.datasetSize ? <p>Dataset Size: {displayText(project.aiDetails.datasetSize)}</p> : null}
              <p>Model: {displayText(project.aiDetails.model)}</p>
              <p>Training Time: {displayText(project.aiDetails.trainingTime)}</p>
              <div className="panel-tech-row">
                {project.aiDetails.frameworks.map((framework) => (
                  <Tag key={framework}>{framework}</Tag>
                ))}
              </div>
            </div>
          ) : null}
          </article>
        );
      })}
      <PanelDivider />
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
            <time>{displayText(item.year)}</time>
            <h3>{displayText(item.title)}</h3>
            <p>{displayText(item.description)}</p>
            <div>
              {item.tags.map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </div>
          </motion.article>
        ))}
      </motion.div>
      <PanelDivider />
      <div className="panel-detail-stack">
        <h3 className="panel-section-title">Certifications</h3>
        {portfolioData.certifications.map((certification) => (
          <DetailCard
            key={certification.name}
            eyebrow={`${certification.issuer} · ${certification.year}`}
            title={certification.name}
            href={certification.credential}
          >
            <p>{displayText(certification.description)}</p>
          </DetailCard>
        ))}
      </div>
      <PanelDivider />
      <div className="panel-detail-stack">
        <h3 className="panel-section-title">Achievements</h3>
        {portfolioData.achievements.map((achievement) => (
          <DetailCard key={achievement.title} eyebrow={achievement.year} title={achievement.title}>
            <p>{displayText(achievement.description)}</p>
          </DetailCard>
        ))}
      </div>
      <PanelDivider />
      <div className="panel-detail-stack">
        <h3 className="panel-section-title">Hackathons</h3>
        {portfolioData.hackathons.map((hackathon) => (
          <DetailCard key={hackathon.name} eyebrow={`${hackathon.year} · ${hackathon.achievement}`} title={hackathon.name}>
            <p>{displayText(hackathon.theme)}</p>
            <p>{displayText(hackathon.description)}</p>
          </DetailCard>
        ))}
      </div>
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
      <section className="github-command-card">
        <div>
          <span>
            <Terminal size={13} />
            developer terminal
          </span>
          <h3>@{portfolioData.github.username}</h3>
          <p>Public builds, experiments, AI tooling, Flutter apps, backend systems, and product code behind the portfolio.</p>
        </div>
        <a href={portfolioData.github.url} target="_blank" rel="noreferrer">
          Open GitHub
          <ExternalLink size={14} />
        </a>
      </section>
      <div className="github-stat-grid">
        {stats.map(([value, label]) => (
          <section key={label}>
            <strong>{displayText(value)}</strong>
            <span>{label}</span>
          </section>
        ))}
      </div>
      <PanelDivider />
      <section className="github-heatmap-block">
        <div className="github-section-heading">
          <h3>Contribution Activity</h3>
          <span>year view</span>
        </div>
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
        <div className="github-heatmap-legend" aria-hidden="true">
          <span>Less</span>
          {[0, 1, 2, 3, 4].map((level) => (
            <i key={level} data-level={level} />
          ))}
          <span>More</span>
        </div>
      </section>
      <PanelDivider />
      <div className="github-section-heading">
        <h3>Pinned Repositories</h3>
        <span>flagship codebases</span>
      </div>
      <div className="pinned-repos">
        {portfolioData.github.pinned.map((repo) => (
          <a key={repo.name} href={repo.url} target="_blank" rel="noreferrer">
            <div>
              <h3>
                <Github size={15} />
                {displayText(repo.name)}
              </h3>
              <Tag>{repo.language}</Tag>
            </div>
            <p>{displayText(repo.description)}</p>
            <footer>
              <span>
                <Star size={13} />
                {repo.stars}
              </span>
              <span>
                <GitFork size={13} />
                {repo.forks}
              </span>
              <span>
                <ExternalLink size={13} />
                View
              </span>
            </footer>
          </a>
        ))}
      </div>
    </>
  );
}

function ContactPanel({ onSound }) {
  const [status, setStatus] = useState('idle');
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const firstName = portfolioData.personal.name.split(' ')[0];

  const updateForm = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    onSound?.('submit');
    setStatus('sending');

    try {
      const result = await sendContactMessage(form, 'Wooden board contact form');
      if (result.status === 'fallback') {
        window.location.href = result.fallbackUrl;
        setStatus('fallback');
        return;
      }

      setStatus('sent');
      onSound?.('success');
      setForm({ name: '', email: '', message: '' });
    } catch {
      onSound?.('error');
      setStatus('error');
    }
  };

  return (
    <>
      <PanelHeader section="contact" />
      <p className="panel-body-copy contact-subtext">For roles, internships, freelance projects, or product collaboration.</p>
      <form className="contact-form" onSubmit={handleSubmit}>
        <label>
          Your name
          <input name="name" type="text" value={form.name} onChange={updateForm} placeholder={`${firstName}'s future teammate`} required />
        </label>
        <label>
          Your email
          <input name="email" type="email" value={form.email} onChange={updateForm} placeholder="you@company.com" required />
        </label>
        <label>
          Message
          <textarea name="message" value={form.message} onChange={updateForm} placeholder="Tell me what we are building..." required />
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
        <p className={`contact-form-status is-${status}`} role="status">
          {status === 'sent' ? 'Message sent directly to my inbox.' : null}
          {status === 'fallback' ? 'Direct email service is not configured yet. Opening your email client instead.' : null}
          {status === 'error' ? 'Message failed. Please use one of the direct channels below.' : null}
        </p>
      </form>
      <PanelDivider />
      <section className="direct-channels">
        <h3>Direct Channels</h3>
        <a href={`mailto:${portfolioData.contact.email}`}>
          <Mail size={15} />
          {portfolioData.contact.email}
        </a>
        <a href={`tel:${portfolioData.contact.phone.replace(/\s/g, '')}`}>
          <Phone size={15} />
          {portfolioData.contact.phone}
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
          <a href={portfolioData.contact.twitter} target="_blank" rel="noreferrer">
            <Twitter size={15} />
            Twitter/X
          </a>
          <a href={portfolioData.contact.instagram} target="_blank" rel="noreferrer">
            <Instagram size={15} />
            Instagram
          </a>
        </div>
        <p className="contact-meta-line">Preferred: {portfolioData.contact.preferred} · {portfolioData.contact.timezone}</p>
      </section>
      <PanelDivider />
      <div className="panel-detail-grid">
        <DetailCard eyebrow="Current Address" title="Jaipur">
          <p>{portfolioData.contact.currentAddress}</p>
        </DetailCard>
        <DetailCard eyebrow="Permanent Address" title="Durgapur">
          <p>{portfolioData.contact.permanentAddress}</p>
        </DetailCard>
      </div>
      <aside className="availability-card">
        <i />
        {displayText(portfolioData.contact.availability)}
      </aside>
    </>
  );
}

function renderPanel(section, onSound) {
  if (section === 'hero') return <HeroPanel onSound={onSound} />;
  if (section === 'about') return <AboutPanel />;
  if (section === 'skills') return <SkillsPanel />;
  if (section === 'projects') return <ProjectsPanel />;
  if (section === 'ai') return <AIPanel />;
  if (section === 'timeline') return <TimelinePanel />;
  if (section === 'github') return <GitHubPanel />;
  if (section === 'contact') return <ContactPanel onSound={onSound} />;
  return null;
}

const getBoardVariants = (isMobile) => ({
  hidden: {
    opacity: 0,
    scale: 0.88,
    x: '-50%',
    y: '-46%',
  },
  visible: {
    opacity: 1,
    scale: 1,
    x: '-50%',
    y: '-50%',
    filter: 'blur(0px)',
    transition: { duration: isMobile ? 0.38 : 0.6, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    scale: 0.94,
    x: '-50%',
    y: '-56%',
    filter: 'blur(4px)',
    transition: { duration: isMobile ? 0.28 : 0.4, ease: [0.4, 0, 1, 1] },
  },
});

const heroVariants = (delay) => ({
  hidden: {
    x: -400,
    y: '-50%',
    opacity: 0,
  },
  visible: {
    x: 0,
    y: '-50%',
    opacity: 1,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1], delay },
  },
  exit: {
    x: -400,
    y: '-50%',
    opacity: 0,
    transition: { duration: 0.4, ease: [0.4, 0, 1, 1] },
  },
});

export { DiamondDivider };

export default function ContentPanel({ activeSection, boardState = 'walking', exitBoard, onSound }) {
  const { isMobile, stepMobileJourney } = useCameraProgress();
  const isHero = activeSection === 'hero';
  const isBoard = Boolean(activeSection && !isHero);
  const shouldShowPanel = Boolean(activeSection && (isHero || boardState !== 'walking'));
  const contentRef = useRef(null);
  const heroHasAnimatedRef = useRef(false);
  const touchScrollRef = useRef({ tracking: false, startX: 0, startY: 0, lastY: 0, boundaryTravel: 0, boundaryDirection: null });
  const [isScrollable, setIsScrollable] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [scrollMetrics, setScrollMetrics] = useState({ thumbTop: 0, thumbHeight: 100 });

  const updateScrollState = useCallback(() => {
    const panel = contentRef.current;
    if (!panel || !shouldShowPanel) {
      setIsScrollable(false);
      setIsAtBottom(false);
      setScrollMetrics({ thumbTop: 0, thumbHeight: 100 });
      return;
    }

    const nextMetrics = getScrollMetrics(panel);
    setIsScrollable(nextMetrics.scrollable);
    setIsAtBottom(nextMetrics.atBottom);
    setScrollMetrics({ thumbTop: nextMetrics.thumbTop, thumbHeight: nextMetrics.thumbHeight });
  }, [shouldShowPanel]);

  const applyBoardScroll = useCallback(
    (delta) => {
      const board = contentRef.current;
      if (!board || boardState !== 'board-open') return;

      const scrollable = board.scrollHeight - board.clientHeight > 12;
      if (!scrollable) {
        window.requestAnimationFrame(updateScrollState);
        return;
      }

      const atBottom = board.scrollTop + board.clientHeight >= board.scrollHeight - 10;
      const atTop = board.scrollTop <= 0;

      if (delta > 0 && atBottom) {
        exitBoard?.('forward');
        return;
      }

      if (delta < 0 && atTop) {
        exitBoard?.('backward');
        return;
      }

      board.scrollTop += delta * 0.8;
      window.requestAnimationFrame(updateScrollState);
    },
    [boardState, exitBoard, updateScrollState],
  );

  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0 });
    const frameId = window.requestAnimationFrame(updateScrollState);
    return () => window.cancelAnimationFrame(frameId);
  }, [activeSection, updateScrollState]);

  useEffect(() => {
    if (isHero) heroHasAnimatedRef.current = true;
  }, [isHero]);

  useEffect(() => {
    if (!isMobile || !isHero) return undefined;

    const panel = contentRef.current;
    if (!panel) return undefined;

    const heroTouchRef = { tracking: false, lastY: 0, boundaryTravel: 0, boundaryDirection: null };

    const handleTouchStart = (event) => {
      if (event.touches.length !== 1) {
        heroTouchRef.tracking = false;
        return;
      }

      heroTouchRef.tracking = true;
      heroTouchRef.lastY = event.touches[0].clientY;
      heroTouchRef.boundaryTravel = 0;
      heroTouchRef.boundaryDirection = null;
    };

    const handleTouchMove = (event) => {
      if (!heroTouchRef.tracking || event.touches.length !== 1) return;

      const currentY = event.touches[0].clientY;
      const deltaY = heroTouchRef.lastY - currentY;
      heroTouchRef.lastY = currentY;
      if (Math.abs(deltaY) < 0.4) return;

      const { scrollable } = getScrollMetrics(panel);
      const atBottom = !scrollable || panel.scrollTop + panel.clientHeight >= panel.scrollHeight - 8;
      const atTop = !scrollable || panel.scrollTop <= 0;
      const boundaryDirection = deltaY > 0 ? 'forward' : 'backward';
      const pushingPastEdge = (deltaY > 0 && atBottom) || (deltaY < 0 && atTop);

      if (!pushingPastEdge) {
        heroTouchRef.boundaryTravel = 0;
        heroTouchRef.boundaryDirection = null;
        window.requestAnimationFrame(updateScrollState);
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation?.();

      if (heroTouchRef.boundaryDirection !== boundaryDirection) {
        heroTouchRef.boundaryDirection = boundaryDirection;
        heroTouchRef.boundaryTravel = 0;
      }

      heroTouchRef.boundaryTravel += Math.abs(deltaY);
      if (heroTouchRef.boundaryTravel > 52) {
        heroTouchRef.tracking = false;
        stepMobileJourney?.(boundaryDirection);
      }
    };

    const handleTouchEnd = () => {
      heroTouchRef.tracking = false;
    };

    panel.addEventListener('touchstart', handleTouchStart, { passive: true });
    panel.addEventListener('touchmove', handleTouchMove, { passive: false });
    panel.addEventListener('touchend', handleTouchEnd, { passive: true });
    panel.addEventListener('touchcancel', handleTouchEnd, { passive: true });

    return () => {
      panel.removeEventListener('touchstart', handleTouchStart);
      panel.removeEventListener('touchmove', handleTouchMove);
      panel.removeEventListener('touchend', handleTouchEnd);
      panel.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [isHero, isMobile, stepMobileJourney, updateScrollState]);

  useEffect(() => {
    if (!isBoard || boardState === 'walking') return undefined;

    const handleWheel = (event) => {
      if (isInteractiveOverlayTarget(event.target)) return;

      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation?.();

      if (boardState !== 'board-open') return;
      applyBoardScroll(event.deltaY);
    };

    window.addEventListener('wheel', handleWheel, { passive: false, capture: true });
    return () => window.removeEventListener('wheel', handleWheel, { capture: true });
  }, [applyBoardScroll, boardState, isBoard]);

  useEffect(() => {
    if (!isBoard || boardState === 'walking') return undefined;
    if (!isMobile) return undefined;

    const board = contentRef.current;
    if (!board) return undefined;

    const handleTouchStart = (event) => {
      if (event.touches.length !== 1 || isInteractiveOverlayTarget(event.target)) {
        touchScrollRef.current.tracking = false;
        return;
      }

      const touch = event.touches[0];
      touchScrollRef.current = {
        tracking: true,
        startX: touch.clientX,
        startY: touch.clientY,
        lastY: touch.clientY,
        boundaryTravel: 0,
        boundaryDirection: null,
      };
    };

    const handleTouchMove = (event) => {
      const state = touchScrollRef.current;
      if (!state.tracking || event.touches.length !== 1 || isInteractiveOverlayTarget(event.target)) return;
      if (boardState !== 'board-open') return;

      const currentY = event.touches[0].clientY;
      const deltaY = state.lastY - currentY;
      state.lastY = currentY;
      if (Math.abs(deltaY) < 0.4) return;

      const scrollable = board.scrollHeight - board.clientHeight > 12;
      const atBottom = !scrollable || board.scrollTop + board.clientHeight >= board.scrollHeight - 8;
      const atTop = !scrollable || board.scrollTop <= 0;
      const boundaryDirection = deltaY > 0 ? 'forward' : 'backward';
      const pushingPastEdge = (deltaY > 0 && atBottom) || (deltaY < 0 && atTop);

      if (pushingPastEdge) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation?.();

        if (state.boundaryDirection !== boundaryDirection) {
          state.boundaryDirection = boundaryDirection;
          state.boundaryTravel = 0;
        }

        state.boundaryTravel += Math.abs(deltaY);
        if (state.boundaryTravel > 52) {
          state.tracking = false;
          exitBoard?.(boundaryDirection);
        }
        return;
      }

      state.boundaryTravel = 0;
      state.boundaryDirection = null;
      window.requestAnimationFrame(updateScrollState);
    };

    const stopTouchScroll = () => {
      touchScrollRef.current.tracking = false;
    };

    board.addEventListener('touchstart', handleTouchStart, { passive: true });
    board.addEventListener('touchmove', handleTouchMove, { passive: false });
    board.addEventListener('touchend', stopTouchScroll, { passive: true });
    board.addEventListener('touchcancel', stopTouchScroll, { passive: true });

    return () => {
      board.removeEventListener('touchstart', handleTouchStart);
      board.removeEventListener('touchmove', handleTouchMove);
      board.removeEventListener('touchend', stopTouchScroll);
      board.removeEventListener('touchcancel', stopTouchScroll);
    };
  }, [boardState, exitBoard, isBoard, isMobile, updateScrollState]);

  useEffect(() => {
    if (!isMobile || !isBoard || boardState === 'walking') return undefined;

    const outsideSwipeRef = { tracking: false, startX: 0, startY: 0, currentX: 0, currentY: 0, lockedVertical: false };

    const handleTouchStart = (event) => {
      if (event.touches.length !== 1 || isInteractiveOverlayTarget(event.target)) {
        outsideSwipeRef.tracking = false;
        return;
      }

      if (event.target instanceof Element && event.target.closest('.section-content-panel')) {
        outsideSwipeRef.tracking = false;
        return;
      }

      const touch = event.touches[0];
      outsideSwipeRef.tracking = true;
      outsideSwipeRef.lockedVertical = false;
      outsideSwipeRef.startX = touch.clientX;
      outsideSwipeRef.startY = touch.clientY;
      outsideSwipeRef.currentX = touch.clientX;
      outsideSwipeRef.currentY = touch.clientY;
    };

    const handleTouchMove = (event) => {
      if (!outsideSwipeRef.tracking || event.touches.length !== 1) return;

      const touch = event.touches[0];
      outsideSwipeRef.currentX = touch.clientX;
      outsideSwipeRef.currentY = touch.clientY;
      const totalX = touch.clientX - outsideSwipeRef.startX;
      const totalY = touch.clientY - outsideSwipeRef.startY;

      if (!outsideSwipeRef.lockedVertical) {
        if (Math.abs(totalX) < 9 && Math.abs(totalY) < 9) return;
        if (Math.abs(totalX) > Math.abs(totalY)) {
          outsideSwipeRef.tracking = false;
          return;
        }
        outsideSwipeRef.lockedVertical = true;
      }

      event.preventDefault();
    };

    const handleTouchEnd = (event) => {
      if (!outsideSwipeRef.tracking) return;
      const touch = event.changedTouches?.[0];
      const endX = touch?.clientX ?? outsideSwipeRef.currentX;
      const endY = touch?.clientY ?? outsideSwipeRef.currentY;
      const totalX = endX - outsideSwipeRef.startX;
      const totalY = outsideSwipeRef.startY - endY;
      outsideSwipeRef.tracking = false;

      if (Math.abs(totalY) < 46 || Math.abs(totalY) < Math.abs(totalX) * 1.15) return;
      exitBoard?.(totalY > 0 ? 'forward' : 'backward');
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true, capture: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false, capture: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('touchcancel', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart, { capture: true });
      window.removeEventListener('touchmove', handleTouchMove, { capture: true });
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [boardState, exitBoard, isBoard, isMobile]);

  useEffect(() => {
    if (!isBoard || boardState === 'walking') return undefined;

    const keyScroll = {
      ArrowDown: 90,
      ArrowRight: 90,
      PageDown: 320,
      ' ': 320,
      ArrowUp: -90,
      ArrowLeft: -90,
      PageUp: -320,
    };

    const handleKeyDown = (event) => {
      if (!(event.key in keyScroll)) return;
      if (isInteractiveOverlayTarget(event.target)) return;

      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation?.();

      if (boardState === 'board-open') {
        applyBoardScroll(keyScroll[event.key]);
      }
    };

    window.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => window.removeEventListener('keydown', handleKeyDown, { capture: true });
  }, [applyBoardScroll, boardState, isBoard]);

  const heroDelay = isHero && !heroHasAnimatedRef.current ? 0.5 : 0;
  const variants = isHero ? heroVariants(heroDelay) : getBoardVariants(isMobile);

  return (
    <AnimatePresence mode="wait">
      {shouldShowPanel ? (
        <motion.aside
          key={activeSection}
          className={`content-panel wood-panel ${isHero ? 'hero-content-panel' : 'section-content-panel'} ${isBoard ? `is-${boardState}` : ''}`}
          variants={variants}
          initial="hidden"
          animate={isBoard && boardState === 'board-exiting' ? 'exit' : 'visible'}
          exit="exit"
          aria-live="polite"
        >
          {isBoard ? (
            <div className="board-reveal-burst" aria-hidden="true">
              {Array.from({ length: 12 }, (_, index) => (
                <span key={index} style={{ '--burst-index': index }} />
              ))}
            </div>
          ) : null}
          <BoardNails hero={isHero} />
          {isBoard ? (
            <button
              type="button"
              className="board-close-button"
              onClick={() => {
                onSound?.('close');
                exitBoard?.('forward');
              }}
              aria-label="Close sign board"
            >
              <X size={15} />
            </button>
          ) : null}
          <div ref={contentRef} className="content-panel-inner" onScroll={updateScrollState}>
            {renderPanel(activeSection, onSound)}
            {isBoard ? (
              <>
                <DiamondDivider />
                <p className="board-end-note">↑ scroll up · scroll down to continue journey ↓</p>
              </>
            ) : null}
          </div>
          <div className={`panel-scrollbar ${isScrollable ? 'is-scrollable' : 'is-static'}`} aria-hidden="true">
            <span style={{ height: `${scrollMetrics.thumbHeight}%`, top: `${scrollMetrics.thumbTop}%` }} />
          </div>
          {isBoard && isScrollable && !isAtBottom ? (
            <div className="board-scroll-fade" aria-hidden="true">
              <span>scroll to read more ↓</span>
            </div>
          ) : null}
        </motion.aside>
      ) : null}
    </AnimatePresence>
  );
}
