import { Maximize2 } from 'lucide-react';

/**
 * Wordless player chrome along the bottom of the poster: a start time, an
 * empty track and a fullscreen glyph. Purely decorative (the duration is not in
 * the CMS, so only 00:00 shows); the play button sits above it.
 */
const PlayerBar = () => (
  <div
    aria-hidden="true"
    className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] flex h-10 items-center gap-3.5 bg-linear-to-b from-transparent to-black/50 px-3 font-mono text-[12px] leading-none text-white tabular-nums md:h-12 md:px-[18px]"
  >
    <span>00:00</span>
    <span className="h-0.5 flex-1 rounded-[1px] bg-white/30" />
    <Maximize2 strokeWidth={2} className="size-3.5" />
  </div>
);

export default PlayerBar;
