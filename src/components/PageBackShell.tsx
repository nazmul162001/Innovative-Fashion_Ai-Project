import { useEffect, useRef, useState, type ReactNode } from 'react';
import { motion, useMotionValue, useReducedMotion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

interface PageBackShellProps {
  children: ReactNode;
}

export default function PageBackShell({ children }: PageBackShellProps) {
  const reduceMotion = useReducedMotion();
  const startX = useRef(0);
  const startY = useRef(0);
  const tracking = useRef(false);
  const dragX = useRef(0);
  const x = useMotionValue(0);
  const [, setTick] = useState(0);

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
    const onStart = (event: TouchEvent) => {
      if (event.touches.length !== 1) return;
      const touch = event.touches[0];
      if (!touch || touch.clientX > 32) return;
      tracking.current = true;
      startX.current = touch.clientX;
      startY.current = touch.clientY;
      dragX.current = 0;
    };

    const onMove = (event: TouchEvent) => {
      if (!tracking.current || event.touches.length !== 1) return;
      const touch = event.touches[0];
      if (!touch) return;
      const dx = touch.clientX - startX.current;
      const dy = Math.abs(touch.clientY - startY.current);
      if (dy > 52 && dx < 20) {
        tracking.current = false;
        dragX.current = 0;
        x.set(0);
        setTick((value) => value + 1);
        return;
      }
      if (dx > 0) {
        dragX.current = Math.min(dx, 140);
        x.set(dragX.current * 0.85);
        setTick((value) => value + 1);
      }
    };

    const onEnd = () => {
      if (!tracking.current) return;
      tracking.current = false;
      if (dragX.current > 78) {
        goBack();
        return;
      }
      dragX.current = 0;
      x.set(0);
      setTick((value) => value + 1);
    };

    window.addEventListener('touchstart', onStart, { passive: true });
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('touchend', onEnd);
    window.addEventListener('touchcancel', onEnd);
    return () => {
      window.removeEventListener('touchstart', onStart);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onEnd);
      window.removeEventListener('touchcancel', onEnd);
    };
  }, [x]);

  return (
    <motion.div
      style={reduceMotion ? undefined : { x }}
      className="relative min-w-0"
      initial={reduceMotion ? false : { opacity: 0, x: 36 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="mx-auto w-full max-w-7xl px-4 pt-4 md:px-6 md:pt-6">
        <button
          type="button"
          onClick={goBack}
          aria-label="Go back"
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-fog transition hover:border-white/20 hover:text-snow"
        >
          <ArrowLeft size={16} />
          Back
        </button>
      </div>
      {children}
    </motion.div>
  );
}
