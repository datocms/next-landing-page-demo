'use client';

import { Star } from 'lucide-react';
import { type ReactNode, useId } from 'react';
import {
  NextButton,
  PrevButton,
  SlideAnnouncer,
  SlideCounter,
} from '@/components/sections/ReviewSection/CarouselControls';
import { slideProps } from '@/components/sections/ReviewSection/slideProps';
import { useCarousel } from '@/components/sections/ReviewSection/useCarousel';
import Segments from '@/components/ui/Ornaments/Segments';
import { uiString } from '@/lib/i18n/uiStrings';
import { cn } from '@/utils/cn';

type Props = {
  /** Pre-rendered quotes, one per review */
  slides: { id: string; node: ReactNode }[];
  /** Pre-rendered portraits (image or initials) in slide order; null hides the plinth */
  portraits: ReactNode[] | null;
  /** The plinth's thread wave, rendered on the server */
  plinth?: ReactNode;
  /** Whole stars per slide (0 hides the pin) */
  ratings: number[];
  /** Plain reviewer names, for the live announcement */
  names: string[];
  locale: string;
};

/**
 * The spotlight well: the reviewer stands on a thread plinth beside a white
 * quote card. Owns only the index; every quote, portrait and thread arrives
 * pre-rendered. All slides share one grid cell, so the well never changes
 * height between them.
 */
const SpotlightStage = ({
  slides,
  portraits,
  plinth,
  ratings,
  names,
  locale,
}: Props) => {
  const count = slides.length;
  const { index, interacted, next, prev, onKeyDown } = useCarousel(count);
  const slidesId = useId();
  const rating = ratings[index] ?? 0;
  const multiple = count > 1;

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: arrow keys are a shortcut for the focusable Previous/Next buttons inside
    <div onKeyDown={onKeyDown} className="well reveal p-2 max-md:p-1.5">
      <div
        className={cn(
          'grid gap-2 max-md:gap-1.5',
          portraits && 'lg:grid-cols-[456px_minmax(0,1fr)]',
        )}
      >
        {portraits && (
          <div
            aria-hidden="true"
            className="relative isolate h-60 md:h-[300px] lg:h-auto lg:min-h-[400px]"
          >
            {plinth && (
              // The wave bleeds through the well's padding, so it runs out at
              // the well's clipped edge (as on the hero plinth) and at the
              // card's edge, never at an invisible line in mid-air
              <div className="absolute -inset-1.5 md:-inset-2">{plinth}</div>
            )}
            <div className="float absolute top-6 left-6 rounded-[18px] p-1.5 md:left-8 md:rounded-card lg:top-10 lg:left-12">
              <div className="photo h-[190px] w-[152px] rounded-[12px] md:h-[250px] md:w-[200px] md:rounded-[14px] lg:h-[290px] lg:w-[232px]">
                {portraits.map((node, i) => (
                  <div
                    key={slides[i]?.id ?? i}
                    className={cn(
                      'absolute inset-0 motion-safe:transition-opacity motion-safe:duration-300 motion-safe:ease-out-expo',
                      i === index ? 'opacity-100' : 'opacity-0',
                    )}
                  >
                    {node}
                  </div>
                ))}
              </div>
            </div>
            {rating > 0 && (
              <div className="float absolute top-[192px] left-[136px] inline-flex h-10 items-center gap-1.5 rounded-pill px-3.5 md:top-[248px] md:left-[188px] lg:top-[306px] lg:left-[212px]">
                <Star
                  strokeWidth={1.75}
                  className="size-3.5 fill-current text-accent-solid"
                />
                <span className="mono text-ink">{rating}.0</span>
              </div>
            )}
          </div>
        )}

        <div className="card flex flex-col rounded-zone p-10 max-lg:p-8 max-md:rounded-[14px] max-md:p-6">
          {multiple && (
            <div className="flex items-center gap-3">
              <SlideCounter index={index} count={count} />
              <Segments count={count} active={index} />
            </div>
          )}

          <div id={slidesId} className={cn('grid', multiple && 'mt-6')}>
            {multiple
              ? slides.map((slide, i) => (
                  // biome-ignore lint/a11y/useSemanticElements: a carousel slide is an ARIA group, not a form fieldset
                  <div
                    key={slide.id}
                    role="group"
                    aria-roledescription={uiString(locale, 'slide')}
                    aria-label={uiString(locale, 'slideOf', {
                      n: i + 1,
                      total: count,
                    })}
                    {...slideProps(i === index)}
                  >
                    {slide.node}
                  </div>
                ))
              : slides[0]?.node}
          </div>

          {/* Pinned to the card's foot: any spare height falls between the
              caption and the arrows, never inside the quote */}
          {multiple && (
            <div className="mt-auto flex gap-2 pt-8 max-md:pt-6">
              <PrevButton onClick={prev} controls={slidesId} locale={locale} />
              <NextButton onClick={next} controls={slidesId} locale={locale} />
            </div>
          )}

          <SlideAnnouncer
            index={index}
            count={count}
            name={names[index] ?? ''}
            enabled={interacted}
            locale={locale}
          />
        </div>
      </div>
    </div>
  );
};

export default SpotlightStage;
