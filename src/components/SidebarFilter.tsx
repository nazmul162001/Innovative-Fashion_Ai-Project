import { COLOR_SWATCHES, PRICE_BOUNDS, SIZES, type FilterState, type Fit, type Size } from '../types/product';
import { cn } from '../lib/utils';
import PriceRangeSlider from './PriceRangeSlider';

interface SidebarFilterProps {
  draft: FilterState;
  onChange: (next: FilterState) => void;
  onApply: () => void;
}

const FIT_OPTIONS: { value: Fit; label: string }[] = [
  { value: 'medium', label: 'Medium' },
  { value: 'slim', label: 'Fit' },
  { value: 'relaxed', label: 'Relaxed' },
];

export default function SidebarFilter({ draft, onChange, onApply }: SidebarFilterProps) {
  const toggleSize = (size: Size) => {
    const sizes = draft.sizes.includes(size)
      ? draft.sizes.filter((item) => item !== size)
      : [...draft.sizes, size];
    onChange({ ...draft, sizes });
  };

  const toggleColor = (name: string) => {
    const colors = draft.colors.includes(name)
      ? draft.colors.filter((item) => item !== name)
      : [...draft.colors, name];
    onChange({ ...draft, colors });
  };

  const toggleFit = (fit: Fit) => {
    const fits = draft.fits.includes(fit) ? draft.fits.filter((item) => item !== fit) : [...draft.fits, fit];
    onChange({ ...draft, fits });
  };

  return (
    <aside className="dark-card-glow rounded-2xl p-5">
      <FilterLabel>Price</FilterLabel>
      <PriceRangeSlider
        min={PRICE_BOUNDS.min}
        max={PRICE_BOUNDS.max}
        value={draft.price}
        onChange={(price) => onChange({ ...draft, price })}
      />

      <FilterLabel className="mt-6">Color</FilterLabel>
      <div className="mt-3 flex flex-wrap gap-2.5">
        {COLOR_SWATCHES.map((swatch) => {
          const selected = draft.colors.includes(swatch.name);
          return (
            <button
              key={swatch.name}
              type="button"
              aria-label={swatch.name}
              aria-pressed={selected}
              onClick={() => toggleColor(swatch.name)}
              className={cn(
                'h-7 w-7 rounded-full border-2 transition',
                selected ? 'border-accent-cyan scale-110' : 'border-transparent',
              )}
              style={{ backgroundColor: swatch.hex }}
            />
          );
        })}
      </div>

      <FilterLabel className="mt-6">Size</FilterLabel>
      <div className="mt-3 grid grid-cols-4 gap-2">
        {SIZES.map((size) => {
          const selected = draft.sizes.includes(size);
          return (
            <button
              key={size}
              type="button"
              onClick={() => toggleSize(size)}
              className={cn(
                'rounded-lg border py-2 text-xs font-medium transition',
                selected
                  ? 'border-accent-blue bg-accent-blue text-white'
                  : 'border-dark-border bg-dark-surface text-fog hover:border-white/25',
              )}
            >
              {size}
            </button>
          );
        })}
      </div>

      <FilterLabel className="mt-6">Fit</FilterLabel>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {FIT_OPTIONS.map((option) => {
          const selected = draft.fits.includes(option.value);
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => toggleFit(option.value)}
              className={cn(
                'rounded-lg border py-2 text-xs font-medium transition',
                selected
                  ? 'border-accent-blue bg-accent-blue text-white'
                  : 'border-dark-border bg-dark-surface text-fog hover:border-white/25',
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={onApply}
        className="mt-7 w-full rounded-xl bg-accent-blue py-3 text-sm font-semibold tracking-wide text-white transition hover:bg-signal-deep"
      >
        Apply Filters
      </button>
    </aside>
  );
}

function FilterLabel({ children, className }: { children: string; className?: string }) {
  return <p className={cn('text-sm font-medium text-snow', className)}>{children}</p>;
}
