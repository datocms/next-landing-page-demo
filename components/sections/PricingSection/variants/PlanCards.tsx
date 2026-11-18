import { type CSSProperties, useId } from 'react';
import Chip from '@/components/ui/Chip';
import { cn } from '@/utils/cn';
import type { Plan } from '../fragment';
import {
  FeatureList,
  MUTED,
  PlanButton,
  PlanDescription,
  Price,
} from '../PlanParts';
import { ownFeatureRows } from '../plans';

type Props = {
  plans: Plan[];
  highlighted: number;
  locale: string;
};

/** Columns by plan count: one column on phones, side by side once each card has room */
const COLUMNS: Record<number, string> = {
  1: 'mx-auto max-w-[28rem]',
  2: 'mx-auto max-w-[52rem] md:grid-cols-2',
  3: 'mx-auto max-w-[32rem] lg:max-w-none lg:grid-cols-3',
  4: 'md:grid-cols-2 xl:grid-cols-4',
};

/** The featured plan's quiet corner mark: three translucent white rings around a 150px circle, clipped by the card */
const RINGS =
  "after:pointer-events-none after:absolute after:-top-[70px] after:-right-[70px] after:-z-10 after:size-[150px] after:rounded-full after:content-[''] after:shadow-[0_0_0_44px_rgb(255_255_255/0.08),0_0_0_92px_rgb(255_255_255/0.05),0_0_0_144px_rgb(255_255_255/0.03)]";

/**
 * `cards`: one card per plan, white with a hairline ring. The cards share
 * their rows (subgrid), so names, prices, buttons and feature lists line up
 * and every card is as tall as the tallest. The highlighted plan is a solid
 * accent fill with white text, the accent glow under it, a translucent white
 * badge and three faint rings in its top-right corner, which breathe slowly.
 * The cards settle in side by side as they enter the view.
 */
const PlanCards = ({ plans, highlighted, locale }: Props) => {
  const uid = useId();

  return (
    <div className={cn('grid gap-[18px]', COLUMNS[plans.length] ?? COLUMNS[4])}>
      {plans.map((plan, i) => {
        const isHighlighted = i === highlighted;
        const tone = isHighlighted ? 'accent' : 'default';
        const headingId = `${uid}-${i}`;

        return (
          <article
            key={plan.id}
            aria-labelledby={headingId}
            className={cn(
              'relative isolate row-span-5 grid grid-rows-subgrid gap-y-0 overflow-hidden rounded-[30px] border p-7 md:p-[34px]',
              isHighlighted
                ? cn(
                    'border-transparent bg-accent text-on-accent shadow-glow [--focus-halo:var(--accent)] [--focus-ring:var(--on-accent)]',
                    RINGS,
                    'breathe-after loop [--loop-scale:1.07] [--loop-time:36s]',
                  )
                : 'border-line bg-surface',
            )}
          >
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-2">
              <h2 id={headingId} className="text-h3">
                {plan.name}
              </h2>
              {isHighlighted && plan.highlightLabel && (
                <Chip tone="inverse">{plan.highlightLabel}</Chip>
              )}
            </div>

            <div>
              <PlanDescription
                plan={plan}
                tone={tone}
                className="mt-2 text-small"
              />
            </div>

            <div
              className="mt-[22px]"
              // The prices change one plan after the other (styles/motion.css)
              style={{ '--plan-i': i } as CSSProperties}
            >
              <Price
                source={plan.name}
                monthly={plan.monthlyPrice}
                yearly={plan.yearlyPrice}
                locale={locale}
                tone={tone}
              />
              {plan.priceNote && (
                <p className={cn('mt-2 text-[0.875rem]', MUTED[tone])}>
                  {plan.priceNote}
                </p>
              )}
            </div>

            <div className="mt-[26px]">
              <PlanButton
                plan={plan}
                primary={false}
                locale={locale}
                size="lg"
                className="w-full"
              />
            </div>

            <div
              className={cn(
                'mt-7 border-t pt-[26px]',
                isHighlighted ? 'border-on-accent/20' : 'border-line',
              )}
            >
              <FeatureList
                rows={ownFeatureRows(plan)}
                locale={locale}
                tone={tone}
                className="text-small"
              />
            </div>
          </article>
        );
      })}
    </div>
  );
};

export default PlanCards;
