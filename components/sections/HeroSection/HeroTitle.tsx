import TwoTone from '@/components/ui/TwoTone';
import { cn } from '@/utils/cn';

type Props = {
  /** Raw CMS title (stega included: the payload stays in the second part) */
  title: string;
  /** compact: for a title set inside a card or tile */
  size?: 'page' | 'compact';
  /** Measure, for example `max-w-[588px]` */
  className?: string;
  /** For the hero section's aria-labelledby */
  id?: string;
};

// The compact size scales with a phone's width, so each half of the title keeps its own line inside the card
const SIZE = {
  page: 'text-h1',
  compact:
    'text-h1 max-md:text-[length:clamp(28px,10.4vw_-_8.5px,32px)] max-md:tracking-[-0.035em] md:text-[44px] md:leading-[1.06]',
} as const;

/**
 * The hero h1 in two tones, never animated so it paints with the first frame.
 * The heading is one Content Link group, so both tones open the title field.
 */
const HeroTitle = ({ title, size = 'page', className, id }: Props) => (
  <h1
    id={id}
    data-datocms-content-link-group
    className={cn('text-balance', SIZE[size], className)}
  >
    <TwoTone text={title} lineBreak="always" />
  </h1>
);

export default HeroTitle;
