import { DatoInlineImage } from '@/components/datocms/DatoImage';
import type { ResponsiveImageFragment } from '@/components/datocms/DatoImage/fragment';
import type { FragmentOf } from '@/lib/datocms/graphql';
import { cn } from '@/utils/cn';
import { initialsOf } from '@/utils/initialsOf';

export type AvatarSize = 20 | 24 | 32 | 40 | 48 | 56;

type Props = {
  /** The person's `responsiveImage`, cropped square */
  image?: FragmentOf<typeof ResponsiveImageFragment> | null;
  /** Their name: its initials stand in for a missing picture. Raw CMS value */
  name: string;
  /** Diameter in px */
  size?: AvatarSize;
  /** Placement only */
  className?: string;
};

// Literal classes: Tailwind only generates what it can read
const SIZE: Record<AvatarSize, string> = {
  20: 'size-5 text-[8px]',
  24: 'size-6 text-[9px]',
  32: 'size-8 text-[11px]',
  40: 'size-10 text-small',
  48: 'size-12 text-small',
  56: 'size-14 text-body',
};

/**
 * A round portrait. Decorative: it always sits next to the
 * person's name, so its alt text is empty. Without a picture it shows the
 * name's initials on a subtle disc.
 */
const Avatar = ({ image, name, size = 32, className }: Props) => (
  <span
    className={cn(
      'inline-grid shrink-0 place-items-center overflow-hidden rounded-full bg-subtle font-medium text-fg-muted leading-none ring-1 ring-line',
      SIZE[size],
      className,
    )}
  >
    {image ? (
      <DatoInlineImage fragment={image} alt="" sizes={`${size}px`} />
    ) : (
      <span aria-hidden="true">{initialsOf(name)}</span>
    )}
  </span>
);

export default Avatar;
