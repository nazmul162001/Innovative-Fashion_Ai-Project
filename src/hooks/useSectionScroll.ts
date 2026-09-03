import { useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '../lib/gsap';
import { NAV_EVENT } from '../providers/NavigationEffects';

let refreshBound = false;

function bindScrollRefresh() {
  if (refreshBound || typeof document === 'undefined') return;
  refreshBound = true;
  const refresh = () => ScrollTrigger.refresh();
  window.addEventListener(NAV_EVENT, refresh);
}

export function useSectionScroll<T extends HTMLElement = HTMLElement>() {
  const ref = useRef<T>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;

      bindScrollRefresh();

      const mm = gsap.matchMedia();

      mm.add(
        {
          reduceMotion: '(prefers-reduced-motion: reduce)',
          motionOk: '(prefers-reduced-motion: no-preference)',
        },
        (context) => {
          const reduce = Boolean(context.conditions?.reduceMotion);
          const grouped = new Set(root.querySelectorAll('[data-stagger] [data-reveal]'));
          const reveals = [...root.querySelectorAll<HTMLElement>('[data-reveal]')].filter((el) => !grouped.has(el));
          const groups = root.querySelectorAll<HTMLElement>('[data-stagger]');
          const parallax = root.querySelectorAll<HTMLElement>('[data-parallax]');
          const lines = root.querySelectorAll<HTMLElement>('[data-line]');

          if (reduce) {
            gsap.set([...reveals, ...grouped], { autoAlpha: 1, y: 0, x: 0 });
            gsap.set(lines, { scaleX: 1 });
            return;
          }

          reveals.forEach((el) => {
            const dir = el.dataset.reveal ?? 'up';
            gsap.from(el, {
              autoAlpha: 0,
              y: dir === 'up' ? 28 : dir === 'down' ? -16 : 0,
              x: dir === 'left' ? -24 : dir === 'right' ? 24 : 0,
              duration: 0.7,
              ease: 'power3.out',
              clearProps: 'transform',
              scrollTrigger: {
                trigger: el,
                start: 'top 90%',
                once: true,
                fastScrollEnd: true,
              },
            });
          });

          groups.forEach((group) => {
            const kids = group.querySelectorAll<HTMLElement>('[data-reveal]');
            gsap.from(kids, {
              autoAlpha: 0,
              y: 24,
              duration: 0.65,
              ease: 'power3.out',
              stagger: 0.08,
              clearProps: 'transform',
              scrollTrigger: {
                trigger: group,
                start: 'top 88%',
                once: true,
                fastScrollEnd: true,
              },
            });
          });

          parallax.forEach((el) => {
            gsap.fromTo(
              el,
              { yPercent: -6 },
              {
                yPercent: 6,
                ease: 'none',
                scrollTrigger: {
                  trigger: el.parentElement ?? el,
                  start: 'top bottom',
                  end: 'bottom top',
                  scrub: 0.6,
                },
              },
            );
          });

          lines.forEach((el) => {
            gsap.fromTo(
              el,
              { scaleX: 0 },
              {
                scaleX: 1,
                ease: 'none',
                transformOrigin: 'left center',
                scrollTrigger: {
                  trigger: el,
                  start: 'top 90%',
                  end: 'top 45%',
                  scrub: true,
                },
              },
            );
          });
        },
        root,
      );

      return () => mm.revert();
    },
    { scope: ref },
  );

  return ref;
}
