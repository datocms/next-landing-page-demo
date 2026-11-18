import type { SVGProps } from 'react';

/**
 * The interface glyphs: 16px, round-capped 1.5px strokes. They are decorative
 * (aria-hidden): the control that holds one names itself with text or
 * aria-label. Size them with `size-*` and colour them with `text-*`.
 */
type Props = Omit<SVGProps<SVGSVGElement>, 'children' | 'viewBox'>;

const base = {
  viewBox: '0 0 16 16',
  width: 16,
  height: 16,
  fill: 'none',
} as const;

const stroke = {
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const;

/** Included, done, selected */
export const CheckIcon = (props: Props) => (
  <svg aria-hidden="true" {...base} {...props}>
    <path d="M3.25 8.5l3 3 6.5-7" {...stroke} />
  </svg>
);

/** The chevron of a menu trigger or a disclosure; rotate it with `rotate-180` when open */
export const CaretIcon = (props: Props) => (
  <svg aria-hidden="true" {...base} {...props}>
    <path d="M4 6l4 4 4-4" {...stroke} />
  </svg>
);

/** Close a sheet, dismiss a strip */
export const CloseIcon = (props: Props) => (
  <svg aria-hidden="true" {...base} {...props}>
    <path d="M4 4l8 8M12 4l-8 8" {...stroke} />
  </svg>
);

/** Open the navigation sheet */
export const MenuIcon = (props: Props) => (
  <svg aria-hidden="true" {...base} {...props}>
    <path d="M2.5 4.5h11M2.5 8h11M2.5 11.5h11" {...stroke} />
  </svg>
);

/** A missing value in a table, a feature a plan lacks */
export const DashIcon = (props: Props) => (
  <svg aria-hidden="true" {...base} {...props}>
    <path d="M4.5 8h7" {...stroke} />
  </svg>
);

/** Play a video */
export const PlayIcon = (props: Props) => (
  <svg aria-hidden="true" {...base} {...props}>
    <path
      d="M5.5 3.6v8.8a.5.5 0 0 0 .76.43l7.1-4.4a.5.5 0 0 0 0-.86l-7.1-4.4a.5.5 0 0 0-.76.43z"
      fill="currentColor"
    />
  </svg>
);

/** One star of a rating */
export const StarIcon = (props: Props) => (
  <svg aria-hidden="true" {...base} {...props}>
    <path
      d="M8 1.6l1.9 3.96 4.35.58-3.18 3.03.8 4.31L8 11.38l-3.87 2.1.8-4.31L1.75 6.14l4.35-.58z"
      fill="currentColor"
    />
  </svg>
);

/** After a "next step" link ("Read the post"), never on a button */
export const ArrowRightIcon = (props: Props) => (
  <svg aria-hidden="true" {...base} {...props}>
    <path d="M3 8h10M9 4l4 4-4 4" {...stroke} />
  </svg>
);
