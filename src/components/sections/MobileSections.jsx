import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  Award,
  BrainCircuit,
  Briefcase,
  Check,
  ChevronDown,
  Code2,
  Copy,
  Download,
  ExternalLink,
  Filter,
  GitFork,
  Github,
  GraduationCap,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Rocket,
  Send,
  Server,
  Smartphone,
  Star,
  Target,
  Trophy,
  Twitter,
  Users,
} from 'lucide-react';
import { portfolioAssets, portfolioData } from '../../data/portfolio';
import { sendContactMessage } from '../../services/contactMailer';

/* ─── animation helpers ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.88 },
  visible: (i = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
};

/* ─── icon maps ─── */
const skillIconMap = { Smartphone, BrainCircuit, Server };
const socialIconMap = { LinkedIn: Linkedin, GitHub: Github, 'Twitter/X': Twitter, Instagram };
const statIcons = [Rocket, BrainCircuit, Trophy, Briefcase, Code2, Award];
const timelineIconMap = {
  education: GraduationCap, project: Code2, experience: Briefcase,
  hackathon: Trophy, leadership: Users, achievement: Award,
  trophy: Trophy, graduation: GraduationCap, target: Target,
  brain: BrainCircuit, rocket: Rocket, code: Code2,
};

/* ─── mini heatmap generator ─── */
function makeMobileHeatmap() {
  return Array.from({ length: 26 * 7 }, (_, i) => {
    const wave = Math.sin(i * 0.37) + Math.cos(i * 0.11);
    const burst = i % 29 < 7 ? 1 : 0;
    return Math.max(0, Math.min(4, Math.floor(wave + burst + 2)));
  });
}

/* ─── skill cluster data ─── */
const skillClusters = [
  {
    title: 'Mobile Development',
    icon: 'Smartphone',
    color: '#2d6a4f',
    summary: 'Flutter apps with rich UI, animations, and production integrations.',
    items: portfolioData.skills.mobile,
  },
  {
    title: 'AI / Machine Learning',
    icon: 'BrainCircuit',
    color: '#7c3aed',
    summary: 'NLP, OCR, applied ML, LLM APIs, and practical AI products.',
    items: portfolioData.skills.aiml,
  },
  {
    title: 'Full Stack & Backend',
    icon: 'Server',
    color: '#0077b6',
    summary: 'Realtime APIs, databases, authentication, and developer tooling.',
    items: portfolioData.skills.fullstack,
  },
];

/* ================================================================== */
/*  SECTION COMPONENTS                                                 */
/* ================================================================== */

function MobileHero() {
  const [typingIndex, setTypingIndex] = useState(0);
  const typingTexts = [
    'Building Flutter Applications...',
    'Engineering AI-Powered Systems...',
    'Developing Full Stack Backends...',
    'Shipping Real Products...',
  ];

  useEffect(() => {
    const timer = setInterval(() => setTypingIndex((i) => (i + 1) % typingTexts.length), 2300);
    return () => clearInterval(timer);
  }, [typingTexts.length]);

  return (
    <section className="m-section m-hero" id="m-hero">
      <motion.div className="m-hero-photo-wrap" initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
        <span className="m-hero-photo-glow" />
        <img src={portfolioAssets.photo} alt={portfolioData.personal.name} className="m-hero-photo" />
      </motion.div>

      <motion.p className="m-hero-kicker" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        B.Tech CSE (AIML) · Open to Opportunities
      </motion.p>

      <motion.h1 className="m-hero-name" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.6 }}>
        {portfolioData.personal.name}
      </motion.h1>

      <motion.div className="m-hero-roles" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65 }}>
        <span className="m-hero-title">{portfolioData.personal.title}</span>
        <span className="m-hero-subtitle">{portfolioData.personal.subtitle}</span>
      </motion.div>

      <motion.div className="m-hero-typing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
        <AnimatePresence mode="wait">
          <motion.span key={typingIndex} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}>
            {typingTexts[typingIndex]}
          </motion.span>
        </AnimatePresence>
      </motion.div>

      <motion.p className="m-hero-desc" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}>
        {portfolioData.personal.heroDescription}
      </motion.p>

      <motion.div className="m-hero-badges" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 }}>
        <span className="m-badge m-badge--available"><i className="m-status-dot" />{portfolioData.personal.availability}</span>
      </motion.div>

      <motion.div className="m-hero-actions" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }}>
        <a href="#m-projects" className="m-btn m-btn--primary">View Projects <ArrowRight size={16} /></a>
        <a href={portfolioAssets.resume} download className="m-btn m-btn--secondary">Resume <Download size={16} /></a>
        <a href="#m-contact" className="m-btn m-btn--secondary">Contact <Send size={16} /></a>
      </motion.div>
    </section>
  );
}

