import { type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeftRight, Heart, Search } from 'lucide-react';
import { useStore } from '@nanostores/react';
import type { Product } from '../types/product';
import { cn, getProductPricing, responsiveSrcSet } from '../lib/utils';
import {
  addToCart,
  adjustLineQuantity,
  cartItems,
  cartLineKey,
  compareIds,
  toggleCompare,
  toggleWishlist,
  wishlistIds,
} from '../stores/shop';
import { DiscountBadge, PriceDisplay } from './PriceDisplay';
import QuantityStepper from './QuantityStepper';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
}

export default function ProductCard({ product, onQuickView }: ProductCardProps) {
  const saved = useStore(wishlistIds, { ssr: 'initial' });
  const compared = useStore(compareIds, { ssr: 'initial' });
  const items = useStore(cartItems, { ssr: 'initial' });
  const isSaved = saved.includes(product.id);
  const isCompared = compared.includes(product.id);
  const href = `/product/${product.id}`;
  const { discountPercent } = getProductPricing(product);
  const size = product.sizes[1] ?? product.sizes[0] ?? 'M';
  const color = product.colors[0]?.name ?? 'Charcoal';
  const quantity = items[cartLineKey(product.id, size, color)]?.quantity ?? 0;

  const add = () => addToCart(product, { size, color });

  return (
    <article className="product-card group relative">
      <a href={href} className="absolute inset-0 z-[1]" aria-label={`View ${product.name}`}>
        <span className="sr-only">{product.name}</span>
      </a>
      <div className="dark-card-glow relative overflow-hidden rounded-2xl">
        <img
          src={product.images[0]}
          srcSet={responsiveSrcSet(product.images[0], [360, 540, 720])}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 280px"
          alt={product.name}
          className="aspect-[4/5] w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          loading="lazy"
          decoding="async"
        />
        <DiscountBadge percent={discountPercent} />
        <div className="pointer-events-none absolute inset-0 hidden flex-col justify-between bg-ink/45 p-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100 md:flex">
          <div className="flex justify-end">
            <div className="pointer-events-auto relative z-[2] flex overflow-hidden rounded-xl border border-white/10 bg-ink-soft/90 shadow-soft">
              <IconAction label="Quick view" onClick={() => onQuickView(product)}>
                <Search size={15} />
              </IconAction>
              <IconAction
                label="Wishlist"
                active={isSaved}
                onClick={() => toggleWishlist(product.id, product.name)}
              >
                <Heart size={15} className={isSaved ? 'fill-current' : ''} />
              </IconAction>
              <IconAction label="Compare" active={isCompared} onClick={() => toggleCompare(product.id)}>
                <ArrowLeftRight size={15} />
              </IconAction>
            </div>
          </div>
          <div className="pointer-events-auto relative z-[2] flex justify-center">
            <CartControl
              quantity={quantity}
              onAdd={add}
              onIncrease={() => adjustLineQuantity(product, { size, color }, 1)}
              onDecrease={() => adjustLineQuantity(product, { size, color }, -1)}
            />
          </div>
        </div>
        <div className="absolute inset-x-3 bottom-3 z-[2] flex justify-center md:hidden">
          <CartControl
            quantity={quantity}
            onAdd={add}
            onIncrease={() => adjustLineQuantity(product, { size, color }, 1)}
            onDecrease={() => adjustLineQuantity(product, { size, color }, -1)}
            compact
          />
        </div>
      </div>
      <div className="relative z-[1] mt-3 px-0.5">
        <p className="text-sm font-medium text-snow group-hover:text-accent-cyan">{product.name}</p>
        <PriceDisplay product={product} className="mt-1" />
      </div>
    </article>
  );
}

function CartControl({
  quantity,
  onAdd,
  onIncrease,
  onDecrease,
  compact = false,
}: {
  quantity: number;
  onAdd: () => void;
  onIncrease: () => void;
  onDecrease: () => void;
  compact?: boolean;
}) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      {quantity > 0 ? (
        <motion.div
          key="stepper"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.92 }}
          className="w-full max-w-[11rem]"
        >
          <QuantityStepper
            quantity={quantity}
            onIncrease={onIncrease}
            onDecrease={onDecrease}
            size={compact ? 'sm' : 'md'}
            className="w-full bg-ink-soft/95"
          />
        </motion.div>
      ) : (
        <motion.button
          key="add"
          type="button"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.92 }}
          className={cn(
            'pointer-events-auto relative z-[2] w-full rounded-xl bg-accent-blue font-semibold tracking-wide text-white uppercase hover:bg-signal-deep',
            compact ? 'py-2 text-xs' : 'py-2.5 text-sm',
          )}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            onAdd();
          }}
        >
          Add to Cart
        </motion.button>
      )}
    </AnimatePresence>
  );
}

function IconAction({
  children,
  label,
  onClick,
  active = false,
}: {
  children: ReactNode;
  label: string;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onClick();
      }}
      className={cn('p-2.5 text-snow transition hover:bg-white/10', active && 'text-accent-cyan')}
    >
      {children}
    </button>
  );
}
