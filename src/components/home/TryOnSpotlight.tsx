import { ArrowRight } from 'lucide-react';
import { unsplash } from '../../lib/utils';
import { useSectionScroll } from '../../hooks/useSectionScroll';

export default function TryOnSpotlight() {
  const ref = useSectionScroll<HTMLElement>();

  return (
    <section
      id="try-on-studio"
      ref={ref}
      className="mx-auto w-full max-w-7xl px-4 py-6 md:px-6 md:py-10"
    >
      <div className="dark-card-glow relative overflow-hidden rounded-[28px] md:rounded-[32px]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_20%,rgba(56,189,248,0.14),transparent_50%),radial-gradient(ellipse_at_90%_80%,rgba(79,128,255,0.12),transparent_46%)]" />

        <div className="relative grid items-center gap-8 p-6 md:grid-cols-2 md:gap-12 md:p-10 lg:p-14">
          <div className="min-w-0">
            <p data-reveal className="text-[10px] font-medium tracking-[0.22em] text-accent-cyan uppercase sm:text-[11px]">
              02  —  Virtual fitting
            </p>
            <h2
              data-reveal
              className="mt-3 text-2xl font-bold tracking-tight text-snow uppercase sm:text-4xl lg:text-[44px] lg:leading-[1.08]"
            >
              The fitting room that follows you home.
            </h2>
            <p data-reveal className="mt-4 max-w-md text-sm leading-relaxed text-mist sm:text-base">
              Preview drape, color, and proportion on your silhouette — in the browser. No queue. No harsh lighting. Just the look, on you, before you commit.
            </p>

            <ul data-stagger className="mt-6 space-y-2.5 text-sm text-fog">
              {[
                'See true length and shoulder fall on your body',
                'Switch looks in seconds — keep only what belongs',
                'Sizes from XS to 4XL+, mapped to you',
              ].map((item) => (
                <li key={item} data-reveal className="flex gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-cyan" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div data-reveal className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="/try-on"
                className="ai-button-glow inline-flex items-center gap-2 rounded-xl px-5 py-3 text-xs font-semibold tracking-[0.12em] text-white uppercase sm:text-sm"
              >
                Open try-on studio
                <ArrowRight size={16} />
              </a>
              <a
                href="#how-it-works"
                className="inline-flex items-center gap-2 rounded-xl border border-white/12 px-5 py-3 text-xs font-semibold tracking-[0.12em] text-fog uppercase transition hover:border-white/25 hover:text-snow sm:text-sm"
              >
                See the steps
              </a>
            </div>
          </div>

          <div data-reveal="right" className="relative mx-auto w-full max-w-md">
            <div className="relative overflow-hidden rounded-[24px]">
              <img
                data-parallax
                src={unsplash('photo-1534528741775-53994a69daeb', 1200)}
                alt="A model in a composed look, ready for virtual try-on"
                className="studio-image-light aspect-[4/5] w-full object-cover will-change-transform"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0f1218]/70 via-transparent to-transparent" />
              <div className="absolute top-4 left-4 rounded-lg border border-white/15 bg-dark-bg/70 px-3 py-2 backdrop-blur-md">
                <p className="text-[9px] tracking-[0.18em] text-accent-cyan uppercase">Inova.scan</p>
                <p className="mt-0.5 text-[10px] text-fog">Live on your silhouette</p>
              </div>
              <div className="absolute right-4 bottom-4 left-4 flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-dark-bg/75 px-4 py-3 backdrop-blur-md">
                <p className="text-xs text-snow">Tap a look. See it on you.</p>
                <span className="text-[10px] tracking-[0.16em] text-mist uppercase">Fit map 1.00</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
