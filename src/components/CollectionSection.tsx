'use client';

import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { SlidersHorizontal, X } from 'lucide-react';
import { useStore } from '@nanostores/react';
import { collectionTitles, getProductsByCategory } from '../data/products';
import type { FilterState, Product } from '../types/product';
import { PRICE_BOUNDS } from '../types/product';
import { getProductPricing } from '../lib/utils';
import { addToCart, adjustLineQuantity, cartItems, cartLineKey } from '../stores/shop';
import { CATEGORY_EVENT, readCollectionCategory } from '../lib/collection-nav';
import ProductCard from './ProductCard';
import { DiscountBadge, PriceDisplay } from './PriceDisplay';
import QuantityStepper from './QuantityStepper';
import SidebarFilter from './SidebarFilter';

const defaultDraft: FilterState = {
  price: [PRICE_BOUNDS.min, PRICE_BOUNDS.max],
  colors: [],
  sizes: ['M'],
  fits: ['medium'],
};

const defaultApplied: FilterState = {
  price: [PRICE_BOUNDS.min, PRICE_BOUNDS.max],
  colors: [],
  sizes: [],
  fits: [],
};

type SortId = 'all' | 'price-asc' | 'price-desc' | 'new';

interface CollectionSectionProps {
  initialCategory: string;
}

