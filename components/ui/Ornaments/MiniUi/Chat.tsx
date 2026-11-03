import MiniUiFrame, { type MiniUiProps } from './MiniUiFrame';

/** A support thread: a question, a tinted answer with a read check, and a typing bubble (the three dots are the hover parts) */
const Chat = ({ className }: MiniUiProps) => (
  <MiniUiFrame name="chat" className={className}>
    <circle cx="36" cy="54" r="10" className="fill-tone" />
    <path
      d="M54.5 38.5a14 14 0 0 1 14-14h148a14 14 0 0 1 14 14v16a14 14 0 0 1-14 14h-158a4 4 0 0 1-4-4z"
      className="lift fill-white stroke-line"
    />
    <rect x="68" y="37" width="140" height="7" rx="3.5" className="fill-sk-2" />
    <rect x="68" y="50" width="92" height="7" rx="3.5" className="fill-sk" />
    <path
      d="M327.5 94.5a14 14 0 0 0-14-14h-160a14 14 0 0 0-14 14v16a14 14 0 0 0 14 14h170a4 4 0 0 0 4-4z"
      className="fill-tone-wash"
    />
    <rect
      x="154"
      y="93"
      width="152"
      height="7"
      rx="3.5"
      className="fill-tone-mark"
    />
    <rect
      x="154"
      y="106"
      width="100"
      height="7"
      rx="3.5"
      className="fill-tone-mark"
    />
    <path
      d="M312 134.5l3 3 6-6"
      className="fill-none stroke-tone"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="36" cy="162" r="10" className="fill-tone" />
    <path
      d="M54.5 160.5a12 12 0 0 1 12-12h40a12 12 0 0 1 12 12v0a12 12 0 0 1-12 12h-48a4 4 0 0 1-4-4z"
      className="lift fill-white stroke-line"
    />
    {/* Each dot moves on its own, so a stagger can use :nth-child(1|2|3) inside this group */}
    <g>
      <circle data-anim="" cx="72" cy="160.5" r="3.5" className="fill-sk-2" />
      <circle data-anim="" cx="86" cy="160.5" r="3.5" className="fill-sk-2" />
      <circle data-anim="" cx="100" cy="160.5" r="3.5" className="fill-sk-2" />
    </g>
  </MiniUiFrame>
);

export default Chat;
