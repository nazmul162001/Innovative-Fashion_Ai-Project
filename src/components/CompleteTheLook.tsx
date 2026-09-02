import type { Product } from '../types/product';

interface CompleteTheLookProps {
  items: Product[];
}

export default function CompleteTheLook({ items }: CompleteTheLookProps) {
  if (items.length === 0) return null;

  return (
    <section className="mt-16">
      <h2 className="text-xl font-bold tracking-tight text-snow uppercase md:text-2xl">Complete the look</h2>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        {items.map((item) => (
          <a key={item.id} href={`/product/${item.id}`} className="product-card group">
            <div className="dark-card-glow overflow-hidden rounded-2xl">
              <img
                src={item.images[0]}
                alt={item.name}
                className="studio-image-light aspect-[3/4] w-full object-cover"
              />
            </div>
            <p className="mt-3 text-sm text-snow">{item.name}</p>
            <p className="text-sm text-mist">${item.price}</p>
          </a>
        ))}
      </div>
    </section>
  );
}