function MobileAbout() {
  const [buildIndex, setBuildIndex] = useState(0);
  const builds = portfolioData.about.cyclingBuilds;

  useEffect(() => {
    const timer = setInterval(() => setBuildIndex((i) => (i + 1) % builds.length), 2500);
    return () => clearInterval(timer);
  }, [builds.length]);

  return (
    <section className="m-section" id="m-about">
      <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}>
        <motion.span className="m-section-label" variants={fadeUp}>About Me</motion.span>
        <motion.h2 className="m-section-heading" variants={fadeUp}>More Than Just a Developer</motion.h2>

        <div className="m-about-text">
          {portfolioData.about.paragraphs.map((p, i) => (
            <motion.p key={i} variants={fadeUp} custom={i}>{p}</motion.p>
          ))}
          <motion.p className="m-about-diff" variants={fadeUp}>{portfolioData.about.difference}</motion.p>
        </div>

        <motion.div className="m-about-pills" variants={fadeUp}>
          <span className="m-pill"><GraduationCap size={13} />{portfolioData.personal.degree}</span>
          <span className="m-pill"><MapPin size={13} />{portfolioData.personal.location}</span>
          <span className="m-pill"><Target size={13} />{portfolioData.personal.year}</span>
        </motion.div>

        <motion.div className="m-building-card" variants={fadeUp}>
          <span className="m-building-label">Currently building & learning</span>
          <AnimatePresence mode="wait">
            <motion.strong key={builds[buildIndex]} className="m-building-value" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3 }}>
              {builds[buildIndex]}
            </motion.strong>
          </AnimatePresence>
        </motion.div>

        <motion.div className="m-stat-grid" variants={staggerContainer}>
          {portfolioData.stats.panel.map((stat, i) => {
            const Icon = statIcons[i] || Rocket;
            return (
              <motion.div key={stat.label} className="m-stat-card" variants={scaleIn} custom={i}>
                <Icon size={18} className="m-stat-icon" />
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.p className="m-fun-fact" variants={fadeUp}>{portfolioData.about.funFact}</motion.p>
      </motion.div>
    </section>
  );
}

function MobileSkills() {
  return (
    <section className="m-section" id="m-skills">
      <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}>
        <motion.span className="m-section-label" variants={fadeUp}>Skills</motion.span>
        <motion.h2 className="m-section-heading" variants={fadeUp}>Three Peaks of Engineering</motion.h2>

        {skillClusters.map((cluster, ci) => {
          const Icon = skillIconMap[cluster.icon];
          return (
            <motion.div key={cluster.title} className="m-skill-cluster" variants={fadeUp} custom={ci}>
              <div className="m-skill-cluster-header">
                <div className="m-skill-icon-box" style={{ borderColor: `${cluster.color}44`, background: `${cluster.color}12` }}>
                  <Icon size={22} color={cluster.color} />
                </div>
                <div>
                  <h3>{cluster.title}</h3>
                  <p>{cluster.summary}</p>
                </div>
              </div>
              <div className="m-skill-tags">
                {cluster.items.map((skill) => (
                  <span key={skill} className="m-skill-tag" style={{ borderColor: `${cluster.color}33` }}>{skill}</span>
                ))}
              </div>
            </motion.div>
          );
        })}

        <motion.div className="m-extra-skills" variants={fadeUp}>
          <div className="m-extra-skill-group">
            <span className="m-extra-skill-label">Databases</span>
            <div className="m-skill-tags">{portfolioData.skills.databases.map((d) => <span key={d} className="m-skill-tag">{d}</span>)}</div>
          </div>
          <div className="m-extra-skill-group">
            <span className="m-extra-skill-label">Languages</span>
            <div className="m-skill-tags">{portfolioData.skills.languages.map((l) => <span key={l} className="m-skill-tag">{l}</span>)}</div>
          </div>
          <div className="m-extra-skill-group">
            <span className="m-extra-skill-label">Tools</span>
            <div className="m-skill-tags">{portfolioData.skills.tools.map((t) => <span key={t} className="m-skill-tag">{t}</span>)}</div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

function MobileProjects() {
  const categories = useMemo(() => ['All', ...new Set(portfolioData.projects.map((p) => p.category))], []);
  const [active, setActive] = useState('All');
  const [expandedProject, setExpandedProject] = useState(null);
  const featured = portfolioData.projects.find((p) => p.featured);
  const filtered = active === 'All' ? portfolioData.projects : portfolioData.projects.filter((p) => p.category === active);

  return (
    <section className="m-section" id="m-projects">
      <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}>
        <motion.span className="m-section-label" variants={fadeUp}>Projects</motion.span>
        <motion.h2 className="m-section-heading" variants={fadeUp}>Products With Real Depth</motion.h2>

        <motion.div className="m-filter-tabs" variants={fadeUp}>
          {categories.map((cat) => (
            <button key={cat} type="button" className={`m-filter-tab ${active === cat ? 'is-active' : ''}`} onClick={() => setActive(cat)}>
              <Filter size={12} />{cat}
            </button>
          ))}
        </motion.div>

        {featured && active === 'All' ? (
          <motion.article className="m-featured-card" variants={fadeUp}>
            <div className="m-featured-gradient">
              <span className="m-featured-badge"><Star size={13} /> Featured</span>
              <p className="m-featured-name">{featured.name}</p>
            </div>
            <div className="m-featured-body">
              <span className="m-pill m-pill--accent">{featured.category}</span>
              <h3>{featured.name}</h3>
              <p>{featured.description}</p>
              <div className="m-skill-tags">{featured.tech.map((t) => <span key={t} className="m-skill-tag">{t}</span>)}</div>
              <div className="m-project-links">
                <a href={featured.github} target="_blank" rel="noreferrer" className="m-btn m-btn--primary m-btn--sm"><Github size={15} /> GitHub</a>
                {featured.live && !featured.live.includes('unavailable') && !featured.live.startsWith('N/A') ? (
                  <a href={featured.live} target="_blank" rel="noreferrer" className="m-btn m-btn--secondary m-btn--sm"><ExternalLink size={15} /> Demo</a>
                ) : null}
              </div>
            </div>
          </motion.article>
        ) : null}

        <AnimatePresence mode="popLayout">
          {filtered.map((project, pi) => (
            <motion.article
              key={project.name}
              className="m-project-card"
              variants={fadeUp}
              custom={pi}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
              layout
            >
              <div className="m-project-top">
                <span className="m-project-category">{project.category}</span>
                {project.featured ? <span className="m-project-featured"><Star size={11} /> Featured</span> : null}
              </div>
              <h3>{project.name}</h3>
              <p>{project.description}</p>

              <button
                type="button"
                className="m-project-expand"
                onClick={() => setExpandedProject(expandedProject === project.name ? null : project.name)}
              >
                {expandedProject === project.name ? 'Show Less' : 'Show Details'}
                <ChevronDown size={14} style={{ transform: expandedProject === project.name ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }} />
              </button>

              <AnimatePresence>
                {expandedProject === project.name ? (
                  <motion.div className="m-project-details" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
                    <div className="m-project-meta">
                      <span className="m-pill">{project.role}</span>
                      <span className="m-pill">{project.duration}</span>
                      {project.teamSize ? <span className="m-pill">Team: {project.teamSize}</span> : null}
                    </div>
                    {project.problem ? <p><strong>Problem:</strong> {project.problem}</p> : null}
                    {project.solution ? <p><strong>Solution:</strong> {project.solution}</p> : null}
                    {project.features?.length ? (
                      <div className="m-detail-block">
                        <strong>Core Features</strong>
                        <ul>{project.features.map((f) => <li key={f}>{f}</li>)}</ul>
                      </div>
                    ) : null}
                    {project.results?.length ? (
                      <div className="m-detail-block">
                        <strong>Results</strong>
                        <ul>{project.results.map((r) => <li key={r}>{r}</li>)}</ul>
                      </div>
                    ) : null}
                  </motion.div>
                ) : null}
              </AnimatePresence>

              <div className="m-skill-tags m-project-tech">{project.tech.map((t) => <span key={t} className="m-skill-tag">{t}</span>)}</div>
              <div className="m-project-links">
                <a href={project.github} target="_blank" rel="noreferrer" className="m-btn m-btn--primary m-btn--sm"><Github size={14} /> GitHub</a>
                {project.live && !project.live.includes('unavailable') && !project.live.startsWith('N/A') && project.live !== '' ? (
                  <a href={project.live} target="_blank" rel="noreferrer" className="m-btn m-btn--secondary m-btn--sm"><ExternalLink size={14} /> Demo</a>
                ) : null}
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}

function MobileAI() {
  const aiProjects = portfolioData.projects.filter((p) => p.metrics);

  return (
    <section className="m-section" id="m-ai">
      <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}>
        <motion.span className="m-section-label" variants={fadeUp}>AI / Machine Learning</motion.span>
        <motion.h2 className="m-section-heading" variants={fadeUp}>Apps That Think</motion.h2>
        <motion.p className="m-section-subtitle" variants={fadeUp}>
          Flutter interfaces connected to OCR, language models, speech systems, and measurable outcomes.
        </motion.p>

        {aiProjects.map((project, pi) => (
          <motion.article key={project.name} className="m-ai-card" variants={fadeUp} custom={pi}>
            <span className="m-ai-label">AI System</span>
            <h3>{project.name}</h3>
            <p>{project.description}</p>

            <div className="m-metrics-row">
              {project.metrics.accuracy ? (
                <div className="m-metric m-metric--cyan">
                  <span>Accuracy</span>
                  <strong>{project.metrics.accuracy}</strong>
                </div>
              ) : null}
              {project.metrics.precision && project.metrics.precision !== 'N/A' ? (
                <div className="m-metric m-metric--violet">
                  <span>Precision</span>
                  <strong>{project.metrics.precision}</strong>
                </div>
              ) : null}
              {project.metrics.dataset && project.metrics.dataset !== 'N/A' ? (
                <div className="m-metric m-metric--emerald">
                  <span>Dataset</span>
                  <strong className="m-metric-text">{project.metrics.dataset}</strong>
                </div>
              ) : null}
            </div>

            {project.aiDetails ? (
              <div className="m-ai-details">
                <p><strong>Model:</strong> {project.aiDetails.model}</p>
                <div className="m-skill-tags">
                  {project.aiDetails.frameworks.map((f) => <span key={f} className="m-skill-tag">{f}</span>)}
                </div>
              </div>
            ) : null}

            <div className="m-architecture-flow">
              <span className="m-architecture-label">Architecture</span>
              <div className="m-architecture-chain">
                {project.tech.map((t, i) => (
                  <React.Fragment key={t}>
                    <span className="m-arch-node">{t}</span>
                    {i < project.tech.length - 1 ? <span className="m-arch-arrow">→</span> : null}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </motion.article>
        ))}

        <motion.div className="m-ai-statement" variants={fadeUp}>
          <strong>Flutter meets AI.</strong>
          <em>I build apps that think.</em>
        </motion.div>
      </motion.div>
    </section>
  );
}

function MobileTimeline() {
  return (
    <section className="m-section" id="m-timeline">
      <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}>
        <motion.span className="m-section-label" variants={fadeUp}>Journey</motion.span>
        <motion.h2 className="m-section-heading" variants={fadeUp}>A Steady Climb</motion.h2>

        <div className="m-timeline">
          <span className="m-timeline-line" />
          {portfolioData.timeline.map((event, i) => {
            const Icon = timelineIconMap[event.icon] || Code2;
            return (
              <motion.article key={`${event.year}-${event.title}`} className="m-timeline-item" variants={fadeUp} custom={i}>
                <span className="m-timeline-dot"><Icon size={13} /></span>
                <div className="m-timeline-content">
                  <time>{event.year}</time>
                  <h3>{event.title}</h3>
                  <p>{event.description}</p>
                  <div className="m-timeline-tags">
                    {event.tags.map((tag) => <span key={tag} className="m-pill m-pill--sm">{tag}</span>)}
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}

function MobileCertifications() {
  return (
    <section className="m-section" id="m-certifications">
      <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}>
        <motion.span className="m-section-label" variants={fadeUp}>Certifications</motion.span>
        <motion.h2 className="m-section-heading" variants={fadeUp}>Credentials & Recognition</motion.h2>

        <div className="m-cert-grid">
          {portfolioData.certifications.map((cert, i) => (
            <motion.a
              key={cert.name}
              href={cert.credential}
              target="_blank"
              rel="noreferrer"
              className="m-cert-card"
              variants={fadeUp}
              custom={i}
            >
              <div className="m-cert-header">
                <Award size={16} className="m-cert-icon" />
                <span className="m-cert-issuer">{cert.issuer} · {cert.year}</span>
              </div>
              <h3 className="m-cert-title">{cert.name}</h3>
              <p className="m-cert-desc">{cert.description}</p>
              <span className="m-cert-link">
                View Credential <ExternalLink size={12} />
              </span>
            </motion.a>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

function MobileGitHub() {
  const username = portfolioData.github.username;
  const [liveStats, setLiveStats] = useState(null);
  const [liveRepos, setLiveRepos] = useState([]);
  const [liveLoading, setLiveLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function fetchGitHub() {
      try {
        const [userRes, reposRes] = await Promise.all([
          fetch(`https://api.github.com/users/${username}`),
          fetch(`https://api.github.com/users/${username}/repos?sort=stars&per_page=6`),
        ]);
        if (!userRes.ok || !reposRes.ok) throw new Error('GitHub API error');
        const user = await userRes.json();
        const repos = await reposRes.json();
        if (!cancelled) {
          setLiveStats({
            repos: user.public_repos,
            followers: user.followers,
            bio: user.bio,
          });
          setLiveRepos(
            repos
              .filter((r) => !r.fork)
              .slice(0, 6)
              .map((r) => ({
                name: r.name,
                description: r.description || '',
                stars: r.stargazers_count,
                forks: r.forks_count,
                language: r.language || 'Unknown',
                url: r.html_url,
              }))
          );
        }
      } catch {
        // Silently fall back to portfolio data
      } finally {
        if (!cancelled) setLiveLoading(false);
      }
    }
    fetchGitHub();
    return () => { cancelled = true; };
  }, [username]);

  const stats = portfolioData.github.stats;
  const displayRepos = liveRepos.length > 0 ? liveRepos : portfolioData.github.pinned;

  return (
    <section className="m-section" id="m-github">
      <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}>
        <motion.span className="m-section-label" variants={fadeUp}>GitHub</motion.span>
        <motion.h2 className="m-section-heading" variants={fadeUp}>Open Source Activity</motion.h2>

        {/* Real github-readme-stats charts */}
        <motion.div className="m-github-charts" variants={fadeUp}>
          <img
            src={`https://github-readme-stats.vercel.app/api?username=${username}&show_icons=true&hide_border=true&count_private=true&theme=default&bg_color=f5f5f5&title_color=1a4a2a&icon_color=2d6a4f&text_color=333&border_radius=10`}
            alt={`${username} GitHub stats`}
            className="m-github-chart-img"
            loading="lazy"
          />
          <img
            src={`https://github-readme-stats.vercel.app/api/top-langs/?username=${username}&layout=compact&hide_border=true&theme=default&bg_color=f5f5f5&title_color=1a4a2a&text_color=333&border_radius=10`}
            alt={`${username} top languages`}
            className="m-github-chart-img"
            loading="lazy"
          />
        </motion.div>

        <motion.div className="m-github-stats" variants={fadeUp}>
          <div className="m-github-stat">
            <strong>{liveLoading ? '…' : (liveStats?.repos ?? stats.commits)}</strong>
            <span>Repos</span>
          </div>
          <div className="m-github-stat">
            <strong>{stats.commits}</strong>
            <span>Commits</span>
          </div>
          <div className="m-github-stat">
            <strong>{liveLoading ? '…' : (liveStats?.followers ?? stats.languages)}</strong>
            <span>Followers</span>
          </div>
          <div className="m-github-stat">
            <strong>{stats.stars}</strong>
            <span>Stars</span>
          </div>
        </motion.div>

        {liveStats?.bio ? (
          <motion.p className="m-github-bio" variants={fadeUp}>{liveStats.bio}</motion.p>
        ) : null}

        <motion.div className="m-pinned-repos" variants={staggerContainer}>
          {displayRepos.map((repo, ri) => (
            <motion.a key={repo.name} href={repo.url} target="_blank" rel="noreferrer" className="m-repo-card" variants={fadeUp} custom={ri}>
              <div className="m-repo-header">
                <Github size={16} />
                <span className="m-pill m-pill--sm">{repo.language}</span>
              </div>
              <h3>{repo.name}</h3>
              <p>{repo.description}</p>
              <div className="m-repo-meta">
                <span><Star size={12} /> {repo.stars}</span>
                <span><GitFork size={12} /> {repo.forks}</span>
              </div>
            </motion.a>
          ))}
        </motion.div>

        <motion.a href={portfolioData.github.url} target="_blank" rel="noreferrer" className="m-btn m-btn--primary m-btn--full" variants={fadeUp}>
          <Github size={16} /> View Full GitHub Profile <ExternalLink size={14} />
        </motion.a>
      </motion.div>
    </section>
  );
}

function MobileCopyEmail({ email }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };
  return (
    <button type="button" className="m-copy-email-btn" onClick={copy}>
      {copied ? <Check size={14} /> : <Copy size={14} />}
      {copied ? 'Copied!' : 'Copy email'}
    </button>
  );
}

function MobileContact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle');

  const update = (e) => setForm((c) => ({ ...c, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const result = await sendContactMessage(form, 'Mobile contact form');
      if (result.status === 'fallback') {
        window.location.href = result.fallbackUrl;
        setStatus('fallback');
        return;
      }
      setStatus('success');
      setForm({ name: '', email: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  return (
    <section className="m-section m-section--contact" id="m-contact">
      <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}>
        <motion.span className="m-section-label" variants={fadeUp}>Contact</motion.span>
        <motion.h2 className="m-section-heading m-section-heading--gradient" variants={fadeUp}>
          {portfolioData.finalRecruiterMessage.heading}
        </motion.h2>
        <motion.p className="m-section-subtitle" variants={fadeUp}>
          {portfolioData.finalRecruiterMessage.message}
        </motion.p>

        <motion.form className="m-contact-form" onSubmit={submit} variants={fadeUp}>
          <label>
            Your name
            <input required name="name" value={form.name} onChange={update} placeholder="Your name" />
          </label>
          <label>
            Your email
            <input required name="email" type="email" value={form.email} onChange={update} placeholder="you@company.com" />
          </label>
          <label>
            Message
            <textarea required name="message" rows="5" value={form.message} onChange={update} placeholder="Tell me what we are building..." />
          </label>
          <button type="submit" className="m-btn m-btn--primary m-btn--full" disabled={status === 'sending'}>
            {status === 'sending' ? 'Sending...' : 'Send Message'} <Send size={16} />
          </button>
          <p className="m-form-status">
            {status === 'success' ? '✓ Message sent successfully!' : null}
            {status === 'error' ? 'Message failed. Please try again.' : null}
            {status === 'fallback' ? 'Redirecting to your email client — thank you for reaching out!' : null}
          </p>
        </motion.form>

        <motion.div className="m-contact-channels" variants={fadeUp}>
          <h3>Direct Channels</h3>
          <div className="m-direct-email-row">
            <a href={`mailto:${portfolioData.contact.email}`}><Mail size={16} /> {portfolioData.contact.email}</a>
            <MobileCopyEmail email={portfolioData.contact.email} />
          </div>
          <a href={`tel:${portfolioData.contact.phone.replace(/\s/g, '')}`}><Phone size={16} /> {portfolioData.contact.phone}</a>
        </motion.div>

        <motion.div className="m-social-grid" variants={fadeUp}>
          {portfolioData.socials.map((social) => {
            const Icon = socialIconMap[social.label] || Send;
            return (
              <a key={social.label} href={social.url} target="_blank" rel="noreferrer" className="m-social-btn" aria-label={social.label}>
                <Icon size={18} />
                <span>{social.label}</span>
              </a>
            );
          })}
        </motion.div>

        <motion.div className="m-availability-banner" variants={fadeUp}>
          <i className="m-status-dot" />
          <div>
            <strong>{portfolioData.finalRecruiterMessage.availabilityBanner}</strong>
            <span>India | Remote OK | Willing to Relocate</span>
          </div>
        </motion.div>
      </motion.div>

      <footer className="m-footer">
        <p>Designed and built by {portfolioData.personal.name} — 2026</p>
        <p>React, Three.js, and a quiet mountain range.</p>
      </footer>
    </section>
  );
}

/* ================================================================== */
/*  MAIN EXPORT                                                        */
/* ================================================================== */

const MobileSections = React.memo(function MobileSections() {
  return (
    <main className="mobile-sections">
      <MobileHero />
      <MobileAbout />
      <MobileSkills />
      <MobileProjects />
      <MobileAI />
      <MobileTimeline />
      <MobileCertifications />
      <MobileGitHub />
      <MobileContact />
    </main>
  );
});

export default MobileSections;
