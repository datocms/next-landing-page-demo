'use client';

import { type ReactNode, useId } from 'react';
import {
  NextButton,
  PrevButton,
  SlideAnnouncer,
  SlideCounter,
} from '@/components/sections/ReviewSection/CarouselControls';
import { slideProps } from '@/components/sections/ReviewSection/slideProps';
import { useCarousel } from '@/components/sections/ReviewSection/useCarousel';
import { uiString } from '@/lib/i18n/uiStrings';
import { cn } from '@/utils/cn';

type Props = {
  /** Pre-rendered quotes, one per review */
  slides: { id: string; node: ReactNode }[];
  /** Pre-rendered 32px avatars, in slide order */
  avatars: ReactNode[];
  /** Plain reviewer names, for labels and the live announcement */
  names: string[];
  locale: string;
};

/** With this many reviews or more, the avatars give way to a counter */
const MAX_AVATARS = 6;

/**
 * One centred quote at a time, picked from a white pill of reviewer avatars
 * flanked by arrows. Owns only the index; quotes and avatars arrive
 * pre-rendered. All slides share one grid cell, so nothing below them moves.
 */
const MinimalStage = ({ slides, avatars, names, locale }: Props) => {
  const count = slides.length;
  const { activeIndex, hasInteracted, next, prev, goTo, onKeyDown } =
    useCarousel(count);
  const slidesId = useId();
  const multiple = count > 1;
  const showAvatars = count < MAX_AVATARS;

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: arrow keys are a shortcut for the focusable buttons inside
    <div
      onKeyDown={onKeyDown}
      className="reveal mx-auto max-w-[760px] text-center"
    >
      <div id={slidesId} className="grid">
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
                {...slideProps(i === activeIndex)}
              >
                {slide.node}
              </div>
            ))
          : slides[0]?.node}
      </div>

      {multiple && (
        <div className="mt-7 flex justify-center">
          <div className="inline-flex items-center gap-1 rounded-pill bg-white p-1 shadow-[inset_0_0_0_1px_var(--line),var(--shadow-xs)]">
            <PrevButton
              onClick={prev}
              controls={slidesId}
              locale={locale}
              tone="ghost"
            />
            {showAvatars ? (
              slides.map((slide, i) => {
                const current = i === activeIndex;
                return (
                  <button
                    key={slide.id}
                    type="button"
                    aria-label={uiString(locale, 'testimonialSlide', {
                      n: i + 1,
                      total: count,
                      name: names[i] ?? '',
                    })}
                    aria-controls={slidesId}
                    aria-current={current ? 'true' : undefined}
                    onClick={() => goTo(i)}
                    className="group grid size-10 place-items-center rounded-full pointer-coarse:size-11 max-md:size-11"
                  >
                    {/* Only the avatar dims, so the button's focus ring keeps full contrast */}
                    <span
                      className={cn(
                        'block rounded-full transition-[opacity,box-shadow] duration-200 ease-out-expo',
                        current
                          ? 'ring-2 ring-accent-solid ring-offset-2 ring-offset-white'
                          : 'opacity-55 group-hover:opacity-90 group-focus-visible:opacity-90',
                      )}
                    >
                      {avatars[i]}
                    </span>
                  </button>
                );
              })
            ) : (
              <SlideCounter
                index={activeIndex}
                count={count}
                className="px-2"
              />
            )}
            <NextButton
              onClick={next}
              controls={slidesId}
              locale={locale}
              tone="ghost"
            />
          </div>
        </div>
      )}

      <SlideAnnouncer
        index={activeIndex}
        count={count}
        name={names[activeIndex] ?? ''}
        enabled={hasInteracted}
        locale={locale}
      />
    </div>
  );
};

export default MinimalStage;
