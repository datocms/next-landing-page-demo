import type { ComponentPropsWithoutRef } from 'react';
import DatoImage from '@/components/datocms/DatoImage';
import { ResponsiveImageFragment } from '@/components/datocms/DatoImage/fragment';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import { ImageBlockFragment } from './fragment';

type Props = {
  fragment: FragmentOf<typeof ImageBlockFragment>;
  /** Load the image eagerly (the article's lead image, above the fold) */
  priority?: boolean;
} & Omit<ComponentPropsWithoutRef<'figure'>, 'children'>;

/**
 * In-article image, wider than the reading column from 1024 up, captioned with
 * the image's title. It renders a single root so content-link props can be
 * cloned onto it.
 */
const ImageBlock = ({ fragment, priority, ...rest }: Props) => {
  const { image } = readFragment(ImageBlockFragment, fragment);

  if (!image?.responsiveImage) return null;

  const { title } = readFragment(
    ResponsiveImageFragment,
    image.responsiveImage,
  );

  return (
    <figure className="prose-block not-prose my-10 lg:-mx-20" {...rest}>
      {/* A capped 16:10 frame: landscape uploads fill it and portrait ones can't run tall */}
      <div className="photo aspect-[16/10] max-h-[520px] rounded-card max-md:rounded-zone">
        <DatoImage
          fragment={image.responsiveImage}
          layout="fill"
          objectFit="cover"
          objectPosition="50% 50%"
          sizes="(min-width: 1024px) 840px, 100vw"
          priority={priority}
        />
      </div>
      {title && <figcaption className="mono mt-3">{title}</figcaption>}
    </figure>
  );
};

export default ImageBlock;
