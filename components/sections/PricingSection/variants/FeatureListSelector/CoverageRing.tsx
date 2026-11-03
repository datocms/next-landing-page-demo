import type { CSSProperties } from 'react';

type Props = {
  included: number;
  total: number;
};

/**
 * A 44px progress ring (the accent conic sweep up to included/total) with the
 * count in mono at its centre. Decorative: the pill list carries the meaning.
 */
const CoverageRing = ({ included, total }: Props) => {
  const percent = total > 0 ? Math.round((included / total) * 100) : 0;

  return (
    <span
      aria-hidden="true"
      className="relative grid size-11 shrink-0 place-items-center"
    >
      <span
        className="ring-progress absolute inset-0"
        style={{ '--p': `${percent}%` } as CSSProperties}
      />
      <span className="font-mono text-[0.6875rem] text-ink tabular-nums leading-none">
        {included}/{total}
      </span>
    </span>
  );
};

export default CoverageRing;
