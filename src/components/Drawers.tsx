import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Minus, Plus, X } from 'lucide-react';
import { useStore } from '@nanostores/react';
import { products } from '../data/products';
import { formatPrice } from '../lib/utils';
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

  return (
    <AnimatePresence>
      {drawer === 'cart' || drawer === 'wishlist' ? (
        <motion.div
          className="fixed inset-0 z-[70] flex justify-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/55 backdrop-blur-[2px]"
            aria-label="Close panel"
            onClick={() => openDrawer.set(null)}
          />
          <motion.aside
            initial={reduceMotion ? false : { x: 420 }}
            animate={{ x: 0 }}
            exit={{ x: 420 }}
            transition={{ type: 'spring', stiffness: 320, damping: 34 }}
            className="relative flex h-full w-full max-w-md flex-col border-l border-white/10 bg-ink-soft shadow-soft"
          >
            <header className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <h2 className="text-sm font-semibold tracking-[0.16em] uppercase">
                {drawer === 'cart' ? 'Your Cart' : 'Wishlist'}
              </h2>
              <button
                type="button"
                onClick={() => openDrawer.set(null)}
                className="rounded-full p-2 text-mist transition hover:bg-white/5 hover:text-snow"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              {drawer === 'cart' ? (
                cartList.length === 0 ? (
                  <p className="pt-10 text-center text-sm text-mist">Your cart is empty.</p>
                ) : (
                  <ul className="space-y-4">
                    {cartList.map((item) => (
                      <li key={item.key} className="flex gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-20 w-20 rounded-xl object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">{item.name}</p>
                          <p className="text-xs text-mist">
                            {item.size} · {item.color}
                          </p>
                          <div className="mt-2 flex items-center justify-between">
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
                        <p className="text-sm">{formatPrice(item.price * item.quantity)}</p>
                      </li>
                    ))}
                  </ul>
                )
              ) : saved.length === 0 ? (
                <p className="pt-10 text-center text-sm text-mist">Nothing saved yet.</p>
              ) : (
                <ul className="space-y-4">
                  {saved.map((product) => (
                    <li key={product.id} className="flex gap-3">
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
                        <p className="text-xs text-mist">{formatPrice(product.price)}</p>
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

            {drawer === 'cart' ? (
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
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
