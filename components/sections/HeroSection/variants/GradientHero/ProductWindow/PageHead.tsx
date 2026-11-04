import SkeletonBar from './SkeletonBar';

/** The page head: a title, a three-way segmented control, stacked faces and an ink button */
const PageHead = () => (
  <div
    aria-hidden="true"
    className="flex items-center gap-4 border-line border-b px-6 max-md:gap-3 max-md:px-3.5"
  >
    <i className="h-3 w-40 rounded-md bg-[color-mix(in_oklch,var(--ink)_16%,white)] max-md:w-[72px]" />
    <span className="flex h-7 gap-0.5 rounded-lg bg-surface p-[3px]">
      <i className="grid w-10 place-items-center rounded-md bg-white shadow-[0_0_0_1px_var(--line),var(--shadow-xs)]">
        <SkeletonBar className="h-[5px] bg-sk-3" width="18px" />
      </i>
      <i className="grid w-10 place-items-center rounded-md">
        <SkeletonBar className="h-[5px] bg-sk-2" width="18px" />
      </i>
      <i className="grid w-10 place-items-center rounded-md">
        <SkeletonBar className="h-[5px] bg-sk-2" width="18px" />
      </i>
    </span>
    <span className="ml-auto flex items-center gap-3.5">
      <span className="flex">
        <i className="tone-0 size-6 rounded-full bg-tone-grad shadow-[0_0_0_2px_#fff]" />
        <i className="tone-2 -ml-1.5 size-6 rounded-full bg-tone-grad shadow-[0_0_0_2px_#fff]" />
        <i className="tone-4 -ml-1.5 size-6 rounded-full bg-tone-grad shadow-[0_0_0_2px_#fff]" />
      </span>
      <i className="grid h-7 w-[72px] place-items-center rounded-full bg-ink max-md:hidden">
        <SkeletonBar className="h-[5px] bg-white/70" width="32px" />
      </i>
    </span>
  </div>
);

export default PageHead;
