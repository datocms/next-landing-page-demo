import { cn } from '@/utils/cn';
import type { Tone } from '@/utils/tones';

type Props = {
  tone: Tone;
};

/** The 10px tone-gradient dot beside a plan's name */
const PlanDot = ({ tone }: Props) => (
  <span
    aria-hidden="true"
    className={cn(tone, 'shrink-0 rounded-full bg-tone-grad size-2.5')}
  />
);

export default PlanDot;
