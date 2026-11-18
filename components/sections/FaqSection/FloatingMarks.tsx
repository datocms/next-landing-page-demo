import type { CSSProperties } from 'react';
import { cn } from '@/utils/cn';
import styles from './FaqSection.module.css';

type Mark = {
  /** Placement and size, as CSS (top/left/right/bottom, --size) */
  style: Record<string, string>;
  /** Only from 1024px (the side margins), or only below it (the corners) */
  only?: 'wide' | 'narrow';
};

const soft = 'var(--accent-soft)';

// Each mark drifts on its own rhythm (15 to 28s), out of step with the others.
// Below 1024px there are no side margins: two smaller marks sit in the
// section's padding, top right and bottom left
const CORNERS: Mark[] = [
  {
    style: {
      right: '0.4rem',
      top: '0',
      '--size': '4rem',
      '--r0': '10deg',
      '--r1': '16deg',
      '--dy': '8px',
      '--dur': '18s',
      '--delay': '-4s',
    },
    only: 'narrow',
  },
  {
    style: {
      left: '0.4rem',
      bottom: '0',
      '--size': '4rem',
      '--r0': '-12deg',
      '--r1': '-6deg',
      '--dy': '-8px',
      '--dur': '23s',
      '--delay': '-12s',
      '--tone': soft,
    },
    only: 'narrow',
  },
];

// From 1024px: big marks in the empty places, under the accordion's header
// and in the side margins
const LAYOUTS: Record<'accordion' | 'columns', Mark[]> = {
  accordion: [
    ...CORNERS,
    {
      style: {
        left: 'calc(var(--page-edge) - 0.25em)',
        bottom: '-0.12em',
        '--size': 'clamp(9rem, 22vw, 17rem)',
        '--r0': '-10deg',
        '--r1': '-4deg',
        '--dy': '-14px',
        '--dur': '26s',
        '--delay': '-7s',
      },
      only: 'wide',
    },
    {
      style: {
        right: 'calc(var(--page-edge) * 0.5 - 0.3em)',
        top: '6%',
        '--size': '7.5rem',
        '--r0': '8deg',
        '--r1': '14deg',
        '--dx': '-6px',
        '--dy': '10px',
        '--dur': '19s',
        '--delay': '-3s',
        '--tone': soft,
      },
      only: 'wide',
    },
    {
      style: {
        left: 'calc(var(--page-edge) * 0.5 - 0.3em)',
        top: '12%',
        '--size': '4.5rem',
        '--r0': '-6deg',
        '--r1': '4deg',
        '--dx': '4px',
        '--dy': '-10px',
        '--dur': '15s',
        '--delay': '-11s',
      },
      only: 'wide',
    },
    {
      style: {
        right: 'calc(var(--page-edge) * 0.35)',
        bottom: '8%',
        '--size': '5.5rem',
        '--r0': '12deg',
        '--r1': '6deg',
        '--dy': '-12px',
        '--dur': '22s',
        '--delay': '-15s',
        '--tone': soft,
      },
      only: 'wide',
    },
  ],
  columns: [
    ...CORNERS,
    {
      style: {
        left: 'calc(var(--page-edge) + 4%)',
        top: 'calc(var(--section-space) * 0.4)',
        '--size': 'clamp(6rem, 13vw, 11rem)',
        '--r0': '-12deg',
        '--r1': '-5deg',
        '--dy': '-12px',
        '--dur': '24s',
        '--delay': '-5s',
      },
      only: 'wide',
    },
    {
      style: {
        right: 'calc(var(--page-edge) + 6%)',
        top: 'calc(var(--section-space) * 0.75)',
        '--size': 'clamp(4.5rem, 9vw, 7.5rem)',
        '--r0': '10deg',
        '--r1': '16deg',
        '--dx': '-5px',
        '--dy': '10px',
        '--dur': '18s',
        '--delay': '-9s',
        '--tone': soft,
      },
      only: 'wide',
    },
    {
      style: {
        left: 'calc(var(--page-edge) * 0.5 - 0.3em)',
        top: '55%',
        '--size': '5rem',
        '--r0': '6deg',
        '--r1': '-3deg',
        '--dy': '-14px',
        '--dur': '28s',
        '--delay': '-14s',
      },
      only: 'wide',
    },
    {
      style: {
        right: 'calc(var(--page-edge) * 0.5 - 0.3em)',
        bottom: '10%',
        '--size': '6rem',
        '--r0': '-8deg',
        '--r1': '2deg',
        '--dx': '5px',
        '--dy': '-10px',
        '--dur': '21s',
        '--delay': '-2s',
        '--tone': soft,
      },
      only: 'wide',
    },
  ],
};

/**
 * A few large, pale question marks behind the section that float and turn
 * slowly. Decoration only: hidden from assistive technology, clipped to the
 * section, still under reduced motion. The section needs `relative isolate`.
 */
const FloatingMarks = ({ layout }: { layout: keyof typeof LAYOUTS }) => (
  <div aria-hidden="true" data-faq-marks="" className={styles.marks}>
    {LAYOUTS[layout].map((mark, i) => (
      <span
        // biome-ignore lint/suspicious/noArrayIndexKey: a fixed list
        key={i}
        className={cn(styles.mark, mark.only && styles[mark.only])}
        style={mark.style as CSSProperties}
      >
        ?
      </span>
    ))}
  </div>
);

export default FloatingMarks;
