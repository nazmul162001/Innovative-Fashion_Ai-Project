import { useEffect, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bookmark, ChevronDown, ChevronLeft, ChevronRight, RefreshCw, Share2, X } from 'lucide-react';
import type { LookItem } from '../data/looks';
import { showToast } from '../stores/shop';

export const TRYON_SIDEBAR_RESERVE_PX = 448;
export const tryOnSidebarTransition = { type: 'spring' as const, stiffness: 280, damping: 34 };

const LOAD_COPY = ['Creating the look...', 'Almost there...', 'Adding the final touches...'] as const;

interface TryOnSidebarProps {
  look: LookItem | null;
  open: boolean;
  onClose: () => void;
  onSelectLook: (look: LookItem) => void;
}

export default function TryOnSidebar({ look, open, onClose, onSelectLook }: TryOnSidebarProps) {
  const [phase, setPhase] = useState<'loading' | 'result'>('loading');
  const [copyIndex, setCopyIndex] = useState(0);
  const [history, setHistory] = useState<LookItem[]>([]);
  const [index, setIndex] = useState(0);
  const [recentOpen, setRecentOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const historyRef = useRef(history);
  const recentScroller = useRef<HTMLDivElement>(null);
  historyRef.current = history;

  const current = history[index] ?? look;

  useEffect(() => {
    if (!open) {
      setRecentOpen(false);
      setHovered(false);
    }
  }, [open]);

  useEffect(() => {
    if (!open || !look) return;

    const existing = historyRef.current.findIndex((item) => item.id === look.id);
    if (existing >= 0) {
      setIndex(existing);
      setPhase('result');
      return;
    }

    setPhase('loading');
    setCopyIndex(0);
    setRecentOpen(false);

    const timers = [
      window.setTimeout(() => setCopyIndex(1), 1300),
      window.setTimeout(() => setCopyIndex(2), 2600),
      window.setTimeout(() => {
        setHistory((prev) => {
          if (prev.some((item) => item.id === look.id)) return prev;
          setIndex(prev.length);
          return [...prev, look];
        });
        setPhase('result');
      }, 4000),
    ];

    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [look?.id, open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const go = (direction: -1 | 1) => {
    if (history.length < 2) return;
    setIndex((currentIndex) => (currentIndex + direction + history.length) % history.length);
  };

  const removeTried = (id: string) => {
    setHistory((prev) => {
      const next = prev.filter((item) => item.id !== id);
      setIndex((currentIndex) => Math.max(0, Math.min(currentIndex, next.length - 1)));
      if (next.length === 0) onClose();
      return next;
    });
  };

  const regenerate = () => {
    setPhase('loading');
    setCopyIndex(0);
    window.setTimeout(() => setCopyIndex(1), 1100);
    window.setTimeout(() => setCopyIndex(2), 2200);
    window.setTimeout(() => setPhase('result'), 3400);
  };

  const share = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: current?.name ?? 'Inovative Try-On', url }).catch(() => undefined);
      return;
    }
    await navigator.clipboard.writeText(url);
    showToast('Link copied');
  };

  return (
    <AnimatePresence>
      {open && look ? (
        <motion.aside
          role="dialog"
          aria-modal="true"
          aria-label="Try-on preview"
          initial={{ x: '110%', opacity: 0.85 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '110%', opacity: 0.85 }}
          transition={tryOnSidebarTransition}
          className="fixed top-3 right-3 bottom-3 z-[75] flex w-[min(26.5rem,calc(100vw-1.5rem))] flex-col overflow-hidden rounded-[28px] bg-[#1c1e21] shadow-[0_24px_80px_rgba(0,0,0,0.55)] md:top-[4.75rem] md:right-3 md:bottom-3"
        >
          <div
            className="relative min-h-0 flex-1"
            onPointerEnter={() => setHovered(true)}
            onPointerLeave={() => setHovered(false)}
          >
            <AnimatePresence mode="wait">
              {phase === 'loading' ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="tryon-loading-aurora absolute inset-0 flex flex-col"
                >
                  <motion.span
                    className="pointer-events-none absolute -top-10 left-[-20%] h-56 w-56 rounded-full bg-cyan-400/25 blur-3xl"
                    animate={{ x: [0, 40, -10, 0], y: [0, 30, 10, 0], opacity: [0.45, 0.7, 0.5, 0.45] }}
                    transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
                  />
                  <motion.span
                    className="pointer-events-none absolute top-[30%] right-[-25%] h-64 w-64 rounded-full bg-indigo-500/30 blur-3xl"
                    animate={{ x: [0, -30, 20, 0], y: [0, -20, 25, 0], opacity: [0.4, 0.65, 0.45, 0.4] }}
                    transition={{ duration: 8.5, repeat: Infinity, ease: 'easeInOut' }}
                  />
                  <motion.span
                    className="pointer-events-none absolute bottom-[-10%] left-[10%] h-52 w-52 rounded-full bg-sky-500/20 blur-3xl"
                    animate={{ x: [0, 25, -15, 0], y: [0, -25, 15, 0], opacity: [0.35, 0.6, 0.4, 0.35] }}
                    transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut' }}
                  />
                  <SidebarClose onClose={onClose} />
                  <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6">
                    <SparkleFace />
                    <p className="mt-5 text-base text-white">{LOAD_COPY[copyIndex]}</p>
                  </div>
                  <p className="relative z-10 px-6 pb-16 text-center text-[11px] leading-relaxed text-white/55">
                    AI images may include mistakes.
                    <br />
                    Fit and appearance won&apos;t be exact.
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key={current?.id ?? 'result'}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35 }}
                  className="absolute inset-0 bg-[#ececec]"
                >
                  <img
                    src={current?.image}
                    alt={current?.name ?? 'Tried look'}
                    className="h-full w-full object-cover object-top"
                  />
                  <SidebarClose onClose={onClose} />

                  {history.length > 1 ? (
                    <>
                      <NavArrow side="left" visible={hovered} label="Previous look" onClick={() => go(-1)} />
                      <NavArrow side="right" visible={hovered} label="Next look" onClick={() => go(1)} />
                    </>
                  ) : null}

                  <div className="absolute bottom-14 left-4">
                    {current?.productId ? (
                      <a
                        href={`/product/${current.productId}`}
                        className="inline-flex rounded-full bg-black/80 px-5 py-2 text-sm font-medium text-white"
                      >
                        Shop
                      </a>
                    ) : (
                      <button
                        type="button"
                        onClick={() => showToast('This look is not in the shop yet')}
                        className="rounded-full bg-black/80 px-5 py-2 text-sm font-medium text-white"
                      >
                        Shop
                      </button>
                    )}
                  </div>

                  <div className="absolute right-3 bottom-14 flex flex-col gap-2">
                    <IconRound label="Share" onClick={() => void share()}>
                      <Share2 size={16} />
                    </IconRound>
                    <IconRound label="Save" onClick={() => showToast(current ? `${current.name} saved` : 'Saved')}>
                      <Bookmark size={16} />
                    </IconRound>
                    <IconRound label="Regenerate" onClick={regenerate}>
                      <RefreshCw size={16} />
                    </IconRound>
                    <IconRound label="About AI looks" onClick={() => showToast('AI previews are experimental')}>
                      <span className="text-[10px] font-semibold tracking-wide">ai</span>
                    </IconRound>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              className="absolute inset-x-0 bottom-0 z-20 overflow-hidden rounded-t-[22px] bg-[#2a2c2f]"
              initial={false}
              animate={{ height: recentOpen ? 248 : 42 }}
              transition={{ type: 'spring', stiffness: 340, damping: 34 }}
            >
              <button
                type="button"
                aria-expanded={recentOpen}
                aria-label={recentOpen ? 'Hide recently tried' : 'Show recently tried'}
                onClick={() => setRecentOpen((value) => !value)}
                className="flex h-[42px] w-full items-center justify-center"
              >
                <span className="h-1 w-10 rounded-full bg-white/35" />
              </button>

              <div className="px-4 pb-4">
                <p className="text-center text-sm text-white">
                  <span className="underline decoration-white/70 underline-offset-4">Recently tried</span>
                </p>
                <div className="relative mt-4">
                  <div ref={recentScroller} className="no-scrollbar flex gap-3 overflow-x-auto px-8 pb-1">
                    {history.length === 0 ? (
                      <p className="w-full py-6 text-center text-xs text-white/40">No looks yet</p>
                    ) : (
                      history.map((item, itemIndex) => {
                        const active = itemIndex === index;
                        return (
                          <div key={item.id} className="w-[72px] shrink-0">
                            <button
                              type="button"
                              onClick={() => {
                                setIndex(itemIndex);
                                onSelectLook(item);
                                setPhase('result');
                              }}
                              className={`overflow-hidden rounded-xl ${active ? 'ring-2 ring-white' : 'ring-1 ring-white/15'}`}
                            >
                              <img src={item.image} alt={item.name} className="aspect-square w-full object-cover" />
                            </button>
                            <button
                              type="button"
                              aria-label={`Remove ${item.name}`}
                              onClick={() => removeTried(item.id)}
                              className="mx-auto mt-2 grid h-6 w-6 place-items-center rounded-full bg-white/10 text-white/80"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        );
                      })
                    )}
                  </div>
                  {history.length > 3 ? (
                    <>
                      <button
                        type="button"
                        aria-label="Scroll recently tried left"
                        onClick={() => recentScroller.current?.scrollBy({ left: -120, behavior: 'smooth' })}
                        className="absolute top-5 left-0 grid h-8 w-8 place-items-center rounded-full bg-black/55 text-white"
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <button
                        type="button"
                        aria-label="Scroll recently tried right"
                        onClick={() => recentScroller.current?.scrollBy({ left: 120, behavior: 'smooth' })}
                        className="absolute top-5 right-0 grid h-8 w-8 place-items-center rounded-full bg-black/55 text-white"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </>
                  ) : null}
                </div>
                <p className="mt-3 text-center text-[11px] text-white/40">
                  AI images may include mistakes.{' '}
                  <button type="button" className="underline" onClick={() => showToast('Thanks — feedback noted')}>
                    Give feedback
                  </button>
                </p>
              </div>
            </motion.div>
          </div>
        </motion.aside>
      ) : null}
    </AnimatePresence>
  );
}

