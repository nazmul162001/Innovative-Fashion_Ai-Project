export const CATEGORY_EVENT = 'if:category';

export function readCollectionCategory(): string {
  if (typeof window === 'undefined') return 'all';
  return new URLSearchParams(window.location.search).get('category') ?? 'all';
}

function scrollToHash(hash: string) {
  if (!hash) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }
  const id = hash.startsWith('#') ? hash.slice(1) : hash;
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

export function applyHomeUrl(url: URL, push: boolean) {
  const category = url.searchParams.get('category') ?? 'all';
  const next = `${url.pathname}${url.search}${url.hash}`;
  const current = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  if (push && next !== current) {
    // Preserve Astro ClientRouter history fields (index / scrollX / scrollY).
    const prev =
      window.history.state && typeof window.history.state === 'object' ? window.history.state : {};
    window.history.pushState(
      {
        ...prev,
        category,
        scrollX: window.scrollX || 0,
        scrollY: window.scrollY || 0,
      },
      '',
      next,
    );
  }
  window.dispatchEvent(new CustomEvent(CATEGORY_EVENT, { detail: category }));
  scrollToHash(url.hash);
}

export function shouldHandleHomeInPlace(url: URL): boolean {
  return url.origin === window.location.origin && url.pathname === '/' && window.location.pathname === '/';
}
