'use client';

import { stripStega } from '@datocms/content-link';
import { type KeyboardEvent, useId } from 'react';
import type { ItemHeadingLevel } from '@/utils/headingLevel';
import CoverStack from './CoverStack';
import Slide from './Slide';
import SlideControls from './SlideControls';
import type { SpotlightLabels, SpotlightPost } from './types';
import { useSlideIndex } from './useSlideIndex';

type Props = {
  posts: SpotlightPost[];
  labels: SpotlightLabels;
  /** Post titles sit one level under the section head */
  headingLevel: ItemHeadingLevel;
  /** Id of the section heading, which then names the carousel */
  labelledBy?: string;
};

/** Fills the {n} and {total} placeholders of the "slide of" label */
const slidePosition = (template: string, n: number, total: number) =>
  template.replace('{n}', String(n)).replace('{total}', String(total));

/**
 * One post at a time: its cover in a bezel beside its story. All slides share
 * one grid cell, so the controls never move when the copy length changes.
 * Without JS the first slide is complete and usable.
 */
const SpotlightSlides = ({
  posts,
  labels,
  headingLevel,
  labelledBy,
}: Props) => {
  const count = posts.length;
  const { activeIndex, hasInteracted, slidesRef, step } = useSlideIndex(count);
  const slidesId = useId();
  const activePost = posts[activeIndex];

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') {
      return;
    }
    event.preventDefault();
    const isRtl = getComputedStyle(event.currentTarget).direction === 'rtl';
    step((event.key === 'ArrowRight') !== isRtl ? 1 : -1);
  };

  return (
    // A group, not a landmark: the section around it is already the region
    // biome-ignore lint/a11y/useSemanticElements: an ARIA carousel is a group, not a fieldset
    <div
      role="group"
      aria-roledescription={labels.carouselRole}
      aria-labelledby={labelledBy}
      aria-label={labelledBy ? undefined : labels.carousel}
      onKeyDown={handleKeyDown}
      className="grid gap-x-6 lg:grid-cols-12 lg:items-stretch"
    >
      <div className="bezel self-start lg:col-span-7 lg:col-start-6 lg:row-start-1">
        <CoverStack posts={posts} activeIndex={activeIndex} />
      </div>

      <div className="flex min-w-0 flex-col max-lg:mt-7 max-lg:max-w-[560px] lg:col-span-5 lg:row-start-1 lg:pt-2">
        <div id={slidesId} ref={slidesRef} className="grid">
          {posts.map((post, index) => (
            <Slide
              key={post.id}
              post={post}
              isActive={index === activeIndex}
              label={slidePosition(labels.slideOf, index + 1, count)}
              roleDescription={labels.slideRole}
              readMoreLabel={labels.readMore}
              headingLevel={headingLevel}
            />
          ))}
        </div>

        {count > 1 && (
          <SlideControls
            count={count}
            activeIndex={activeIndex}
            slidesId={slidesId}
            previousLabel={labels.previous}
            nextLabel={labels.next}
            onStep={step}
          />
        )}

        <p className="sr-only" aria-live="polite" aria-atomic="true">
          {hasInteracted
            ? `${slidePosition(labels.slideOf, activeIndex + 1, count)}: ${stripStega(activePost.title)}`
            : ''}
        </p>
      </div>
    </div>
  );
};

export default SpotlightSlides;
