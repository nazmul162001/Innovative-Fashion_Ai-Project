import Link from 'next/link';
import { BRAND } from '../lib/brand';

const year = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="mt-6 border-t border-dark-border md:mt-8">
      <div className="mx-auto max-w-7xl px-4 py-5 md:px-6 md:py-6">
        <nav className="mb-4 hidden flex-wrap items-center gap-x-6 gap-y-2 text-sm text-mist md:flex" aria-label="Footer">
          <span className="text-snow">Quick links</span>
          <Link href="/#how-it-works" className="hover:text-snow">
            How it works
          </Link>
          <Link href="/try-on" className="hover:text-snow">
            Try-On
          </Link>
          <Link href="/?category=men#collection" className="hover:text-snow">
            Men
          </Link>
          <Link href="/?category=women#collection" className="hover:text-snow">
            Women
          </Link>
          <Link href="/?category=accessories#collection" className="hover:text-snow">
            Accessories
          </Link>
          <Link href="/#confidence" className="hover:text-snow">
            The edit
          </Link>
        </nav>
        <div className="flex items-center justify-between gap-4">
          <p className="min-w-0 text-xs text-mist/80">
            © {year} {BRAND.legal}. All Rights Reserved.
          </p>
          <div className="flex shrink-0 items-center gap-4 text-mist">
            <a href="https://facebook.com" aria-label="Facebook" className="hover:text-snow" target="_blank" rel="noreferrer">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                <path d="M13.5 9H16V6h-2.5C11.6 6 11 7.2 11 9v1.5H9V13h2v7h3v-7h2.2l.8-2.5H14V9.4c0-.2.2-.4.5-.4Z" />
              </svg>
            </a>
            <a href="https://x.com" aria-label="X" className="hover:text-snow" target="_blank" rel="noreferrer">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                <path d="M14.7 10.3 21 3h-2.2l-5.2 6-4.2-6H3.2l6.6 9.5L3 21h2.2l5.6-6.5 4.6 6.5h6.2l-7-10.7Zm-2 2.3-.6-.9-5.2-7.4h2.2l4.2 6 .6.9 5.5 7.8h-2.2l-4.5-6.4Z" />
              </svg>
            </a>
            <a href="https://instagram.com" aria-label="Instagram" className="hover:text-snow" target="_blank" rel="noreferrer">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                <rect x="4" y="4" width="16" height="16" rx="4" />
                <circle cx="12" cy="12" r="3.5" />
                <circle cx="17.2" cy="6.8" r="0.8" fill="currentColor" stroke="none" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
