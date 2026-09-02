import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { unsplash } from '../lib/utils';

const slides = [
  {
    title: 'Style reimagined with AI.',
    copy: 'Inovative reads silhouette, climate, and intent — then composes a look that feels inevitable. Discover garments calibrated to you.',
    image: unsplash('photo-1487222477894-8943e31ef7b2', 1400),
    coords: '41.9028° N  12.4964° E',
  },
  {
    title: 'Tailored by intelligence.',
    copy: 'Fit models trained on thousands of body maps. Less guesswork, more garments that move the way you do.',
    image: unsplash('photo-1506794778202-cad84cf45f1d', 1400),
    coords: '48.8566° N  2.3522° E',
  },
  {
    title: 'The future of fit.',
    copy: 'Try on in-browser with Inovative. Preview drape, color, and proportion before anything ships.',
    image: unsplash('photo-1534528741775-53994a69daeb', 1400),
    coords: '35.6762° N  139.6503° E',
  },
];

export default function Hero() {
  const [index, setIndex] = useState(0);
  const reduceMotion = useReducedMotion();
  const slide = slides[index] ?? slides[0];

  useEffect(() => {
    if (reduceMotion) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, 7000);
    return () => window.clearInterval(timer);
  }, [reduceMotion]);

  return (
    <section id="hero" className="hero-bg relative overflow-x-clip overflow-y-hidden">
      <div className="relative mx-auto grid w-full min-w-0 max-w-7xl items-center gap-8 px-4 py-8 md:grid-cols-2 md:gap-10 md:px-6 md:py-14">
        <div className="relative z-10 min-w-0 max-w-xl">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={slide.title}
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.45 }}
            >
              <h1 className="text-[1.75rem] font-bold tracking-tight break-words text-snow uppercase sm:text-4xl lg:text-[56px] lg:leading-[1.05]">
                {slide.title}
              </h1>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-mist sm:mt-5">{slide.copy}</p>
            </motion.div>
          </AnimatePresence>
          <a
            href="#collection"
            className="mt-6 inline-flex rounded-xl bg-accent-blue px-5 py-3 text-xs font-semibold tracking-[0.12em] text-white uppercase transition hover:bg-signal-deep sm:mt-8 sm:px-6 sm:text-sm"
          >
            Discover Your Look
          </a>
        </div>

        <div className="relative mx-auto w-full min-w-0 max-w-md lg:max-w-lg">
          <div className="dark-card-glow relative overflow-hidden rounded-[28px]">
            <AnimatePresence mode="wait" initial={false}>
              <motion.img
                key={slide.image}
                src={slide.image}
                alt=""
                initial={false}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="studio-image-light aspect-[4/5] w-full object-cover"
              />
            </AnimatePresence>
            <AiHud coords={slide.coords} />
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-2 pb-6" role="tablist" aria-label="Hero slides">
        {slides.map((item, slideIndex) => (
          <button
            key={item.title}
            type="button"
            role="tab"
            aria-selected={slideIndex === index}
            onClick={() => setIndex(slideIndex)}
            className={`h-1.5 rounded-full transition ${slideIndex === index ? 'w-8 bg-snow' : 'w-4 bg-white/25'}`}
          />
        ))}
      </div>
    </section>
  );
}

function AiHud({ coords }: { coords: string }) {
  return (
    <div className="pointer-events-none absolute inset-0">
      <svg viewBox="0 0 400 500" className="h-full w-full">
        <defs>
          <linearGradient id="hud" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#9ecbff" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#5b7cfa" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        <rect x="28" y="36" width="70" height="70" fill="none" stroke="url(#hud)" strokeWidth="1.2" opacity="0.7" />
        <rect x="302" y="36" width="70" height="70" fill="none" stroke="url(#hud)" strokeWidth="1.2" opacity="0.7" />
        <rect x="28" y="394" width="70" height="70" fill="none" stroke="url(#hud)" strokeWidth="1.2" opacity="0.55" />
        <rect x="302" y="394" width="70" height="70" fill="none" stroke="url(#hud)" strokeWidth="1.2" opacity="0.55" />
        <polygon
          points="200,118 248,146 248,202 200,230 152,202 152,146"
          fill="none"
          stroke="#b9d7ff"
          strokeWidth="1.4"
          opacity="0.9"
        />
        <polygon
          points="200,132 236,154 236,196 200,218 164,196 164,154"
          fill="rgba(155,197,255,0.08)"
          stroke="#d7e9ff"
          strokeWidth="0.8"
        />
        <line x1="200" y1="90" x2="200" y2="118" stroke="#cfe4ff" strokeWidth="1" />
        <line x1="200" y1="230" x2="200" y2="270" stroke="#cfe4ff" strokeWidth="1" />
        <circle cx="200" cy="174" r="3" fill="#eaf4ff" />
        <text x="46" y="58" fill="#cfe4ff" fontSize="9" fontFamily="Outfit, sans-serif" letterSpacing="1.4">
          INOVA.SCAN
        </text>
        <text x="46" y="72" fill="#9bb0d0" fontSize="8" fontFamily="Outfit, sans-serif">
          {coords}
        </text>
        <text x="250" y="420" fill="#9bb0d0" fontSize="8" fontFamily="Outfit, sans-serif">
          FIT MAP  0.98
        </text>
      </svg>
      <motion.div
        className="absolute inset-x-10 h-px bg-gradient-to-r from-transparent via-sky-200 to-transparent opacity-70"
        animate={{ top: ['18%', '78%', '18%'] }}
        transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}
