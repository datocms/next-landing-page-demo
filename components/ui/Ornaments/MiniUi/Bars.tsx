import MiniUiFrame, { type MiniUiProps } from './MiniUiFrame';

/** A panel with five rising bars on the ramp; every bar is a hover part */
const Bars = ({ className }: MiniUiProps) => (
  <MiniUiFrame name="bars" className={className}>
    <rect
      x="24.5"
      y="20.5"
      width="303"
      height="159"
      rx="12"
      className="lift fill-white stroke-line"
    />
    <rect x="40" y="36" width="72" height="8" rx="4" className="fill-sk-2" />
    <rect x="40" y="50" width="44" height="6" rx="3" className="fill-sk" />
    <rect x="252" y="34" width="60" height="22" rx="11" className="fill-sk" />
    <rect
      x="255"
      y="37"
      width="28"
      height="16"
      rx="8"
      className="lift fill-white"
    />
    <path d="M40 164.5H312" className="fill-none stroke-line" />
    <rect
      data-anim=""
      x="40"
      y="136"
      width="32"
      height="28"
      rx="6"
      className="fill-g-200"
    />
    <rect
      data-anim=""
      x="100"
      y="120"
      width="32"
      height="44"
      rx="6"
      className="fill-g-300"
    />
    <rect
      data-anim=""
      x="160"
      y="104"
      width="32"
      height="60"
      rx="6"
      className="fill-g-400"
    />
    <rect
      data-anim=""
      x="220"
      y="88"
      width="32"
      height="76"
      rx="6"
      className="fill-g-500"
    />
    <rect
      data-anim=""
      x="280"
      y="72"
      width="32"
      height="92"
      rx="6"
      className="fill-tone"
    />
  </MiniUiFrame>
);

export default Bars;
