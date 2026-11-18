import { stripStega } from '@datocms/content-link';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import { HeroSectionFragment } from './fragment';
import CenteredHero from './variants/CenteredHero';
import CoverHero from './variants/CoverHero';
import MinimalHero from './variants/MinimalHero';
import MosaicHero from './variants/MosaicHero';
import SplitHero from './variants/SplitHero';
import StatementHero from './variants/StatementHero';

type Props = {
  fragment: FragmentOf<typeof HeroSectionFragment>;
  locale: string;
};

export type HeroLayout =
  | 'centered'
  | 'split'
  | 'minimal'
  | 'statement'
  | 'mosaic'
  | 'cover';

/**
 * The layout a hero renders: the value of its "Layout" field, or
 * `centered` for anything unknown or empty. `split` and `cover` need an image:
 * without one the hero falls back to `centered` (which is text only).
 */
export function heroLayout(
  fragment: FragmentOf<typeof HeroSectionFragment>,
): HeroLayout {
  const { layout, image } = readFragment(HeroSectionFragment, fragment);
  const value = stripStega(layout ?? '').trim();

  if (value === 'minimal') return 'minimal';
  if (value === 'statement') return 'statement';
  if (value === 'mosaic') return 'mosaic';
  if (value === 'split' && image?.responsiveImage) return 'split';
  if (value === 'cover' && image?.responsiveImage) return 'cover';
  return 'centered';
}

/** The landing hero: renders the layout picked in the block's "Layout" field */
const HeroSection = ({ fragment, locale }: Props) => {
  switch (heroLayout(fragment)) {
    case 'minimal':
      return <MinimalHero fragment={fragment} />;
    case 'statement':
      return <StatementHero fragment={fragment} locale={locale} />;
    case 'mosaic':
      return <MosaicHero fragment={fragment} locale={locale} />;
    case 'cover':
      return <CoverHero fragment={fragment} />;
    case 'split':
      return <SplitHero fragment={fragment} locale={locale} />;
    default:
      return <CenteredHero fragment={fragment} />;
  }
};

export default HeroSection;
