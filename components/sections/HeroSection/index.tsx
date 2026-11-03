import { stripStega } from '@datocms/content-link';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import { HeroSectionFragment } from './fragment';
import BackgroundImageHero from './variants/BackgroundImageHero';
import DefaultHero from './variants/DefaultHero';
import GradientHero from './variants/GradientHero';
import RightImageHero from './variants/RightImageHero';
import SplitImageHero from './variants/SplitImageHero';

type Props = {
  fragment: FragmentOf<typeof HeroSectionFragment>;
};

/** Renders the layout picked in the block's "Display options" field */
const HeroSection = ({ fragment }: Props) => {
  const { displayOptions } = readFragment(HeroSectionFragment, fragment);

  switch (stripStega(displayOptions ?? '')) {
    case 'gradient':
      return <GradientHero fragment={fragment} />;
    case 'right_image':
      return <RightImageHero fragment={fragment} />;
    case 'background_image':
      return <BackgroundImageHero fragment={fragment} />;
    case 'split_image':
      return <SplitImageHero fragment={fragment} />;
    default:
      return <DefaultHero fragment={fragment} />;
  }
};

export default HeroSection;
