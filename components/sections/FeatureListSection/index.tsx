import { stripStega } from '@datocms/content-link';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import { FeatureListSectionFragment } from './fragment';
import BentoFeatures from './variants/BentoFeatures';
import GridFeatures from './variants/GridFeatures';
import ListFeatures from './variants/ListFeatures';
import MosaicFeatures from './variants/MosaicFeatures';

type Props = {
  fragment: FragmentOf<typeof FeatureListSectionFragment>;
  locale: string;
};

/**
 * Renders the layout picked in the block's "Layout" field:
 * `grid` (the mosaic of large tiles; also for unknown or empty values), `list`,
 * `cards` or `mosaic` (the mosaic landing page's tiles and shapes)
 */
const FeatureListSection = ({ fragment, locale }: Props) => {
  const { layout } = readFragment(FeatureListSectionFragment, fragment);

  switch (stripStega(layout ?? '').trim()) {
    case 'list':
      return <ListFeatures fragment={fragment} />;
    case 'cards':
      return <GridFeatures fragment={fragment} />;
    case 'mosaic':
      return <MosaicFeatures fragment={fragment} />;
    default:
      return <BentoFeatures fragment={fragment} locale={locale} />;
  }
};

export default FeatureListSection;
