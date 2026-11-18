import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';
import AppLink from './AppLink';

type Props = {
  /** Makes the chip a link (a post's tag) */
  href?: string;
  /**
   * neutral: grey. accent: a pale tint of the accent, for a chip that should stand
   * out. solid: the accent fill, for a highlighted plan's badge. inverse: translucent
   * white, for a badge on an accent fill (the featured plan)
   */
  tone?: 'neutral' | 'accent' | 'solid' | 'inverse';
  /** Placement only */
  className?: string;
  children: ReactNode;
};

const CHIP = 'inline-flex min-h-6 items-center rounded-chip px-2.5 text-ui';

const TONE = {
  neutral: 'bg-subtle font-medium text-fg-muted ring-1 ring-inset ring-line',
  accent: 'bg-accent-soft font-medium text-accent-ink',
  solid: 'bg-accent font-semibold text-on-accent',
  inverse: 'bg-on-accent/20 font-semibold text-on-accent',
};

/** A small label: a tag, a version, a plan's badge. Sentence case */
const Chip = ({ href, tone = 'neutral', className, children }: Props) =>
  href ? (
    <AppLink
      href={href}
      className={cn(
        CHIP,
        TONE[tone],
        'transition-colors duration-150 hover:text-fg',
        className,
      )}
    >
      {children}
    </AppLink>
  ) : (
    <span className={cn(CHIP, TONE[tone], className)}>{children}</span>
  );

export default Chip;
