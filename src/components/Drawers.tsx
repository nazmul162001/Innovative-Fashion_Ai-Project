'use client';

import { motion, animate, useMotionValue, useReducedMotion, useTransform } from 'framer-motion';
import { Minus, Plus, X } from 'lucide-react';
import { useStore } from '@nanostores/react';
import { useEffect, useRef, useState } from 'react';
import { products } from '../data/products';
import { formatPrice } from '../lib/utils';
import { PriceDisplay } from './PriceDisplay';
import { useSwipeToDismiss } from '../hooks/useSwipeToDismiss';
import {
  cartItems,
  cartTotal,
  openDrawer,
  removeFromCart,
  toggleWishlist,
  updateCartQuantity,
  wishlistIds,
} from '../stores/shop';

type Phase = 'closed' | 'open' | 'closing';

export default function Drawers() {
  const drawer = useStore(openDrawer, { ssr: 'initial' });
  const items = useStore(cartItems, { ssr: 'initial' });
  const total = useStore(cartTotal, { ssr: 'initial' });
  const savedIds = useStore(wishlistIds, { ssr: 'initial' });
  const reduceMotion = useReducedMotion();
  const cartList = Object.values(items);
  const saved = products.filter((product) => savedIds.includes(product.id));

  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const panelX = useMotionValue(0);
  const storeOpen = drawer === 'cart' || drawer === 'wishlist';
  const [phase, setPhase] = useState<Phase>('closed');
  const kindRef = useRef<'cart' | 'wishlist'>('cart');
  const swipeClosing = useRef(false);

  if (storeOpen) kindRef.current = drawer;

  const panelWidth = () => {
    if (panelRef.current?.offsetWidth) return panelRef.current.offsetWidth;
    if (typeof window === 'undefined') return 448;
    return Math.min(window.innerWidth, 448);
  };

  const scrimOpacity = useTransform(panelX, (value) => {
    const width = typeof window === 'undefined' ? 448 : panelWidth();
    return Math.max(0, 0.55 * (1 - value / Math.max(width, 1)));
  });

  const phaseRef = useRef<Phase>('closed');
  phaseRef.current = phase;

  const finishClose = () => {
    phaseRef.current = 'closed';
    setPhase('closed');
    panelX.set(0);
    swipeClosing.current = false;
    if (openDrawer.get() !== null) openDrawer.set(null);
  };

  const requestClose = (fromSwipe = false) => {
    if (phaseRef.current === 'closing' || phaseRef.current === 'closed') return;
    swipeClosing.current = fromSwipe;
    phaseRef.current = 'closing';
    setPhase('closing');
    if (openDrawer.get() !== null) openDrawer.set(null);

    if (fromSwipe || reduceMotion) {
      finishClose();
      return;
    }

    const width = panelWidth();
    void animate(panelX, width, { duration: 0.2, ease: [0.22, 1, 0.36, 1] }).then(finishClose);
  };

  useEffect(() => {
    if (storeOpen) {
      swipeClosing.current = false;
      phaseRef.current = 'open';
      setPhase('open');
      const width = typeof window !== 'undefined' ? Math.min(window.innerWidth, 448) : 448;
      if (reduceMotion) {
        panelX.set(0);
        return;
      }
      panelX.set(width);
      const id = requestAnimationFrame(() => {
        void animate(panelX, 0, { type: 'spring', stiffness: 340, damping: 36 });
      });
      return () => cancelAnimationFrame(id);
    }

    // Closed from outside while still open (e.g. programmatic) — animate out once.
    if (phaseRef.current === 'open' && !swipeClosing.current) {
      requestClose(false);
    }
  }, [storeOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  useSwipeToDismiss({
    enabled: phase === 'open' && !reduceMotion,
    targetRef: overlayRef,
    requireTargetHit: true,
    x: panelX,
    onCommit: () => requestClose(true),
    maxOffset: panelWidth,
    ignoreSelector: '',
    distanceThreshold: 88,
  });

  if (phase === 'closed') return null;

  const kind = storeOpen ? drawer : kindRef.current;

  return (
    <div ref={overlayRef} className="fixed inset-0 z-[70] flex justify-end overflow-hidden">
      <motion.button
        type="button"
        className="absolute inset-0 bg-black backdrop-blur-[2px]"
        aria-label="Close panel"
        style={{ opacity: scrimOpacity }}
        onClick={() => requestClose(false)}
      />
      <motion.aside
        ref={panelRef}
        style={{ x: panelX }}
        className="relative flex h-full w-full max-w-md flex-col border-l border-white/10 bg-ink-soft shadow-soft will-change-transform"
      >
        <div className="flex justify-center pt-3 md:hidden" aria-hidden>
          <span className="h-1 w-10 rounded-full bg-white/20" />
        </div>
        <header className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <h2 className="text-sm font-semibold tracking-[0.16em] uppercase">
            {kind === 'wishlist' ? 'Wishlist' : 'Your Cart'}
          </h2>
          <button
            type="button"
            onClick={() => requestClose(false)}
            className="rounded-full p-2 text-mist transition hover:bg-white/5 hover:text-snow"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-4">
          {kind === 'cart' ? (
            cartList.length === 0 ? (
              <p className="pt-10 text-center text-sm text-mist">Your cart is empty.</p>
            ) : (
              <ul className="space-y-4">
                {cartList.map((item) => (
                  <li key={item.key} className="flex min-w-0 gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-20 w-20 shrink-0 rounded-xl object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-mist">
                        {item.size} · {item.color}
                      </p>
                      <div className="mt-2 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 rounded-full border border-white/10 px-2 py-1">
                          <button
                            type="button"
                            aria-label="Decrease quantity"
                            onClick={() => updateCartQuantity(item.key, item.quantity - 1)}
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-4 text-center text-xs">{item.quantity}</span>
                          <button
                            type="button"
                            aria-label="Increase quantity"
                            onClick={() => updateCartQuantity(item.key, item.quantity + 1)}
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        <button
                          type="button"
                          className="text-xs text-mist hover:text-snow"
                          onClick={() => removeFromCart(item.key)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    <p className="shrink-0 text-sm">{formatPrice(item.price * item.quantity)}</p>
                  </li>
                ))}
              </ul>
            )
          ) : saved.length === 0 ? (
            <p className="pt-10 text-center text-sm text-mist">Nothing saved yet.</p>
          ) : (
            <ul className="space-y-4">
              {saved.map((product) => (
                <li key={product.id} className="flex min-w-0 gap-3">
                  <a href={`/product/${product.id}`} className="shrink-0">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="h-20 w-20 rounded-xl object-cover"
                    />
                  </a>
                  <div className="min-w-0 flex-1">
                    <a href={`/product/${product.id}`} className="text-sm font-medium">
                      {product.name}
                    </a>
                    <PriceDisplay product={product} className="mt-0.5" />
                    <button
                      type="button"
                      className="mt-2 text-xs text-mist hover:text-snow"
                      onClick={() => toggleWishlist(product.id)}
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {kind === 'cart' ? (
          <footer className="border-t border-white/10 p-5">
            <div className="mb-4 flex items-center justify-between text-sm">
              <span className="text-mist">Subtotal</span>
              <span className="font-semibold">{formatPrice(total)}</span>
            </div>
            <button
              type="button"
              className="w-full rounded-xl bg-signal py-3 text-sm font-semibold tracking-wide text-white transition hover:bg-signal-deep"
            >
              Checkout
            </button>
          </footer>
        ) : null}
      </motion.aside>
    </div>
  );
}
