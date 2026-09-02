import { cn, formatPrice } from '../lib/utils';

interface PriceRangeSliderProps {
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
}

export default function PriceRangeSlider({ min, max, value, onChange }: PriceRangeSliderProps) {
  const [from, to] = value;
  const span = max - min;
  const left = ((from - min) / span) * 100;
  const right = ((to - min) / span) * 100;

  return (
    <div className="pt-3">
      <div className="relative h-5">
        <div className="absolute top-1/2 right-0 left-0 h-1 -translate-y-1/2 rounded-full bg-white/10" />
        <div
          className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-accent-blue"
          style={{ left: `${left}%`, width: `${right - left}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={from}
          aria-label="Minimum price"
          onChange={(event) => {
            const next = Math.min(Number(event.target.value), to - 1);
            onChange([next, to]);
          }}
          className="absolute inset-0 z-10 w-full cursor-pointer"
        />
        <input
          type="range"
          min={min}
          max={max}
          value={to}
          aria-label="Maximum price"
          onChange={(event) => {
            const next = Math.max(Number(event.target.value), from + 1);
            onChange([from, next]);
          }}
          className="absolute inset-0 z-20 w-full cursor-pointer"
        />
      </div>
      <div className="mt-2 flex justify-between text-xs text-mist">
        <span className={cn('tabular-nums')}>{formatPrice(from)}</span>
        <span className="tabular-nums">{formatPrice(to)}</span>
      </div>
    </div>
  );
}
