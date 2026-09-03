import type { Metadata } from 'next';
import TryOnExperience from '@/components/TryOnExperience';
import { BRAND } from '@/lib/brand';

export const metadata: Metadata = {
  title: 'Try-On',
  description: 'See yourself in every look. One photo, endless outfits — try on Inovative pieces before they ship.',
};

export default function TryOnPage() {
  return <TryOnExperience />;
}
