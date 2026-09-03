import type { Product } from '../types/product';
import { getProductPricing, responsiveSrcSet } from '../lib/utils';
import { DiscountBadge, PriceDisplay } from './PriceDisplay';

interface CompleteTheLookProps {
  items: Product[];
}

export default function CompleteTheLook({ items }: CompleteTheLookProps) {
  if (items.length === 0) return null;

  return (
    <section className="mt-12 min-w-0 max-w-full overflow-x-clip sm:mt-16">
      <h2 className="text-xl font-bold tracking-tight text-snow uppercase md:text-2xl">Complete the look</h2>
      <div className="mt-6 grid min-w-0 grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        {items.map((item) => {
          const { discountPercent } = getProductPricing(item);
          return (
            <a key={item.id} href={`/product/${item.id}`} className="product-card group min-w-0">
              <div className="dark-card-glow relative overflow-hidden rounded-2xl">
                <img
                  src={item.images[0]}
                  srcSet={responsiveSrcSet(item.images[0], [280, 420, 560])}
                  sizes="(max-width: 768px) 45vw, 220px"
                  alt={item.name}
                  className="studio-image-light aspect-[3/4] w-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
                <DiscountBadge percent={discountPercent} />
              </div>
              <p className="mt-3 truncate text-sm text-snow">{item.name}</p>
              <PriceDisplay product={item} className="mt-0.5" />
            </a>
          );
        })}
      </div>
    </section>
  );
}
