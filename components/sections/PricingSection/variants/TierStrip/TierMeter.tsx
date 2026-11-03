import { planTone } from '@/components/sections/PricingSection/plans';
import { cn } from '@/utils/cn';

type Props = {
  /** 0-based position of the plan */
  rank: number;
  total: number;
  className?: string;
};

const MAX_BARS = 5;

/**
 * A wordless signal-strength meter: up to five rising bars, filled up to the
 * plan's rank (Lite 1, Basic 2, Plus 3), each filled bar a deeper tone.
 */
const TierMeter = ({ rank, total, className }: Props) => {
  const barCount = Math.max(1, Math.min(total, MAX_BARS));
  // The plan's rank scaled onto the bars, so the last plan fills them all
  const lastFilledBar = Math.round(
    (rank * (barCount - 1)) / Math.max(1, total - 1),
  );
  const bars = Array.from({ length: barCount }, (_, i) => ({
    key: `bar-${i}`,
    // 6px to 16px, rising left to right
    height: barCount === 1 ? 10 : 6 + (i * 10) / (barCount - 1),
    filled: i <= lastFilledBar,
    tone: planTone(i, barCount),
  }));

  return (
    <span
      aria-hidden="true"
      className={cn('flex h-4 items-end gap-[3px]', className)}
    >
      {bars.map((bar) => (
        <span
          key={bar.key}
          className={cn(
            'block w-1 rounded-full',
            bar.filled ? cn(bar.tone, 'bg-tone') : 'bg-line',
          )}
          style={{ height: `${bar.height}px` }}
        />
      ))}
    </span>
  );
};

export default TierMeter;
