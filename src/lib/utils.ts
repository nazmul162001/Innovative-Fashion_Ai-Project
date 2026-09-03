import type { Product } from '../types/product';

const BANGLA_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'] as const;

/** Stable “random” discount % per product (10–45, steps of 5). */
export function getDiscountPercent(product: Pick<Product, 'id'> | string): number {
  const id = typeof product === 'string' ? product : product.id;
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  const tiers = [10, 12, 15, 18, 20, 22, 25, 28, 30, 35, 40, 45] as const;
  return tiers[hash % tiers.length] ?? 15;
}

export function getSalePrice(original: number, discountPercent: number): number {
  return Math.round(original * (1 - discountPercent / 100));
}

export function toBanglaDigits(value: number | string): string {
  return String(value).replace(/\d/g, (digit) => BANGLA_DIGITS[Number(digit)] ?? digit);
}

/** Format a BDT amount with ৳, grouping, and Bangla numerals. */
export function formatPrice(value: number): string {
  const rounded = Math.round(value);
  const grouped = rounded.toLocaleString('en-US');
  return `৳${toBanglaDigits(grouped)}`;
}

export function formatDiscountPercent(percent: number): string {
  return `${toBanglaDigits(percent)}%`;
}

export function getProductPricing(product: Pick<Product, 'id' | 'price'>) {
  const discountPercent = getDiscountPercent(product);
  const original = product.price;
  const sale = getSalePrice(original, discountPercent);
  return { discountPercent, original, sale };
}

export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}

/** Optimized Unsplash URL — auto format (webp/avif when supported), sensible quality. */
export function unsplash(photoId: string, width = 900): string {
  return `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=${width}&q=72`;
}

/** Build a responsive srcset from an existing Unsplash URL (or any w= query URL). */
export function responsiveSrcSet(src: string, widths: number[] = [360, 720, 1080]): string | undefined {
  if (!src.includes('images.unsplash.com')) return undefined;
  return widths
    .map((width) => {
      const next = src.includes('w=')
        ? src.replace(/([?&])w=\d+/i, `$1w=${width}`)
        : `${src}${src.includes('?') ? '&' : '?'}w=${width}`;
      const withQ = next.includes('q=') ? next.replace(/([?&])q=\d+/i, '$1q=72') : `${next}&q=72`;
      return `${withQ} ${width}w`;
    })
    .join(', ');
}
