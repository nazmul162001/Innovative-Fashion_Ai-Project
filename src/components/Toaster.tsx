'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useStore } from '@nanostores/react';
import { toastMessage } from '../stores/shop';

export default function Toaster() {
  const message = useStore(toastMessage, { ssr: 'initial' });
  const reduceMotion = useReducedMotion();

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-[max(1rem,env(safe-area-inset-bottom))] z-[80] flex justify-center px-4">
      <AnimatePresence>
        {message ? (
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="pointer-events-auto max-w-[min(22rem,calc(100vw-2rem))] rounded-full bg-[#3a3d42] px-4 py-2.5 text-center text-[13px] leading-snug text-white shadow-[0_8px_24px_rgba(0,0,0,0.35)] sm:px-5 sm:text-sm"
          >
            {message}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
