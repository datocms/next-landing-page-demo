'use client';

import { type KeyboardEvent, type ReactNode, useRef, useState } from 'react';
import { cn } from '@/utils/cn';

type Props = {
  /** Accessible name of the tablist ("Plans") */
  label: string;
  /** Prefix for the tab and panel ids */
  idPrefix: string;
  /** What each tab shows (a plan's name and price) */
  tabs: ReactNode[];
  /** One panel per tab, all rendered on the server */
  panels: ReactNode[];
  /** The tab selected on load */
  initial: number;
};

/**
 * A tablist of plans as a row of tiles over one panel tile (the mosaic page's
 * pricing): the tabs are pale tiles, the selected one navy like the panel
 * under it, so the two read as one shape. Arrow keys, Home and End move the
 * selection (roving tabindex, automatic activation); every panel is in the
 * HTML, the others hidden.
 */
const TabList = ({ label, idPrefix, tabs, panels, initial }: Props) => {
  const [selected, setSelected] = useState(initial);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const count = tabs.length;

  const select = (index: number) => {
    const next = (index + count) % count;
    setSelected(next);
    tabRefs.current[next]?.focus();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const moves: Record<string, number> = {
      ArrowRight: selected + 1,
      ArrowDown: selected + 1,
      ArrowLeft: selected - 1,
      ArrowUp: selected - 1,
      Home: 0,
      End: count - 1,
    };
    if (!(event.key in moves)) return;
    event.preventDefault();
    select(moves[event.key]);
  };

  return (
    <div className="grid gap-2.5 lg:gap-3">
      <div
        role="tablist"
        aria-label={label}
        onKeyDown={onKeyDown}
        style={{ gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))` }}
        className="grid gap-2.5 lg:gap-3"
      >
        {tabs.map((tab, i) => {
          const isSelected = i === selected;
          return (
            <button
              // biome-ignore lint/suspicious/noArrayIndexKey: tabs follow the plans' order
              key={i}
              ref={(node) => {
                tabRefs.current[i] = node;
              }}
              type="button"
              role="tab"
              id={`${idPrefix}-tab-${i}`}
              aria-controls={`${idPrefix}-panel-${i}`}
              aria-selected={isSelected}
              tabIndex={isSelected ? 0 : -1}
              onClick={() => setSelected(i)}
              className={cn(
                'group/tab flex min-h-24 cursor-pointer flex-col items-start justify-between gap-3 rounded-card p-4 text-left transition-colors duration-200 sm:min-h-28 sm:p-6',
                isSelected
                  ? 'on-ink bg-ink text-surface'
                  : 'bg-subtle text-fg hover:bg-tint',
              )}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {panels.map((panel, i) => (
        <div
          // biome-ignore lint/suspicious/noArrayIndexKey: panels follow the plans' order
          key={i}
          role="tabpanel"
          id={`${idPrefix}-panel-${i}`}
          aria-labelledby={`${idPrefix}-tab-${i}`}
          hidden={i !== selected}
          // biome-ignore lint/a11y/noNoninteractiveTabindex: a tab panel takes focus after its tab (ARIA pattern)
          tabIndex={0}
          className="on-ink relative isolate overflow-hidden rounded-card bg-ink text-surface focus-visible:outline-offset-2"
        >
          {/* The mosaic hero's navy tile shape: an accent quarter circle
              growing out of the bottom-right corner */}
          <span
            aria-hidden="true"
            className="absolute right-0 bottom-0 -z-10 size-[clamp(6rem,14vw,11rem)] rounded-tl-full bg-accent"
          />
          {panel}
        </div>
      ))}
    </div>
  );
};

export default TabList;
