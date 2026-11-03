import MiniUiFrame, { type MiniUiProps } from './MiniUiFrame';

/** A padlock over a settings card with two switches on. No hover part */
const Lock = ({ className }: MiniUiProps) => (
  <MiniUiFrame name="lock" className={className}>
    <path
      d="M176 70V84"
      className="fill-none stroke-line-strong"
      strokeDasharray="2 3"
    />
    <circle cx="176" cy="44" r="24" className="fill-tone-wash" />
    <g
      className="stroke-tone"
      fill="none"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="167" y="42" width="18" height="13" rx="3" />
      <path d="M170.5 42v-4a5.5 5.5 0 0 1 11 0v4" />
    </g>
    <circle cx="176" cy="48.5" r="1.6" className="fill-tone" />
    <rect
      x="56.5"
      y="84.5"
      width="239"
      height="95"
      rx="12"
      className="lift fill-white stroke-line"
    />
    <rect x="72" y="100" width="92" height="8" rx="4" className="fill-sk-2" />
    <rect x="72" y="114" width="60" height="6" rx="3" className="fill-sk" />
    <rect x="248" y="100" width="32" height="18" rx="9" className="fill-tone" />
    <circle cx="271" cy="109" r="7" className="fill-white" />
    <path d="M72 132.5H280" className="fill-none stroke-line" />
    <rect x="72" y="147" width="76" height="8" rx="4" className="fill-sk-2" />
    <rect x="72" y="161" width="104" height="6" rx="3" className="fill-sk" />
    <rect x="248" y="147" width="32" height="18" rx="9" className="fill-tone" />
    <circle cx="271" cy="156" r="7" className="fill-white" />
  </MiniUiFrame>
);

export default Lock;
