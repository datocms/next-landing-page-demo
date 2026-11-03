import { stripStega } from '@datocms/content-link';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useId } from 'react';
import DatoImage from '@/components/datocms/DatoImage';
import { TeamSectionFragment } from '@/components/sections/TeamSection/fragment';
import SectionTitle from '@/components/ui/SectionTitle';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import {
  buildUrl,
  type ResolvedGlobalPageProps,
} from '@/utils/globalPageProps';
import initialsOf from '@/utils/initialsOf';

type Props = {
  fragment: FragmentOf<typeof TeamSectionFragment>;
  globalPageProps: ResolvedGlobalPageProps;
  /** Pass "h1" when this block opens the page, so its title doubles as the page header */
  as?: 'h1' | 'h2';
};

/**
 * Profile cells (the "compact" option): one hairline grid of rows, each a
 * rounded-square portrait, the name and a mono role, the whole cell linking to
 * the author page (a forward arrow marks it as internal).
 */
const ProfileCells = ({ fragment, globalPageProps, as = 'h2' }: Props) => {
  const {
    title,
    subtitle,
    showcasedMembers: members,
  } = readFragment(TeamSectionFragment, fragment);
  const headingId = `team-${useId().replace(/[^\w-]/g, '')}`;

  if (members.length === 0) {
    return null;
  }

  const MemberHeading = as === 'h1' ? 'h2' : 'h3';

  return (
    <section
      className="section"
      aria-labelledby={title ? headingId : undefined}
    >
      <div className="container-page">
        <SectionTitle
          title={title}
          paragraph={subtitle}
          align="split"
          as={as}
          h1Size="section"
          id={headingId}
        />

        <ul className="cells reveal grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {members.map((member) => (
            <li
              key={member.id}
              className="group relative grid h-20 grid-cols-[56px_minmax(0,1fr)_16px] items-center gap-x-4 px-4 py-3 transition-colors duration-150 hover:bg-well md:h-[88px] md:grid-cols-[64px_minmax(0,1fr)_16px]"
            >
              <span className="photo block size-14 rounded-[14px] md:size-16">
                {member.picture?.responsiveImage ? (
                  <DatoImage
                    layout="fill"
                    objectFit="cover"
                    objectPosition="50% 25%"
                    sizes="64px"
                    fragment={member.picture.responsiveImage}
                  />
                ) : (
                  <span
                    aria-hidden="true"
                    className="grid size-full place-items-center bg-well font-display text-[18px] font-medium tracking-[-0.01em] text-ink-2 md:text-[20px]"
                  >
                    {initialsOf(member.name ?? '')}
                  </span>
                )}
              </span>
              <div className="min-w-0">
                <MemberHeading className="truncate font-display text-[16px]/[1.3] font-medium tracking-[-0.01em] text-ink">
                  <Link
                    href={buildUrl(
                      globalPageProps,
                      `/posts/author/${stripStega(member.slug)}`,
                    )}
                    className="stretched-link [--stretched-offset:-2px] [--stretched-radius:0]"
                  >
                    {member.name}
                  </Link>
                </MemberHeading>
                {member.bio && (
                  <p className="mono mt-1 truncate">{member.bio}</p>
                )}
              </div>
              <ArrowRight
                aria-hidden="true"
                strokeWidth={1.75}
                className="btn-arrow size-3.5 text-ink-3 transition-[color,translate] duration-150 group-hover:text-ink motion-safe:group-hover:translate-x-0.5 rtl:rotate-180 rtl:motion-safe:group-hover:-translate-x-0.5"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default ProfileCells;
