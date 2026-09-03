'use client';

import { useState, type FormEvent } from 'react';
import { ArrowRight, RefreshCcw, Ruler, Truck, Sparkles } from 'lucide-react';
import { showToast } from '../../stores/shop';
import { useSectionScroll } from '../../hooks/useSectionScroll';

const promises = [
  { icon: Sparkles, title: 'Try before you buy', copy: 'See the garment on your silhouette in the browser.' },
  { icon: Ruler, title: 'XS to 4XL+', copy: 'Fit mapped to you — not a single sample size.' },
  { icon: Truck, title: '2–4 day shipping', copy: 'Complimentary delivery, packed like it matters.' },
  { icon: RefreshCcw, title: '30-day returns', copy: 'Keep the sure things. Send back the almosts.' },
];

const voices = [
  {
    quote: 'The drape is cinematic. Wore it twice in one week.',
    author: 'Ava L.',
    meta: 'Lumen Silk Blouse',
  },
  {
    quote: 'Softer than it looks. The charcoal hides nothing — in a good way.',
    author: 'Jonas K.',
    meta: 'Aetheric Knit Tee',
  },
  {
    quote: 'The proportion is perfect over dresses and trousers.',
    author: 'Irene C.',
    meta: 'Veil Trench',
  },
];

export default function FitConfidence() {
  const ref = useSectionScroll<HTMLElement>();
  const [email, setEmail] = useState('');

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    const value = email.trim();
    if (!value) return;
    showToast('You’re on the list. The next edit lands Friday.', 3200);
    setEmail('');
  };

  return (
    <section
      id="confidence"
      ref={ref}
      className="cv-section mx-auto w-full max-w-7xl px-4 pt-16 pb-8 md:px-6 md:pt-24 md:pb-10"
    >
      <div className="max-w-2xl">
        <p data-reveal className="text-[10px] font-medium tracking-[0.22em] text-accent-cyan uppercase sm:text-[11px]">
          05  —  Why it stays
        </p>
        <h2
          data-reveal
          className="mt-3 text-2xl font-bold tracking-tight text-snow uppercase sm:text-4xl lg:text-[44px] lg:leading-[1.08]"
        >
          Clothes that earn the keep.
        </h2>
        <p data-reveal className="mt-4 max-w-lg text-sm leading-relaxed text-mist sm:text-base">
          The goal is not more cart. It’s fewer maybes — and a wardrobe that already knows you.
        </p>
      </div>

      <div data-stagger className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {promises.map((item) => {
          const Icon = item.icon;
          return (
            <article key={item.title} data-reveal className="dark-card-glow rounded-[24px] p-5">
              <div className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/5 text-accent-cyan">
                <Icon size={18} strokeWidth={1.75} />
              </div>
              <h3 className="mt-4 text-sm font-semibold tracking-wide text-snow uppercase">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-mist">{item.copy}</p>
            </article>
          );
        })}
      </div>

      <div data-stagger className="mt-6 grid gap-4 lg:grid-cols-3">
        {voices.map((voice) => (
          <blockquote key={voice.author} data-reveal className="rounded-[24px] border border-white/8 bg-white/[0.03] p-6">
            <p className="text-base leading-relaxed text-snow">“{voice.quote}”</p>
            <footer className="mt-4 text-sm text-mist">
              <span className="text-fog">{voice.author}</span>
              <span className="mx-2 text-white/20">·</span>
              {voice.meta}
            </footer>
          </blockquote>
        ))}
      </div>

      <div
        data-reveal
        className="dark-card-glow relative mt-10 overflow-hidden rounded-[28px] px-6 py-8 md:px-12 md:py-10"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_80%_0%,rgba(56,189,248,0.16),transparent_42%)]" />
        <div className="relative grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="text-[10px] tracking-[0.22em] text-accent-cyan uppercase">The weekly edit</p>
            <h3 className="mt-3 text-2xl font-bold tracking-tight text-snow uppercase sm:text-3xl">
              Your next look is already waiting.
            </h3>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-mist">
              Short notes on fit, fabric, and what to try on this week. No noise. Unsubscribe whenever.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="/try-on"
                className="ai-button-glow inline-flex items-center gap-2 rounded-xl px-5 py-3 text-xs font-semibold tracking-[0.12em] text-white uppercase"
              >
                Try on a look
                <ArrowRight size={16} />
              </a>
              <a
                href="#collection"
                className="inline-flex items-center gap-2 rounded-xl border border-white/12 px-5 py-3 text-xs font-semibold tracking-[0.12em] text-fog uppercase transition hover:border-white/25 hover:text-snow"
              >
                Shop the collection
              </a>
            </div>
          </div>

          <form onSubmit={onSubmit} className="rounded-2xl border border-white/10 bg-dark-bg/60 p-4 sm:p-5">
            <label htmlFor="edit-email" className="text-xs tracking-[0.16em] text-mist uppercase">
              Email the edit
            </label>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
              <input
                id="edit-email"
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="contact@inovativefashion.com"
                className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-snow outline-none placeholder:text-mist/70 focus:border-accent-cyan/50"
              />
              <button
                type="submit"
                className="rounded-xl bg-snow px-4 py-3 text-xs font-semibold tracking-[0.12em] text-ink uppercase transition hover:bg-fog"
              >
                Join
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
