import { stripStega } from '@datocms/content-link';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import { BrandSectionFragment } from './fragment';
import LogoGrid from './variants/LogoGrid';
import LogoMarquee from './variants/LogoMarquee';

type Props = {
  fragment: FragmentOf<typeof BrandSectionFragment>;
  locale: string;
};

/** Renders the layout picked in the block's "Display options" field */
const BrandSection = ({ fragment, locale }: Props) => {
  const { displayOptions } = readFragment(BrandSectionFragment, fragment);

  switch (stripStega(displayOptions ?? '')) {
    case 'brand_cards':
      return <LogoMarquee fragment={fragment} locale={locale} />;
    default:
      return <LogoGrid fragment={fragment} locale={locale} />;
  }
};

export default BrandSection;
