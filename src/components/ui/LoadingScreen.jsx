import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { portfolio } from '../../data/portfolio';

const LoadingScreen = React.memo(function LoadingScreen({ visible }) {
  return (
    <AnimatePresence>
      {visible ? (
        <motion.div className="loading-screen" initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.55, ease: 'easeOut' }}>
          <div>
            <h1>{portfolio.person.displayName}</h1>
            <span>
              <i />
            </span>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
});

export default LoadingScreen;
