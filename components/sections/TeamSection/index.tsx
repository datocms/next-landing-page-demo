import { stripStega } from '@datocms/content-link';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import type { ResolvedGlobalPageProps } from '@/utils/globalPageProps';
import { TeamSectionFragment } from './fragment';
import TeamCards from './variants/TeamCards';
import TeamCompact from './variants/TeamCompact';

type Props = {
  fragment: FragmentOf<typeof TeamSectionFragment>;
  globalPageProps: ResolvedGlobalPageProps;
};

/**
 * Renders the layout picked in the block's "Layout" field
 * (`cards`, also for unknown values, or `compact`), or nothing without members
 */
const TeamSection = ({ fragment, globalPageProps }: Props) => {
  const { layout, showcasedMembers } = readFragment(
    TeamSectionFragment,
    fragment,
  );
  if (showcasedMembers.length === 0) return null;

  return stripStega(layout ?? '').trim() === 'compact' ? (
    <TeamCompact fragment={fragment} globalPageProps={globalPageProps} />
  ) : (
    <TeamCards fragment={fragment} globalPageProps={globalPageProps} />
  );
};

export default TeamSection;
