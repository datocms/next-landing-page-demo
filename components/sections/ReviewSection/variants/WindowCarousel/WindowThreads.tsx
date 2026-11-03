import { Threads } from '@/components/ui/Ornaments';

/* Each bundle fills the gutter beside the window (up to 360px) and tucks its
   converged end 24px behind the window's edge, where a port receives it. The
   loose end fades in, so on wide screens the bundle never starts at a hard
   edge. The mask sits in the SVG's own space, so the mirrored bundle fades
   its outer end too. */
const BUNDLE =
  'top-0 z-0 h-full w-[clamp(120px,calc(50vw-456px),360px)] opacity-90 [mask-image:linear-gradient(90deg,transparent,#000_28%)]';

/**
 * Two converging thread bundles plugging into ports on the review window's
 * left and right edges, like the Centred window hero. Only from 1200, where
 * the gutters are wide enough; the section clips any overhang. Static server
 * SVG, drawn by scroll where supported and fully drawn otherwise.
 */
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
