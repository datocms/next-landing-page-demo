import SkeletonBar from './SkeletonBar';

/** Window dots, an address bar and two round buttons */
const TitleBar = () => (
  <div
    aria-hidden="true"
    className="window-bar max-md:h-8 max-md:gap-3 max-md:px-3"
  >
    <span className="window-dots">
      <i />
      <i />
      <i />
    </span>
    <span className="mx-auto flex h-5 w-60 items-center justify-center gap-1.5 rounded-md bg-surface max-md:w-32">
      <b className="size-2 rounded-[2px] border-[1.5px] border-sk-3" />
      <SkeletonBar className="h-1.5 bg-sk-2" width="96px" />
    </span>
    <span className="flex gap-1.5">
      <i className="size-5 rounded-full bg-surface" />
      <i className="size-5 rounded-full bg-surface" />
    </span>
  </div>
);

export default TitleBar;
