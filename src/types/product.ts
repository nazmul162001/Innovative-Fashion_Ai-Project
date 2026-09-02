export const SIZES = ['S', 'M', 'L', 'XL', 'XXL'] as const;
export type Size = (typeof SIZES)[number];

export const FITS = ['slim', 'medium', 'relaxed'] as const;
export type Fit = (typeof FITS)[number];

export const CATEGORIES = ['men', 'women', 'accessories'] as const;
export type Category = (typeof CATEGORIES)[number];

export interface ColorSwatch {
  name: string;
  hex: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  text: string;
  date: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: Category;
  fit: Fit;
  sizes: Size[];
  colors: ColorSwatch[];
  images: string[];
  fabricCare: string;
  shipping: string;
  reviews: Review[];
  relatedIds: string[];
  isNew: boolean;
  featured: boolean;
}

export interface FilterState {
  price: [number, number];
  colors: string[];
  sizes: Size[];
  fits: Fit[];
}

export const PRICE_BOUNDS = { min: 30, max: 150 } as const;

export const COLOR_SWATCHES: ColorSwatch[] = [
  { name: 'Charcoal', hex: '#2C3038' },
  { name: 'Ash', hex: '#C8CCD4' },
  { name: 'Signal', hex: '#3D6BDB' },
  { name: 'Sand', hex: '#C4A882' },
  { name: 'Crimson', hex: '#B94A4A' },
];

export const NAV_LINKS = [
  { label: 'Men', href: '/?category=men#collection' },
  { label: 'Women', href: '/?category=women#collection' },
  { label: 'Accessories', href: '/?category=accessories#collection' },
  { label: 'New Arrivals', href: '/?category=new#collection' },
  { label: 'Try-On', href: '/try-on' },
] as const;
