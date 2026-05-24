import React from 'react';
import { Github, Linkedin, Mail, Twitter } from 'lucide-react';
import { portfolio } from '../../data/portfolio';

const icons = {
  LinkedIn: Linkedin,
  GitHub: Github,
  'Twitter/X': Twitter,
};

const ContactBoard = React.memo(function ContactBoard() {
  const usefulSocials = portfolio.socials.filter((social) => icons[social.label]);

  return (
    <article className="board-content contact-board">
      <header>
        <span>Contact</span>
        <i />
      </header>
      <form onSubmit={(event) => event.preventDefault()}>
        <input aria-label="Name" placeholder="Name" />
        <input aria-label="Email" placeholder="Email" type="email" />
        <textarea aria-label="Message" placeholder="Message" rows="2" />
        <button type="submit">
          <Mail size={12} />
          Send Message
        </button>
      </form>
      <div className="social-row">
        {usefulSocials.map((social) => {
          const Icon = icons[social.label];
          return (
            <a key={social.label} href={social.url} target="_blank" rel="noreferrer" aria-label={social.label}>
              <Icon size={13} />
            </a>
          );
        })}
      </div>
    </article>
  );
});

export default ContactBoard;
