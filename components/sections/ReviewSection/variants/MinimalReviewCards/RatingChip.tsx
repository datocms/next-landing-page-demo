import SpokenRating from '@/components/sections/ReviewSection/SpokenRating';
import { cn } from '@/utils/cn';

type Props = {
  /** Whole stars, from clampRating */
  value: number;
  locale: string;
  className?: string;
};

/** A small mono "5.0" chip in the corner of a review cell. Nothing for 0 */
const RatingChip = ({ value, locale, className }: Props) =>
  value > 0 ? (
    <>
      <span
        aria-hidden="true"
        className={cn(
          'inline-grid h-[22px] shrink-0 place-items-center rounded-[6px] border border-line bg-well px-2 font-mono text-[11.5px] leading-none text-ink-2 tabular-nums',
          className,
        )}
      >
        {value}.0
      </span>
      <SpokenRating value={value} locale={locale} />
    </>
  ) : null;

export default RatingChip;
