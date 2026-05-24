import { useEffect, useRef, useState } from 'react';
import { ArrowDown, Download, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { portfolio } from '../../data/portfolio';

gsap.registerPlugin(ScrollToPlugin);

export default function Hero({ onSound }) {
  const [typingIndex, setTypingIndex] = useState(0);
  const [hasScrolled, setHasScrolled] = useState(false);
  const photoRef = useRef(null);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTypingIndex((index) => (index + 1) % portfolio.hero.typingTexts.length);
    }, 2300);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const onScroll = () => setHasScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const goTo = (id) => {
    onSound?.('click');
    gsap.to(window, { duration: 1.1, scrollTo: `#${id}`, ease: 'power4.inOut' });
  };

  const handlePhotoMove = (event) => {
    const node = photoRef.current;
    if (!node || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rect = node.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    node.style.transform = `perspective(1000px) rotateX(${-y * 15}deg) rotateY(${x * 15}deg)`;
  };

  const handlePhotoLeave = () => {
    if (photoRef.current) {
      photoRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    }
  };

  return (
    <section id="hero" className="section pt-28" aria-label="Hero section">
      <div className="section-inner grid items-center gap-10 lg:grid-cols-[0.78fr_1.22fr]">
        <motion.div
          className="relative mx-auto lg:mx-0"
          initial={{ opacity: 0, scale: 0.88, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 1.05, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="photo-glow" />
          <div ref={photoRef} onMouseMove={handlePhotoMove} onMouseLeave={handlePhotoLeave} className="hero-photo transition-transform duration-300">
            <div className="hero-photo-shell">
              <img src={portfolio.assets.photo} alt={`${portfolio.person.displayName} profile portrait`} />
            </div>
          </div>
        </motion.div>

        <div className="text-center lg:text-left">
          <motion.p
            className="mono typing-cursor mb-4 text-sm text-cyan-200"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.6 }}
          >
            {portfolio.hero.topTag.replace(/[<>/]/g, '')}
          </motion.p>

          <h1
            className="mb-5 font-heading font-extrabold text-white"
            style={{ fontSize: 'clamp(38px, 5.5vw, 72px)', lineHeight: 1.1 }}
          >
            {portfolio.person.displayName.split(' ').map((word, index) => (
              <motion.span
                key={`${word}-${index}`}
                className="mr-[0.18em] inline-block"
                initial={{ opacity: 0, y: 42 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.18 + index * 0.08, duration: 0.55, ease: 'easeOut' }}
              >
                {word}
              </motion.span>
            ))}
          </h1>

          <motion.div
            className="mb-5 space-y-2"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.35, duration: 0.7, ease: 'easeOut' }}
          >
            <p className="gradient-text font-heading text-3xl font-extrabold md:text-5xl">{portfolio.hero.subtitle}</p>
            <p className="mono text-sm text-cyan-100/80">{portfolio.hero.typingTexts[typingIndex]}</p>
          </motion.div>

          <motion.p
            className="mx-auto mb-6 max-w-2xl text-lg leading-8 text-slate-300 lg:mx-0"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.65 }}
          >
            {portfolio.hero.description}
            <span className="mt-2 block text-cyan-100">{portfolio.person.quote}</span>
          </motion.p>

          <motion.div
            className="mb-7 flex flex-wrap justify-center gap-2 lg:justify-start"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6, duration: 0.65 }}
          >
            <span className="pill border-emerald-400/30 bg-emerald-400/10">
              <span className="status-dot" />
              {portfolio.hero.availability}
            </span>
            {portfolio.person.roleBadges.map((badge) => (
              <span key={badge} className="pill">
                {badge}
              </span>
            ))}
          </motion.div>

          <motion.div
            className="flex flex-wrap justify-center gap-4 lg:justify-start"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.75, duration: 0.7 }}
          >
            <button type="button" className="magnetic-btn primary" onClick={() => goTo('projects')}>
              {portfolio.hero.ctas.primary}
              <ArrowDown size={18} />
            </button>
            <a className="magnetic-btn secondary" href={portfolio.assets.resume} download onClick={() => onSound?.('click')}>
              {portfolio.hero.ctas.secondary}
              <Download size={18} />
            </a>
            <button type="button" className="magnetic-btn secondary" onClick={() => goTo('contact')}>
              {portfolio.hero.ctas.tertiary}
              <Send size={18} />
            </button>
          </motion.div>
        </div>
      </div>

      <motion.button
        type="button"
        aria-label="Scroll to about section"
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-xs text-slate-300 md:flex"
        onClick={() => goTo('about')}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: hasScrolled ? 0 : 1, y: [0, 8, 0] }}
        transition={{ delay: 2.2, duration: 1.8, repeat: Infinity, repeatDelay: 0.6 }}
      >
        <span className="grid h-10 w-6 place-items-start rounded-full border border-cyan-300/40 p-1">
          <span className="h-2 w-2 rounded-full bg-cyan-300" />
        </span>
        <ArrowDown className="text-cyan-200" size={18} />
        <span className="mono">Scroll to explore</span>
      </motion.button>
    </section>
  );
}
