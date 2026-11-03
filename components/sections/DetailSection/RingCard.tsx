import { Check } from 'lucide-react';
import { cn } from '@/utils/cn';

type Props = {
  /** Placement (absolute offsets) */
  className?: string;
};

/** Wordless progress badge pinned to the Detail photo: a full accent ring around a check. Decorative */
const RingCard = ({ className }: Props) => (
  <div
    aria-hidden="true"
    className={cn(
      'float grid size-16 place-items-center rounded-full md:size-[76px]',
      className,
    )}
  >
    <span className="ring-progress size-11 [grid-area:1/1] md:size-[52px]" />
    <Check strokeWidth={2.5} className="size-4 text-ink [grid-area:1/1]" />
  </div>
);

export default RingCard;
