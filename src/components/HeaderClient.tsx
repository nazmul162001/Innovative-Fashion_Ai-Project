import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Heart, Menu, Search, ShoppingBag, User, X } from 'lucide-react';
import { useStore } from '@nanostores/react';
import { NAV_LINKS } from '../types/product';
import { products } from '../data/products';
import { cartCount, openDrawer, wishlistIds } from '../stores/shop';
import Logo from './Logo';

interface HeaderClientProps {
  pathname: string;
  search: string;
}

export default function HeaderClient({ pathname, search }: HeaderClientProps) {
  const count = useStore(cartCount, { ssr: 'initial' });
  const saved = useStore(wishlistIds, { ssr: 'initial' });
  const drawer = useStore(openDrawer, { ssr: 'initial' });
  const [query, setQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);

  const [category, setCategory] = useState(() => new URLSearchParams(search).get('category'));

  useEffect(() => {
    const sync = () => setCategory(new URLSearchParams(window.location.search).get('category'));
    sync();
    window.addEventListener('if:category', sync);
    window.addEventListener('popstate', sync);
    document.addEventListener('astro:page-load', sync);
    return () => {
      window.removeEventListener('if:category', sync);
      window.removeEventListener('popstate', sync);
      document.removeEventListener('astro:page-load', sync);
    };
  }, [search]);
  const navOpen = drawer === 'nav';

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    return products
      .filter((product) => product.name.toLowerCase().includes(q) || product.description.toLowerCase().includes(q))
      .slice(0, 5);
  }, [query]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSearchOpen(false);
        if (navOpen) openDrawer.set(null);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [navOpen]);

  const isActive = (href: string) => {
    if (href.includes('/try-on')) {
      return pathname.includes('/try-on');
    }
    if (href.includes('category=')) {
      const value = new URL(href, 'https://inovativefashion.com').searchParams.get('category');
      return category === value;
    }
    return false;
  };

  return (
    <header className="sticky top-0 z-50 border-b border-dark-border/80 bg-dark-bg/85 backdrop-blur-md">
      <div className="mx-auto flex w-full min-w-0 max-w-7xl items-center gap-1.5 px-3 py-3 sm:gap-4 sm:px-4 md:px-6">
        <button
          type="button"
          className="shrink-0 rounded-lg p-2 text-snow md:hidden"
          aria-label={navOpen ? 'Close menu' : 'Open menu'}
          onClick={() => openDrawer.set(navOpen ? null : 'nav')}
        >
          {navOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <Logo className="min-w-0 flex-1 md:flex-none" />

        <div className="relative mx-auto hidden w-full max-w-md md:block">
          <Search size={16} className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-mist" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onFocus={() => setSearchOpen(true)}
            placeholder="Search Inovative"
            className="w-full rounded-full border border-dark-border bg-dark-surface py-2 pr-4 pl-10 text-sm text-snow outline-none placeholder:text-mist/70 focus:border-accent-cyan/50"
          />
          <SearchResults open={searchOpen && matches.length > 0} matches={matches} onClose={() => setSearchOpen(false)} />
        </div>

        <div className="ml-auto flex shrink-0 items-center text-snow">
          <button
            type="button"
            className="rounded-full p-2 hover:bg-white/5 md:hidden"
            aria-label="Search"
            onClick={() => setSearchOpen((open) => !open)}
          >
            <Search size={18} />
          </button>
          <button type="button" className="hidden rounded-full p-2 hover:bg-white/5 sm:inline-flex" aria-label="Account">
            <User size={18} />
          </button>
          <button
            type="button"
            className="relative rounded-full p-2 hover:bg-white/5"
            aria-label="Wishlist"
            onClick={() => openDrawer.set('wishlist')}
          >
            <Heart size={18} />
            {saved.length > 0 ? <Badge count={saved.length} /> : null}
          </button>
          <button
            type="button"
            className="relative rounded-full p-2 hover:bg-white/5"
            aria-label="Cart"
            onClick={() => openDrawer.set('cart')}
          >
            <ShoppingBag size={18} />
            {count > 0 ? <Badge count={count} /> : null}
          </button>
        </div>
      </div>

      {searchOpen ? (
        <div className="relative px-3 pb-3 sm:px-4 md:hidden">
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search Inovative"
            className="w-full rounded-full border border-dark-border bg-dark-surface py-2 px-4 text-sm outline-none"
          />
          <SearchResults open={matches.length > 0} matches={matches} onClose={() => setSearchOpen(false)} />
        </div>
      ) : null}

      <nav className="hidden justify-center gap-4 overflow-x-auto px-4 pb-3 md:flex lg:gap-8" aria-label="Primary">
        {NAV_LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className={`text-[12px] font-medium tracking-[0.18em] uppercase transition hover:text-snow ${
              isActive(link.href) ? 'text-snow underline decoration-accent-cyan underline-offset-8' : 'text-mist'
            }`}
          >
            {link.label}
          </a>
        ))}
      </nav>

      <AnimatePresence>
        {navOpen ? (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-dark-border md:hidden"
          >
            <div className="flex flex-col gap-1 px-4 py-3">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => openDrawer.set(null)}
                  className="rounded-lg px-3 py-2 text-sm tracking-[0.14em] uppercase text-fog"
                >
                  {link.label}
                </a>
              ))}
              <button
                type="button"
                className="rounded-lg px-3 py-2 text-left text-sm tracking-[0.14em] uppercase text-fog sm:hidden"
                onClick={() => openDrawer.set(null)}
              >
                Account
              </button>
            </div>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
  );
}

function Badge({ count }: { count: number }) {
  return (
    <span className="absolute top-0.5 right-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-signal px-1 text-[10px] font-semibold text-white">
      {count}
    </span>
  );
}

function SearchResults({
  open,
  matches,
  onClose,
}: {
  open: boolean;
  matches: typeof products;
  onClose: () => void;
}) {
  if (!open) return null;
  return (
    <ul className="absolute z-20 mt-2 w-full overflow-hidden rounded-2xl border border-white/10 bg-ink-soft shadow-soft">
      {matches.map((product) => (
        <li key={product.id}>
          <a
            href={`/product/${product.id}`}
            onClick={onClose}
            className="flex items-center gap-3 px-3 py-2.5 hover:bg-white/5"
          >
            <img src={product.images[0]} alt="" className="h-10 w-10 rounded-lg object-cover" />
            <span className="text-sm">{product.name}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
