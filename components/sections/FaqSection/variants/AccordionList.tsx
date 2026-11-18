'use client';

import { type CSSProperties, type ReactNode, useId, useState } from 'react';
import { cn } from '@/utils/cn';
import styles from '../FaqSection.module.css';

type Item = {
  id: string;
  question: string;
  /** The answer, rendered on the server */
  answer: ReactNode;
};

type Props = {
  items: Item[];
  /** Stagger index of the first item in the section's settle-in */
  settleFrom?: number;
};

/** The 30px circle on the right of a question: a plus whose upright bar turns flat into a minus as it opens */
const PlusMinus = () => (
  <span
    aria-hidden="true"
    className={cn(
      styles.toggleIcon,
      'relative size-[30px] shrink-0 rounded-full bg-surface transition-colors duration-300 group-data-open:bg-subtle',
    )}
  >
    <span className="absolute inset-x-[9px] top-[14px] h-0.5 rounded-full bg-fg" />
    <span className="absolute inset-x-[9px] top-[14px] h-0.5 rotate-90 rounded-full bg-fg transition-[rotate] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] group-data-open:rotate-180 motion-reduce:transition-none" />
  </span>
);

/**
 * The questions of the accordion, one open at a time: opening one closes the
 * other, pressing the open one closes it. The first starts open. Each
 * question is a button (aria-expanded, aria-controls) in a heading; its
 * answer eases open and shut. Without JavaScript every answer shows.
 */
const AccordionList = ({ items, settleFrom = 0 }: Props) => {
  const baseId = useId();
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);

  return (
    <div className="grid gap-2">
      {items.map((item, index) => {
        const open = item.id === openId;
        const buttonId = `${baseId}-q${index}`;
        const panelId = `${baseId}-a${index}`;

        return (
          <div
            key={item.id}
            data-open={open || undefined}
            style={{ '--i': settleFrom + index } as CSSProperties}
            className={cn(
              'group rounded-[20px] border border-transparent bg-subtle transition-[background-color,border-color,box-shadow] duration-300 not-data-open:hover:bg-tint data-open:border-line data-open:bg-surface data-open:shadow-[0_40px_60px_-44px_var(--glow)]',
            )}
          >
            <h2>
              <button
                type="button"
                id={buttonId}
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() =>
                  setOpenId((current) => (current === item.id ? null : item.id))
                }
                className="flex w-full cursor-pointer items-center justify-between gap-4 rounded-[20px] py-5 pr-[22px] pl-[26px] text-left font-semibold text-[1.0625rem] leading-snug tracking-[-0.015em] focus-visible:-outline-offset-2"
              >
                <span>{item.question}</span>
                <PlusMinus />
              </button>
            </h2>
            <div
              id={panelId}
              data-open={open || undefined}
              className={styles.panel}
            >
              <div className={styles.panelInner}>
                <div
                  className={cn(
                    styles.panelBody,
                    'prose max-w-[38rem] pr-[22px] pb-5 pl-[26px] text-[0.96875rem] text-fg-muted',
                  )}
                >
                  {item.answer}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AccordionList;
