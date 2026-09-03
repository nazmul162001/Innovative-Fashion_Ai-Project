'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Minus, Plus } from 'lucide-react';
import { cn, toBanglaDigits } from '../lib/utils';

interface QuantityStepperProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  className?: string;
  size?: 'sm' | 'md';
}

export default function QuantityStepper({
  quantity,
  onIncrease,
  onDecrease,
  className,
  size = 'md',
}: QuantityStepperProps) {
  const compact = size === 'sm';
  return (
    <div
      className={cn(
        'pointer-events-auto relative z-[2] inline-flex items-center justify-between rounded-xl border border-white/15 bg-ink-soft/95 text-snow shadow-soft',
        compact ? 'h-9 min-w-[7.5rem] px-1' : 'h-11 min-w-[9.5rem] px-1.5',
        className,
      )}
    >
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          onDecrease();
        }}
        className={cn(
          'grid place-items-center rounded-lg text-fog transition hover:bg-white/10 hover:text-snow',
          compact ? 'h-7 w-7' : 'h-8 w-8',
        )}
      >
        <Minus size={compact ? 14 : 16} />
      </button>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={quantity}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.18 }}
          className={cn('min-w-[1.5rem] text-center font-semibold tabular-nums', compact ? 'text-xs' : 'text-sm')}
        >
          {toBanglaDigits(quantity)}
        </motion.span>
      </AnimatePresence>
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          onIncrease();
        }}
        className={cn(
          'grid place-items-center rounded-lg text-fog transition hover:bg-white/10 hover:text-snow',
          compact ? 'h-7 w-7' : 'h-8 w-8',
        )}
      >
        <Plus size={compact ? 14 : 16} />
      </button>
    </div>
  );
}
