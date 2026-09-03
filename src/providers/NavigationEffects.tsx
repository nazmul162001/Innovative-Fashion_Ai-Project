'use client';

import { useLayoutEffect } from 'react';
import { usePathname } from 'next/navigation';

const SCROLL_KEY = 'if-scroll-map';
export const NAV_EVENT = 'if:navigation';

/** Module-level — survives Strict Mode / Suspense remounts of this component. */
let bootstrapped = false;
let lastKey: string | null = null;
const pathStack: string[] = [];
let pendingRestoreY: number | null = null;
let restoreTimer = 0;

function readMap(): Record<string, number> {
  try {
    return JSON.parse(sessionStorage.getItem(SCROLL_KEY) || '{}') as Record<string, number>;
  } catch {
    return {};
  }
}

function writeMap(map: Record<string, number>) {
  try {
    sessionStorage.setItem(SCROLL_KEY, JSON.stringify(map));
  } catch {
    /* ignore */
  }
}

function saveScroll(key: string, y = window.scrollY || window.pageYOffset || 0) {
  if (!key) return;
  const map = readMap();
  map[key] = y;
  writeMap(map);
}

function scrollTop() {
  pendingRestoreY = null;
  window.scrollTo({ left: 0, top: 0, behavior: 'instant' });
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}

function applyScrollY(y: number) {
  window.scrollTo({ left: 0, top: y, behavior: 'instant' });
  document.documentElement.scrollTop = y;
  document.body.scrollTop = y;
}

function restoreScroll(key: string) {
  const map = readMap();
  const y = map[key];
  if (typeof y !== 'number') {
    scrollTop();
    return;
  }
  pendingRestoreY = y;
  applyScrollY(y);

  window.clearTimeout(restoreTimer);
  const deadlines = [0, 16, 50, 100, 200, 400, 700, 1200];
  deadlines.forEach((ms) => {
    window.setTimeout(() => {
      if (pendingRestoreY === null) return;
      applyScrollY(pendingRestoreY);
    }, ms);
  });
  restoreTimer = window.setTimeout(() => {
    pendingRestoreY = null;
  }, 1400);
}

function emitNavigation() {
  window.dispatchEvent(new CustomEvent(NAV_EVENT));
  window.__ifPageLoads = (window.__ifPageLoads || 0) + 1;
  if ((window.__ifPageLoads || 0) > 1) window.__ifAstroClientNav = true;
}

function ensureNavListeners() {
  if (typeof window === 'undefined' || window.__ifNavInit) return;
  window.__ifNavInit = true;

  try {
    history.scrollRestoration = 'manual';
  } catch {
    /* ignore */
  }

  window.__ifPageLoads = window.__ifPageLoads || 0;
  window.__ifIsPopNav = false;

  // Capture phase so we run even if Next handles the event first.
  window.addEventListener(
    'popstate',
    () => {
      window.__ifIsPopNav = true;
    },
    true,
  );

  // Keep latest scroll for the active path while the user browses.
  let scrollTimer = 0;
  const persist = () => {
    window.clearTimeout(scrollTimer);
    scrollTimer = window.setTimeout(() => {
      if (lastKey) saveScroll(lastKey);
    }, 50);
  };
  window.addEventListener('scroll', persist, { passive: true });
  window.addEventListener('scrollend', () => {
    if (lastKey) saveScroll(lastKey);
  });

  document.addEventListener(
    'click',
    (event) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }
      const anchor = (event.target as Element | null)?.closest?.('a');
      if (!anchor) return;
      const href = anchor.getAttribute('href');
      if (!href || href.startsWith('#')) return;

      let url: URL;
      try {
        url = new URL(href, location.href);
      } catch {
        return;
      }
      if (url.origin !== location.origin) return;

      // Always snapshot scroll before Next soft-navigates away.
      const leaving = location.pathname;
      if (url.pathname !== leaving && lastKey) {
        saveScroll(lastKey, window.scrollY || window.pageYOffset || 0);
      } else if (url.pathname !== leaving) {
        saveScroll(leaving, window.scrollY || window.pageYOffset || 0);
      }

      // Home category soft-nav (stay on `/`).
      if (url.pathname === '/' && location.pathname === '/') {
        event.preventDefault();
        event.stopPropagation();
        const category = url.searchParams.get('category') || 'all';
        const next = `${url.pathname}${url.search}${url.hash}`;
        const current = `${location.pathname}${location.search}${location.hash}`;
        if (next !== current) {
          const prev = history.state && typeof history.state === 'object' ? history.state : {};
          history.pushState({ ...prev, category, scrollY: window.scrollY || 0 }, '', next);
        }
        window.dispatchEvent(new CustomEvent('if:category', { detail: category }));
        if (url.hash) {
          document.getElementById(url.hash.slice(1))?.scrollIntoView({ behavior: 'smooth' });
        } else if (!url.search) {
          scrollTop();
        }
      }
    },
    true,
  );
}

/**
 * App Router scroll restore. Pathname-only keys (search handled via soft category nav).
 * State is module-scoped so Suspense/Strict Mode remounts cannot reset it and force top.
 */
export default function NavigationEffects() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    ensureNavListeners();

    const key = pathname;

    if (!bootstrapped) {
      bootstrapped = true;
      lastKey = key;
      pathStack.push(key);
      emitNavigation();
      if (!window.__ifIsPopNav) scrollTop();
      return;
    }

    if (lastKey === key) return;

    const prev = lastKey;
    const stackBack = pathStack.length >= 2 && pathStack[pathStack.length - 2] === key;
    const isPop = Boolean(window.__ifIsPopNav) || stackBack;

    if (!isPop && prev) {
      // Prefer already-saved click snapshot; only write if missing.
      const map = readMap();
      if (typeof map[prev] !== 'number') {
        saveScroll(prev, window.scrollY || window.pageYOffset || 0);
      }
    }

    lastKey = key;
    emitNavigation();

    if (isPop) {
      if (stackBack) {
        pathStack.pop();
      } else {
        const idx = pathStack.lastIndexOf(key);
        if (idx >= 0) pathStack.length = idx + 1;
        else pathStack.push(key);
      }
      restoreScroll(key);
      window.setTimeout(() => {
        window.__ifIsPopNav = false;
      }, 500);
      return;
    }

    pathStack.push(key);
    scrollTop();
  }, [pathname]);

  return null;
}
