import { useState } from 'react';
import { Github, Instagram, Linkedin, Mail, Phone, Send, Twitter } from 'lucide-react';
import { motion } from 'framer-motion';
import { portfolio } from '../../data/portfolio';

const iconMap = {
  LinkedIn: Linkedin,
  GitHub: Github,
  'Twitter/X': Twitter,
  Instagram,
  YouTube: Send,
  Medium: Send,
  'Dev.to': Send,
};

export default function Contact({ onSound }) {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle');

  const update = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const submit = async (event) => {
    event.preventDefault();
    onSound?.('click');
    setStatus('sending');

    const endpoint = portfolio.contact.formspreeEndpoint;
    if (endpoint.startsWith('N/A')) {
      const subject = encodeURIComponent(`Portfolio inquiry from ${form.name || 'visitor'}`);
      const body = encodeURIComponent(`${form.message}\n\nFrom: ${form.name}\nEmail: ${form.email}`);
      window.location.href = `mailto:${portfolio.contact.email}?subject=${subject}&body=${body}`;
      setStatus('fallback');
      return;
    }

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      setStatus(response.ok ? 'success' : 'error');
    } catch {
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="section" aria-label="Contact">
      <div className="section-inner">
        <motion.div
          className="mb-10 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
        >
          <span className="section-label">Contact Cliff</span>
          <h2 className="gradient-text font-heading text-5xl font-extrabold md:text-7xl">{portfolio.contact.finalHeading}</h2>
          <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-300">
            {portfolio.contact.finalMessage}
          </p>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-[1fr_0.75fr]">
          <motion.form
            onSubmit={submit}
            className="glass-card p-6 md:p-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
          >
            <div className="mb-6 border-b border-slate-900/10 pb-4">
              <h3 className="font-heading text-2xl font-extrabold text-white">Start a conversation</h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">For roles, internships, freelance projects, or product collaboration.</p>
            </div>

            <label className="mb-5 block text-sm font-semibold text-slate-300">
              Your name
              <input
                required
                name="name"
                value={form.name}
                onChange={update}
                className="form-field mt-2"
                placeholder="Soumik's future teammate"
              />
            </label>
            <label className="mb-5 block text-sm font-semibold text-slate-300">
              Your email
              <input
                required
                name="email"
                type="email"
                value={form.email}
                onChange={update}
                className="form-field mt-2"
                placeholder="you@company.com"
              />
            </label>
            <label className="mb-6 block text-sm font-semibold text-slate-300">
              Message
              <textarea
                required
                name="message"
                rows="6"
                value={form.message}
                onChange={update}
                className="form-field mt-2 resize-none"
                placeholder="Tell me what we are building..."
              />
            </label>
            <button type="submit" className="magnetic-btn primary">
              {status === 'sending' ? 'Sending...' : 'Send Message'}
              <Send size={18} />
            </button>
            <p className="mt-4 min-h-6 text-sm text-cyan-100">
              {status === 'success' ? 'Message sent successfully.' : null}
              {status === 'error' ? 'Message failed. Try again.' : null}
              {status === 'fallback' ? 'Form endpoint is not configured. Opening your email client instead.' : null}
            </p>
          </motion.form>

          <motion.aside
            className="space-y-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ delay: 0.1 }}
          >
            <div className="glass-card p-6">
              <p className="mono mb-4 text-cyan-200">Direct channels</p>
              <a className="mb-3 flex items-center gap-3 text-slate-200 transition hover:text-cyan-200" href={`mailto:${portfolio.contact.email}`}>
                <Mail size={18} />
                {portfolio.contact.email}
              </a>
              <a className="flex items-center gap-3 text-slate-200 transition hover:text-cyan-200" href={`tel:${portfolio.contact.phone.replace(/\s/g, '')}`}>
                <Phone size={18} />
                {portfolio.contact.phone}
              </a>
              <p className="mt-4 text-sm leading-6 text-slate-400">{portfolio.contact.availability}</p>
            </div>

            <div className="glass-card p-6">
              <p className="mono mb-4 text-cyan-200">Profiles</p>
              <div className="flex flex-wrap gap-3">
                {portfolio.socials.slice(0, 4).map((social, index) => {
                  const Icon = iconMap[social.label] || Send;
                  return (
                    <a
                      key={social.label}
                      href={social.url}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={social.label}
                      className="group relative grid h-14 w-14 place-items-center rounded-full border border-cyan-300/25 bg-white/60 text-cyan-100 transition hover:scale-105 hover:border-cyan-300/70 hover:shadow-neon"
                      style={{ transitionDelay: `${index * 20}ms` }}
                    >
                      <Icon size={20} />
                      <span className="pointer-events-none absolute -top-9 whitespace-nowrap rounded-full bg-slate-950 px-3 py-1 text-xs opacity-0 transition group-hover:opacity-100">
                        {social.handle}
                      </span>
                    </a>
                  );
                })}
              </div>
            </div>

            <div className="glass-card border-emerald-400/30 bg-emerald-400/10 p-6">
              <div className="mb-2 flex items-center gap-3">
                <span className="status-dot" />
                <p className="font-heading text-2xl font-extrabold text-white">{portfolio.contact.availabilityBanner}</p>
              </div>
              <p className="mono text-sm text-emerald-100">India | Remote OK | Willing to Relocate</p>
            </div>
          </motion.aside>
        </div>

        <footer className="mt-12 text-center">
          <p className="mono text-sm text-slate-400">Designed and built by {portfolio.person.displayName} - 2026</p>
          <p className="mono mt-2 text-xs text-slate-500">React, Three.js, and a quiet mountain range.</p>
        </footer>
      </div>
    </section>
  );
}
