import { unsplash } from '../lib/utils';

export type WearTab = 'womenswear' | 'menswear';

export interface LookItem {
  id: string;
  name: string;
  image: string;
  productId?: string;
}

export interface LookCollection {
  id: string;
  title: string;
  subtitle: string;
  items: LookItem[];
}

export const HERO_LOOKS = [
  unsplash('photo-1524504388940-b1c1722653e1', 900),
  unsplash('photo-1515886657613-9f3515b0c78f', 900),
  unsplash('photo-1485968579580-b6d095142e6e', 900),
];

export const AVATAR_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL+'] as const;
export type AvatarSize = (typeof AVATAR_SIZES)[number];

export const GENERATE_GARMENTS = [
  unsplash('photo-1496747611176-843222e1e57c', 800),
  unsplash('photo-1515372039744-b8f02a3ae446', 800),
  unsplash('photo-1572804013309-59a88b7e92f1', 800),
  unsplash('photo-1515886657613-9f3515b0c78f', 800),
  unsplash('photo-1485968579580-b6d095142e6e', 800),
  unsplash('photo-1490481651871-ab68de25d43d', 800),
];

export const AVATAR_POSES = [
  { id: 'pose-knit', name: 'Cream knit', image: unsplash('photo-1524504388940-b1c1722653e1', 800) },
  { id: 'pose-black', name: 'Black tailored', image: unsplash('photo-1485968579580-b6d095142e6e', 800) },
  { id: 'pose-brown', name: 'Cocoa layer', image: unsplash('photo-1515886657613-9f3515b0c78f', 800) },
  { id: 'pose-denim', name: 'Denim set', image: unsplash('photo-1572804013309-59a88b7e92f1', 800) },
];

