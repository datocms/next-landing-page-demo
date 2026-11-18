import { SharedElement } from '@/components/layout/PageTransition';
import { TeamSectionFragment } from '@/components/sections/TeamSection/fragment';
import AppLink from '@/components/ui/AppLink';
import Avatar from '@/components/ui/Avatar';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import type { ResolvedGlobalPageProps } from '@/utils/globalPageProps';
import { authorUrl } from '@/utils/routes';

type Props = {
  fragment: FragmentOf<typeof TeamSectionFragment>;
  globalPageProps: ResolvedGlobalPageProps;
};

/**
 * `compact`: one pale tile per member (round avatar,
 * name, role) in three columns on desktop, two on tablets and one on phones. Each
 * card links to the member's author page, where its avatar travels to the
 * portrait at the top (SharedElement).
 */
const TeamCompact = ({ fragment, globalPageProps }: Props) => {
  const { showcasedMembers: members } = readFragment(
    TeamSectionFragment,
    fragment,
  );
  const NameHeading = 'h2';

  return (
    <section className="section">
      <div className="container-page">
        <ul className="grid gap-[18px] md:grid-cols-2 lg:grid-cols-3">
          {members.map((member) => (
            <li key={member.id} className="reveal">
              <AppLink
                href={authorUrl(globalPageProps, member.slug)}
                className="tile group flex h-full items-center gap-4 p-5 transition-[background-color,translate] duration-200 ease-[cubic-bezier(0.2,0.7,0.2,1)] hover:bg-tint motion-safe:hover:-translate-y-0.5"
              >
                <SharedElement
                  kind="portrait"
                  href={authorUrl(globalPageProps, member.slug)}
                >
                  <Avatar
                    image={member.avatar?.responsiveImage}
                    name={member.name}
                    size={56}
                  />
                </SharedElement>
                <span className="min-w-0">
                  <NameHeading className="text-h3 transition-colors duration-150 group-hover:text-accent-ink">
                    {member.name}
                  </NameHeading>
                  {member.role && (
                    <span className="mt-1 block text-small text-fg-muted">
                      {member.role}
                    </span>
                  )}
                </span>
              </AppLink>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default TeamCompact;
