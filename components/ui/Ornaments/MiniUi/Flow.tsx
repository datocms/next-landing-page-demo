import MiniUiFrame, { type MiniUiProps } from './MiniUiFrame';

/** Three connected workflow nodes; the last (checked) node is the hover part */
const Flow = ({ className }: MiniUiProps) => (
  <MiniUiFrame name="flow" className={className}>
    <g className="stroke-tone" fill="none" strokeWidth={1.25}>
      <path d="M58 60V125Q58 159 92 159H134" />
      <path d="M62 60V125Q62 155 92 155H134" />
      <path d="M66 60V125Q66 151 92 151H134" />
      <path d="M218 151H260Q286 151 286 125V60" />
      <path d="M218 155H260Q290 155 290 125V60" />
      <path d="M218 159H260Q294 159 294 125V60" />
    </g>
    <g className="lift">
      <rect
        x="20.5"
        y="30.5"
        width="84"
        height="30"
        rx="15"
        className="fill-white stroke-line"
      />
      <rect
        x="134.5"
        y="140.5"
        width="84"
        height="30"
        rx="15"
        className="fill-white stroke-line"
      />
    </g>
    <circle cx="37" cy="45.5" r="7" className="fill-tone-mark" />
    <rect x="51" y="41.5" width="40" height="8" rx="4" className="fill-sk-2" />
    <circle cx="151" cy="155.5" r="7" className="fill-tone-mark" />
    <rect
      x="165"
      y="151.5"
      width="40"
      height="8"
      rx="4"
      className="fill-sk-2"
    />
    <g data-anim="">
      <rect
        x="248.5"
        y="30.5"
        width="84"
        height="30"
        rx="15"
        className="lift fill-white stroke-line"
      />
      <circle cx="265" cy="45.5" r="8" className="fill-tone" />
      <path
        d="M261.4 45.7l2.5 2.5 4.9-5"
        className="fill-none stroke-white"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect
        x="279"
        y="41.5"
        width="40"
        height="8"
        rx="4"
        className="fill-sk-2"
      />
    </g>
  </MiniUiFrame>
);

export default Flow;
