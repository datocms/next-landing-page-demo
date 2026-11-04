import type { ResultOf } from '@/lib/datocms/graphql';
import type { HeroSectionFragment } from './fragment';
import HeroButtons from './HeroButtons';
import HeroSubtitle from './HeroSubtitle';
import HeroTitle from './HeroTitle';

type Hero = ResultOf<typeof HeroSectionFragment>;

type Props = {
  headingId: string;
  title: Hero['heroTitle'];
  subtitle: Hero['heroSubtitle'];
  buttons: Hero['buttons'];
};

/** The copy column beside the media of DefaultHero and RightImageHero */
const HeroCopyColumn = ({ headingId, title, subtitle, buttons }: Props) => (
  <div className="col-span-full max-w-[620px] lg:col-span-6 lg:max-w-none">
    <HeroTitle id={headingId} title={title} className="max-w-[588px]" />
    <HeroSubtitle
      text={subtitle}
      className="mt-[18px] max-w-[520px] text-lead text-ink-2 max-md:mt-4 [&_p+p]:mt-3"
    />
    <HeroButtons buttons={buttons} className="mt-7 max-md:mt-6" />
  </div>
);

export default HeroCopyColumn;
