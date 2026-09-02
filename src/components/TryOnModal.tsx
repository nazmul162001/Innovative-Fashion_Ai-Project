import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Sparkles, X } from 'lucide-react';
import type { Product } from '../types/product';

interface TryOnModalProps {
  product: Product;
  open: boolean;
  onClose: () => void;
}

type Phase = 'scan' | 'ready';

export default function TryOnModal({ product, open, onClose }: TryOnModalProps) {
  const [phase, setPhase] = useState<Phase>('scan');

  useEffect(() => {
    if (!open) {
      setPhase('scan');
      return;
    }
    const timer = window.setTimeout(() => setPhase('ready'), 2400);
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[75] flex items-end justify-center p-0 sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button type="button" className="absolute inset-0 bg-black/70 backdrop-blur-sm" aria-label="Close try on" onClick={onClose} />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="tryon-title"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
            className="relative grid max-h-[92vh] w-full max-w-4xl overflow-hidden rounded-t-3xl border border-white/10 bg-ink sm:rounded-3xl md:grid-cols-2"
          >
            <div className="relative bg-card">
              <img src={product.images[0]} alt={product.name} className="h-64 w-full object-cover md:h-full" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
              <p className="absolute bottom-4 left-4 text-xs tracking-[0.2em] text-fog uppercase">Source garment</p>
            </div>
            <div className="relative flex min-h-[380px] flex-col p-6">
              <button type="button" onClick={onClose} className="absolute top-4 right-4 rounded-full p-2 hover:bg-white/5" aria-label="Close">
                <X size={18} />
              </button>
              <p className="flex items-center gap-2 text-xs tracking-[0.2em] text-signal uppercase">
                <Sparkles size={14} /> Inovative
              </p>
              <h2 id="tryon-title" className="mt-2 text-2xl font-semibold">
                {phase === 'scan' ? 'Mapping your look' : 'Look composed'}
              </h2>
              <p className="mt-2 text-sm text-mist">
                {phase === 'scan'
                  ? `Scanning drape, proportion, and palette for the ${product.name}.`
                  : `${product.name} is calibrated. Preview the silhouette, then add it to your cart.`}
              </p>

              <div className="relative mx-auto mt-6 grid h-56 w-40 place-items-center">
                <Mannequin scanning={phase === 'scan'} />
                {phase === 'ready' ? (
                  <motion.img
                    src={product.images[0]}
                    alt=""
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 0.92, y: 0 }}
                    className="absolute inset-x-4 top-16 h-28 rounded-xl object-cover shadow-glow"
                  />
                ) : null}
              </div>

              <div className="mt-auto flex gap-3 pt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 rounded-xl border border-white/15 py-3 text-sm font-medium"
                >
                  Close
                </button>
                <a
                  href="#selection"
                  onClick={onClose}
                  className="flex-1 rounded-xl bg-signal py-3 text-center text-sm font-semibold"
                >
                  Keep this look
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function Mannequin({ scanning }: { scanning: boolean }) {
  return (
    <div className="relative">
      <svg viewBox="0 0 120 220" className="h-56 w-auto text-fog">
        <ellipse cx="60" cy="28" rx="16" ry="18" fill="none" stroke="currentColor" strokeWidth="1.4" />
        <path
          d="M44 52c0-6 7-10 16-10s16 4 16 10v8c18 8 24 28 24 52v78H20v-78c0-24 6-44 24-52z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
        />
      </svg>
      {scanning ? (
        <motion.div
          className="absolute inset-x-2 h-0.5 bg-sky-200 shadow-glow"
          animate={{ top: [16, 180, 16] }}
          transition={{ duration: 2.1, repeat: Infinity, ease: 'easeInOut' }}
        />
      ) : null}
    </div>
  );
}
