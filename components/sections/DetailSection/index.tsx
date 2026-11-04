import { isHeading } from 'datocms-structured-text-utils';
import { useId } from 'react';
import DatoImage from '@/components/datocms/DatoImage';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import { cn } from '@/utils/cn';
import type { SectionHeadingLevel } from '@/utils/headingLevel';
import { rootNodes } from '@/utils/structuredText';
import ChatCard from './ChatCard';
import DetailCopy from './DetailCopy';
import { DetailSectionFragment } from './fragment';
import RingCard from './RingCard';

type Props = {
  fragment: FragmentOf<typeof DetailSectionFragment>;
  as?: SectionHeadingLevel;
};

/**
 * One renderer, two content modes, picked from the Structured Text:
 * - one top-level heading: a title, copy and a pill cloud beside a photo with
 *   a progress ring badge;
 * - several top-level headings (stacked): a short stack of points, each
 *   marked with a tone shape, beside a taller photo with a chat card.
 * The photo side follows the CMS `imagePosition` (true = inline end).
 */
const DetailSection = ({ fragment, as = 'h2' }: Props) => {
  const { details, image, imagePosition } = readFragment(
    DetailSectionFragment,
    fragment,
  );
  const headingId = `detail-${useId()}`;

  const topHeadings = rootNodes(details?.value).filter(
    (node) => isHeading(node) && node.level <= 2,
  );
  const stacked = topHeadings.length > 1;
  // When the section opens a page, its first top-level heading is the page h1
  const pageTitle = as === 'h1' ? topHeadings[0] : undefined;
  // A single top-level heading is the section's title; stacked headings are peers
  const hasTitle = topHeadings.length === 1;

  const photo = image?.responsiveImage;
  const photoAtEnd = Boolean(imagePosition);

  const copy = (
    <DetailCopy
      details={details}
      topHeadings={topHeadings}
      pageTitle={pageTitle}
      stacked={stacked}
      headingId={headingId}
    />
  );

  if (!photo) {
    return (
      <section
        className="section"
        aria-labelledby={hasTitle ? headingId : undefined}
      >
        <div className="container-page">
          <div className="reveal lg:max-w-[792px]">{copy}</div>
        </div>
      </section>
    );
  }

  if (stacked) {
    return (
      <section className="section">
        <div className="container-page grid items-center lg:grid-cols-12 lg:gap-x-6">
          <div
            className={cn(
              'reveal-stagger relative max-w-[640px] lg:col-span-5 lg:row-start-1 lg:max-w-none',
              photoAtEnd ? 'lg:col-start-8' : 'lg:col-start-1',
            )}
          >
            <div className="photo aspect-[4/3] rounded-photo lg:aspect-auto lg:h-[384px]">
              <DatoImage
                fragment={photo}
                layout="fill"
                objectFit="cover"
                objectPosition="50% 45%"
                sizes="(min-width: 1024px) 486px, (min-width: 768px) 640px, 100vw"
              />
            </div>
            <ChatCard
              className={cn(
                'absolute right-3 -bottom-7 z-[2] md:-right-7 md:bottom-8',
                photoAtEnd && 'lg:right-auto lg:-left-7',
              )}
            />
          </div>
          <div
            className={cn(
              'reveal mt-14 max-w-[640px] md:mt-12 lg:col-span-6 lg:row-start-1 lg:mt-0 lg:max-w-none',
              photoAtEnd ? 'lg:col-start-1' : 'lg:col-start-7',
            )}
          >
            {copy}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="section"
      aria-labelledby={hasTitle ? headingId : undefined}
    >
      <div className="container-page grid items-center lg:grid-cols-12 lg:gap-x-6">
        <div
          className={cn(
            'reveal max-w-[620px] lg:col-span-5 lg:row-start-1 lg:max-w-none',
            photoAtEnd ? 'lg:col-start-1' : 'lg:col-start-8',
          )}
        >
          {copy}
        </div>
        <div
          className={cn(
            'reveal-stagger relative mt-8 max-w-[640px] md:mt-10 lg:col-span-5 lg:row-start-1 lg:mt-0 lg:max-w-none',
            photoAtEnd ? 'lg:col-start-8' : 'lg:col-start-1',
          )}
        >
          <div className="photo aspect-[3/2] rounded-photo md:aspect-[16/10]">
            <DatoImage
              fragment={photo}
              layout="fill"
              objectFit="cover"
              objectPosition="50% 50%"
              sizes="(min-width: 1024px) 486px, (min-width: 768px) 640px, 100vw"
            />
          </div>
          <RingCard
            className={cn(
              'absolute right-3 -bottom-6 z-[2] md:top-7 md:bottom-auto',
              photoAtEnd
                ? 'md:right-auto md:-left-5'
                : 'md:right-auto md:-left-5 lg:right-[-20px] lg:left-auto',
            )}
          />
        </div>
      </div>
    </section>
  );
};

export default DetailSection;
