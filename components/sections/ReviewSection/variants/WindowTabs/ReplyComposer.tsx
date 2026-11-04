import { ArrowUp } from 'lucide-react';

/** A wordless reply field under the open review, so the window reads as a chat (decorative, hidden on phones) */
const ReplyComposer = () => (
  <div
    aria-hidden="true"
    className="mt-8 flex h-10 items-center rounded-pill bg-white ps-4 pe-1.5 shadow-[inset_0_0_0_1px_var(--line)] max-md:hidden"
  >
    <i className="block h-2 w-[140px] rounded-full bg-surface" />
    <span className="ms-auto grid size-7 place-items-center rounded-full bg-accent-solid text-white">
      <ArrowUp className="size-3.5" strokeWidth={2} />
    </span>
  </div>
);

export default ReplyComposer;
