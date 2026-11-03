import TwoTone from '@/components/ui/SectionTitle/TwoTone';
import { cn } from '@/utils/cn';

type Props = {
  /** Raw CMS title (stega included: the payload stays in the second part) */
  title: string;
  /** Size and measure, for example `text-h1 max-w-[588px]` */
  className?: string;
  /** For the hero section's aria-labelledby */
  id?: string;
};

/**
 * The hero H1, set in two tones: the first part in ink on its own line, the
 * rest in ink-2. Titles under three words stay one tone. Never animated, so
 * it paints with the first frame. The heading is one Content Link group, so
 * both tones open the title field (the stega payload sits in the second part).
 */
const HeroHeading = ({ title, className, id }: Props) => (
  <h1
    id={id}
    data-datocms-content-link-group
    className={cn('text-balance', className)}
  >
    <TwoTone text={title} lineBreak="always" />
  </h1>
);

export default HeroHeading;
