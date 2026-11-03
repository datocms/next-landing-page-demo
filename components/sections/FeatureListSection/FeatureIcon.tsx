import DatoImage from '@/components/datocms/DatoImage';
import type { ResponsiveImageFragment } from '@/components/datocms/DatoImage/fragment';
import type { FragmentOf } from '@/lib/datocms/graphql';
import { cn } from '@/utils/cn';

type Props = {
  /** The feature's CMS icon (featureIcon.responsiveImage) */
  image?: FragmentOf<typeof ResponsiveImageFragment> | null;
  /** sm: 24px, beside a card title; md: 40px (36 below 768), leading a list row */
  size?: 'sm' | 'md';
};

/** Tile size and radius for each size */
const TILE = {
  sm: 'size-6 rounded-[7px]',
  md: 'size-10 rounded-[12px] max-md:size-9',
} as const;

/**
 * The CMS feature icon in a small framed tile. The art is tinted to the
 * nearest tone-N (its luminosity over the tone colour), so icons drawn in
 * any colour follow the CMS accent like the rest of the page. Without an icon
 * it falls back to the tone dot, so a title row never loses its mark.
 */
const FeatureIcon = ({ image, size = 'sm' }: Props) => {
  if (!image && size === 'sm') {
    return <span aria-hidden="true" className="dot" />;
  }

  // The md dot keeps the tile's footprint, so list rows stay aligned
  if (!image) {
    return (
      <span
        aria-hidden="true"
        className="grid size-10 shrink-0 place-items-center max-md:size-9"
      >
        <span className="dot" />
      </span>
    );
  }

  // A div, not a span: DatoImage renders block-level wrappers inside
  return (
    <div
      className={cn(
        'relative isolate shrink-0 overflow-hidden bg-tone ring-1 ring-line [&_img]:mix-blend-luminosity',
        TILE[size],
      )}
    >
      <DatoImage
        fragment={image}
        layout="fill"
        objectFit="cover"
        sizes={size === 'sm' ? '24px' : '40px'}
      />
    </div>
  );
};

export default FeatureIcon;