export const lookCollections: Record<WearTab, LookCollection[]> = {
  womenswear: [
    {
      id: 'belle',
      title: 'Belle of the Ball',
      subtitle: 'Looks that turn heads',
      items: [
        { id: 'puff-sleeve-dress', name: 'Puff Sleeve Dress', image: unsplash('photo-1496747611176-843222e1e57c'), productId: 'lumen-silk-blouse' },
        { id: 'velvet-maxi', name: 'Velvet Maxi', image: unsplash('photo-1515372039744-b8f02a3ae446'), productId: 'nova-wide-leg' },
        { id: 'pleated-maxi', name: 'Pleated Maxi', image: unsplash('photo-1566174053879-31528523f8ae') },
        { id: 'corsage-maxi', name: 'Corsage Maxi', image: unsplash('photo-1595777457583-95e059d581b8') },
        { id: 'textured-fan-dress', name: 'Textured Fan Dress', image: unsplash('photo-1572804013309-59a88b7e92f1') },
        { id: 'ruched-waist-maxi', name: 'Ruched Waist Maxi', image: unsplash('photo-1539008835657-9e8e9680c956') },
        { id: 'metallic-fringe-maxi', name: 'Metallic Fringe Maxi', image: unsplash('photo-1490481651871-ab68de25d43d') },
      ],
    },
    {
      id: 'winter',
      title: 'Winter Must-Haves',
      subtitle: 'Feel warm and stylish all winter',
      items: [
        { id: 'mixed-media-maxi', name: 'Mixed Media Maxi', image: unsplash('photo-1483985988355-763728e1935b'), productId: 'veil-trench' },
        { id: 'wool-vneck', name: 'Wool V-Neck', image: unsplash('photo-1434389677669-e08b4cac3105') },
        { id: 'hybrid-dropped-waist', name: 'Hybrid Dropped Waist', image: unsplash('photo-1485968579580-b6d095142e6e') },
        { id: 'cow-print-coat', name: 'Cow Print Coat', image: unsplash('photo-1539533018447-63fcce2678e3') },
        { id: 'loose-turtleneck', name: 'Loose-Fit Turtleneck', image: unsplash('photo-1576566588028-4147f3842f27') },
        { id: 'effortless-wool-pants', name: 'Effortless Wool Pants', image: unsplash('photo-1584865288642-42078afe6942'), productId: 'nova-wide-leg' },
        { id: 'lambswool-rugby', name: 'Lambswool Rugby', image: unsplash('photo-1618354691373-d851c5c3a990') },
      ],
    },
    {
      id: 'frosty',
      title: 'Frosty Footwear',
      subtitle: 'Sleigh the season',
      items: [
        { id: 'bianka-mesh', name: 'Bianka Mesh Slingback', image: unsplash('photo-1543163521-1bf539c55dd2'), productId: 'signal-heel' },
        { id: 'satin-pump', name: 'Satin Court Pump', image: unsplash('photo-1535043934128-cf0b28d52f95') },
        { id: 'bow-slingback', name: 'Bow Slingback', image: unsplash('photo-1518049362265-d5b2a6467637') },
        { id: 'crystal-heel', name: 'Crystal Heel', image: unsplash('photo-1543163521-1bf539c55dd2', 800) },
        { id: 'ivory-mule', name: 'Ivory Mule', image: unsplash('photo-1560343090-f0409e92791a') },
        { id: 'navy-pump', name: 'Navy Pump', image: unsplash('photo-1460353581641-37baddab0fa2') },
        { id: 'strappy-sandal', name: 'Strappy Sandal', image: unsplash('photo-1549298916-b41d501d3772') },
      ],
    },
    {
      id: 'browse-women',
      title: 'Browse the rest of Inovative',
      subtitle: 'More categories to explore',
      items: [
        { id: 'sweaters', name: 'Sweaters', image: unsplash('photo-1434389677669-e08b4cac3105') },
        { id: 'loafers', name: 'Loafers', image: unsplash('photo-1449505278894-297fdb3edbc1') },
        { id: 'straight-leg-jeans', name: 'Straight Leg Jeans', image: unsplash('photo-1541099649105-f69ad21f3246') },
        { id: 'midi-dresses', name: 'Midi Dresses', image: unsplash('photo-1572804013309-59a88b7e92f1') },
        { id: 'blazers', name: 'Blazers', image: unsplash('photo-1591369822096-ffd140ec948f') },
        { id: 'low-profile-sneaker', name: 'Low Profile Sneaker', image: unsplash('photo-1542291026-7eec264c27ff') },
        { id: 'overcoat', name: 'Overcoat', image: unsplash('photo-1539533018447-63fcce2678e3'), productId: 'veil-trench' },
      ],
    },
  ],
  menswear: [
    {
      id: 'city-tailoring',
      title: 'City Tailoring',
      subtitle: 'Looks that hold a room',
      items: [
        { id: 'aegis-look', name: 'Aegis Active Jacket', image: unsplash('photo-1591047139829-d91aecb6caea'), productId: 'aegis-active-jacket' },
        { id: 'nebula-shirt-look', name: 'Nebula Shirt', image: unsplash('photo-1596755094514-f87e34085b2c'), productId: 'nebula-shirt' },
        { id: 'pulse-overshirt-look', name: 'Pulse Overshirt', image: unsplash('photo-1593030761757-71fae45fa0e7'), productId: 'pulse-overshirt' },
        { id: 'orbit-polo-look', name: 'Orbit Merino Polo', image: unsplash('photo-1618354691373-d851c5c3a990'), productId: 'orbit-merino-polo' },
        { id: 'knit-tee-look', name: 'Aetheric Knit Tee', image: unsplash('photo-1521572163474-6864f9cf17ab'), productId: 'aetheric-knit-tee' },
        { id: 'tailored-blazer', name: 'Tailored Blazer', image: unsplash('photo-1507679799987-c73779587ccf') },
        { id: 'evening-coat', name: 'Evening Coat', image: unsplash('photo-1617127365659-c47fa864d8bc') },
      ],
    },
    {
      id: 'weekend-layers',
      title: 'Weekend Layers',
      subtitle: 'Easy pieces, sharper ease',
      items: [
        { id: 'nebula-chinos-look', name: 'Nebula Chinos', image: unsplash('photo-1473966968600-fa801b869a1a'), productId: 'nebula-chinos' },
        { id: 'quantum-belt-look', name: 'Quantum Belt', image: unsplash('photo-1684510334550-0c4fa8aaffd1'), productId: 'quantum-belt' },
        { id: 'halo-cap-look', name: 'Halo Cap', image: unsplash('photo-1556306535-0f09a537f0a3'), productId: 'halo-cap' },
        { id: 'leather-layer', name: 'Leather Layer', image: unsplash('photo-1551028719-00167b16eac5') },
        { id: 'hoodie-set', name: 'Studio Hoodie', image: unsplash('photo-1544022613-e87ca75a784a') },
        { id: 'wool-trouser', name: 'Wool Trouser', image: unsplash('photo-1624378439575-d8705ad7ae80') },
        { id: 'field-jacket', name: 'Field Jacket', image: unsplash('photo-1495105787522-5334e3ffa0ef') },
      ],
    },
    {
      id: 'street-runners',
      title: 'Street Runners',
      subtitle: 'Miles with a quiet finish',
      items: [
        { id: 'helix-look', name: 'Helix Runner', image: unsplash('photo-1542291026-7eec264c27ff'), productId: 'helix-runner' },
        { id: 'aetheric-shoe-look', name: 'Aetheric Shoes', image: unsplash('photo-1549298916-b41d501d3772'), productId: 'aetheric-shoes' },
        { id: 'court-low', name: 'Court Low', image: unsplash('photo-1595950653106-6c9ebd614d3a') },
        { id: 'runner-green', name: 'Tempo Runner', image: unsplash('photo-1606107557195-0e29a4b5b4aa') },
        { id: 'puma-low', name: 'Track Low', image: unsplash('photo-1608231387042-66d1773070a5') },
        { id: 'mesh-runner', name: 'Mesh Runner', image: unsplash('photo-1460353581641-37baddab0fa2') },
        { id: 'night-runner', name: 'Night Runner', image: unsplash('photo-1515955656352-a1fa3ffcd111') },
      ],
    },
    {
      id: 'browse-men',
      title: 'Browse the rest of Inovative',
      subtitle: 'More categories to explore',
      items: [
        { id: 'mens-jackets', name: 'Jackets', image: unsplash('photo-1591047139829-d91aecb6caea') },
        { id: 'mens-tees', name: 'Tees', image: unsplash('photo-1521572163474-6864f9cf17ab') },
        { id: 'mens-trousers', name: 'Trousers', image: unsplash('photo-1473966968600-fa801b869a1a') },
        { id: 'mens-shirts', name: 'Shirts', image: unsplash('photo-1596755094514-f87e34085b2c') },
        { id: 'mens-sneakers', name: 'Sneakers', image: unsplash('photo-1542291026-7eec264c27ff') },
        { id: 'mens-knit', name: 'Knitwear', image: unsplash('photo-1618354691373-d851c5c3a990') },
        { id: 'mens-outerwear', name: 'Outerwear', image: unsplash('photo-1617127365659-c47fa864d8bc') },
      ],
    },
  ],
};
