import { stripStega } from '@datocms/content-link';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import type { ResolvedGlobalPageProps } from '@/utils/globalPageProps';
import type { SectionHeadingLevel } from '@/utils/headingLevel';
import { TeamSectionFragment } from './fragment';
import PortraitGrid from './variants/PortraitGrid';
import ProfileCells from './variants/ProfileCells';

type Props = {
  fragment: FragmentOf<typeof TeamSectionFragment>;
  globalPageProps: ResolvedGlobalPageProps;
  as?: SectionHeadingLevel;
};

/** Renders the layout picked in the block's "Display options" field, or nothing without members */
const TeamSection = ({ fragment, globalPageProps, as }: Props) => {
  const { displayOptions, showcasedMembers } = readFragment(
    TeamSectionFragment,
    fragment,
  );
  if (showcasedMembers.length === 0) return null;

  switch (stripStega(displayOptions)) {
    case 'compact':
      return (
        <ProfileCells
          fragment={fragment}
          globalPageProps={globalPageProps}
          as={as}
        />
      );
    default:
      return (
        <PortraitGrid
          fragment={fragment}
          globalPageProps={globalPageProps}
          as={as}
        />
      );
  }
};

export default TeamSection;
