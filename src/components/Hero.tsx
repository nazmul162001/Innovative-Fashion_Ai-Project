'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { unsplash, responsiveSrcSet } from '../lib/utils';

const SLIDE_MS = 7000;
const easeOut = [0.16, 1, 0.3, 1] as const;
const easeIn = [0.4, 0, 1, 1] as const;

const slides = [
  {
    id: 'compose',
    kicker: '01  —  Intelligent styling',
    title: 'Every look, composed for you.',
    copy: 'Inovative reads silhouette, climate, and intent — then builds a complete look with the discipline of a private atelier. Fewer choices. The right ones.',
    cta: 'Discover your look',
    href: '#collection',
    image: unsplash('photo-1487222477894-8943e31ef7b2', 1400),
    coords: '41.9028° N  12.4964° E',
    fitMap: '0.98',
  },
  {
    id: 'fit',
    kicker: '02  —  Precision fit',
    title: 'Tailored by intelligence, not chance.',
    copy: 'Trained on thousands of body maps, our models predict drape, stretch, and proportion — so what arrives feels made for you, not merely sized to you.',
    cta: 'Explore the collection',
    href: '#collection',
    image: unsplash('photo-1506794778202-cad84cf45f1d', 1400),
    coords: '48.8566° N  2.3522° E',
    fitMap: '0.94',
  },
  {
    id: 'tryon',
    kicker: '03  —  Virtual try-on',
    title: 'See yourself in it first.',
    copy: 'Preview color, drape, and presence in the browser before anything ships. Walk in certain. Then make the look yours.',
    cta: 'Start a try-on',
    href: '/try-on',
    image: unsplash('photo-1534528741775-53994a69daeb', 1400),
    coords: '35.6762° N  139.6503° E',
    fitMap: '1.00',
  },
] as const;

type Slide = (typeof slides)[number];

export default function Hero() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [introReady, setIntroReady] = useState(false);
  const reduceMotion = useReducedMotion();
  const slide = slides[index] ?? slides[0];

  useEffect(() => {
    if (!document.documentElement.classList.contains('if-splash')) {
      setIntroReady(true);
      return;
    }
    const observer = new MutationObserver(() => {
      if (!document.documentElement.classList.contains('if-splash')) {
        setIntroReady(true);
        observer.disconnect();
      }
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    const fallback = window.setTimeout(() => {
      setIntroReady(true);
      observer.disconnect();
    }, 4000);
    return () => {
      observer.disconnect();
      window.clearTimeout(fallback);
    };
  }, []);

  useEffect(() => {
    if (reduceMotion || !introReady) return;
    const timer = window.setInterval(() => {
      setDirection(1);
      setIndex((current) => (current + 1) % slides.length);
    }, SLIDE_MS);
    return () => window.clearInterval(timer);
  }, [index, reduceMotion, introReady]);

  const goTo = (next: number) => {
    if (next === index) return;
    const last = slides.length - 1;
    if (index === last && next === 0) setDirection(1);
    else if (index === 0 && next === last) setDirection(-1);
    else setDirection(next > index ? 1 : -1);
    setIndex(next);
  };

  return (
    <section id="hero" className="hero-bg relative overflow-x-clip overflow-y-hidden">
      <div className="relative mx-auto grid w-full min-w-0 max-w-7xl items-center gap-8 px-4 py-8 md:grid-cols-2 md:gap-10 md:px-6 md:py-14">
        <div className="relative z-10 min-h-[18.5rem] min-w-0 max-w-xl sm:min-h-[20.5rem] lg:min-h-[24rem]">
          <AnimatePresence custom={direction}>
            {introReady ? (
              <SlideCopy key={slide.id} slide={slide} direction={direction} reduceMotion={!!reduceMotion} />
            ) : null}
          </AnimatePresence>
        </div>

        <div className="relative mx-auto w-full min-w-0 max-w-md lg:max-w-lg">
          <div className="dark-card-glow relative aspect-[4/5] overflow-hidden rounded-[28px]">
            <AnimatePresence initial={false}>
              <motion.img
                key={slide.image}
                src={slide.image}
                srcSet={responsiveSrcSet(slide.image, [480, 720, 960])}
                sizes="(max-width: 768px) 90vw, 480px"
                alt=""
                fetchPriority={index === 0 ? 'high' : 'auto'}
                loading={index === 0 ? 'eager' : 'lazy'}
                decoding="async"
                initial={reduceMotion ? { opacity: 1 } : { opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: reduceMotion ? 1 : 1.08 }}
                exit={{ opacity: 0, transition: { duration: 0.55, ease: easeIn } }}
                transition={
                  reduceMotion
                    ? { duration: 0 }
                    : { opacity: { duration: 0.7, ease: easeOut }, scale: { duration: SLIDE_MS / 1000, ease: 'linear' } }
                }
                className="studio-image-light absolute inset-0 h-full w-full object-cover"
              />
            </AnimatePresence>
            <AiHud coords={slide.coords} fitMap={slide.fitMap} />
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-2 pb-10 md:pb-14" role="tablist" aria-label="Hero slides">
        {slides.map((item, slideIndex) => {
          const active = slideIndex === index;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-label={item.title}
              aria-selected={active}
              onClick={() => goTo(slideIndex)}
              className={`relative h-1.5 overflow-hidden rounded-full transition-[width] duration-500 ${
                active ? 'w-10 bg-white/25' : 'w-4 bg-white/20 hover:bg-white/35'
              }`}
            >
              {active ? (
                <motion.span
                  key={`${item.id}-${introReady ? 'play' : 'idle'}-progress`}
                  className="absolute inset-0 origin-left bg-snow"
                  initial={{ scaleX: reduceMotion || !introReady ? 1 : 0 }}
                  animate={{ scaleX: 1 }}
                  transition={
                    reduceMotion || !introReady ? { duration: 0 } : { duration: SLIDE_MS / 1000, ease: 'linear' }
                  }
                />
              ) : null}
            </button>
          );
        })}
      </div>
    </section>
  );
}

