import { atom, computed, map } from 'nanostores';
import type { Product } from '../types/product';
import { getProductPricing } from '../lib/utils';

export interface CartItem {
  key: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  size: string;
  color: string;
  quantity: number;
}

export const cartItems = map<Record<string, CartItem>>({});

export const cartCount = computed(cartItems, (items) =>
  Object.values(items).reduce((sum, item) => sum + item.quantity, 0),
);

export const cartTotal = computed(cartItems, (items) =>
  Object.values(items).reduce((sum, item) => sum + item.price * item.quantity, 0),
);

export function addToCart(
  product: Product,
  options: { size: string; color: string; quantity?: number },
): void {
  const quantity = options.quantity ?? 1;
  const key = `${product.id}-${options.size}-${options.color}`;
  const existing = cartItems.get()[key];
  const { sale } = getProductPricing(product);

  cartItems.setKey(key, {
    key,
    productId: product.id,
    name: product.name,
    price: sale,
    image: product.images[0] ?? '',
    size: options.size,
    color: options.color,
    quantity: existing ? existing.quantity + quantity : quantity,
  });

  showToast(`${product.name} added to cart`);
}

export function updateCartQuantity(key: string, quantity: number): void {
  const existing = cartItems.get()[key];
  if (!existing) return;
  if (quantity <= 0) {
    const next = { ...cartItems.get() };
    delete next[key];
    cartItems.set(next);
    return;
  }
  cartItems.setKey(key, { ...existing, quantity });
}

export function removeFromCart(key: string): void {
  const next = { ...cartItems.get() };
  delete next[key];
  cartItems.set(next);
}

export const wishlistIds = atom<string[]>([]);

export function toggleWishlist(productId: string, productName?: string): void {
  const current = wishlistIds.get();
  if (current.includes(productId)) {
    wishlistIds.set(current.filter((id) => id !== productId));
    showToast('Removed from wishlist');
    return;
  }
  wishlistIds.set([...current, productId]);
  showToast(productName ? `${productName} saved` : 'Saved to wishlist');
}

export const compareIds = atom<string[]>([]);

export function toggleCompare(productId: string): void {
  const current = compareIds.get();
  if (current.includes(productId)) {
    compareIds.set(current.filter((id) => id !== productId));
    showToast('Removed from compare');
    return;
  }
  if (current.length >= 3) {
    showToast('Compare is limited to 3 items');
    return;
  }
  compareIds.set([...current, productId]);
  showToast('Added to compare');
}

export type DrawerId = 'cart' | 'wishlist' | 'nav' | null;

export const openDrawer = atom<DrawerId>(null);

export function setDrawer(id: DrawerId): void {
  openDrawer.set(id);
}

export const toastMessage = atom<string | null>(null);

let toastTimer: ReturnType<typeof setTimeout> | undefined;

export function showToast(message: string, durationMs = 2200): void {
  toastMessage.set(message);
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastMessage.set(null), durationMs);
}
