import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollToPlugin);

export default function BackToTop({ onSound }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const denominator = document.body.scrollHeight - window.innerHeight || 1;
      setVisible(window.scrollY / denominator > 0.4);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.button
          type="button"
          aria-label="Back to top"
          onClick={() => {
            onSound?.('click');
            gsap.to(window, { duration: 1.0, scrollTo: 0, ease: 'power3.inOut' });
          }}
          className="fixed bottom-6 right-6 z-[100] grid h-12 w-12 place-items-center rounded-full border border-slate-900/10 bg-white/70 text-slate-950 shadow-neon backdrop-blur-xl"
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          whileHover={{ y: -3, scale: 1.05 }}
        >
          <ArrowUp size={18} />
        </motion.button>
      ) : null}
    </AnimatePresence>
  );
}
