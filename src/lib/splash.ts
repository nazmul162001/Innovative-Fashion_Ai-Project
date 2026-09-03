declare global {
  interface Window {
    /** Splash currently displaying (survives React Strict Mode remount). */
    __ifSplashPlaying?: boolean;
    /** Splash already finished for this document lifetime. */
    __ifSplashDone?: boolean;
    /** Set after the first Astro page-load when a soft client nav happens. */
    __ifAstroClientNav?: boolean;
    __ifPageLoads?: number;
    /** True while handling browser back/forward so islands skip forced top scroll. */
    __ifIsPopNav?: boolean;
    /** Guards Layout nav/scroll script from re-binding on ClientRouter swaps. */
    __ifNavInit?: boolean;
  }
}

/**
 * Show splash on every full load / reload of the home page.
 * Skip only after it already finished, or on soft Astro client navigations.
 */
export function shouldPlaySplash(): boolean {
  if (typeof window === 'undefined') return false;

  const path = window.location.pathname;
  if (path !== '/' && path !== '') return false;

  // Remount while splash is on screen (Strict Mode) — keep playing.
  if (window.__ifSplashPlaying) return true;

  // Already finished this page load.
  if (window.__ifSplashDone) return false;

  // Soft in-app navigation back to home — no splash.
  if (window.__ifAstroClientNav) return false;

  // Browser back/forward restore — no splash.
  const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
  if (nav?.type === 'back_forward') return false;

  return true;
}

export function markSplashStarted(): void {
  if (typeof window === 'undefined') return;
  window.__ifSplashPlaying = true;
}

export function markSplashEnded(): void {
  if (typeof window === 'undefined') return;
  window.__ifSplashPlaying = false;
  window.__ifSplashDone = true;
}

/** @deprecated kept so older imports do not break */
export function markHomeVisited(): void {
  /* no-op */
}
