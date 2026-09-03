import Link from 'next/link';
import { BRAND } from '@/lib/brand';

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="text-xs tracking-[0.2em] text-signal uppercase">404</p>
      <h1 className="mt-3 text-3xl font-bold">This look does not exist.</h1>
      <p className="mt-3 text-sm text-mist">The piece you wanted may have moved, or the link is incomplete.</p>
      <Link href="/" className="mt-8 inline-flex rounded-xl bg-signal px-5 py-3 text-sm font-semibold">
        Return home
      </Link>
      <p className="sr-only">{BRAND.name}</p>
    </div>
  );
}
