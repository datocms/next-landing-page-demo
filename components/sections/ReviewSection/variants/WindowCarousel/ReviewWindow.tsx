'use client';

import {
  type KeyboardEvent,
  type ReactNode,
  useId,
  useRef,
  useState,
} from 'react';
import { slideProps } from '@/components/sections/ReviewSection/slideProps';
import { cn } from '@/utils/cn';
import ReplyComposer from './ReplyComposer';
import { useTabOrientation } from './useTabOrientation';
import WindowTitleBar from './WindowTitleBar';

type ReviewItem = {
  id: string;
  /** Pre-rendered avatar for the list row */
  avatar: ReactNode;
  /** Raw CMS strings (they keep their Content Link encoding) */
  name: string;
  role?: string | null;
  /** Pre-rendered message: stars, quote and author */
  message: ReactNode;
};

type Props = {
  items: ReviewItem[];
  /** Accessible name of the tab list */
  label: string;
};

// A reviewer row: a full-width sidebar row from md, a pill in the phone strip below
const ROW =
  'flex shrink-0 items-center gap-3 rounded-xl px-3 text-start md:h-14 md:w-full max-md:h-11 max-md:gap-2 max-md:rounded-pill max-md:ps-1.5 max-md:pe-3.5';
const SELECTED_ROW =
  'bg-white shadow-[inset_0_0_0_1px_var(--line),var(--shadow-xs)]';

/** Bring a half-clipped tab fully into the phone strip (focus alone may not) */
const scrollTabIntoView = (tab?: HTMLElement | null) => {
  const reduceMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)',
  ).matches;
  tab?.scrollIntoView({
    block: 'nearest',
    inline: 'nearest',
    behavior: reduceMotion ? 'instant' : 'smooth',
  });
};

/** The name and (from md) the role in a reviewer row */
const RowLabel = ({ name, role }: { name: string; role?: string | null }) => (
  <span className="grid min-w-0 gap-0.5">
    <span className="truncate text-[14.5px] leading-[1.25] font-medium text-ink max-md:max-w-[140px] max-md:text-[14px]">
      {name}
    </span>
    {role && <span className="mono truncate max-md:hidden">{role}</span>}
  </span>
);

/**
 * The review window: a sidebar list of reviewers (an APG tab list) and the
 * selected review as an open message with a wordless reply composer. Owns
 * only the selection; every avatar and message arrives pre-rendered. Messages
 * share one grid cell, so the window never changes height.
 */
const ReviewWindow = ({ items, label }: Props) => {
  const count = items.length;
  const multiple = count > 1;
  const [rawIndex, setIndex] = useState(0);
  // Real-time updates can shrink the list under us
  const index = count > 0 ? Math.min(rawIndex, count - 1) : 0;
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const orientation = useTabOrientation();
  const baseId = useId();
  const tabId = (i: number) => `${baseId}-tab-${i}`;
  const panelId = (i: number) => `${baseId}-panel-${i}`;

  // With a single review there is no tab list, so its message is a plain block
  const tabPanelProps = (i: number) =>
    multiple
      ? {
          id: panelId(i),
          role: 'tabpanel',
          'aria-labelledby': tabId(i),
          tabIndex: i === index ? 0 : -1,
        }
      : {};

  /** Selects a tab by position (wrapping around) and moves focus to it, as the arrow keys do */
  const selectAndFocus = (i: number) => {
    const target = (i + count) % count;
    setIndex(target);
    const tab = tabRefs.current[target];
    tab?.focus();
    scrollTabIntoView(tab);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const isRtl = getComputedStyle(event.currentTarget).direction === 'rtl';
    switch (event.key) {
      case 'ArrowDown':
        selectAndFocus(index + 1);
        break;
      case 'ArrowUp':
        selectAndFocus(index - 1);
        break;
      case 'ArrowRight':
        selectAndFocus(isRtl ? index - 1 : index + 1);
        break;
      case 'ArrowLeft':
        selectAndFocus(isRtl ? index + 1 : index - 1);
        break;
      case 'Home':
        selectAndFocus(0);
        break;
      case 'End':
        selectAndFocus(count - 1);
        break;
      default:
        return;
    }
    event.preventDefault();
  };

  return (
    <div className="window reveal relative z-[1] rounded-[16px]">
      <WindowTitleBar index={index} count={count} />

      <div className="grid md:grid-cols-[232px_minmax(0,1fr)] lg:grid-cols-[272px_minmax(0,1fr)]">
        <div className="min-w-0 border-line bg-well max-md:border-b md:border-e md:p-3">
          {multiple ? (
            <div
              role="tablist"
              aria-label={label}
              aria-orientation={orientation}
              onKeyDown={onKeyDown}
              className="flex gap-1 max-md:no-scrollbar max-md:scroll-px-2 max-md:overflow-x-auto max-md:p-2 md:flex-col"
            >
              {items.map((item, i) => {
                const selected = i === index;
                return (
                  <button
                    key={item.id}
                    ref={(node) => {
                      tabRefs.current[i] = node;
                    }}
                    type="button"
                    role="tab"
                    id={tabId(i)}
                    aria-selected={selected}
                    aria-controls={panelId(i)}
                    tabIndex={selected ? 0 : -1}
                    onClick={(event) => {
                      setIndex(i);
                      scrollTabIntoView(event.currentTarget);
                    }}
                    className={cn(
                      ROW,
                      'transition-[background-color,box-shadow] duration-200 ease-out-expo',
                      selected ? SELECTED_ROW : 'hover:bg-surface/60',
                    )}
                  >
                    {item.avatar}
                    <RowLabel name={item.name} role={item.role} />
                  </button>
                );
              })}
            </div>
          ) : (
            // A single reviewer: a static row drawn as selected
            items[0] && (
              <div className={cn(ROW, SELECTED_ROW, 'max-md:m-2')}>
                {items[0].avatar}
                <RowLabel name={items[0].name} role={items[0].role} />
              </div>
            )
          )}
        </div>

        <div className="flex min-w-0 flex-col p-8 max-md:p-5 lg:px-10 lg:py-9">
          <div className="grid">
            {items.map((item, i) => (
              <div
                key={item.id}
                {...tabPanelProps(i)}
                {...slideProps(i === index, 'rounded-lg')}
              >
                {item.message}
              </div>
            ))}
          </div>

          <ReplyComposer />
        </div>
      </div>
    </div>
  );
};

export default ReviewWindow;
