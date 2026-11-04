import { stripStega } from '@datocms/content-link';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import type { ResultOf } from '@/lib/datocms/graphql';
import { cn } from '@/utils/cn';
import type { HeroSectionFragment } from './fragment';

type Props = {
  buttons: ResultOf<typeof HeroSectionFragment>['buttons'];
  /** Fill of the primary button */
  tone?: 'accent' | 'ink';
  align?: 'start' | 'center';
  /** Placement only (margins, max width) */
  className?: string;
};

// A button never outgrows its row: a long CMS label wraps when the buttons stack, and truncates on one line otherwise
const PILL =
  'max-w-full text-center max-md:h-auto max-md:min-h-12 max-md:w-full max-md:whitespace-normal max-md:py-3';
const LABEL = 'leading-snug md:truncate';

/**
 * The hero's call-to-action row: the CMS "primary" flag picks the filled
 * button with an arrow, the others are secondary. Step 2 of the hero's load
 * animation, after the subtitle.
 */
const HeroButtons = ({
  buttons,
  tone = 'accent',
  align = 'start',
  className,
}: Props) => {
  if (buttons.length === 0) return null;

  const primaryClass = tone === 'ink' ? 'btn-ink' : 'btn-primary';

  return (
    <div
      data-hero-rise=""
      style={{ '--d': 2 } as CSSProperties}
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
