'use client';

import { ArrowLeft, ArrowRight } from 'lucide-react';
import { type ReactNode, useId } from 'react';
import Segments from '@/components/ui/Ornaments/Segments';
import { uiString } from '@/lib/i18n/uiStrings';
import { twoDigits } from '@/utils/twoDigits';
import { useGalleryView } from './useGalleryView';

type Props = {
  /** The server-rendered section head (SectionTitle with gap="none") */
  heading: ReactNode;
  /** Accessible name of the scroll region (stega-free) */
  label: string;
  /** Number of cards in `children` */
  count: number;
  /** The server-rendered `<li>` cards */
  children: ReactNode;
  locale: string;
};

/**
 * The gallery's interactive shell: a head row with a counter and arrows, a
 * native scroll-snap track that bleeds off the right edge, and a segmented
 * progress. Without JS the track still scrolls (keyboard, touch, shift-wheel)
 * and shows "01 / 0N"; with JS the counter and segments follow the fully
 * visible cards and the arrows move exactly one card.
 */
const GalleryScroller = ({
  heading,
  label,
  count,
  children,
  locale,
}: Props) => {
  const trackId = useId();
  const { trackRef, view, scrollByCard } = useGalleryView();

  const visibleRange =
    view.first === view.last
      ? twoDigits(view.first + 1)
      : `${twoDigits(view.first + 1)}–${twoDigits(view.last + 1)}`;
  const total = twoDigits(count);
  const hasControls = count > 1;

  return (
    <>
      <div className="container-page grid-page items-end gap-y-5">
        <div className="col-span-full lg:col-span-9 min-[80rem]:col-span-7">
          {heading}
        </div>
        {hasControls && (
          <div
            hidden={view.fitsAll}
            className="reveal col-span-full flex items-center gap-3.5 justify-self-start max-md:w-full lg:col-span-3 lg:col-start-10 lg:justify-self-end min-[80rem]:col-span-4 min-[80rem]:col-start-9"
          >
            <span aria-hidden="true" className="mono me-1 max-md:me-auto">
              <b className="font-normal text-ink">{visibleRange}</b> / {total}
            </span>
            <button
              type="button"
              className="btn btn-secondary btn-icon"
              aria-label={uiString(locale, 'previousFeature')}
              aria-controls={trackId}
              aria-disabled={view.atStart}
              onClick={() => scrollByCard(-1)}
            >
              <ArrowLeft aria-hidden="true" className="rtl:rotate-180" />
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-icon"
              aria-label={uiString(locale, 'nextFeature')}
              aria-controls={trackId}
              aria-disabled={view.atEnd}
              onClick={() => scrollByCard(1)}
            >
              <ArrowRight aria-hidden="true" className="rtl:rotate-180" />
            </button>
          </div>
        )}
      </div>

      {/* biome-ignore lint/a11y/useSemanticElements: a labelled scroll region inside the section, not a section of its own */}
      <div
        ref={trackRef}
        id={trackId}
        role="region"
        aria-label={label}
        // biome-ignore lint/a11y/noNoninteractiveTabindex: the scroll region must be reachable by keyboard to scroll it
        tabIndex={0}
        className="gallery-track no-scrollbar reveal mt-8 max-md:mt-6"
      >
        <ol className="flex w-max gap-4">{children}</ol>
      </div>

      {hasControls && (
        <div className="container-page" hidden={view.fitsAll}>
          <Segments
            count={count}
            active={[view.first, view.last]}
            className="mt-6 max-md:mt-5"
          />
        </div>
      )}
    </>
  );
};

export default GalleryScroller;
