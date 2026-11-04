'use client';

import { Pause, Play } from 'lucide-react';
import { useRef, useState } from 'react';
import { uiString } from '@/lib/i18n/uiStrings';

type Props = {
  locale: string;
};

/**
 * Pause / play for the logo marquee (WCAG 2.2.2). It flips `data-paused` on
 * the nearest `[data-marquee]` ancestor; the CSS pauses the track from there.
 * The label names the action the button will take.
 */
const MarqueeToggle = ({ locale }: Props) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [paused, setPaused] = useState(false);

  const toggle = () => {
    const next = !paused;
    setPaused(next);
    buttonRef.current
      ?.closest('[data-marquee]')
      ?.toggleAttribute('data-paused', next);
  };

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={toggle}
      aria-label={
        paused ? uiString(locale, 'playLogos') : uiString(locale, 'pauseLogos')
      }
      className="relative grid size-7 shrink-0 place-items-center rounded-full bg-well text-ink-2 transition-colors duration-200 before:absolute before:-inset-2 hover:bg-surface hover:text-ink max-md:size-8 motion-reduce:hidden"
    >
      {paused ? (
        <Play
          aria-hidden="true"
          className="size-3 fill-current"
          strokeWidth={0}
        />
      ) : (
        <Pause
          aria-hidden="true"
          className="size-3 fill-current"
          strokeWidth={0}
        />
      )}
    </button>
  );
};

export default MarqueeToggle;
