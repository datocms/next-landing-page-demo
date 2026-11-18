import type { ComponentPropsWithoutRef } from 'react';
import DatoImage from '@/components/datocms/DatoImage';
import { ResponsiveImageFragment } from '@/components/datocms/DatoImage/fragment';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import { cn } from '@/utils/cn';
import { ImageBlockFragment } from './fragment';

type Props = {
  fragment: FragmentOf<typeof ImageBlockFragment>;
  /** Load the image eagerly (the article's lead image, above the fold) */
  priority?: boolean;
} & Omit<ComponentPropsWithoutRef<'figure'>, 'children'>;

/**
 * A media block wider than the text column it sits in: up to 120px past it on
 * each side, never closer than the page gutter to the viewport edge (so on
 * phones it is as wide as the text). The column keeps its place
 */
export const BREAKOUT =
  '[--bleed:clamp(0px,(100vw_-_2_*_var(--gutter)_-_100%)_/_2,120px)] -mx-(--bleed)';

/**
 * How wide a BREAKOUT image is drawn: the column (68ch, 684px) plus 240px from
 * 1024px, the container width below
 */
export const BREAKOUT_SIZES =
  '(min-width: 1024px) 924px, (min-width: 640px) calc(100vw - 48px), calc(100vw - 40px)';

/**
 * An image of the post body, in colour and at its own ratio (the media radius,
 * nothing on top), a little wider than the text, captioned with the asset's
 * title when it has one (the caption stays in the column)
 */
const ImageBlock = ({ fragment, priority, className, ...rest }: Props) => {
  const { image } = readFragment(ImageBlockFragment, fragment);

  if (!image?.responsiveImage) return null;

  const { title } = readFragment(
    ResponsiveImageFragment,
    image.responsiveImage,
  );

  return (
    <figure className={cn('not-prose my-8 lg:my-12', className)} {...rest}>
      <div className={cn('overflow-hidden rounded-media bg-subtle', BREAKOUT)}>
        <DatoImage
          fragment={image.responsiveImage}
          sizes={BREAKOUT_SIZES}
          priority={priority}
        />
      </div>
      {title && (
        <figcaption className="mt-3 text-small text-fg-muted">
          {title}
        </figcaption>
      )}
    </figure>
  );
};

export default ImageBlock;
