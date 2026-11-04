import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';
import type { ItemHeadingLevel } from '@/utils/headingLevel';
import type { Tone } from '@/utils/tones';

type Props = {
  headingLevel: ItemHeadingLevel;
  id?: string;
  tone: Tone;
  /** md in plan cards, sm in compact cards */
  size?: 'md' | 'sm';
  children: ReactNode;
};

const NAME_SIZES = {
  md: 'font-medium text-[1.125rem] text-ink leading-[1.3] tracking-[-0.01em]',
  sm: 'text-h3 text-ink',
} as const;

/** A plan's name as a heading, after its tone dot. Place it inside a flex row */
const PlanName = ({
  headingLevel: Heading,
  id,
  tone,
  size = 'md',
  children,
}: Props) => (
  <>
    <span
      aria-hidden="true"
      className={cn(tone, 'shrink-0 rounded-full bg-tone-grad size-2.5')}
    />
    <Heading id={id} className={NAME_SIZES[size]}>
      {children}
    </Heading>
  </>
);

export default PlanName;
