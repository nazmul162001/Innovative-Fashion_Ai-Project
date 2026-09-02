import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '../lib/utils';

interface ProductGalleryProps {
  name: string;
  images: string[];
}

export default function ProductGallery({ name, images }: ProductGalleryProps) {
  const [active, setActive] = useState(0);
  const current = images[active] ?? images[0] ?? '';

  return (
    <div>
      <div className="dark-card-glow relative overflow-hidden rounded-2xl">
        <AnimatePresence mode="wait" initial={false}>
          <motion.img
            key={current}
            src={current}
            alt={`${name} view ${active + 1}`}
            initial={false}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}
            className="studio-image-light aspect-square w-full object-cover"
          />
        </AnimatePresence>
      </div>
      <div className="mt-3 grid grid-cols-4 gap-3">
        {images.slice(0, 4).map((image, index) => (
          <button
            key={image + index}
            type="button"
            onClick={() => setActive(index)}
            className={cn(
              'overflow-hidden rounded-xl border-2 bg-dark-card transition',
              index === active
                ? 'border-accent-cyan shadow-[0_0_12px_rgba(56,189,248,0.35)]'
                : 'border-transparent hover:border-white/20',
            )}
          >
            <img src={image} alt={`${name} thumbnail ${index + 1}`} className="aspect-square w-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
