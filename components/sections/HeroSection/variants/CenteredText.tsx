import Announcement from '@/components/sections/HeroSection/Announcement';
import { HeroSectionFragment } from '@/components/sections/HeroSection/fragment';
import {
  HeroLead,
  HeroTitle,
} from '@/components/sections/HeroSection/HeroCopy';
import CmsButtons from '@/components/ui/CmsButtons';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';

type Props = {
  fragment: FragmentOf<typeof HeroSectionFragment>;
  headingId: string;
};

/**
 * The centred copy shared by `centered` and `minimal`: announcement, headline,
 * lead and the buttons row, rising in one after another on load
 */
const CenteredText = ({ fragment, headingId }: Props) => {
  const { title, subtitle, announcement, announcementLabel, buttons } =
    readFragment(HeroSectionFragment, fragment);

  return (
    <div className="mx-auto flex max-w-[56rem] flex-col items-center text-center">
      <Announcement
        field={announcement}
        label={announcementLabel}
        className="arrive mb-6"
      />
      <HeroTitle
        id={headingId}
        title={title}
        className="arrive max-w-[18ch] [--arrive:70ms]"
      />
      <HeroLead
        text={subtitle}
        className="arrive mt-6 max-w-[39rem] text-fg/80 [--arrive:150ms]"
      />
      {/* On phones the buttons stack at full width rather than at two different widths */}
      <CmsButtons
        buttons={buttons}
        size="lg"
        align="center"
        className="arrive mt-9 w-full [--arrive:230ms] max-sm:flex-col max-sm:[&>a]:w-full"
      />
    </div>
  );
};

export default CenteredText;
