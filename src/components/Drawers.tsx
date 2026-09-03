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
  const open = drawer === 'cart' || drawer === 'wishlist';
  const [visible, setVisible] = useState(false);
  const activeDrawer = useRef<'cart' | 'wishlist'>('cart');

  if (open) activeDrawer.current = drawer;

  const scrimOpacity = useTransform(panelX, (value) => {
    const width = panelRef.current?.offsetWidth || 400;
    return Math.max(0.12, 1 - value / Math.max(width, 1));
  });

  const close = () => openDrawer.set(null);

  useEffect(() => {
    if (open) {
      setVisible(true);
      const width = typeof window !== 'undefined' ? Math.min(window.innerWidth, 448) : 448;
      if (reduceMotion) {
        panelX.set(0);
        return;
      }
      panelX.set(width);
      const frame = requestAnimationFrame(() => {
        void animate(panelX, 0, { type: 'spring', stiffness: 320, damping: 34 });
      });
      return () => cancelAnimationFrame(frame);
    }

    if (!visible) return;

    const width = panelRef.current?.offsetWidth || Math.min(window.innerWidth, 448);
    if (reduceMotion) {
      setVisible(false);
      panelX.set(0);
      return;
    }

    let cancelled = false;
    void animate(panelX, width, { duration: 0.2, ease: [0.22, 1, 0.36, 1] }).then(() => {
      if (cancelled) return;
      setVisible(false);
      panelX.set(0);
    });
    return () => {
      cancelled = true;
    };
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps -- intentional open-only trigger

  useSwipeToDismiss({
    enabled: visible && open && !reduceMotion,
    targetRef: overlayRef,
    requireTargetHit: true,
    x: panelX,
    onCommit: close,
    maxOffset: () => panelRef.current?.offsetWidth ?? Math.min(window.innerWidth, 448),
    ignoreSelector: '',
    distanceThreshold: 96,
  });

  if (!visible) return null;

  const kind = open ? drawer : activeDrawer.current;

  return (
    <div ref={overlayRef} className="fixed inset-0 z-[70] flex justify-end overflow-hidden">
      <motion.button
        type="button"
        className="absolute inset-0 bg-black/55 backdrop-blur-[2px]"
        aria-label="Close panel"
        style={{ opacity: scrimOpacity }}
        onClick={close}
      />
      <motion.aside
        ref={panelRef}
        style={{ x: panelX }}
        className="relative flex h-full w-full max-w-md flex-col border-l border-white/10 bg-ink-soft shadow-soft"
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
            onClick={close}
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
