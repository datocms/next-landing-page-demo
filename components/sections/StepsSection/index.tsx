import { stripStega } from '@datocms/content-link';
import type { CSSProperties } from 'react';
import DatoStructuredText from '@/components/datocms/DatoStructuredText';
import ProductCard from '@/components/product/ProductCard';
import { ArrowRightIcon } from '@/components/ui/icons';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import { cn } from '@/utils/cn';
import { hasStructuredText } from '@/utils/structuredText';
import { StepsSectionFragment } from './fragment';
import StepsRail from './variants/StepsRail';

type Props = {
  fragment: FragmentOf<typeof StepsSectionFragment>;
  locale: string;
};

// The tiles take the two pale fills in turn
const FILLS = ['bg-subtle', 'bg-tint'];

/**
 * The arrow between two tiles on desktop: a small white disc centred in the
 * gap. It sits in an element at the tile's content edge, so it is pushed out
 * by the tile's padding (1.75rem) plus half the gap (2rem)
 */
const Arrow = () => (
  <span
    aria-hidden="true"
    className="absolute top-1/2 -right-[2.75rem] z-10 hidden size-9 translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-line bg-surface text-fg xl:grid"
  >
    <ArrowRightIcon className="size-4" />
  </span>
);

/**
 * `tiles` (the default; `rail` is in variants/): a short sequence (two to four steps) as tiles in the two pale fills,
 * numbered from their order. Each tile shows its step's product card floating
 * at the top, then the number on a small accent chip, the title and the text;
 * small arrows in the gaps lead from one tile to the next. One column on
 * phones; from 768px each tile puts its card beside the text; from 1280px the
 * tiles stand side by side (four as two rows of two) and the cards and texts
 * line up across them (a subgrid). Three abreast, a tile is narrower than a
 * product card is drawn for, so the card is drawn at its own size and zoomed
 * down to fit.
 */
const StepsSection = ({ fragment, locale }: Props) => {
  const { steps, layout } = readFragment(StepsSectionFragment, fragment);
  if (steps.length === 0) return null;
  if (stripStega(layout ?? '').trim() === 'rail') {
    return <StepsRail fragment={fragment} locale={locale} />;
  }

  const anyCard = steps.some((step) => step.illustration);
  // Four steps make two rows of two
  const cols = steps.length === 4 ? 2 : steps.length;
  const zoomed = cols >= 3;

  return (
    <section className="section">
      <div className="container-page">
        {steps.length > 0 && (
          <ol
            style={{ '--cols': cols } as CSSProperties}
            className="grid gap-4 xl:grid-cols-[repeat(var(--cols),minmax(0,1fr))] xl:gap-x-8"
          >
            {steps.map((step, index) => {
              const card = step.illustration;
              // No arrow after the last tile of a row
              const arrow =
                index < steps.length - 1 && index % cols !== cols - 1;

              return (
                <li
                  key={step.id}
                  className={cn(
                    'relative flex flex-col gap-7 rounded-card p-6 sm:p-7 md:grid md:grid-cols-2 md:items-center md:gap-8 xl:grid-cols-1 xl:items-stretch xl:gap-7',
                    anyCard && 'xl:row-span-2 xl:grid-rows-subgrid',
                    FILLS[index % FILLS.length],
                  )}
                >
                  {anyCard && (
                    <div
                      className={cn(
                        'relative flex items-center justify-center',
                        !card && 'max-xl:hidden',
                      )}
                    >
                      {card && (
                        <div
                          aria-hidden="true"
                          className={cn(
                            'w-full max-w-[26rem]',
                            zoomed &&
                              'xl:w-[calc(100%/0.8)] xl:max-w-none xl:[zoom:0.8]',
                          )}
                        >
                          <ProductCard
                            card={card}
                            locale={locale}
                            className="w-full"
                          />
                        </div>
                      )}
                      {arrow && <Arrow />}
                    </div>
                  )}
                  <div
                    className={cn(
                      'relative',
                      card ? 'md:max-xl:col-start-2' : 'md:max-xl:col-span-2',
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className="inline-grid size-8 place-items-center rounded-full bg-accent font-semibold text-on-accent text-ui tabular-nums"
                    >
                      {index + 1}
                    </span>
                    {!anyCard && arrow && <Arrow />}
                    <h2 className="mt-4 text-h3">{step.title}</h2>
                    {hasStructuredText(step.description) && (
                      <div className="mt-2 max-w-[30rem] text-fg-muted text-small leading-[1.55] [&_p+p]:mt-2">
                        <DatoStructuredText data={step.description} />
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </section>
  );
};

export default StepsSection;
