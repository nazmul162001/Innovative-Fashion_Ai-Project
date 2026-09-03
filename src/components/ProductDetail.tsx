import type { Product } from '../types/product';
import ProductGallery from './ProductGallery';
import ProductSelectionPanel from './ProductSelectionPanel';
import CompleteTheLook from './CompleteTheLook';
import PageBackShell from './PageBackShell';

interface ProductDetailProps {
  product: Product;
  related: Product[];
}

export default function ProductDetail({ product, related }: ProductDetailProps) {
  return (
    <PageBackShell>
      <div className="mx-auto w-full min-w-0 max-w-7xl px-4 pb-8 md:px-6 md:pb-12">
        <div className="grid items-start gap-6 lg:grid-cols-2 lg:gap-8">
          <ProductGallery name={product.name} images={product.images} productId={product.id} />
          <ProductSelectionPanel
            product={product}
            onTryOn={() => {
              void import('astro:transitions/client').then(({ navigate }) => navigate('/try-on')).catch(() => {
                window.location.assign('/try-on');
              });
            }}
          />
        </div>
        <CompleteTheLook items={[product, ...related].slice(0, 4)} />
      </div>
    </PageBackShell>
  );
}

