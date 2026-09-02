import type { Product } from '../types/product';
import { unsplash } from '../lib/utils';

const charcoal = { name: 'Charcoal', hex: '#2C3038' };
const ash = { name: 'Ash', hex: '#C8CCD4' };
const signal = { name: 'Signal', hex: '#3D6BDB' };
const sand = { name: 'Sand', hex: '#C4A882' };
const crimson = { name: 'Crimson', hex: '#B94A4A' };

const allSizes = ['S', 'M', 'L', 'XL', 'XXL'] as const;

export const products: Product[] = [
  {
    id: 'aetheric-knit-tee',
    name: 'Aetheric Knit Tee',
    price: 2490,
    description:
      'A merino-blend crewneck with a quiet drape and thermal memory. Engineered for all-day wear under jackets or solo.',
    category: 'men',
    fit: 'medium',
    sizes: [...allSizes],
    colors: [charcoal, ash, signal],
    images: [
      unsplash('photo-1521572163474-6864f9cf17ab'),
      unsplash('photo-1583743814966-8936f5b7be1a'),
      unsplash('photo-1618354691373-d851c5c3a990'),
      unsplash('photo-1576566588028-4147f3842f27'),
    ],
    fabricCare: '70% merino wool, 30% recycled nylon. Cold wash, lay flat to dry. Do not bleach.',
    shipping: 'Complimentary 2–4 day shipping. Easy 30-day returns from your door.',
    reviews: [
      {
        id: 'r1',
        author: 'Jonas K.',
        rating: 5,
        text: 'Softer than it looks. The charcoal hides nothing — in a good way.',
        date: 'Aug 2026',
      },
    ],
    relatedIds: ['nebula-chinos', 'aetheric-shoes', 'aegis-active-jacket'],
    isNew: true,
    featured: true,
  },
  {
    id: 'nebula-chinos',
    name: 'Nebula Chinos',
    price: 3890,
    description:
      'Tapered technical chinos with four-way stretch and a crease that actually holds. Built for movement, cut for evenings.',
    category: 'men',
    fit: 'slim',
    sizes: [...allSizes],
    colors: [charcoal, sand, signal],
    images: [
      unsplash('photo-1473966968600-fa801b869a1a'),
      unsplash('photo-1624378439575-d8705ad7ae80'),
      unsplash('photo-1584865288642-42078afe6942'),
      unsplash('photo-1552374196-1ab2a1c593e8'),
    ],
    fabricCare: '96% cotton, 4% elastane. Machine wash cold. Steam to restore the crease.',
    shipping: 'Ships in 24 hours. Free exchanges on size within 14 days.',
    reviews: [
      {
        id: 'r2',
        author: 'Amir S.',
        rating: 4,
        text: 'True to size. The taper is sharp without looking skinny.',
        date: 'Jul 2026',
      },
    ],
    relatedIds: ['aetheric-knit-tee', 'aetheric-shoes', 'nebula-shirt'],
    isNew: false,
    featured: true,
  },
  {
    id: 'nebula-shirt',
    name: 'Nebula Shirt',
    price: 3690,
    description:
      'A crisp poplin shirt with a hidden placket and slightly elongated cuff. Minimal hardware, maximum signal.',
    category: 'men',
    fit: 'medium',
    sizes: [...allSizes],
    colors: [ash, charcoal, sand],
    images: [
      unsplash('photo-1596755094514-f87e34085b2c'),
      unsplash('photo-1602810318383-e386cc2a3ccf'),
      unsplash('photo-1602810316693-3667c854239a'),
      unsplash('photo-1621072156002-e2fccdc0b176'),
    ],
    fabricCare: '100% organic cotton poplin. Wash cold, hang dry, light iron if needed.',
    shipping: 'Standard shipping 3–5 days. Express available at checkout.',
    reviews: [
      {
        id: 'r3',
        author: 'Leo M.',
        rating: 5,
        text: 'The collar sits perfectly under a jacket. Will buy in charcoal next.',
        date: 'Jun 2026',
      },
    ],
    relatedIds: ['nebula-chinos', 'aegis-active-jacket', 'orbit-merino-polo'],
    isNew: false,
    featured: true,
  },
  {
    id: 'aetheric-shoes',
    name: 'Aetheric Shoes',
    price: 4290,
    description:
      'Low-profile court sneakers with a cushioned footbed and matte upper. Quiet luxury for city miles.',
    category: 'men',
    fit: 'medium',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [charcoal, ash, crimson],
    images: [
      unsplash('photo-1549298916-b41d501d3772'),
      unsplash('photo-1460353581641-37baddab0fa2'),
      unsplash('photo-1595950653106-6c9ebd614d3a'),
      unsplash('photo-1608231387042-66d1773070a5'),
    ],
    fabricCare: 'Leather and recycled mesh. Wipe clean. Avoid soaking.',
    shipping: 'Free shipping over ৳২,০০০. 14-day trial period.',
    reviews: [
      {
        id: 'r4',
        author: 'Priya N.',
        rating: 5,
        text: 'Walked 12k steps on day one. No break-in drama.',
        date: 'Aug 2026',
      },
    ],
    relatedIds: ['nebula-chinos', 'aetheric-knit-tee', 'helix-runner'],
    isNew: true,
    featured: true,
  },
  {
    id: 'aegis-active-jacket',
    name: 'Aegis Active Jacket',
    price: 7990,
    description:
      'A weather-ready hooded shell with bonded seams, articulated sleeves, and an interior that regulates heat without bulk. Designed to layer over knits and under wool.',
    category: 'men',
    fit: 'medium',
    sizes: [...allSizes],
    colors: [charcoal, signal, sand, crimson, ash],
    images: [
      unsplash('photo-1591047139829-d91aecb6caea'),
      unsplash('photo-1617127365659-c47fa864d8bc'),
      unsplash('photo-1551028719-00167b16eac5'),
      unsplash('photo-1544022613-e87ca75a784a'),
    ],
    fabricCare:
      'Three-layer recycled nylon with DWR finish. Machine wash cold on gentle. Do not tumble dry. Re-proof annually.',
    shipping: 'Priority shipping included. Carbon-neutral fulfillment from our Berlin atelier.',
    reviews: [
      {
        id: 'r5',
        author: 'Elena V.',
        rating: 5,
        text: 'Blocks wind without sounding like a trash bag. The hood actually stays up.',
        date: 'Sep 2026',
      },
      {
        id: 'r6',
        author: 'Marcus T.',
        rating: 4,
        text: 'True to size. Get M if you layer a heavy knit underneath.',
        date: 'Aug 2026',
      },
    ],
    relatedIds: ['aetheric-knit-tee', 'aetheric-shoes', 'nebula-chinos', 'orbit-merino-polo'],
    isNew: true,
    featured: true,
  },
  {
    id: 'orbit-merino-polo',
    name: 'Orbit Merino Polo',
    price: 3290,
    description:
      'Fine-gauge merino polo with a clean placket and temperature-aware knit. Desk to dinner without a costume change.',
    category: 'men',
    fit: 'slim',
    sizes: [...allSizes],
    colors: [charcoal, signal, sand],
    images: [
      unsplash('photo-1618354691373-d851c5c3a990'),
      unsplash('photo-1586363104862-3a5e2ab60d99'),
      unsplash('photo-1617137968427-85924c800a22'),
      unsplash('photo-1593032465175-481ac7f401a0'),
    ],
    fabricCare: '100% extrafine merino. Hand wash or wool cycle. Lay flat.',
    shipping: 'Ships next business day. Free returns.',
    reviews: [
      {
        id: 'r7',
        author: 'Noah P.',
        rating: 5,
        text: 'No itch, no pills after six weeks. That is rare.',
        date: 'Jul 2026',
      },
    ],
    relatedIds: ['nebula-chinos', 'aegis-active-jacket', 'aetheric-knit-tee'],
    isNew: false,
    featured: true,
  },
  {
    id: 'pulse-overshirt',
    name: 'Pulse Overshirt',
    price: 4590,
    description:
      'A structured overshirt in brushed twill. Wear it open as a layer or closed as a light jacket.',
    category: 'men',
    fit: 'relaxed',
    sizes: [...allSizes],
    colors: [charcoal, sand, ash],
    images: [
      unsplash('photo-1593030761757-71fae45fa0e7'),
      unsplash('photo-1617127365659-c47fa864d8bc'),
      unsplash('photo-1495105787522-5334e3ffa0ef'),
      unsplash('photo-1603252109303-2751441dd157'),
    ],
    fabricCare: 'Organic cotton twill. Wash cold, hang dry.',
    shipping: 'Standard 3–5 day shipping.',
    reviews: [
      {
        id: 'r8',
        author: 'Chris D.',
        rating: 4,
        text: 'Heavier than expected — in the right way.',
        date: 'May 2026',
      },
    ],
    relatedIds: ['aetheric-knit-tee', 'nebula-chinos', 'aegis-active-jacket'],
    isNew: false,
    featured: true,
  },
  {
    id: 'helix-runner',
    name: 'Helix Runner',
    price: 6490,
    description:
      'A sculpted runner with energy-return foam and a knit upper that maps to your stride. Night-reflective hits.',
    category: 'men',
    fit: 'medium',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [charcoal, crimson, signal],
    images: [
      unsplash('photo-1542291026-7eec264c27ff'),
      unsplash('photo-1606107557195-0e29a4b5b4aa'),
      unsplash('photo-1600185365483-26d7a4cc7519'),
      unsplash('photo-1515955656352-a1fa3ffcd111'),
    ],
    fabricCare: 'Knit upper, EVA foam. Spot clean. Air dry away from heat.',
    shipping: 'Free shipping. 30-day run trial.',
    reviews: [
      {
        id: 'r9',
        author: 'Sofia R.',
        rating: 5,
        text: 'Stable at tempo, quiet on pavement. Keep these in rotation.',
        date: 'Aug 2026',
      },
    ],
    relatedIds: ['aetheric-shoes', 'nebula-chinos', 'aetheric-knit-tee'],
    isNew: true,
    featured: true,
  },
  {
    id: 'lumen-silk-blouse',
    name: 'Lumen Silk Blouse',
    price: 5490,
    description:
      'Fluid silk with a concealed button line and a neckline that frames without fuss. Evening-ready, office-capable.',
    category: 'women',
    fit: 'medium',
    sizes: [...allSizes],
    colors: [ash, sand, charcoal],
    images: [
      unsplash('photo-1539533018447-63fcce2678e3'),
      unsplash('photo-1515886657613-9f3515b0c78f'),
      unsplash('photo-1485968579580-b6d095142e6e'),
      unsplash('photo-1490481651871-ab68de25d43d'),
    ],
    fabricCare: '100% mulberry silk. Dry clean or cold hand wash.',
    shipping: 'Complimentary overnight in metro areas.',
    reviews: [
      {
        id: 'r10',
        author: 'Ava L.',
        rating: 5,
        text: 'The drape is cinematic. Wore it twice in one week.',
        date: 'Sep 2026',
      },
    ],
    relatedIds: ['nova-wide-leg', 'signal-heel', 'veil-trench'],
    isNew: true,
    featured: true,
  },
  {
    id: 'nova-wide-leg',
    name: 'Nova Wide Leg',
    price: 4790,
    description:
      'Full-length trousers with a floating crease and elastic-free waist that still holds. Architecture you can walk in.',
    category: 'women',
    fit: 'relaxed',
    sizes: [...allSizes],
    colors: [charcoal, sand, ash],
    images: [
      unsplash('photo-1584865288642-42078afe6942'),
      unsplash('photo-1594633312681-425c7b97ccd1'),
      unsplash('photo-1515372039744-b8f02a3ae446'),
      unsplash('photo-1483985988355-763728e1935b'),
    ],
    fabricCare: 'Wool blend. Dry clean recommended.',
    shipping: 'Free shipping and hemming notes included.',
    reviews: [
      {
        id: 'r11',
        author: 'Maya H.',
        rating: 4,
        text: 'Length is generous — I am 5\'4" and had them taken up once.',
        date: 'Jul 2026',
      },
    ],
    relatedIds: ['lumen-silk-blouse', 'signal-heel', 'veil-trench'],
    isNew: false,
    featured: true,
  },
  {
    id: 'veil-trench',
    name: 'Veil Trench',
    price: 9990,
    description:
      'A shortened trench with a magnetic closure and water-shedding cotton. The collar sits like a sculpture.',
    category: 'women',
    fit: 'medium',
    sizes: [...allSizes],
    colors: [sand, charcoal, ash],
    images: [
      unsplash('photo-1520975916090-3105956dac38'),
      unsplash('photo-1544022613-e87ca75a784a'),
      unsplash('photo-1483985988355-763728e1935b'),
      unsplash('photo-1490481651871-ab68de25d43d'),
    ],
    fabricCare: 'Cotton gabardine with DWR. Specialist clean.',
    shipping: 'Shipped in a reusable garment bag.',
    reviews: [
      {
        id: 'r12',
        author: 'Irene C.',
        rating: 5,
        text: 'The proportion is perfect over dresses and trousers.',
        date: 'Aug 2026',
      },
    ],
    relatedIds: ['lumen-silk-blouse', 'nova-wide-leg', 'signal-heel'],
    isNew: true,
    featured: true,
  },
  {
    id: 'signal-heel',
    name: 'Signal Heel',
    price: 6990,
    description:
      'A sculpted 70mm heel with a squared toe and matte leather. Designed to disappear under wide-leg trousers.',
    category: 'women',
    fit: 'slim',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [charcoal, crimson, sand],
    images: [
      unsplash('photo-1543163521-1bf539c55dd2'),
      unsplash('photo-1535043934128-cf0b28d52f95'),
      unsplash('photo-1543163521-1bf539c55dd2', 800),
      unsplash('photo-1518049362265-d5b2a6467637'),
    ],
    fabricCare: 'Calf leather. Wipe with a damp cloth. Use shoe trees.',
    shipping: 'Gift boxing available. 14-day fit guarantee.',
    reviews: [
      {
        id: 'r13',
        author: 'Jules F.',
        rating: 5,
        text: 'Surprisingly walkable. The heel is a statement without a scream.',
        date: 'Jun 2026',
      },
    ],
    relatedIds: ['nova-wide-leg', 'lumen-silk-blouse', 'veil-trench'],
    isNew: false,
    featured: true,
  },
  {
    id: 'quantum-belt',
    name: 'Quantum Belt',
    price: 1890,
    description:
      'Vegetable-tanned leather with a brushed hardware buckle. Ages darker with every commute.',
    category: 'accessories',
    fit: 'medium',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [charcoal, sand, crimson],
    images: [
      unsplash('photo-1684510334550-0c4fa8aaffd1'),
      unsplash('photo-1664286074176-5206ee5dc878'),
      unsplash('photo-1625789250576-9efae40f4689'),
      unsplash('photo-1565251419287-9097aa7299ec'),
    ],
    fabricCare: 'Full-grain leather. Condition twice a year.',
    shipping: 'Ships in 24 hours.',
    reviews: [
      {
        id: 'r14',
        author: 'Ben W.',
        rating: 5,
        text: 'The buckle weight feels expensive. It is.',
        date: 'May 2026',
      },
    ],
    relatedIds: ['nebula-chinos', 'aegis-active-jacket', 'orbit-merino-polo'],
    isNew: false,
    featured: true,
  },
  {
    id: 'halo-cap',
    name: 'Halo Cap',
    price: 1290,
    description:
      'Unstructured six-panel cap in washed cotton with a subtle reflective stitch under the brim.',
    category: 'accessories',
    fit: 'medium',
    sizes: ['S', 'M', 'L'],
    colors: [charcoal, ash, signal],
    images: [
      unsplash('photo-1556306535-0f09a537f0a3'),
      unsplash('photo-1521369909029-2afed882baee'),
      unsplash('photo-1576871337622-98d48d1cf531'),
      unsplash('photo-1556306535-0f09a537f0a3', 800),
    ],
    fabricCare: 'Cotton twill. Spot clean.',
    shipping: 'Always free.',
    reviews: [
      {
        id: 'r15',
        author: 'Kai J.',
        rating: 4,
        text: 'Sits right. Not too deep, not too shallow.',
        date: 'Apr 2026',
      },
    ],
    relatedIds: ['aegis-active-jacket', 'aetheric-knit-tee', 'quantum-belt'],
    isNew: true,
    featured: true,
  },
];

export function getProductById(id: string): Product | undefined {
  return products.find((product) => product.id === id);
}

export function getRelatedProducts(product: Product): Product[] {
  return product.relatedIds
    .map((id) => getProductById(id))
    .filter((item): item is Product => item !== undefined);
}

export function getProductsByCategory(category: string | null): Product[] {
  if (!category || category === 'all') {
    return products;
  }
  if (category === 'new') {
    return products.filter((product) => product.isNew);
  }
  return products.filter((product) => product.category === category);
}

export const collectionTitles: Record<string, string> = {
  men: "Men's Collection",
  women: "Women's Collection",
  accessories: 'Accessories',
  new: 'New Arrivals',
  all: 'The Collection',
};
