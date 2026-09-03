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
      <div className="mx-auto box-border w-full min-w-0 max-w-7xl overflow-x-clip px-4 py-8 sm:px-5 md:px-6 md:py-12">
        <div className="grid min-w-0 w-full grid-cols-1 items-start gap-6 lg:grid-cols-2 lg:gap-8">
          <div className="min-w-0 w-full max-w-full">
            <ProductGallery name={product.name} images={product.images} productId={product.id} />
          </div>
          <div className="min-w-0 w-full max-w-full">
            <ProductSelectionPanel
              product={product}
              onTryOn={() => {
                void import('astro:transitions/client').then(({ navigate }) => navigate('/try-on')).catch(() => {
                  window.location.assign('/try-on');
                });
              }}
            />
          </div>
        </div>
        <CompleteTheLook items={[product, ...related].slice(0, 4)} />
      </div>
    </PageBackShell>
  );
}
