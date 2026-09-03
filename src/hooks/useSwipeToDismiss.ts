import { useEffect, useRef, type RefObject } from 'react';
import { animate, type AnimationPlaybackControls, type MotionValue } from 'framer-motion';

interface UseSwipeToDismissOptions {
  enabled?: boolean;
  targetRef?: RefObject<HTMLElement | null>;
  x: MotionValue<number>;
  onCommit: () => void;
  maxOffset?: number | (() => number);
  distanceThreshold?: number;
  velocityThreshold?: number;
  ignoreSelector?: string;
  edgeOnly?: boolean;
  edgeWidth?: number;
  requireTargetHit?: boolean;
  /** Called while dragging (0–1 progress). */
  onProgress?: (progress: number) => void;
}

/**
 * Right-swipe dismiss with direction lock. Uses transform-only motion values.
 * Does NOT reset `x` after commit — the caller owns enter/exit lifecycle.
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
  onProgress,
}: UseSwipeToDismissOptions) {
  const onCommitRef = useRef(onCommit);
  const onProgressRef = useRef(onProgress);
  onCommitRef.current = onCommit;
  onProgressRef.current = onProgress;

  useEffect(() => {
    if (!enabled) return;

    let activeAnim: AnimationPlaybackControls | null = null;
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

    const stopAnim = () => {
      activeAnim?.stop();
      activeAnim = null;
    };

    const springBack = () => {
      stopAnim();
      activeAnim = animate(x, 0, { type: 'spring', stiffness: 460, damping: 40 });
      onProgressRef.current?.(0);
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

      stopAnim();
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
      const max = getMax();
      const next = Math.max(0, Math.min(dx, max * 0.98));
      x.set(next);
      onProgressRef.current?.(next / Math.max(max, 1));
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

      const max = getMax();
      const threshold = distanceThreshold ?? Math.min(100, window.innerWidth * 0.24);
      if (current > threshold || velocity.current > velocityThreshold) {
        stopAnim();
        activeAnim = animate(x, max, {
          duration: 0.18,
          ease: [0.22, 1, 0.36, 1],
          onComplete: () => {
            onProgressRef.current?.(1);
            onCommitRef.current();
            // Intentionally do NOT reset x — prevents flash/shake.
          },
        });
        return;
      }
      springBack();
    };

    window.addEventListener('touchstart', onStart, { passive: true });
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('touchend', onEnd);
    window.addEventListener('touchcancel', reset);
    return () => {
      stopAnim();
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
