import { stripStega } from '@datocms/content-link';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import { PricingSectionFragment } from './fragment';
import BestValueCards from './variants/BestValueCards';
import FeatureListSelector from './variants/FeatureListSelector';
import PlanCards from './variants/PlanCards';
import PlanTable from './variants/PlanTable';
import TierStrip from './variants/TierStrip';

type Props = {
  fragment: FragmentOf<typeof PricingSectionFragment>;
  locale: string;
  /** h1 when the section opens a page without a hero */
  as?: 'h1' | 'h2';
};

/** Renders the layout picked in the block's "Display option" field */
const PricingSection = ({ fragment, locale, as }: Props) => {
  const { displayOption } = readFragment(PricingSectionFragment, fragment);

  switch (stripStega(displayOption ?? '')) {
    case 'cards_gradient':
      return <BestValueCards fragment={fragment} locale={locale} as={as} />;
    case 'minimal':
      return <PlanTable fragment={fragment} locale={locale} as={as} />;
    case 'feature_list':
      return (
        <FeatureListSelector fragment={fragment} locale={locale} as={as} />
      );
    case 'mini_cards':
      return <TierStrip fragment={fragment} locale={locale} as={as} />;
    default:
      return <PlanCards fragment={fragment} locale={locale} as={as} />;
  }
};

export default PricingSection;
