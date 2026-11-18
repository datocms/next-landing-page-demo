import { stripStega } from '@datocms/content-link';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import { BrandSectionFragment } from './fragment';
import LogoGrid from './variants/LogoGrid';
import LogoRow from './variants/LogoRow';

type Props = {
  fragment: FragmentOf<typeof BrandSectionFragment>;
  locale: string;
};

/** More logos than this no longer read as one band, so `row` becomes `grid` */
const ROW_MAX = 12;

/**
 * Renders the layout picked in the block's "Layout" field (`row`,
 * also for unknown values, or `grid`), or nothing without brands
 */
const BrandSection = ({ fragment, locale }: Props) => {
  const { layout, brands } = readFragment(BrandSectionFragment, fragment);
  if (brands.length === 0) return null;

  const wantsGrid = stripStega(layout ?? '').trim() === 'grid';

  return wantsGrid || brands.length > ROW_MAX ? (
    <LogoGrid fragment={fragment} locale={locale} />
  ) : (
    <LogoRow fragment={fragment} locale={locale} />
  );
};

export default BrandSection;
