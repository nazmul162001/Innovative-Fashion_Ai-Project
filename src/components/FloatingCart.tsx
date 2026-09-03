'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { useStore } from '@nanostores/react';
import { cartBump, cartCount, openDrawer } from '../stores/shop';
import { toBanglaDigits } from '../lib/utils';

export default function FloatingCart() {
  const count = useStore(cartCount, { ssr: 'initial' });
  const bump = useStore(cartBump, { ssr: 'initial' });
  const drawer = useStore(openDrawer, { ssr: 'initial' });
  const [pulse, setPulse] = useState(0);
  const prevBump = useRef(bump);

  useEffect(() => {
    if (bump === prevBump.current) return;
    prevBump.current = bump;
    setPulse((value) => value + 1);
  }, [bump]);

  if (drawer === 'cart') return null;

  return (
    <AnimatePresence>
      {count > 0 ? (
        <motion.button
          key="floating-cart"
          type="button"
          aria-label={`Open cart, ${count} items`}
          onClick={() => openDrawer.set('cart')}
          initial={{ opacity: 0, scale: 0.7, y: 24 }}
          animate={{
            opacity: 1,
            scale: pulse > 0 ? [1, 1.14, 1] : 1,
            y: 0,
          }}
          exit={{ opacity: 0, scale: 0.75, y: 20 }}
          transition={
            pulse > 0
              ? { duration: 0.45, ease: [0.22, 1, 0.36, 1] }
              : { type: 'spring', stiffness: 420, damping: 24 }
          }
          className="fixed right-4 bottom-[max(1.25rem,env(safe-area-inset-bottom))] z-[72] grid h-14 w-14 place-items-center rounded-full bg-accent-blue text-white shadow-[0_12px_40px_rgba(79,128,255,0.45)] md:right-6"
        >
          <ShoppingBag size={22} />
          <motion.span
            key={count}
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute -top-1 -right-1 grid min-w-5 place-items-center rounded-full bg-snow px-1.5 py-0.5 text-[10px] font-bold text-ink"
          >
            {toBanglaDigits(count > 99 ? 99 : count)}
          </motion.span>
        </motion.button>
      ) : null}
    </AnimatePresence>
  );
}
