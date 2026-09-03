'use client';

import { ArrowRight } from 'lucide-react';
import { lookCollections } from '../../data/looks';
import { products } from '../../data/products';
import { useSectionScroll } from '../../hooks/useSectionScroll';
import { DiscountBadge, PriceDisplay } from '../PriceDisplay';
import { getProductPricing } from '../../lib/utils';

const picks = [
  lookCollections.womenswear[0]?.items[0],
  lookCollections.womenswear[0]?.items[1],
  lookCollections.menswear[0]?.items[0],
  lookCollections.menswear[0]?.items[1],
].filter((item): item is NonNullable<typeof item> => Boolean(item));

export default function AtelierLooks() {
  const ref = useSectionScroll<HTMLElement>();

  return (
    <section
      id="atelier-edit"
      ref={ref}
      className="cv-section mx-auto w-full max-w-7xl px-4 py-16 md:px-6 md:py-24"
    >
      <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
        <div className="max-w-xl">
          <p data-reveal className="text-[10px] font-medium tracking-[0.22em] text-accent-cyan uppercase sm:text-[11px]">
            04  —  The atelier edit
          </p>
          <h2
            data-reveal
            className="mt-3 text-2xl font-bold tracking-tight text-snow uppercase sm:text-4xl lg:text-[44px] lg:leading-[1.08]"
          >
            Looks we’d send you first.
          </h2>
          <p data-reveal className="mt-4 text-sm leading-relaxed text-mist sm:text-base">
            A short, considered edit — not a catalogue. Try them on, or open the piece behind the look.
          </p>
        </div>
        <a
          data-reveal
          href="/try-on"
          className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.14em] text-fog uppercase transition hover:text-snow"
        >
          See all looks
          <ArrowRight size={14} />
        </a>
      </div>

      <div data-stagger className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {picks.map((look) => {
          const product = look.productId ? products.find((entry) => entry.id === look.productId) : undefined;
          const href = look.productId ? `/product/${look.productId}` : '/try-on';
          return (
            <a
              key={look.id}
              href={href}
              data-reveal
              className="group dark-card-glow overflow-hidden rounded-[24px]"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  src={look.image}
                  alt=""
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0e14]/80 via-transparent to-transparent opacity-90" />
                {product ? <DiscountBadge percent={getProductPricing(product).discountPercent} /> : null}
                <span className="absolute top-3 right-3 rounded-full border border-white/12 bg-dark-bg/60 px-3 py-1 text-[10px] tracking-[0.16em] text-fog uppercase backdrop-blur-md">
                  Try on
                </span>
              </div>
              <div className="flex items-start justify-between gap-3 p-5">
                <div>
                  <h3 className="font-semibold tracking-wide text-snow uppercase">{look.name}</h3>
                  {product ? (
                    <PriceDisplay product={product} className="mt-1" />
                  ) : (
                    <p className="mt-1 text-sm text-mist">View in studio</p>
                  )}
                </div>
                <span className="mt-0.5 text-mist transition group-hover:text-accent-cyan">
                  <ArrowRight size={16} />
                </span>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}
