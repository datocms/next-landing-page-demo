import { stripStega } from '@datocms/content-link';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import type { ResolvedGlobalPageProps } from '@/utils/globalPageProps';
import { TeamSectionFragment } from './fragment';
import PortraitGrid from './variants/PortraitGrid';
import ProfileCells from './variants/ProfileCells';

type Props = {
  fragment: FragmentOf<typeof TeamSectionFragment>;
  globalPageProps: ResolvedGlobalPageProps;
  /** h1 when the section opens a page without a hero */
  as?: 'h1' | 'h2';
};

/** Renders the layout picked in the block's "Display options" field */
const TeamSection = ({ fragment, globalPageProps, as }: Props) => {
  const { displayOptions } = readFragment(TeamSectionFragment, fragment);
  const props = { fragment, globalPageProps, as };

  return stripStega(displayOptions ?? '') === 'compact' ? (
    <ProfileCells {...props} />
  ) : (
    <PortraitGrid {...props} />
  );
};

export default TeamSection;
