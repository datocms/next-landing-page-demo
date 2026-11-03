type Props = {
  /** Per-instance prefix (from useId in the drawing); ids are `${id}-sweep` and `${id}-area` */
  id: string;
};

/** Accent sweep (x: g-300 → grad-b → grad-c) and fading area fill (y: g-200 → clear) for the mini-UIs */
const MiniGradients = ({ id }: Props) => (
  <defs>
    <linearGradient id={`${id}-sweep`} x1={0} y1={0} x2={1} y2={0}>
      <stop offset={0} style={{ stopColor: 'var(--g-300)' }} />
      <stop offset={0.55} style={{ stopColor: 'var(--grad-b)' }} />
      <stop offset={1} style={{ stopColor: 'var(--grad-c)' }} />
    </linearGradient>
    <linearGradient id={`${id}-area`} x1={0} y1={0} x2={0} y2={1}>
      <stop offset={0} style={{ stopColor: 'var(--g-200)' }} />
      <stop offset={1} style={{ stopColor: 'var(--g-50)', stopOpacity: 0 }} />
    </linearGradient>
  </defs>
);

export default MiniGradients;
