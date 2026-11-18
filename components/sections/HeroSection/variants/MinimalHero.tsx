import { useId } from 'react';
import type { HeroSectionFragment } from '@/components/sections/HeroSection/fragment';
import type { FragmentOf } from '@/lib/datocms/graphql';
import CenteredText from './CenteredText';

type Props = {
  fragment: FragmentOf<typeof HeroSectionFragment>;
};

/** `minimal`: the centred copy on the white page, with less air around it. It never shows the images */
const MinimalHero = ({ fragment }: Props) => {
  const headingId = useId();

  return (
    <section
      aria-labelledby={headingId}
      className="container-page pt-12 pb-4 sm:pt-16 lg:pt-20 lg:pb-8"
    >
      <CenteredText fragment={fragment} headingId={headingId} />
    </section>
  );
};

export default MinimalHero;
