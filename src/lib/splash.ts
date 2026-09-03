declare global {
  interface Window {
    /** Splash currently displaying (survives React Strict Mode remount). */
    __ifSplashPlaying?: boolean;
    /** Splash already finished for this document lifetime. */
    __ifSplashDone?: boolean;
    /** Set after the first soft client navigation (name kept for splash script compat). */
    __ifAstroClientNav?: boolean;
    __ifPageLoads?: number;
    /** True while handling browser back/forward so islands skip forced top scroll. */
    __ifIsPopNav?: boolean;
    /** Guards nav/scroll script from re-binding. */
    __ifNavInit?: boolean;
  }
}

/**
 * Show splash on every full load / reload of the home page.
 * Skip only after it already finished, or on soft client navigations.
 */
export function shouldPlaySplash(): boolean {
  if (typeof window === 'undefined') return false;

  const path = window.location.pathname;
  if (path !== '/' && path !== '') return false;

  if (window.__ifSplashPlaying) return true;
  if (window.__ifSplashDone) return false;
  if (window.__ifAstroClientNav) return false;

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
