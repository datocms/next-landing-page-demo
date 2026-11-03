import { cn } from '@/utils/cn';

type Props = {
  /** Number of segments, 2–12 (anything else renders nothing) */
  count: number;
  /** The lit segment, or the lit range [first, last] (inclusive) */
  active: number | readonly [number, number];
  /** Placement only */
  className?: string;
};

/** Stable keys for the at most 12 segments */
const SEGMENT_KEYS = Array.from({ length: 12 }, (_, index) => `seg${index}`);

/**
 * Progress segments that together read as one --grad-line sweep cut into
 * pieces (carousels, galleries). Decorative: pair it with a text counter or a
 * live region. No hooks, so client islands can import it.
 */
const Segments = ({ count, active, className }: Props) => {
  if (count < 2 || count > 12) {
    return null;
  }

  const [first, last] = typeof active === 'number' ? [active, active] : active;

  return (
    <span aria-hidden="true" className={cn('flex gap-1', className)}>
      {SEGMENT_KEYS.slice(0, count).map((key, index) => (
        <i
          key={key}
          className="block h-[3px] w-7 rounded-[2px] bg-no-repeat transition-opacity duration-200"
          // One sweep spans the whole row (28px segments, 4px gaps): each segment shows its own slice
          style={{
            backgroundImage: 'var(--grad-line)',
            backgroundSize: `${count * 32 - 4}px 100%`,
            backgroundPosition: `${-32 * index}px 0`,
            opacity: index >= first && index <= last ? 1 : 0.25,
          }}
        />
      ))}
    </span>
  );
};

export default Segments;
