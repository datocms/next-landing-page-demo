import MiniUiFrame, { type MiniUiProps } from './MiniUiFrame';

/** A shared document with stacked collaborators, a highlighted line and a named cursor (the hover part) */
const Presence = ({ className }: MiniUiProps) => (
  <MiniUiFrame name="presence" className={className}>
    <rect
      x="24.5"
      y="18.5"
      width="303"
      height="163"
      rx="12"
      className="lift fill-white stroke-line"
    />
    <rect x="40" y="36" width="96" height="9" rx="4.5" className="fill-sk-2" />
    <g strokeWidth={2.5} className="stroke-white">
      <circle cx="250" cy="40" r="11" className="fill-g-300" />
      <circle cx="266" cy="40" r="11" className="fill-g-500" />
      <circle cx="282" cy="40" r="11" className="fill-g-700" />
      <circle cx="298" cy="40" r="11" className="fill-g-900" />
    </g>
    <path d="M40 62.5H312" className="fill-none stroke-line" />
    <rect x="40" y="80" width="248" height="8" rx="4" className="fill-sk" />
    <rect
      x="94"
      y="94"
      width="122"
      height="16"
      rx="3"
      className="fill-tone-mark"
    />
    <rect x="40" y="98" width="236" height="8" rx="4" className="fill-sk" />
    <path d="M216 91V113" className="fill-none stroke-tone" strokeWidth={2} />
    <rect x="40" y="116" width="222" height="8" rx="4" className="fill-sk" />
    <rect x="40" y="134" width="160" height="8" rx="4" className="fill-sk" />
    <rect x="40" y="156" width="200" height="8" rx="4" className="fill-sk" />
    {/* The hover move goes on the outer group: a CSS transform would replace the inner transform attribute */}
    <g data-anim="">
      <g transform="translate(228 118)">
        <path
          d="M0 0L0 19L5 14.5L8.8 22.6L12.2 21.1L8.4 13H15Z"
          className="fill-tone stroke-white"
          strokeWidth={1.5}
          strokeLinejoin="round"
        />
        <rect
          x="14"
          y="21"
          width="40"
          height="15"
          rx="7.5"
          className="fill-tone"
        />
        <rect
          x="21"
          y="26.5"
          width="20"
          height="4"
          rx="2"
          className="fill-white"
          opacity={0.8}
        />
      </g>
    </g>
  </MiniUiFrame>
);

export default Presence;
