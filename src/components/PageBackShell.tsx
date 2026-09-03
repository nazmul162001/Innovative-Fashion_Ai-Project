import { useEffect, useRef, type ReactNode } from 'react';
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from 'framer-motion';

interface PageBackShellProps {
  children: ReactNode;
}

/** Slack-style edge swipe: drag from the left edge to reveal previous page and go back. */
export default function PageBackShell({ children }: PageBackShellProps) {
  const reduceMotion = useReducedMotion();
  const startX = useRef(0);
  const startY = useRef(0);
  const tracking = useRef(false);
  const locked = useRef(false);
  const x = useMotionValue(0);
  const dim = useTransform(x, [0, 320], [0, 0.45]);
  const shadow = useTransform(x, [0, 40, 320], [0, 0.18, 0.35]);

  const goBack = () => {
    if (typeof window === 'undefined') return;
    if (window.history.length > 1) {
      window.history.back();
      return;
    }
    void import('astro:transitions/client')
      .then(({ navigate }) => navigate('/'))
      .catch(() => window.location.assign('/'));
  };

  useEffect(() => {
    const EDGE = 28;
    const reset = () => {
      tracking.current = false;
      locked.current = false;
      document.documentElement.classList.remove('overflow-x-hidden');
      void animate(x, 0, { type: 'spring', stiffness: 420, damping: 38 });
    };

    const onStart = (event: TouchEvent) => {
      if (reduceMotion) return;
      if (event.touches.length !== 1) return;
      const touch = event.touches[0];
      if (!touch || touch.clientX > EDGE) return;
      tracking.current = true;
      locked.current = false;
      startX.current = touch.clientX;
      startY.current = touch.clientY;
    };

    const onMove = (event: TouchEvent) => {
      if (!tracking.current || event.touches.length !== 1) return;
      const touch = event.touches[0];
      if (!touch) return;
      const dx = touch.clientX - startX.current;
      const dy = touch.clientY - startY.current;

      if (!locked.current) {
        if (Math.abs(dy) > 14 && Math.abs(dy) > Math.abs(dx) * 1.15) {
          tracking.current = false;
          void animate(x, 0, { type: 'spring', stiffness: 420, damping: 38 });
          return;
        }
        if (dx > 8) {
          locked.current = true;
          document.documentElement.classList.add('overflow-x-hidden');
        }
      }

      if (!locked.current) return;
      if (event.cancelable) event.preventDefault();
      x.set(Math.max(0, Math.min(dx, window.innerWidth * 0.94)));
    };

    const onEnd = () => {
      if (!tracking.current && !locked.current) return;
      const current = x.get();
      tracking.current = false;
      locked.current = false;
      document.documentElement.classList.remove('overflow-x-hidden');
      const threshold = Math.min(110, window.innerWidth * 0.26);
      if (current > threshold) {
        void animate(x, window.innerWidth, { duration: 0.2, ease: [0.22, 1, 0.36, 1] }).then(goBack);
        return;
      }
      void animate(x, 0, { type: 'spring', stiffness: 420, damping: 38 });
    };

    window.addEventListener('touchstart', onStart, { passive: true });
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('touchend', onEnd);
    window.addEventListener('touchcancel', reset);
    return () => {
      document.documentElement.classList.remove('overflow-x-hidden');
      window.removeEventListener('touchstart', onStart);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onEnd);
      window.removeEventListener('touchcancel', reset);
    };
  }, [reduceMotion, x]);

  return (
    <div className="relative w-full max-w-full overflow-x-clip">
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[5] bg-black md:hidden"
        style={{ opacity: dim }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-y-0 left-0 z-[5] w-2 bg-black md:hidden"
        style={{ opacity: shadow }}
      />
      <motion.div
        style={reduceMotion ? undefined : { x }}
        className="relative z-[6] w-full min-w-0 max-w-full overflow-x-clip will-change-transform"
        initial={reduceMotion ? false : { opacity: 0.98 }}
        animate={{ opacity: 1 }}
      >
        {children}
      </motion.div>
    </div>
  );
}
