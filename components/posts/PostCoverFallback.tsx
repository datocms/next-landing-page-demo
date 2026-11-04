import { cn } from '@/utils/cn';
import { toneClassFor } from '@/utils/tones';

type Props = {
  /** Text the tone is hashed from (the post title), so a post keeps its colour everywhere */
  seed: string;
};

/** One skeleton text line on the stand-in page */
const SKELETON_LINE = 'block h-[max(3px,2cqw)] rounded-full';

/**
 * Wordless stand-in for a missing cover: a small white "page" on a pale tone
 * field. Fills its (positioned) frame and scales with it through container
 * units, so it reads the same in a small thumb and a full card.
 */
const PostCoverFallback = ({ seed }: Props) => (
  <div
    aria-hidden="true"
    className={cn(
      '@container absolute inset-0 grid place-items-center bg-g-50',
      toneClassFor(seed),
    )}
  >
    <div className="flex h-[52%] w-[64%] flex-col justify-center gap-[max(3px,3cqw)] rounded-[min(10px,4cqw)] border border-line bg-white px-[9cqw] shadow-xs">
      <span className="block size-[max(5px,2.6cqw)] rounded-full bg-tone-grad" />
      <span className={cn(SKELETON_LINE, 'w-[70%] bg-sk')} />
      <span className={cn(SKELETON_LINE, 'w-[90%] bg-sk-2')} />
      <span className={cn(SKELETON_LINE, 'w-[55%] bg-sk')} />
    </div>
  </div>
);

export default PostCoverFallback;