function SidebarClose({ onClose }: { onClose: () => void }) {
  return (
    <button
      type="button"
      onClick={onClose}
      aria-label="Close try-on"
      className="absolute top-3 left-3 z-10 grid h-10 w-10 place-items-center rounded-full bg-black/55 text-white"
    >
      <ChevronDown size={18} />
    </button>
  );
}

function NavArrow({
  side,
  visible,
  label,
  onClick,
}: {
  side: 'left' | 'right';
  visible: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <motion.button
      type="button"
      aria-label={label}
      onClick={onClick}
      initial={false}
      animate={{ opacity: visible ? 1 : 0, x: visible ? 0 : side === 'left' ? -8 : 8 }}
      transition={{ duration: 0.22 }}
      className={`absolute top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-black/55 text-white ${
        side === 'left' ? 'left-3' : 'right-3'
      } ${visible ? 'pointer-events-auto' : 'pointer-events-none'}`}
    >
      {side === 'left' ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
    </motion.button>
  );
}

function IconRound({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="grid h-10 w-10 place-items-center rounded-full bg-black/55 text-white"
    >
      {children}
    </button>
  );
}

function SparkleFace() {
  return (
    <svg viewBox="0 0 72 72" className="h-16 w-16 text-white" fill="none" aria-hidden="true">
      <circle cx="36" cy="40" r="18" stroke="currentColor" strokeWidth="2" />
      <path d="M28 42c2.8 4.5 13.2 4.5 16 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="30" cy="36" r="1.8" fill="currentColor" />
      <circle cx="42" cy="36" r="1.8" fill="currentColor" />
      <path d="M50 16.5 51.4 20l3.6 1.4-3.6 1.4L50 26.2l-1.4-3.4-3.6-1.4 3.6-1.4L50 16.5Z" fill="currentColor" />
      <path d="M58 10.5 58.9 13l2.6 1-2.6 1L58 17.4l-.9-2.4-2.6-1 2.6-1L58 10.5Z" fill="currentColor" />
    </svg>
  );
}
