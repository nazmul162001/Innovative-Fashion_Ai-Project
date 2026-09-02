import { useLayoutEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { BRAND } from '../lib/brand';

const SESSION_KEY = 'if-home-visited';

function shouldPlaySplash(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    const type = performance.getEntriesByType('navigation')[0]?.type;
    if (type === 'reload') return true;
    return sessionStorage.getItem(SESSION_KEY) !== '1';
  } catch {
    return true;
  }
}

const wordmark = BRAND.name.toUpperCase();

export default function SplashLoader() {
  const reduceMotion = useReducedMotion();
  const [play, setPlay] = useState(true);

  useLayoutEffect(() => {
    if (!shouldPlaySplash()) {
      setPlay(false);
      document.documentElement.classList.remove('if-splash');
      return;
    }
    document.documentElement.classList.add('if-splash');
    try {
      sessionStorage.setItem(SESSION_KEY, '1');
    } catch {
      /* ignore */
    }

    const hold = reduceMotion ? 600 : 2800;
    const hide = window.setTimeout(() => {
      setPlay(false);
      document.documentElement.classList.remove('if-splash');
    }, hold);
    return () => window.clearTimeout(hide);
  }, [reduceMotion]);

  return (
    <AnimatePresence>
      {play ? (
        <motion.div
          key="splash"
          role="status"
          aria-label="Loading Inovative Fashion"
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[#0f1218]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="pointer-events-none absolute inset-0">
            <motion.span
              className="absolute top-1/2 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/20 blur-[90px]"
              animate={reduceMotion ? undefined : { opacity: [0.25, 0.55, 0.3], scale: [0.85, 1.08, 0.92] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.span
              className="absolute top-[38%] left-[42%] h-56 w-56 rounded-full bg-blue-500/15 blur-[70px]"
              animate={reduceMotion ? undefined : { x: [0, 30, -10], y: [0, -20, 10] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>

          <div className="relative z-10 flex flex-col items-center px-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.55, rotate: -12 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.08 }}
              className="relative grid h-[4.5rem] w-[4.5rem] place-items-center overflow-hidden rounded-2xl border border-white/15 bg-[#161b22] shadow-[0_0_40px_rgba(56,189,248,0.35)]"
            >
              <motion.span
                className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 to-transparent"
                animate={reduceMotion ? undefined : { opacity: [0.2, 0.55, 0.2] }}
                transition={{ duration: 1.8, repeat: Infinity }}
              />
              <svg viewBox="0 0 32 32" className="relative h-12 w-12 text-snow" fill="none" aria-hidden="true">
                <motion.rect
                  x="10"
                  y="7.5"
                  width="12"
                  height="2.4"
                  rx="1.2"
                  fill="currentColor"
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  style={{ originX: 0.5, originY: 0.5 }}
                  transition={{ delay: 0.25, duration: 0.35 }}
                />
                <motion.rect
                  x="14"
                  y="9"
                  width="4"
                  height="14"
                  rx="1.2"
                  fill="currentColor"
                  initial={{ opacity: 0, scaleY: 0 }}
                  animate={{ opacity: 1, scaleY: 1 }}
                  style={{ originX: 0.5, originY: 0 }}
                  transition={{ delay: 0.38, duration: 0.4 }}
                />
                <motion.rect
                  x="10"
                  y="22.1"
                  width="12"
                  height="2.4"
                  rx="1.2"
                  fill="currentColor"
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  style={{ originX: 0.5, originY: 0.5 }}
                  transition={{ delay: 0.55, duration: 0.35 }}
                />
                <motion.path
                  d="M22.5 10.5c2.8 2.6 3 8.2-.6 11.5"
                  stroke="#38BDF8"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ delay: 0.7, duration: 0.7, ease: 'easeInOut' }}
                />
              </svg>
            </motion.div>

            <motion.p
              className="mt-7 flex flex-wrap justify-center gap-x-[0.35em] text-[13px] font-semibold tracking-[0.28em] text-white uppercase sm:text-sm sm:tracking-[0.34em]"
              initial="hidden"
              animate="show"
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.035, delayChildren: 0.85 } },
              }}
            >
              {wordmark.split('').map((letter, index) => (
                <motion.span
                  key={`${letter}-${index}`}
                  variants={{
                    hidden: { opacity: 0, y: 12 },
                    show: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                  className={letter === ' ' ? 'w-2' : undefined}
                >
                  {letter === ' ' ? '\u00a0' : letter}
                </motion.span>
              ))}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 0.7, y: 0 }}
              transition={{ delay: 1.35, duration: 0.45 }}
              className="mt-3 text-[11px] tracking-[0.22em] text-cyan-200/80 uppercase"
            >
              {BRAND.tagline}
            </motion.p>

            <div className="mt-8 h-[2px] w-40 overflow-hidden rounded-full bg-white/10">
              <motion.span
                className="block h-full origin-left rounded-full bg-gradient-to-r from-cyan-300 via-blue-400 to-cyan-300"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 1.15, duration: 1.35, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
