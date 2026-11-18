import { isHeading } from 'datocms-structured-text-utils';
import { useId } from 'react';
import DatoImage from '@/components/datocms/DatoImage';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import { cn } from '@/utils/cn';
import type { SectionHeadingLevel } from '@/utils/headingLevel';
import { rootNodes } from '@/utils/structuredText';
import DetailText from '../DetailText';
import { DetailSectionFragment } from '../fragment';

type Props = {
  fragment: FragmentOf<typeof DetailSectionFragment>;
  as?: SectionHeadingLevel;
};

/**
 * `overlap` (the mosaic page's look): a slice of the mosaic hero, two tiles
 * on its 12px gap: the text on a pale tile, its checklist plain, and the image
 * with its outer top corner cut as a quarter circle, like the hero's large
 * image (`imagePosition` on: the image at the end). Below 1024px the image
 * comes first.
 */
const DetailOverlap = ({ fragment, as = 'h2' }: Props) => {
  const headingId = useId();
  const { details, image, imagePosition } = readFragment(
    DetailSectionFragment,
    fragment,
  );
  const title = rootNodes(details?.value).find(isHeading);
  const photo = image?.responsiveImage;
  const imageAtEnd = Boolean(imagePosition);
  const focal = image?.focalPoint;

  return (
    <section
      aria-labelledby={title ? headingId : undefined}
      className="section"
    >
      <div
        className={cn(
          'container-page grid gap-2.5 lg:min-h-[34rem] lg:gap-3',
          photo && 'lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]',
        )}
      >
        <div
          className={cn(
            'reveal flex min-w-0 items-center rounded-card bg-subtle p-7 sm:p-10 lg:p-14',
            !imageAtEnd && 'lg:order-2',
            photo && 'max-lg:order-2',
          )}
        >
          <DetailText
            details={details}
            as={as}
            title={title}
            headingId={headingId}
            checklist="plain"
            className="max-w-[30rem]"
          />
        </div>
        {photo && (
          <div
            aria-hidden="true"
            className={cn(
              'reveal relative min-h-[18rem] overflow-hidden rounded-card bg-tint max-lg:order-1 sm:min-h-[24rem] [--reveal-delay:80ms]',
              imageAtEnd
                ? 'rounded-tr-[min(16rem,50%)]'
                : 'rounded-tl-[min(16rem,50%)] lg:order-1',
            )}
          >
            <DatoImage
              fragment={photo}
              alt=""
              layout="fill"
              objectFit="cover"
              objectPosition={
                focal ? `${focal.x * 100}% ${focal.y * 100}%` : undefined
              }
              sizes="(min-width: 1184px) 660px, (min-width: 1024px) 58vw, 100vw"
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default DetailOverlap;
