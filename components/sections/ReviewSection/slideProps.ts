import { cn } from '@/utils/cn';

/*
 * The outgoing slide fades out first, then (once out of sight) drops 8px; the
 * incoming one fades and rises in after it. Motion-safe only: under reduced
 * motion the slides swap instantly.
 */
const ENTER =
  'opacity-100 motion-safe:transition-[opacity,translate] motion-safe:duration-200 motion-safe:delay-100 motion-safe:ease-out-expo';
const EXIT =
  'pointer-events-none opacity-0 motion-safe:translate-y-2 motion-safe:[transition:opacity_100ms_var(--ease-standard),translate_0s_linear_100ms]';

/**
 * Props for one slide. Every slide is rendered in the same grid cell, so the
 * carousel is always as tall as its longest slide and the controls never move.
 * Inactive slides stay in the layout but are invisible, hidden from assistive
 * technology and unreachable by keyboard.
 */
export const slideProps = (active: boolean, className?: string) => ({
  inert: !active,
  'aria-hidden': active ? undefined : true,
  className: cn('[grid-area:1/1]', active ? ENTER : EXIT, className),
});
