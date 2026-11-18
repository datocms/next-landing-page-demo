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
 * `panel` (the statement page's look): a flat pale panel. The text sits in one
 * half, its checklist plain; in the other half the image rises from the
 * panel's bottom edge as an arch, two faint arch outlines behind it, as the
 * arches rise from the statement hero (`imagePosition` on: the image at the
 * end). Below 1024px the arch stands under the text.
 */
const DetailPanel = ({ fragment, as = 'h2' }: Props) => {
  const headingId = useId();
  const { details, tall, imagePosition } = readFragment(
    DetailSectionFragment,
    fragment,
  );
  const title = rootNodes(details?.value).find(isHeading);
  const photo = tall?.responsiveImage;
  const imageAtEnd = Boolean(imagePosition);
  const focal = tall?.focalPoint;

  return (
    <section
      aria-labelledby={title ? headingId : undefined}
      className="panel overflow-hidden bg-subtle"
    >
      <div className="container-page grid gap-x-16 lg:min-h-[40rem] lg:grid-cols-2">
        <div
          className={cn(
            'flex min-w-0 items-center pt-14 sm:pt-16 lg:py-24',
            !photo && 'pb-14 sm:pb-16',
            !imageAtEnd && 'lg:order-2',
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
            className="relative isolate flex items-end justify-center pt-14 lg:pt-16"
          >
            <span className="absolute bottom-0 left-1/2 -z-10 h-[calc(100%-2rem)] w-[min(34rem,96%)] -translate-x-1/2 rounded-t-full border border-[color:var(--accent-line)] border-b-0 opacity-70" />
            <span className="absolute bottom-0 left-1/2 -z-10 h-[calc(100%-4.75rem)] w-[min(27rem,82%)] -translate-x-1/2 rounded-t-full border border-[color:var(--accent-line)] border-b-0" />
            <div
              data-detail-image=""
              className="relative h-[24rem] w-[min(21rem,72%)] overflow-hidden rounded-t-full bg-tint sm:h-[28rem] lg:h-[32rem]"
            >
              <DatoImage
                fragment={photo}
                alt=""
                layout="fill"
                objectFit="cover"
                objectPosition={
                  focal ? `${focal.x * 100}% ${focal.y * 100}%` : undefined
                }
                sizes="(min-width: 1024px) 340px, 72vw"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default DetailPanel;
