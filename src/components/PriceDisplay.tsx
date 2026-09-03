'use client';

import { cn, formatDiscountPercent, formatPrice, getProductPricing } from '../lib/utils';
import type { Product } from '../types/product';

interface PriceDisplayProps {
  product: Pick<Product, 'id' | 'price'>;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function PriceDisplay({ product, className, size = 'sm' }: PriceDisplayProps) {
  const { original, sale } = getProductPricing(product);
  const saleClass =
    size === 'lg'
      ? 'text-2xl font-semibold text-snow'
      : size === 'md'
        ? 'text-base font-semibold text-snow'
        : 'text-sm font-semibold text-snow';
  const originalClass =
    size === 'lg' ? 'text-base text-mist/70' : size === 'md' ? 'text-sm text-mist/70' : 'text-xs text-mist/70';

  return (
    <p className={cn('flex flex-wrap items-baseline gap-x-2 gap-y-0.5', className)}>
      <span className={saleClass}>{formatPrice(sale)}</span>
      <span className={cn('line-through decoration-mist/60', originalClass)}>{formatPrice(original)}</span>
    </p>
  );
}

interface DiscountBadgeProps {
  percent: number;
  className?: string;
}

export function DiscountBadge({ percent, className }: DiscountBadgeProps) {
  return (
    <span
      className={cn(
        'pointer-events-none absolute top-3 left-3 z-[3] rounded-full bg-gradient-to-r from-[#e11d48] to-[#f43f5e] px-2.5 py-1 text-[10px] font-bold tracking-wide text-white shadow-[0_6px_16px_rgba(225,29,72,0.35)] sm:text-[11px]',
        className,
      )}
    >
      −{formatDiscountPercent(percent)}
    </span>
  );
}
