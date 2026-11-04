import { cn } from '@/utils/cn';
import { formatDate } from '@/utils/formatDate';
import { toneClassFor } from '@/utils/tones';

type Props = {
  /** Raw CMS tag (stega kept for visual editing); its tone is hashed on the visible text */
  tag?: string | null;
  /** Raw CMS date or datetime */
  date?: string | null;
  /** Chip above the date, right-aligned (the side column of index rows) */
  stack?: boolean;
  /** Placement only */
  className?: string;
};

/** Tag chip + mono date, the meta row shared by every post card. Renders nothing when both are missing. */
const PostMeta = ({ tag, date, stack = false, className }: Props) => {
  const formattedDate = date ? formatDate(date) : null;

  if (!tag && !formattedDate) {
    return null;
  }

  return (
    <div
      className={cn(
        stack
          ? 'flex flex-col items-end gap-2'
          : 'flex flex-wrap items-center gap-x-2.5 gap-y-1.5',
        className,
      )}
    >
      {tag && <span className={cn('chip', toneClassFor(tag))}>{tag}</span>}
      {formattedDate && (
        <time dateTime={formattedDate.iso} className="mono whitespace-nowrap">
          {formattedDate.label}
        </time>
      )}
    </div>
  );
};

export default PostMeta;
