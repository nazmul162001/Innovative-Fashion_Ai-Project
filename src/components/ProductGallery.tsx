import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn, getProductPricing, responsiveSrcSet } from '../lib/utils';
import { DiscountBadge } from './PriceDisplay';

interface ProductGalleryProps {
  name: string;
  images: string[];
  productId: string;
}

export default function ProductGallery({ name, images, productId }: ProductGalleryProps) {
  const [active, setActive] = useState(0);
  const current = images[active] ?? images[0] ?? '';
  const { discountPercent } = getProductPricing({ id: productId, price: 0 });

  return (
    <div className="min-w-0 max-w-full">
      <div className="dark-card-glow relative overflow-hidden rounded-2xl">
        <AnimatePresence mode="wait" initial={false}>
          <motion.img
            key={current}
            src={current}
            srcSet={responsiveSrcSet(current, [480, 800, 1200])}
            sizes="(max-width: 1024px) 100vw, 560px"
            alt={`${name} view ${active + 1}`}
            fetchPriority="high"
            decoding="async"
            initial={false}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}
            className="studio-image-light aspect-square w-full max-w-full object-cover"
          />
        </AnimatePresence>
        <DiscountBadge percent={discountPercent} />
      </div>
      <div className="mt-3 grid grid-cols-4 gap-2 sm:gap-3">
        {images.slice(0, 4).map((image, index) => (
          <button
            key={image + index}
            type="button"
            onClick={() => setActive(index)}
            className={cn(
              'min-w-0 overflow-hidden rounded-xl border-2 bg-dark-card transition',
              index === active
                ? 'border-accent-cyan shadow-[0_0_12px_rgba(56,189,248,0.35)]'
                : 'border-transparent hover:border-white/20',
            )}
          >
            <img
              src={image}
              srcSet={responsiveSrcSet(image, [120, 240])}
              sizes="80px"
              alt={`${name} thumbnail ${index + 1}`}
              className="aspect-square w-full object-cover"
              loading="lazy"
              decoding="async"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
