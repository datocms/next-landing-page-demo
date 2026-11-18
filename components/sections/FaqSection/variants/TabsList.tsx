'use client';

import {
  type KeyboardEvent,
  type ReactNode,
  useId,
  useRef,
  useState,
} from 'react';
import { cn } from '@/utils/cn';

type Item = {
  id: string;
  question: string;
  /** The answer, rendered on the server */
  answer: ReactNode;
};

/**
 * The questions as a column of pale tiles beside one answer tile, on the
 * mosaic hero's 12px gap: picking a question (click, or the arrow keys, Home
 * and End) turns its tile the accent and shows its answer in the tinted
 * tile, a navy quarter circle growing out of its corner. The first question
 * starts selected.
 */
const TabsList = ({ items }: { items: Item[] }) => {
  const baseId = useId();
  const [selected, setSelected] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  const move = (event: KeyboardEvent, index: number) => {
    const last = items.length - 1;
    const next =
      event.key === 'ArrowDown'
        ? index === last
          ? 0
          : index + 1
        : event.key === 'ArrowUp'
          ? index === 0
            ? last
            : index - 1
          : event.key === 'Home'
            ? 0
            : event.key === 'End'
              ? last
              : null;
    if (next === null) return;
    event.preventDefault();
    setSelected(next);
    tabs.current[next]?.focus();
  };

  return (
    <div className="grid grid-cols-[minmax(0,5fr)_minmax(0,7fr)] items-stretch gap-3">
      <div
        role="tablist"
        aria-orientation="vertical"
        className="grid content-start gap-2"
      >
        {items.map((item, index) => {
          const active = index === selected;
          return (
            <button
              key={item.id}
              ref={(node) => {
                tabs.current[index] = node;
              }}
              type="button"
              role="tab"
              id={`${baseId}-t${index}`}
              aria-selected={active}
              aria-controls={`${baseId}-p${index}`}
              tabIndex={active ? 0 : -1}
              onClick={() => setSelected(index)}
              onKeyDown={(event) => move(event, index)}
              className={cn(
                'flex min-h-16 cursor-pointer items-center rounded-[20px] px-6 py-4 text-left font-semibold text-[1.0625rem] leading-snug tracking-[-0.015em] transition-colors duration-200',
                active
                  ? 'bg-accent text-on-accent'
                  : 'bg-subtle text-fg hover:bg-tint',
              )}
            >
              {item.question}
            </button>
          );
        })}
      </div>
      <div className="relative isolate min-h-[22rem] overflow-hidden rounded-card bg-tint p-12 text-fg">
        {/* Keyed on the question, so each pick plays its settle again: it grows back
            out of its corner as the new answer rises */}
        <span
          key={`quarter-${selected}`}
          aria-hidden="true"
          className="faq-shape-in absolute right-0 bottom-0 -z-10 size-40 origin-bottom-right rounded-tl-full bg-ink"
        />
        {items.map((item, index) => (
          <div
            key={item.id}
            role="tabpanel"
            id={`${baseId}-p${index}`}
            aria-labelledby={`${baseId}-t${index}`}
            hidden={index !== selected}
            className="faq-tab-in max-w-[32rem]"
          >
            <h2 className="text-h2">{item.question}</h2>
            <div className="mt-6 text-fg-muted text-lead [&_a]:text-accent-ink [&_a]:underline [&_p+p]:mt-3">
              {item.answer}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TabsList;
