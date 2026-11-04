import { stripStega } from '@datocms/content-link';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import type { SectionHeadingLevel } from '@/utils/headingLevel';
import { PricingSectionFragment } from './fragment';
import BestValueCards from './variants/BestValueCards';
import PlanCards from './variants/PlanCards';
import PlanSelector from './variants/PlanSelector';
import PlanTable from './variants/PlanTable';
import TierStrip from './variants/TierStrip';

type Props = {
  fragment: FragmentOf<typeof PricingSectionFragment>;
  locale: string;
  as?: SectionHeadingLevel;
};

/** Renders the layout picked in the block's "Display option" field, or nothing without plans */
const PricingSection = ({ fragment, locale, as }: Props) => {
  const { displayOption, plans } = readFragment(
    PricingSectionFragment,
    fragment,
  );
  if (plans.length === 0) return null;

  switch (stripStega(displayOption)) {
    case 'cards_gradient':
      return <BestValueCards fragment={fragment} locale={locale} as={as} />;
    case 'minimal':
      return <PlanTable fragment={fragment} locale={locale} as={as} />;
    case 'feature_list':
      return <PlanSelector fragment={fragment} locale={locale} as={as} />;
    case 'mini_cards':
      return <TierStrip fragment={fragment} locale={locale} as={as} />;
    default:
      return <PlanCards fragment={fragment} locale={locale} as={as} />;
  }
};

export default PricingSection;
