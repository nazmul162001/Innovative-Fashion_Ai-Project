import { useEffect, useRef, type RefObject } from 'react';
import { animate, type MotionValue } from 'framer-motion';

interface UseSwipeToDismissOptions {
  enabled?: boolean;
  /** Element that owns the gesture. Defaults to window/document. */
  targetRef?: RefObject<HTMLElement | null>;
  /** Motion value driving horizontal position (px). */
  x: MotionValue<number>;
  /** Called when the swipe commits (close / go back). */
  onCommit: () => void;
  /** Max drag distance. Defaults to viewport width. */
  maxOffset?: number | (() => number);
  distanceThreshold?: number;
  velocityThreshold?: number;
  /** Ignore swipes that start on these selectors (horizontal carousels, etc.). */
  ignoreSelector?: string;
  /** When true, only start from the left screen edge. */
  edgeOnly?: boolean;
  edgeWidth?: number;
  /** Restrict tracking to touches that begin inside targetRef (when set). */
  requireTargetHit?: boolean;
}

/**
 * Right-swipe dismiss with direction lock so vertical scrolling still works.
 */
export function useSwipeToDismiss({
  enabled = true,
  targetRef,
  x,
  onCommit,
  maxOffset,
  distanceThreshold,
  velocityThreshold = 650,
  ignoreSelector = '[data-no-swipe-back]',
  edgeOnly = false,
  edgeWidth = 28,
  requireTargetHit = false,
}: UseSwipeToDismissOptions) {
  const onCommitRef = useRef(onCommit);
  onCommitRef.current = onCommit;

  useEffect(() => {
    if (!enabled) return;

    const startX = { current: 0 };
    const startY = { current: 0 };
    const tracking = { current: false };
    const locked = { current: false };
    const lastX = { current: 0 };
    const lastT = { current: 0 };
    const velocity = { current: 0 };

    const getMax = () => {
      if (typeof maxOffset === 'function') return maxOffset();
      if (typeof maxOffset === 'number') return maxOffset;
      return window.innerWidth;
    };

    const springBack = () => {
      void animate(x, 0, { type: 'spring', stiffness: 420, damping: 38 });
    };

    const reset = () => {
      tracking.current = false;
      locked.current = false;
      velocity.current = 0;
      document.documentElement.classList.remove('overflow-x-hidden');
      springBack();
    };

    const shouldIgnore = (target: EventTarget | null) => {
      if (!(target instanceof Element)) return false;
      if (ignoreSelector && target.closest(ignoreSelector)) return true;
      return false;
    };

    const isInsideTarget = (target: EventTarget | null) => {
      const root = targetRef?.current;
      if (!root || !(target instanceof Node)) return !requireTargetHit;
      return root.contains(target);
    };

    const onStart = (event: TouchEvent) => {
      if (event.touches.length !== 1) return;
      const touch = event.touches[0];
      if (!touch) return;
      if (edgeOnly && touch.clientX > edgeWidth) return;
      if (requireTargetHit && !isInsideTarget(event.target)) return;
      if (shouldIgnore(event.target)) return;

      tracking.current = true;
      locked.current = false;
      startX.current = touch.clientX;
      startY.current = touch.clientY;
      lastX.current = touch.clientX;
      lastT.current = performance.now();
      velocity.current = 0;
    };

    const onMove = (event: TouchEvent) => {
      if (!tracking.current || event.touches.length !== 1) return;
      const touch = event.touches[0];
      if (!touch) return;

      const dx = touch.clientX - startX.current;
      const dy = touch.clientY - startY.current;
      const now = performance.now();
      const dt = Math.max(1, now - lastT.current);
      velocity.current = ((touch.clientX - lastX.current) / dt) * 1000;
      lastX.current = touch.clientX;
      lastT.current = now;

      if (!locked.current) {
        if (Math.abs(dy) > 12 && Math.abs(dy) > Math.abs(dx) * 1.1) {
          tracking.current = false;
          springBack();
          return;
        }
        if (dx > 10 && Math.abs(dx) > Math.abs(dy)) {
          locked.current = true;
          document.documentElement.classList.add('overflow-x-hidden');
        }
      }

      if (!locked.current) return;
      if (event.cancelable) event.preventDefault();
      x.set(Math.max(0, Math.min(dx, getMax() * 0.96)));
    };

    const onEnd = () => {
      if (!tracking.current && !locked.current) return;
      const current = x.get();
      const wasLocked = locked.current;
      tracking.current = false;
      locked.current = false;
      document.documentElement.classList.remove('overflow-x-hidden');

      if (!wasLocked) {
        springBack();
        return;
      }

      const threshold = distanceThreshold ?? Math.min(110, window.innerWidth * 0.26);
      if (current > threshold || velocity.current > velocityThreshold) {
        void animate(x, getMax(), { duration: 0.2, ease: [0.22, 1, 0.36, 1] }).then(() => {
          onCommitRef.current();
          x.set(0);
        });
        return;
      }
      springBack();
    };

    const optsPassive = { passive: true } as const;
    const optsActive = { passive: false } as const;

    window.addEventListener('touchstart', onStart, optsPassive);
    window.addEventListener('touchmove', onMove, optsActive);
    window.addEventListener('touchend', onEnd);
    window.addEventListener('touchcancel', reset);
    return () => {
      document.documentElement.classList.remove('overflow-x-hidden');
      window.removeEventListener('touchstart', onStart);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onEnd);
      window.removeEventListener('touchcancel', reset);
    };
  }, [
    enabled,
    targetRef,
    x,
    maxOffset,
    distanceThreshold,
    velocityThreshold,
    ignoreSelector,
    edgeOnly,
    edgeWidth,
    requireTargetHit,
  ]);
}
