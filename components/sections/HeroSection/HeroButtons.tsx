import { stripStega } from '@datocms/content-link';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import type { ResultOf } from '@/lib/datocms/graphql';
import { cn } from '@/utils/cn';
import type { HeroSectionFragment } from './fragment';

type Props = {
  buttons: ResultOf<typeof HeroSectionFragment>['buttons'];
  /** The primary pill: the accent fill (default) or ink (SplitImageHero, GradientHero) */
  tone?: 'accent' | 'ink';
  align?: 'start' | 'center';
  /** Load-choreography step: the row rises after the lead (motion users only) */
  rise?: number;
  /** Placement only (margins, max width) */
  className?: string;
};

/**
 * A pill never outgrows its row. Stacked below 768 it is full width and at
 * least 48px tall, and a long CMS label wraps onto a second line.
 */
const PILL =
  'max-w-full text-center max-md:h-auto max-md:min-h-12 max-md:w-full max-md:whitespace-normal max-md:py-3';

/** From 768 a pill keeps one line: a label too long for the row ends in an ellipsis */
const LABEL = 'leading-snug md:truncate';

/**
 * The call-to-action row shared by every hero: the CMS "primary" flag picks
 * the filled pill (with a nudging arrow), every other button is the white
 * secondary pill. Below 768 the pills stack as equal full-width buttons.
 */
const HeroButtons = ({
  buttons,
  tone = 'accent',
  align = 'start',
  rise,
  className,
}: Props) => {
  if (buttons.length === 0) return null;

  const rises = rise !== undefined;
  const primaryClass = tone === 'ink' ? 'btn-ink' : 'btn-primary';

  return (
    <div
      data-hero-rise={rises ? '' : undefined}
      style={rises ? ({ '--d': rise } as CSSProperties) : undefined}
      className={cn(
        'flex flex-wrap gap-2.5 max-md:flex-col max-md:items-stretch max-md:gap-2',
        align === 'center' && 'justify-center',
        className,
      )}
    >
      {buttons.map((button) => (
        <Link
          key={button.id}
          href={stripStega(button.url ?? '') || '#'}
          className={cn(
            'btn',
            button.primary ? primaryClass : 'btn-secondary',
            PILL,
          )}
        >
          <span className={LABEL}>{button.label}</span>
          {button.primary && (
            <ArrowRight
              aria-hidden="true"
              strokeWidth={2}
              className="btn-arrow rtl:rotate-180"
            />
          )}
        </Link>
      ))}
    </div>
  );
};

export default HeroButtons;
