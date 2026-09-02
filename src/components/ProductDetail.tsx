import { useState } from 'react';
import type { Product } from '../types/product';
import ProductGallery from './ProductGallery';
import ProductSelectionPanel from './ProductSelectionPanel';
import TryOnModal from './TryOnModal';
import CompleteTheLook from './CompleteTheLook';

interface ProductDetailProps {
  product: Product;
  related: Product[];
}

export default function ProductDetail({ product, related }: ProductDetailProps) {
  const [tryOnOpen, setTryOnOpen] = useState(false);

  return (
    <div className="mx-auto w-full min-w-0 max-w-7xl px-4 py-8 md:px-6 md:py-12">
      <div className="grid items-start gap-6 lg:grid-cols-2 lg:gap-8">
        <ProductGallery name={product.name} images={product.images} productId={product.id} />
        <ProductSelectionPanel product={product} onTryOn={() => setTryOnOpen(true)} />
      </div>
      <CompleteTheLook items={[product, ...related].slice(0, 4)} />
      <TryOnModal product={product} open={tryOnOpen} onClose={() => setTryOnOpen(false)} />
    </div>
  );
}
