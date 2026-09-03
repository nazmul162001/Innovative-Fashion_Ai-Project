import { useEffect, useRef, useState } from 'react';
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from 'framer-motion';
import { useStore } from '@nanostores/react';
import { useSwipeToDismiss } from '../hooks/useSwipeToDismiss';
import { openDrawer } from '../stores/shop';

function canGoBack(): boolean {
  if (typeof window === 'undefined') return false;
  if (window.location.pathname === '/' && !window.location.search && !window.location.hash) {
    return false;
  }
  return window.history.length > 1;
}

function goBack() {
  if (typeof window === 'undefined') return;
  if (window.history.length > 1) {
    window.history.back();
    return;
  }
  void import('astro:transitions/client')
    .then(({ navigate }) => navigate('/'))
    .catch(() => window.location.assign('/'));
}

/**
 * Full-screen swipe-right → previous page (same gesture as cart close).
 * Disabled on home, when a drawer is open, or when reduced motion is preferred.
 */
export default function SwipeBack() {
  const drawer = useStore(openDrawer, { ssr: 'initial' });
  const reduceMotion = useReducedMotion();
  const rootRef = useRef<HTMLElement | null>(null);
  const x = useMotionValue(0);
  const dim = useTransform(x, [0, 320], [0, 0.42]);
  const [enabled, setEnabled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    rootRef.current = document.getElementById('swipe-back-root');
  }, []);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 767px)');
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const sync = () => setEnabled(canGoBack());
    sync();
    document.addEventListener('astro:page-load', sync);
    window.addEventListener('popstate', sync);
    return () => {
      document.removeEventListener('astro:page-load', sync);
      window.removeEventListener('popstate', sync);
    };
  }, []);

  useEffect(() => {
    const root = rootRef.current ?? document.getElementById('swipe-back-root');
    if (!root) return;
    const unsubscribe = x.on('change', (value) => {
      root.style.transform = `translate3d(${value}px, 0, 0)`;
      root.style.willChange = value === 0 ? 'auto' : 'transform';
    });
    return () => {
      unsubscribe();
      root.style.transform = '';
      root.style.willChange = '';
    };
  }, [x]);

  const drawerOpen = drawer === 'cart' || drawer === 'wishlist';

  useSwipeToDismiss({
    enabled: enabled && isMobile && !drawerOpen && !reduceMotion,
    x,
    onCommit: () => {
      const root = rootRef.current ?? document.getElementById('swipe-back-root');
      goBack();
      requestAnimationFrame(() => {
        x.set(0);
        if (root) {
          root.style.transform = '';
          root.style.willChange = '';
        }
      });
    },
    maxOffset: () => window.innerWidth,
    ignoreSelector: '[data-no-swipe-back], [data-horizontal-scroll], .no-scrollbar',
    distanceThreshold: 96,
  });

  if (reduceMotion || !enabled || !isMobile || drawerOpen) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[40] bg-black md:hidden"
      style={{ opacity: dim }}
    />
  );
}
