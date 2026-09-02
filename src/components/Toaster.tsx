import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useStore } from '@nanostores/react';
import { toastMessage } from '../stores/shop';

export default function Toaster() {
  const message = useStore(toastMessage, { ssr: 'initial' });
  const reduceMotion = useReducedMotion();

  return (
    <div className="pointer-events-none fixed bottom-6 left-1/2 z-[80] -translate-x-1/2 px-4">
      <AnimatePresence>
        {message ? (
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="pointer-events-auto rounded-full border border-white/10 bg-ink-mid/95 px-5 py-2.5 text-sm text-snow shadow-soft backdrop-blur-md"
          >
            {message}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
