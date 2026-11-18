import { stripStega } from '@datocms/content-link';
import { isHeading } from 'datocms-structured-text-utils';
import { useId } from 'react';
import Photo from '@/components/ui/Photo';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import { cn } from '@/utils/cn';
import type { SectionHeadingLevel } from '@/utils/headingLevel';
import { rootNodes } from '@/utils/structuredText';
import DetailText from './DetailText';
import { DetailSectionFragment } from './fragment';
import DetailOverlap from './variants/DetailOverlap';
import DetailPanel from './variants/DetailPanel';

type Props = {
  fragment: FragmentOf<typeof DetailSectionFragment>;
  as?: SectionHeadingLevel;
};

/**
 * `split` (the default; `panel` and `overlap` are in variants/): rich text beside a 5:4 image in two equal columns 88px apart, vertically
 * centred, the image on the side the CMS picks (`imagePosition`: on = image at
 * the end). Below 1024px the text sits above the image. Without an image the
 * text keeps the first column's measure.
 */
const DetailSection = ({ fragment, as = 'h2' }: Props) => {
  const headingId = useId();
  const { details, image, imagePosition, layout } = readFragment(
    DetailSectionFragment,
    fragment,
  );
  const variant = stripStega(layout ?? '').trim();
  if (variant === 'panel') return <DetailPanel fragment={fragment} as={as} />;
  if (variant === 'overlap') {
    return <DetailOverlap fragment={fragment} as={as} />;
  }

  // The document's first heading titles the section
  const title = rootNodes(details?.value).find(isHeading);
  const photo = image?.responsiveImage;
  const imageAtEnd = Boolean(imagePosition);

  return (
    <section
      aria-labelledby={title ? headingId : undefined}
      className="section"
    >
      <div className="container-page grid items-center gap-y-10 lg:grid-cols-2 lg:gap-x-[88px]">
        <div
          className={cn('reveal min-w-0', photo && !imageAtEnd && 'lg:order-2')}
        >
          <DetailText
            details={details}
            as={as}
            title={title}
            headingId={headingId}
          />
        </div>
        {photo && (
          <Photo
            image={photo}
            frame="landscape"
            radius="large"
            focalPoint={image.focalPoint}
            sizes="(min-width: 1184px) 580px, (min-width: 1024px) 50vw, 100vw"
            className={cn('reveal frame-media', !imageAtEnd && 'lg:order-1')}
          />
        )}
      </div>
    </section>
  );
};

export default DetailSection;
