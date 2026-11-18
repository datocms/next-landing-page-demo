import Photo from '@/components/ui/Photo';
import type { ResultOf } from '@/lib/datocms/graphql';
import { cn } from '@/utils/cn';
import type { AboutIntroFragment } from './fragment';

type Props = {
  images: ResultOf<typeof AboutIntroFragment>['images'];
  /** The block opens the page: the first photo loads eagerly */
  leadsPage: boolean;
  className?: string;
};

/**
 * Up to three of the CMS photos in a row of equal 4:3 frames, in colour, with
 * the media radius (24px). On
 * phones the first one takes the full width and the other two share the row
 * under it; one or two photos split the row in halves. Renders nothing when
 * no image has a responsive version.
 */
const PhotoStrip = ({ images, leadsPage, className }: Props) => {
  const photos = images.filter((image) => image.responsiveImage).slice(0, 3);
  if (photos.length === 0) return null;

  const three = photos.length === 3;

  return (
    <div
      className={cn(
        'grid grid-cols-2 gap-[18px]',
        three ? 'sm:grid-cols-3' : 'sm:grid-cols-2',
        className,
      )}
    >
      {photos.map((image, index) =>
        image.responsiveImage ? (
          <Photo
            key={image.id}
            image={image.responsiveImage}
            frame="detail"
            radius="card"
            focalPoint={image.focalPoint}
            priority={leadsPage && index === 0}
            sizes={
              three
                ? `(min-width: 1264px) 384px, (min-width: 640px) 32vw, ${index === 0 ? '100vw' : '50vw'}`
                : '(min-width: 1264px) 588px, (min-width: 640px) 50vw, 100vw'
            }
            className={cn(
              (index === 0 && three) || photos.length === 1
                ? 'max-sm:col-span-2'
                : undefined,
              photos.length === 1 && 'sm:col-span-2',
            )}
          />
        ) : null,
      )}
    </div>
  );
};

export default PhotoStrip;
