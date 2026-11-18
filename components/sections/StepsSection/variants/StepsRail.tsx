import type { CSSProperties } from 'react';
import DatoStructuredText from '@/components/datocms/DatoStructuredText';
import ProductCard from '@/components/product/ProductCard';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import { hasStructuredText } from '@/utils/structuredText';
import { StepsSectionFragment } from '../fragment';
import SettleIn from '../SettleIn';
import styles from './StepsRail.module.css';

type Props = {
  fragment: FragmentOf<typeof StepsSectionFragment>;
  locale: string;
};

/**
 * `rail` (the statement page's look): the steps are arches standing on one
 * hairline, each a little taller than the one before, like the arches rising
 * from the statement hero. Inside, centred: the number on an accent disc, the
 * title and the text, and at the arch's foot the step's product card. Side by
 * side from 1024px; stacked below, all the same height.
 */
const StepsRail = ({ fragment, locale }: Props) => {
  const { steps } = readFragment(StepsSectionFragment, fragment);

  return (
    <section className="section">
      <SettleIn className="container-page">
        <ol
          style={{ '--cols': steps.length } as CSSProperties}
          className={styles.rail}
        >
          {steps.map((step, index) => (
            <li
              key={step.id}
              data-settle-item=""
              style={{ '--i': index } as CSSProperties}
              className={styles.step}
            >
              <span aria-hidden="true" className={styles.disc}>
                {index + 1}
              </span>
              <h2 className="mt-5 text-h3">{step.title}</h2>
              {hasStructuredText(step.description) && (
                <div className="mt-2 max-w-[19rem] text-balance text-fg-muted text-small leading-[1.55] [&_p+p]:mt-2">
                  <DatoStructuredText data={step.description} />
                </div>
              )}
              {step.illustration && (
                <div aria-hidden="true" className={styles.card}>
                  <ProductCard
                    card={step.illustration}
                    locale={locale}
                    className="w-full text-left"
                  />
                </div>
              )}
            </li>
          ))}
        </ol>
      </SettleIn>
    </section>
  );
};

export default StepsRail;