function SlideCopy({
  slide,
  direction,
  reduceMotion,
}: {
  slide: Slide;
  direction: number;
  reduceMotion: boolean;
}) {
  const words = slide.title.split(' ');
  const offset = direction >= 0 ? 28 : -28;

  return (
    <motion.div
      custom={direction}
      initial={false}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      exit={
        reduceMotion
          ? { opacity: 0 }
          : { opacity: 0, y: direction >= 0 ? -22 : 22, filter: 'blur(8px)' }
      }
      transition={{ duration: reduceMotion ? 0.12 : 0.45, ease: easeIn }}
      className="absolute inset-x-0 top-0 flex flex-col"
      aria-live="polite"
    >
      <motion.p
        initial={reduceMotion ? false : { opacity: 0, y: offset * 0.45, letterSpacing: '0.28em' }}
        animate={{ opacity: 1, y: 0, letterSpacing: '0.22em' }}
        transition={{ duration: 0.55, delay: 0.04, ease: easeOut }}
        className="text-[10px] font-medium tracking-[0.22em] text-accent-cyan uppercase sm:text-[11px]"
      >
        {slide.kicker}
      </motion.p>

      <h1 className="mt-3 text-[1.75rem] font-bold tracking-tight break-words text-snow uppercase sm:text-4xl lg:mt-4 lg:text-[52px] lg:leading-[1.08]">
        {words.map((word, wordIndex) => (
          <span key={`${slide.id}-${wordIndex}`} className="mr-[0.28em] inline-block overflow-hidden align-bottom last:mr-0">
            <motion.span
              className="inline-block"
              initial={reduceMotion ? false : { y: `${110 * Math.sign(offset)}%`, opacity: 0 }}
              animate={{ y: '0%', opacity: 1 }}
              transition={{
                duration: 0.72,
                delay: 0.08 + wordIndex * 0.055,
                ease: easeOut,
              }}
            >
              {word}
            </motion.span>
          </span>
        ))}
      </h1>

      <motion.p
        initial={reduceMotion ? false : { opacity: 0, y: offset * 0.6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, delay: 0.28, ease: easeOut }}
        className="mt-4 max-w-md text-sm leading-relaxed text-mist sm:mt-5"
      >
        {slide.copy}
      </motion.p>

      <motion.a
        href={slide.href}
        initial={reduceMotion ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.42, ease: easeOut }}
        className="mt-6 inline-flex w-fit rounded-xl bg-accent-blue px-5 py-3 text-xs font-semibold tracking-[0.12em] text-white uppercase transition hover:bg-signal-deep sm:mt-8 sm:px-6 sm:text-sm"
      >
        {slide.cta}
      </motion.a>
    </motion.div>
  );
}

function AiHud({ coords, fitMap }: { coords: string; fitMap: string }) {
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
          {`FIT MAP  ${fitMap}`}
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
