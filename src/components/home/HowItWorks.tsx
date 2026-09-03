'use client';

import { Camera, ScanLine, Sparkles, ShieldCheck } from 'lucide-react';
import { useSectionScroll } from '../../hooks/useSectionScroll';

const steps = [
  {
    n: '01',
    title: 'Start with a photo',
    copy: 'One clear snapshot. No studio, no appointment — just you, as you are.',
    icon: Camera,
  },
  {
    n: '02',
    title: 'We map your silhouette',
    copy: 'Fit models read proportion and posture, not a generic size label.',
    icon: ScanLine,
  },
  {
    n: '03',
    title: 'Try on any look',
    copy: 'See drape, color, and presence on your body before anything ships.',
    icon: Sparkles,
  },
  {
    n: '04',
    title: 'Order with certainty',
    copy: 'Keep what belongs. Easy 30-day returns on the rare miss.',
    icon: ShieldCheck,
  },
];

export default function HowItWorks() {
  const ref = useSectionScroll<HTMLElement>();

  return (
    <section
      id="how-it-works"
      ref={ref}
      className="cv-section relative mx-auto w-full max-w-7xl px-4 py-16 md:px-6 md:py-24"
    >
      <div className="max-w-2xl">
        <p data-reveal className="text-[10px] font-medium tracking-[0.22em] text-accent-cyan uppercase sm:text-[11px]">
          01  —  How it works
        </p>
        <h2
          data-reveal
          className="mt-3 text-2xl font-bold tracking-tight text-snow uppercase sm:text-4xl lg:text-[44px] lg:leading-[1.08]"
        >
          Four steps. Then you actually know.
        </h2>
        <p data-reveal className="mt-4 max-w-lg text-sm leading-relaxed text-mist sm:text-base">
          Online shopping is usually a guess. Inovative is a fitting — so the piece that arrives already feels like yours.
        </p>
      </div>

      <div className="relative mt-12 md:mt-16">
        <div
          data-line
          className="pointer-events-none absolute top-[2.25rem] right-[8%] left-[8%] hidden h-px origin-left bg-gradient-to-r from-accent-cyan/0 via-accent-cyan/50 to-accent-cyan/0 md:block"
        />
        <ol data-stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <li
                key={step.n}
                data-reveal
                className="dark-card-glow relative overflow-hidden rounded-[24px] p-5 sm:p-6"
              >
                <span className="pointer-events-none absolute -top-3 -right-1 text-6xl font-bold text-white/5">
                  {step.n}
                </span>
                <div className="relative grid h-11 w-11 place-items-center rounded-2xl border border-accent-cyan/25 bg-accent-cyan/10 text-accent-cyan">
                  <Icon size={18} strokeWidth={1.75} />
                </div>
                <h3 className="relative mt-5 text-sm font-semibold tracking-wide text-snow uppercase sm:text-base">
                  {step.title}
                </h3>
                <p className="relative mt-2 text-sm leading-relaxed text-mist">{step.copy}</p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
