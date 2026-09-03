'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Sparkles } from 'lucide-react';
import { useStore } from '@nanostores/react';
import type { Product, Size } from '../types/product';
import { cn } from '../lib/utils';
import { PriceDisplay } from './PriceDisplay';
import QuantityStepper from './QuantityStepper';
import { addToCart, adjustLineQuantity, cartItems, cartLineKey } from '../stores/shop';

interface ProductSelectionPanelProps {
  product: Product;
  onTryOn: () => void;
}

export default function ProductSelectionPanel({ product, onTryOn }: ProductSelectionPanelProps) {
  const [size, setSize] = useState<Size>(product.sizes[0] ?? 'S');
  const [color, setColor] = useState(product.colors[0]?.name ?? 'Charcoal');
  const [pendingQty, setPendingQty] = useState(1);
  const [openSection, setOpenSection] = useState<string | null>(null);
  const items = useStore(cartItems, { ssr: 'initial' });
  const quantity = items[cartLineKey(product.id, size, color)]?.quantity ?? 0;
  const inCart = quantity > 0;

  const sections = [
    { id: 'fabric', title: 'Fabric & Care', body: product.fabricCare },
    {
      id: 'reviews',
      title: 'Reviews',
      body: product.reviews.map((review) => `${review.author} · ${review.rating}/5 — ${review.text}`).join('\n\n'),
    },
    { id: 'shipping', title: 'Shipping', body: product.shipping },
  ];

  return (
    <div id="selection" className="dark-card-glow min-w-0 max-w-full overflow-hidden rounded-3xl p-5 sm:p-6 md:p-8">
      <h1 className="break-words text-2xl font-bold tracking-tight text-snow uppercase sm:text-3xl md:text-[34px] md:leading-tight">
        {product.name}
      </h1>
      <PriceDisplay product={product} size="lg" className="mt-3" />
      <p className="mt-4 max-w-md text-sm leading-relaxed text-[#9CA3AF]">{product.description}</p>

      <p className="mt-8 text-xs font-medium tracking-[0.18em] text-[#9CA3AF] uppercase">Size</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {product.sizes.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setSize(option)}
            className={cn(
              'h-11 w-11 rounded-lg border text-sm font-medium transition hover:border-white/25',
              size === option
                ? 'border-accent-blue bg-accent-blue text-white'
                : 'border-white/10 bg-dark-surface text-[#9CA3AF]',
            )}
          >
            {option}
          </button>
        ))}
      </div>

      <p className="mt-6 text-xs font-medium tracking-[0.18em] text-[#9CA3AF] uppercase">Color</p>
      <div className="mt-3 flex flex-wrap gap-2.5">
        {product.colors.map((swatch) => (
          <button
            key={swatch.name}
            type="button"
            aria-label={swatch.name}
            onClick={() => setColor(swatch.name)}
            className={cn(
              'h-8 w-8 rounded-md border-2 transition',
              color === swatch.name ? 'border-accent-cyan shadow-[0_0_10px_rgba(56,189,248,0.45)]' : 'border-transparent',
            )}
            style={{ backgroundColor: swatch.hex }}
          />
        ))}
      </div>

      <motion.button
        type="button"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={onTryOn}
        className="ai-button-glow relative mt-8 flex w-full items-center justify-center rounded-xl py-4 text-sm font-bold tracking-[0.2em] text-white uppercase"
      >
        <span>AI Try On</span>
        <span className="absolute right-5">
          <MannequinIcon />
        </span>
      </motion.button>
      <p className="mt-3 flex items-center justify-center gap-1.5 text-sm text-[#9CA3AF]">
        <Sparkles size={14} className="text-accent-cyan" /> Try it with Inovative
      </p>

      <div className="mt-5 space-y-3">
        <AnimatePresence mode="wait" initial={false}>
          {inCart ? (
            <motion.div
              key="in-cart"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-2"
            >
              <p className="text-center text-xs tracking-[0.14em] text-[#9CA3AF] uppercase">Quantity</p>
              <QuantityStepper
                quantity={quantity}
                onIncrease={() => adjustLineQuantity(product, { size, color }, 1)}
                onDecrease={() => adjustLineQuantity(product, { size, color }, -1)}
                className="w-full border-white/15 bg-ink-soft"
              />
            </motion.div>
          ) : (
            <motion.div
              key="add-flow"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-3"
            >
              <p className="text-center text-xs tracking-[0.14em] text-[#9CA3AF] uppercase">Quantity</p>
              <QuantityStepper
                quantity={pendingQty}
                onIncrease={() => setPendingQty((value) => value + 1)}
                onDecrease={() => setPendingQty((value) => Math.max(1, value - 1))}
                className="w-full border-white/15 bg-ink-soft"
              />
              <button
                type="button"
                onClick={() => {
                  addToCart(product, { size, color, quantity: pendingQty });
                  setPendingQty(1);
                }}
                className="w-full rounded-xl bg-accent-blue py-3 text-sm font-semibold tracking-wide text-white uppercase transition hover:bg-signal-deep"
              >
                Add to Cart
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-8 divide-y divide-white/8 border-t border-white/10">
        {sections.map((section) => {
          const open = openSection === section.id;
          return (
            <div key={section.id}>
              <button
                type="button"
                className="flex w-full items-center justify-between py-4 text-left text-sm font-medium tracking-[0.16em] text-[#D1D5DB] uppercase transition hover:text-snow"
                onClick={() => setOpenSection(open ? null : section.id)}
                aria-expanded={open}
              >
                {section.title}
                <motion.span animate={{ rotate: open ? 180 : 0 }} className="text-[#9CA3AF]">
                  <ChevronDown size={16} />
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {open ? (
                  <motion.p
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden pb-4 text-sm leading-relaxed whitespace-pre-line text-[#9CA3AF]"
                  >
                    {section.body}
                  </motion.p>
                ) : null}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MannequinIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden="true">
      <circle cx="12" cy="4.6" r="2.1" />
      <path d="M8.2 9.2c0-1.5 1.7-2.6 3.8-2.6s3.8 1.1 3.8 2.6v1.2c1.7.7 2.7 2.4 2.7 4.6V21h-2.2v-5.8c0-1.3-.7-2.2-1.8-2.5v8.3h-5v-8.3c-1.1.3-1.8 1.2-1.8 2.5V21H6.5v-6c0-2.2 1-3.9 2.7-4.6z" />
    </svg>
  );
}
