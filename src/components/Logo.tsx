import { cn } from '../lib/utils';
import { BRAND } from '../lib/brand';

interface LogoProps {
  className?: string;
  compact?: boolean;
}

export default function Logo({ className, compact = false }: LogoProps) {
  return (
    <a href="/" className={cn('group flex min-w-0 items-center gap-2', className)} aria-label={`${BRAND.name} home`}>
      <span className="relative grid h-8 w-8 shrink-0 place-items-center overflow-hidden rounded-lg border border-dark-border bg-dark-surface">
        <svg viewBox="0 0 32 32" className="h-8 w-8" fill="none" aria-hidden="true">
          <rect x="10" y="7.5" width="12" height="2.4" rx="1.2" fill="currentColor" />
          <rect x="14" y="9" width="4" height="14" rx="1.2" fill="currentColor" />
          <rect x="10" y="22.1" width="12" height="2.4" rx="1.2" fill="currentColor" />
          <path
            d="M22.5 10.5c2.8 2.6 3 8.2-.6 11.5"
            stroke="#38BDF8"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
        </svg>
      </span>
      {compact ? null : (
        <span className="truncate text-[12px] font-semibold tracking-[0.14em] text-snow uppercase sm:text-[13px] sm:tracking-[0.16em]">
          <span className="sm:hidden">{BRAND.short}</span>
          <span className="hidden sm:inline">{BRAND.name}</span>
        </span>
      )}
    </a>
  );
}
