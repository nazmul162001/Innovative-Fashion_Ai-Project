const SESSION_KEY = 'if-home-visited';

declare global {
  interface Window {
    __ifSplashShown?: boolean;
    __ifDocNavType?: string;
    __ifOriginalPath?: string;
  }
}

export function rememberDocumentNav(): void {
  if (typeof window === 'undefined') return;
  window.__ifDocNavType ??= performance.getEntriesByType('navigation')[0]?.type;
  window.__ifOriginalPath ??= window.location.pathname;
}

export function shouldPlaySplash(): boolean {
  if (typeof window === 'undefined') return false;
  rememberDocumentNav();
  if (window.__ifSplashShown) return false;
  window.__ifSplashShown = true;

  const path = window.location.pathname;
  if (path !== '/' && path !== '') return false;

  try {
    const seen = sessionStorage.getItem(SESSION_KEY) === '1';
    const reloadedThisPage =
      window.__ifDocNavType === 'reload' && (window.__ifOriginalPath === '/' || window.__ifOriginalPath === '');
    return !seen || reloadedThisPage;
  } catch {
    return false;
  }
}

export function markHomeVisited(): void {
  try {
    sessionStorage.setItem(SESSION_KEY, '1');
  } catch {
    /* ignore */
  }
}
