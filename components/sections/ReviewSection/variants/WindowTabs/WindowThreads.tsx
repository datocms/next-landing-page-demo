import { Threads } from '@/components/ui/Ornaments';

/* The mask fades each bundle's loose end in, so it never starts at a hard
   edge; it sits in the SVG's own space, so the mirrored bundle fades too */
const BUNDLE =
  'top-0 z-0 h-full w-[clamp(120px,calc(50vw-456px),360px)] opacity-90 [mask-image:linear-gradient(90deg,transparent,#000_28%)]';

/** Two thread bundles plugging into ports on the review window's sides, where the gutters are wide enough. Decorative */
const WindowThreads = () => (
  <div aria-hidden="true" className="hidden xl:block">
    <Threads
      shape="converge"
      draw="view"
      className={`${BUNDLE} right-[calc(100%-24px)] left-auto`}
    />
    <Threads
      shape="converge"
      draw="view"
      className={`${BUNDLE} right-auto left-[calc(100%-24px)] -scale-x-100`}
    />
    <span className="port -left-1 top-[calc(54%-26px)] h-[52px] w-2" />
    <span className="port -right-1 top-[calc(54%-26px)] h-[52px] w-2" />
  </div>
);

export default WindowThreads;
