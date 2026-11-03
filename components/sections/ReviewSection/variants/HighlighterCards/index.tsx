import { useId } from 'react';
import { ReviewSectionFragment } from '@/components/sections/ReviewSection/fragment';
import SectionTitle from '@/components/ui/SectionTitle';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import { uiString } from '@/lib/i18n/uiStrings';
import { cn } from '@/utils/cn';
import HighlighterCard from './HighlighterCard';

type Props = {
  fragment: FragmentOf<typeof ReviewSectionFragment>;
  locale: string;
  /** Use h1 when this section opens a page without a hero */
  as?: 'h1' | 'h2';
};

/**
 * One review sits alone at a readable width; two or four split the row; three
 * or more go three across from 1024 (one 640px column below, so a lone card
 * never trails a second row).
 */
const gridClasses = (count: number) => {
  if (count === 1) return 'max-w-[640px]';
  if (count === 2 || count === 4) return 'md:grid-cols-2';
  return 'max-lg:max-w-[640px] lg:grid-cols-3';
};

/** Default variant (`star_cards`): a row of highlighter cards */
const HighlighterCards = ({ fragment, locale, as = 'h2' }: Props) => {
  const headingId = useId();
  const {
    reviews,
    reviewSectionHeader: header,
    reviewSectionSubheader: subheader,
  } = readFragment(ReviewSectionFragment, fragment);

  if (!reviews?.length) return null;

  return (
    <section
      className="section"
      aria-labelledby={header ? headingId : undefined}
      aria-label={header ? undefined : uiString(locale, 'testimonials')}
    >
      <div className="container-page">
        <SectionTitle
          title={header}
          paragraph={subheader}
          as={as}
          h1Size="section"
          id={headingId}
          className="[--lead-max:680px]"
        />

        <ul
          className={cn(
            'reveal-stagger grid gap-4 max-md:gap-3',
            gridClasses(reviews.length),
          )}
        >
          {reviews.map((review) => (
            <li key={review.id}>
              <HighlighterCard fragment={review} locale={locale} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default HighlighterCards;
