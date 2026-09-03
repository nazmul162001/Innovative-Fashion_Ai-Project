/**
 * Lightweight previous-page peek for swipe-back.
 * Keeps a single frozen viewport clone — no canvas, no extra deps.
 */

const UNDERLAY_ID = 'swipe-back-underlay';

let underlayEl: HTMLDivElement | null = null;

function isMobileViewport(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches;
}

export function releasePageSnapshot(): void {
  underlayEl?.remove();
  underlayEl = null;
  const stray = document.getElementById(UNDERLAY_ID);
  stray?.remove();
}

/** Capture the visible page into a fixed underlay behind the live root. */
export function capturePageSnapshot(source: HTMLElement): void {
  if (!isMobileViewport()) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  releasePageSnapshot();

  const wrap = document.createElement('div');
  wrap.id = UNDERLAY_ID;
  wrap.setAttribute('aria-hidden', 'true');
  wrap.style.cssText = [
    'position:fixed',
    'inset:0',
    'z-index:30',
    'overflow:hidden',
    'pointer-events:none',
    'contain:strict',
    'background:#0F1218',
  ].join(';');

  const clone = source.cloneNode(true) as HTMLElement;
  clone.removeAttribute('id');
  clone.setAttribute('aria-hidden', 'true');
  clone.style.cssText = [
    'position:absolute',
    'left:0',
    'right:0',
    'top:0',
    `transform:translate3d(0,${-window.scrollY}px,0)`,
    'width:100%',
    'will-change:auto',
  ].join(';');

  // Freeze interaction + strip heavy bits that don't help the peek.
  clone.querySelectorAll('script, iframe, video, canvas').forEach((node) => node.remove());
  clone.querySelectorAll('a, button, input, select, textarea').forEach((node) => {
    node.setAttribute('tabindex', '-1');
    if (node instanceof HTMLElement) node.style.pointerEvents = 'none';
  });

  const dim = document.createElement('div');
  dim.dataset.swipeDim = '1';
  dim.style.cssText = 'position:absolute;inset:0;background:rgba(0,0,0,0.28);';

  wrap.appendChild(clone);
  wrap.appendChild(dim);

  const parent = source.parentElement;
  if (!parent) return;
  parent.insertBefore(wrap, source);
  underlayEl = wrap;
}

export function setSnapshotDim(amount: number): void {
  const dim = underlayEl?.querySelector<HTMLElement>('[data-swipe-dim]');
  if (!dim) return;
  const t = Math.max(0, Math.min(1, amount));
  // More of the previous page shows as you drag (dim eases off slightly).
  dim.style.opacity = String(0.28 + t * 0.12);
}

export function hasPageSnapshot(): boolean {
  return Boolean(underlayEl ?? document.getElementById(UNDERLAY_ID));
}
