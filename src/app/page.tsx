import dynamic from 'next/dynamic';
import Hero from '@/components/Hero';
import ClientVisible from '@/components/ClientVisible';
import { BRAND } from '@/lib/brand';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: BRAND.name,
  description: BRAND.description,
};

const CollectionSection = dynamic(() => import('@/components/CollectionSection'), {
  loading: () => <div className="min-h-[28rem]" aria-hidden />,
});

const HowItWorks = dynamic(() => import('@/components/home/HowItWorks'));
const TryOnSpotlight = dynamic(() => import('@/components/home/TryOnSpotlight'));
const ShopByIntent = dynamic(() => import('@/components/home/ShopByIntent'));
const AtelierLooks = dynamic(() => import('@/components/home/AtelierLooks'));
const FitConfidence = dynamic(() => import('@/components/home/FitConfidence'));

export default function HomePage() {
  return (
    <>
      <Hero />
      <CollectionSection initialCategory="all" />
      <ClientVisible>
        <HowItWorks />
      </ClientVisible>
      <ClientVisible>
        <TryOnSpotlight />
      </ClientVisible>
      <ClientVisible>
        <ShopByIntent />
      </ClientVisible>
      <ClientVisible>
        <AtelierLooks />
      </ClientVisible>
      <ClientVisible>
        <FitConfidence />
      </ClientVisible>
    </>
  );
}
