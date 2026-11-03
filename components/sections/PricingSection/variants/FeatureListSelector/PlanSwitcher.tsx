'use client';

import {
  type KeyboardEvent,
  type ReactNode,
  useId,
  useRef,
  useState,
} from 'react';
import { uiString } from '@/lib/i18n/uiStrings';
import { cn } from '@/utils/cn';
import type { Tone } from '@/utils/tones';

type PlanOption = {
  id: string;
  /** The raw CMS plan name (keeps its Content Link encoding) */
  name: string;
  tone: Tone;
  /** Pre-rendered compact price that follows the billing period */
  price: ReactNode;
};

type Props = {
  options: PlanOption[];
  /** One pre-rendered panel per option, in the same order */
  panels: ReactNode[];
  defaultId: string;
  /** The billing toggle, placed at the end of the control row */
  toggle?: ReactNode;
  locale: string;
};

/** Class names for each part of the switcher, per layout */
type Layout = {
  group: string;
  option: string;
  radio: string;
  dot: string;
  price: string;
};

/** How far each arrow key moves the selection (horizontal ones flip in right-to-left text) */
const KEY_STEP: Record<string, number> = {
  ArrowRight: 1,
  ArrowDown: 1,
  ArrowLeft: -1,
  ArrowUp: -1,
};

/* Stacked 56px radio rows on narrow screens, one pill track (as tall as the
   billing toggle: 40, or 44 on touch screens) where the plans fit. Up to three
   plans share the track from 640; more stay stacked until 1024, so plan names
   never truncate. The track sizes segments to their content, and scrolls
   instead of overflowing if the CMS adds more plans than a row can hold. */
const FEW_PLANS: Layout = {
  group:
    'grid w-full gap-2 sm:auto-cols-[minmax(max-content,1fr)] sm:grid-flow-col sm:gap-0 sm:overflow-x-auto sm:rounded-pill sm:bg-well sm:p-1 sm:ring-1 sm:ring-line sm:ring-inset lg:inline-grid lg:w-auto lg:max-w-full',
  option:
    'h-14 w-full gap-3 rounded-2xl bg-white px-4 text-left text-ink max-sm:ring-1 max-sm:ring-line max-sm:aria-checked:ring-2 max-sm:aria-checked:ring-accent-solid sm:h-8 sm:justify-center sm:gap-2.5 sm:rounded-pill sm:bg-transparent sm:px-5 sm:text-ink-2 sm:aria-checked:bg-white sm:aria-checked:text-ink sm:aria-checked:shadow-thumb sm:pointer-coarse:h-9',
  radio: 'sm:hidden',
  dot: 'max-sm:hidden',
  price: 'max-sm:ml-auto',
};

const MANY_PLANS: Layout = {
  group:
    'grid w-full gap-2 lg:inline-grid lg:w-auto lg:max-w-full lg:auto-cols-[minmax(max-content,1fr)] lg:grid-flow-col lg:gap-0 lg:overflow-x-auto lg:rounded-pill lg:bg-well lg:p-1 lg:ring-1 lg:ring-line lg:ring-inset',
  option:
    'h-14 w-full gap-3 rounded-2xl bg-white px-4 text-left text-ink max-lg:ring-1 max-lg:ring-line max-lg:aria-checked:ring-2 max-lg:aria-checked:ring-accent-solid lg:h-8 lg:justify-center lg:gap-2.5 lg:rounded-pill lg:bg-transparent lg:px-5 lg:text-ink-2 lg:aria-checked:bg-white lg:aria-checked:text-ink lg:aria-checked:shadow-thumb lg:pointer-coarse:h-9',
  radio: 'lg:hidden',
  dot: 'max-lg:hidden',
  price: 'max-lg:ml-auto',
};

/**
 * The plan radiogroup and its panels. Every panel is server-rendered; the
 * inactive ones are hidden, so the default plan shows without JavaScript.
 * Arrow keys, Home and End move focus and selection together (roving tabindex).
 */
const PlanSwitcher = ({
  options,
  panels,
  defaultId,
  toggle,
  locale,
}: Props) => {
  const [selectedId, setSelectedId] = useState(defaultId);
  // Only fade panels in after the visitor switches, never on first paint
  const [switched, setSwitched] = useState(false);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const uid = useId();

  const selectedIndex = Math.max(
    0,
    options.findIndex((option) => option.id === selectedId),
  );
  const layout = options.length > 3 ? MANY_PLANS : FEW_PLANS;

  const select = (index: number) => {
    setSelectedId(options[index].id);
    setSwitched(true);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const count = options.length;
    let next: number | null = null;
    if (event.key in KEY_STEP) {
      // In right-to-left text, ArrowLeft moves forward
      const isRtl = getComputedStyle(event.currentTarget).direction === 'rtl';
      const horizontal =
        event.key === 'ArrowLeft' || event.key === 'ArrowRight';
      const step = KEY_STEP[event.key] * (isRtl && horizontal ? -1 : 1);
      next = (selectedIndex + step + count) % count;
    } else if (event.key === 'Home') {
      next = 0;
    } else if (event.key === 'End') {
      next = count - 1;
    }
    if (next === null) return;
    event.preventDefault();
    select(next);
    optionRefs.current[next]?.focus();
  };

  return (
    <div className="reveal">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div
          role="radiogroup"
          aria-label={uiString(locale, 'plan')}
          className={cn('no-scrollbar', layout.group)}
        >
          {options.map((option, i) => {
            const checked = i === selectedIndex;
            return (
              // biome-ignore lint/a11y/useSemanticElements: a styled radio button; the radiogroup keyboard pattern is handled here
              <button
                key={option.id}
                ref={(element) => {
                  optionRefs.current[i] = element;
                }}
                type="button"
                role="radio"
                aria-checked={checked}
                aria-controls={`${uid}-panel-${i}`}
                tabIndex={checked ? 0 : -1}
                onClick={() => select(i)}
                onKeyDown={handleKeyDown}
                className={cn(
                  'group/opt hit-44 flex items-center text-ui transition-[background-color,color,box-shadow] duration-200 ease-out-expo',
                  // Stacked radio rows, then pill segments; the checked one is a white thumb
                  layout.option,
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    'size-[18px] shrink-0 rounded-full border-[1.5px] border-line-strong transition-[border-width,border-color] duration-150 group-aria-checked/opt:border-[5px] group-aria-checked/opt:border-accent-solid',
                    layout.radio,
                  )}
                />
                <span
                  aria-hidden="true"
                  className={cn(
                    option.tone,
                    'size-2 shrink-0 rounded-full bg-tone-grad',
                    layout.dot,
                  )}
                />
                <span className="min-w-0 truncate">{option.name}</span>
                <span className={cn('shrink-0', layout.price)}>
                  {option.price}
                </span>
              </button>
            );
          })}
        </div>
        {toggle}
      </div>

      <div className="mt-4">
        {panels.map((panel, i) => (
          <div
            key={options[i]?.id ?? i}
            id={`${uid}-panel-${i}`}
            hidden={i !== selectedIndex}
            className={cn(switched && 'motion-safe:animate-fade-in')}
          >
            {panel}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlanSwitcher;
