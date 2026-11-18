import Image from 'next/image';
import { DatoInlineImage } from '@/components/datocms/DatoImage';
import type { ResponsiveImageFragment } from '@/components/datocms/DatoImage/fragment';
import type { FragmentOf } from '@/lib/datocms/graphql';
import { cn } from '@/utils/cn';

/** A CMS icon as the Features block queries it */
export type CmsIcon = {
  url: string;
  format?: string | null;
  width?: number | null;
  height?: number | null;
  /** Bitmaps only: SVG files have none */
  responsiveImage?: FragmentOf<typeof ResponsiveImageFragment> | null;
};

type Props = {
  icon?: CmsIcon | null;
  /** md: 40px tile. sm: 32px tile, for the compact cards */
  size?: 'md' | 'sm';
  /** Placement only */
  className?: string;
};

/**
 * A CMS icon in a flat tile filled with the pale accent tint. Decorative: a title
 * always sits next to it. Nothing renders without an icon.
 */
const FeatureIcon = ({ icon, size = 'md', className }: Props) => {
  if (!icon?.url) return null;

  return (
    <span
      aria-hidden="true"
      className={cn(
        'grid shrink-0 place-items-center bg-accent-soft',
        size === 'sm' ? 'size-8 rounded-[8px]' : 'size-10 rounded-[10px]',
        className,
      )}
    >
      {icon.responsiveImage ? (
        <span
          className={cn(
            'relative block overflow-hidden',
            size === 'sm' ? 'size-4' : 'size-5',
          )}
        >
          <DatoInlineImage
            fragment={icon.responsiveImage}
            alt=""
            sizes="20px"
          />
        </span>
      ) : (
        <Image
          src={icon.url}
          alt=""
          width={icon.width ?? 26}
          height={icon.height ?? 26}
          className={cn(
            'object-contain',
            size === 'sm' ? 'size-5' : 'size-6.5',
          )}
        />
      )}
    </span>
  );
};

export default FeatureIcon;
