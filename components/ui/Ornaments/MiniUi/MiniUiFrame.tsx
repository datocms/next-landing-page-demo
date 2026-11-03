import type { ReactNode } from 'react';

export type MiniUiProps = {
  /** Size and placement of the svg (for example size-full, or h-full w-auto) */
  className?: string;
};

type Props = MiniUiProps & {
  /** Names the drawing for the hover motion in CSS ([data-mini='bars'] [data-anim]) */
  name: string;
  children: ReactNode;
};

/** The decorative 352×200 svg every mini-UI drawing is drawn in */
const MiniUiFrame = ({ name, className, children }: Props) => (
  <svg
    viewBox="0 0 352 200"
    aria-hidden="true"
    focusable="false"
    preserveAspectRatio="xMidYMid meet"
    data-mini={name}
    className={className}
  >
    {children}
  </svg>
);

export default MiniUiFrame;
