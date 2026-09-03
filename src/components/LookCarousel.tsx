import { useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import type { LookCollection, LookItem } from '../data/looks';

interface LookCarouselProps {
  collection: LookCollection;
  onSelect: (look: LookItem) => void;
}

export default function LookCarousel({ collection, onSelect }: LookCarouselProps) {
  const scroller = useRef<HTMLDivElement>(null);

  const scrollByCards = (direction: 1 | -1) => {
    const node = scroller.current;
    if (!node) return;
    node.scrollBy({ left: direction * 220, behavior: 'smooth' });
  };

  return (
    <section className="mt-12">
      <div className="mb-5 flex items-start justify-between gap-3 px-4 sm:items-end md:px-8">
        <div className="min-w-0 flex-1">
          <h3 className="text-[22px] font-semibold tracking-tight break-words text-white sm:text-2xl md:text-[28px]">
            {collection.title}
          </h3>
          <p className="mt-1 text-sm leading-snug wrap-break-word text-white/55">{collection.subtitle}</p>
        </div>
        <motion.button
          type="button"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => scrollByCards(1)}
          className="inline-flex shrink-0 items-center gap-1 rounded-full bg-white/10 px-3 py-1.5 text-sm text-white transition hover:bg-white/16 sm:gap-1.5 sm:px-4 sm:py-2"
        >
          More
          <ChevronRight size={16} />
        </motion.button>
      </div>

      <div className="relative">
        <div
          ref={scroller}
          className="no-scrollbar flex gap-4 overflow-x-auto px-4 pb-2 md:px-8"
          data-horizontal-scroll
          data-no-swipe-back
        >
          {collection.items.map((item) => (
            <motion.button
              key={item.id}
              type="button"
              onClick={() => onSelect(item)}
              whileHover={{ scale: 1.04, y: -4 }}
              whileTap={{ scale: 0.98 }}
              className="w-[148px] shrink-0 text-left sm:w-[168px]"
            >
              <div className="overflow-hidden rounded-2xl bg-[#ececec]">
                <img src={item.image} alt={item.name} className="aspect-square w-full object-cover" />
              </div>
              <p className="mt-3 text-center text-sm text-white">{item.name}</p>
            </motion.button>
          ))}
        </div>
        <motion.button
          type="button"
          aria-label={`Scroll ${collection.title}`}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => scrollByCards(1)}
          className="absolute top-[72px] right-3 hidden h-11 w-11 items-center justify-center rounded-full bg-[#2f3134] text-white shadow-lg md:flex"
        >
          <ChevronRight size={20} />
        </motion.button>
      </div>
    </section>
  );
}
