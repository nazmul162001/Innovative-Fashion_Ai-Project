import { useEffect, useRef, useState } from 'react';
import { useMotionValue, useReducedMotion } from 'framer-motion';
import { useStore } from '@nanostores/react';
import { useSwipeToDismiss } from '../hooks/useSwipeToDismiss';
import {
  capturePageSnapshot,
  hasPageSnapshot,
  releasePageSnapshot,
  setSnapshotDim,
} from '../lib/pageSnapshot';
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

function resetRootStyles(root: HTMLElement | null) {
  if (!root) return;
  root.style.transform = '';
  root.style.willChange = '';
  root.style.boxShadow = '';
}

/**
 * Full-screen swipe-right → previous page.
 * Peek layer is one frozen snapshot of the page you left (same idea as cart over collection).
 */
export default function SwipeBack() {
  const drawer = useStore(openDrawer, { ssr: 'initial' });
  const reduceMotion = useReducedMotion();
  const rootRef = useRef<HTMLElement | null>(null);
  const x = useMotionValue(0);
  const committing = useRef(false);
  const isPopNav = useRef(false);
  const [enabled, setEnabled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const drawerOpen = drawer === 'cart' || drawer === 'wishlist';

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
    const sync = () => setEnabled(canGoBack() && hasPageSnapshot());

    const onPopState = () => {
      isPopNav.current = true;
      sync();
    };

    const onBeforePrep = () => {
      // Back navigations must not overwrite the peek with the page being left.
      if (committing.current || isPopNav.current) return;
      const root = document.getElementById('swipe-back-root');
      if (root) capturePageSnapshot(root);
    };

    const onPageLoad = () => {
      const root = rootRef.current ?? document.getElementById('swipe-back-root');
      x.set(0);
      resetRootStyles(root);

      if (committing.current || isPopNav.current) {
        releasePageSnapshot();
      }
      // Forward client nav: keep the snapshot captured in before-preparation.

      committing.current = false;
      isPopNav.current = false;
      sync();
    };

    sync();
    document.addEventListener('astro:before-preparation', onBeforePrep);
    document.addEventListener('astro:page-load', onPageLoad);
    window.addEventListener('popstate', onPopState);
    return () => {
      document.removeEventListener('astro:before-preparation', onBeforePrep);
      document.removeEventListener('astro:page-load', onPageLoad);
      window.removeEventListener('popstate', onPopState);
    };
  }, [x]);

  useEffect(() => {
    const root = rootRef.current ?? document.getElementById('swipe-back-root');
    if (!root) return;

    const unsub = x.on('change', (value) => {
      root.style.transform = `translate3d(${value}px,0,0)`;
      if (value > 0.5) {
        root.style.willChange = 'transform';
        root.style.boxShadow = '-10px 0 28px rgba(0,0,0,0.32)';
      } else {
        root.style.willChange = 'auto';
        root.style.boxShadow = '';
      }
    });

    return () => {
      unsub();
      if (!committing.current) resetRootStyles(root);
    };
  }, [x]);

  useSwipeToDismiss({
    enabled: enabled && isMobile && !drawerOpen && !reduceMotion,
    x,
    onProgress: (progress) => setSnapshotDim(progress),
    onCommit: () => {
      committing.current = true;
      goBack();
    },
    maxOffset: () => window.innerWidth,
    ignoreSelector: '[data-no-swipe-back], [data-horizontal-scroll], .no-scrollbar',
    distanceThreshold: 88,
  });

  return null;
}
