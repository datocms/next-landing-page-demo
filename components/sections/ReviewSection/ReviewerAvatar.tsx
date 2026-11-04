import { RSCImage } from 'react-datocms/rsc-image';
import { ResponsiveImageFragment } from '@/components/datocms/DatoImage/fragment';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import { cn } from '@/utils/cn';
import { initialsOf } from '@/utils/initialsOf';

type Props = {
  image?: FragmentOf<typeof ResponsiveImageFragment> | null;
  name: string;
  /** Rendered size in px, used as the image `sizes` hint (and for the square radius) */
  size: number;
  /** Size classes, for example `size-10` */
  className: string;
  /** round (default) or a softly squared tile */
  shape?: 'round' | 'square';
};

// The plain <picture>/<img> renderer stretched over the frame
const imgStyle = {
  width: '100%',
  height: '100%',
  maxWidth: 'none',
  aspectRatio: 'auto',
  objectFit: 'cover',
  objectPosition: '50% 30%',
  filter: 'saturate(.95) contrast(1.03)',
} as const;

const squareRadius = (size: number) =>
  size >= 40 ? 'rounded-[12px]' : 'rounded-[10px]';

/**
 * Reviewer photo in a neutral frame with a hairline ring. Falls back to the
 * reviewer's initials when the CMS image is missing, so rows keep their
 * alignment.
 *
 * Only phrasing elements (<span>, <picture>, <img>) are rendered, so the
 * avatar is valid inside buttons, links and inline text.
 */
const ReviewerAvatar = ({
  image,
  name,
  size,
  className,
  shape = 'round',
}: Props) => (
  <span
    className={cn(
      'relative block shrink-0 overflow-hidden bg-surface after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:shadow-[inset_0_0_0_1px_var(--photo-ring)]',
      shape === 'round' ? 'rounded-full' : squareRadius(size),
      className,
    )}
  >
    {image ? (
      <RSCImage
        data={readFragment(ResponsiveImageFragment, image)}
        sizes={`${size}px`}
        pictureClassName="block size-full"
        imgStyle={imgStyle}
      />
    ) : (
      <span
        aria-hidden="true"
        className="grid size-full place-items-center bg-well font-sans text-meta font-medium text-ink-2"
      >
        {initialsOf(name)}
      </span>
    )}
  </span>
);

export default ReviewerAvatar;
