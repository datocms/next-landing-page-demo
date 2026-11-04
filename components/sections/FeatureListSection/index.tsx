import { stripStega } from '@datocms/content-link';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import type { SectionHeadingLevel } from '@/utils/headingLevel';
import { FeatureListSectionFragment } from './fragment';
import BentoGridFeatures from './variants/BentoGridFeatures';
import BigImageHorizontalFeatures from './variants/BigImageHorizontalFeatures';
import BigImageVerticalFeatures from './variants/BigImageVerticalFeatures';
import GalleryFeatures from './variants/GalleryFeatures';
import IconListFeatures from './variants/IconListFeatures';

type Props = {
  fragment: FragmentOf<typeof FeatureListSectionFragment>;
  as?: SectionHeadingLevel;
  locale: string;
};

/** Renders the layout picked in the block's "Display option" field */
const FeatureListSection = ({ fragment, as, locale }: Props) => {
  const { displayOption } = readFragment(FeatureListSectionFragment, fragment);

  switch (stripStega(displayOption)) {
    case 'card_minimal':
      return <IconListFeatures fragment={fragment} as={as} />;
    case 'grid':
      return <BentoGridFeatures fragment={fragment} as={as} />;
    case 'big_image_horizontal':
      return <BigImageHorizontalFeatures fragment={fragment} as={as} />;
    case 'big_image_vertical':
      return <BigImageVerticalFeatures fragment={fragment} as={as} />;
    default:
      return <GalleryFeatures fragment={fragment} as={as} locale={locale} />;
  }
};

export default FeatureListSection;