export default function CollectionSection({ initialCategory }: CollectionSectionProps) {
  const [draft, setDraft] = useState<FilterState>(defaultDraft);
  const [applied, setApplied] = useState<FilterState>(defaultApplied);
  const [sort, setSort] = useState<SortId>('all');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [quickView, setQuickView] = useState<Product | null>(null);
  const [category, setCategory] = useState(initialCategory || 'all');
  const itemsMap = useStore(cartItems, { ssr: 'initial' });
  const quickSize = quickView?.sizes[0] ?? 'M';
  const quickColor = quickView?.colors[0]?.name ?? 'Charcoal';
  const quickQty =
    quickView ? itemsMap[cartLineKey(quickView.id, quickSize, quickColor)]?.quantity ?? 0 : 0;

  useEffect(() => {
    const syncCategory = () => setCategory(readCollectionCategory());

    const onCategory = (event: Event) => {
      const next = (event as CustomEvent<string>).detail;
      setCategory(next || 'all');
    };

    syncCategory();
    window.addEventListener(CATEGORY_EVENT, onCategory);
    window.addEventListener('popstate', syncCategory);
    window.addEventListener('if:navigation', syncCategory);
    return () => {
      window.removeEventListener(CATEGORY_EVENT, onCategory);
      window.removeEventListener('popstate', syncCategory);
      window.removeEventListener('if:navigation', syncCategory);
    };
  }, []);

  const title = collectionTitles[category] ?? collectionTitles.all;

  const items = useMemo(() => {
    let next = getProductsByCategory(category).filter((product) => {
      const sale = getProductPricing(product).sale;
      const inPrice = sale >= applied.price[0] && sale <= applied.price[1];
      const inColor =
        applied.colors.length === 0 || product.colors.some((color) => applied.colors.includes(color.name));
      const inSize = applied.sizes.length === 0 || product.sizes.some((size) => applied.sizes.includes(size));
      const inFit = applied.fits.length === 0 || applied.fits.includes(product.fit);
      return inPrice && inColor && inSize && inFit;
    });

    if (sort === 'price-asc') next = [...next].sort((a, b) => getProductPricing(a).sale - getProductPricing(b).sale);
    if (sort === 'price-desc') next = [...next].sort((a, b) => getProductPricing(b).sale - getProductPricing(a).sale);
    if (sort === 'new') next = [...next].sort((a, b) => Number(b.isNew) - Number(a.isNew));
    return next;
  }, [applied, category, sort]);

  const apply = () => {
    setApplied(draft);
    setFiltersOpen(false);
  };

  return (
    <section id="collection" className="mx-auto w-full min-w-0 max-w-7xl px-4 py-16 md:px-6 md:py-24">
      <div className="sticky top-0 z-30 -mx-4 mb-6 flex flex-col gap-3 bg-[#0f1218]/95 px-4 py-3 backdrop-blur-md lg:static lg:z-auto lg:mx-0 lg:flex-row lg:items-end lg:justify-between lg:gap-3 lg:bg-transparent lg:px-0 lg:py-0 lg:backdrop-blur-none">
        <h2 className="w-full text-left text-xl font-bold tracking-tight whitespace-nowrap text-snow uppercase sm:text-2xl md:text-3xl lg:w-auto">
          {title}
        </h2>
        <div className="flex w-full shrink-0 items-center justify-end gap-2 lg:w-auto">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs text-fog lg:hidden"
            onClick={() => setFiltersOpen(true)}
          >
            <SlidersHorizontal size={14} />
            Filters
          </button>
          <label className="sr-only" htmlFor="sort">
            Sort
          </label>
          <select
            id="sort"
            value={sort}
            onChange={(event) => setSort(event.target.value as SortId)}
            className="rounded-lg border border-dark-border bg-dark-surface px-3 py-2 text-xs text-fog outline-none"
          >
            <option value="all">All items</option>
            <option value="new">New arrivals</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)] xl:grid-cols-[300px_minmax(0,1fr)]">
        <div className="hidden lg:block">
          <div className="sticky top-0 z-20 self-start">
            <SidebarFilter draft={draft} onChange={setDraft} onApply={apply} />
          </div>
        </div>
        <div>
          {items.length === 0 ? (
            <p className="py-20 text-center text-sm text-mist">No pieces match those filters.</p>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
              {items.map((product) => (
                <ProductCard key={product.id} product={product} onQuickView={setQuickView} />
              ))}
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {filtersOpen ? (
          <motion.div className="fixed inset-0 z-50 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <button
              type="button"
              className="absolute inset-0 bg-black/55"
              aria-label="Close filters"
              onClick={() => setFiltersOpen(false)}
            />
            <motion.div
              initial={{ y: 40 }}
              animate={{ y: 0 }}
              exit={{ y: 40 }}
              className="absolute inset-x-0 bottom-0 max-h-[88vh] overflow-y-auto rounded-t-3xl bg-ink p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-semibold tracking-wide uppercase">Filters</p>
                <button type="button" onClick={() => setFiltersOpen(false)} aria-label="Close">
                  <X size={18} />
                </button>
              </div>
              <SidebarFilter draft={draft} onChange={setDraft} onApply={apply} />
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {quickView ? (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <button
              type="button"
              className="absolute inset-0 bg-black/60"
              aria-label="Close quick view"
              onClick={() => setQuickView(null)}
            />
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              className="relative grid w-full max-w-2xl overflow-hidden rounded-3xl border border-white/10 bg-ink-soft md:grid-cols-2"
            >
              <div className="relative">
                <img src={quickView.images[0]} alt={quickView.name} className="h-64 w-full object-cover md:h-full" />
                <DiscountBadge percent={getProductPricing(quickView).discountPercent} />
              </div>
              <div className="p-6">
                <button type="button" className="absolute top-4 right-4" onClick={() => setQuickView(null)} aria-label="Close">
                  <X size={18} />
                </button>
                <h3 className="text-xl font-semibold">{quickView.name}</h3>
                <PriceDisplay product={quickView} size="md" className="mt-1" />
                <p className="mt-3 text-sm leading-relaxed text-mist">{quickView.description}</p>
                <div className="mt-6 flex gap-3">
                  {quickQty > 0 ? (
                    <QuantityStepper
                      quantity={quickQty}
                      onIncrease={() =>
                        quickView && adjustLineQuantity(quickView, { size: quickSize, color: quickColor }, 1)
                      }
                      onDecrease={() =>
                        quickView && adjustLineQuantity(quickView, { size: quickSize, color: quickColor }, -1)
                      }
                      className="flex-1 border-white/10"
                    />
                  ) : (
                    <button
                      type="button"
                      className="flex-1 rounded-xl bg-signal py-2.5 text-sm font-semibold"
                      onClick={() => {
                        if (!quickView) return;
                        addToCart(quickView, {
                          size: quickSize,
                          color: quickColor,
                        });
                      }}
                    >
                      Add to Cart
                    </button>
                  )}
                  <a href={`/product/${quickView.id}`} className="rounded-xl border border-white/15 px-4 py-2.5 text-sm">
                    Details
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
