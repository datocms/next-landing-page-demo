import { stripStega } from '@datocms/content-link';
import Link from 'next/link';
import { useId } from 'react';
import DatoImage from '@/components/datocms/DatoImage';
import { TeamSectionFragment } from '@/components/sections/TeamSection/fragment';
import SectionTitle from '@/components/ui/SectionTitle';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import { cn } from '@/utils/cn';
import {
  buildUrl,
  type ResolvedGlobalPageProps,
} from '@/utils/globalPageProps';
import initialsOf from '@/utils/initialsOf';
import { toneClass } from '@/utils/tones';

type Props = {
  fragment: FragmentOf<typeof TeamSectionFragment>;
  globalPageProps: ResolvedGlobalPageProps;
  /** Pass "h1" when this block opens the page, so its title doubles as the page header */
  as?: 'h1' | 'h2';
};

/**
 * Portrait grid (the default): tone-ringed circles, three to a row (two at md,
 * a list of rows on phones), each with the portrait, name, role and
 * description, the whole tile linking to the author page. Each ring takes the
 * next tone of the accent.
 */
const PortraitGrid = ({ fragment, globalPageProps, as = 'h2' }: Props) => {
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

        <ul className="reveal-stagger flex flex-wrap justify-center gap-x-6 gap-y-6 md:gap-y-12">
          {members.map((member, index) => (
            <li
              key={member.id}
              className={cn(
                'group relative grid basis-full grid-cols-[72px_minmax(0,1fr)] items-start gap-x-4 md:block md:basis-[calc((100%-24px)/2)] md:text-center lg:basis-[calc((100%-48px)/3)]',
                toneClass(index),
              )}
            >
              <span className="ring-tone media-zoom mx-auto mt-[5px] block size-[72px] rounded-full md:size-[120px]">
                <span className="photo block size-full rounded-full">
                  {member.picture?.responsiveImage ? (
                    <DatoImage
                      layout="fill"
                      objectFit="cover"
                      objectPosition="50% 30%"
                      sizes="(min-width: 768px) 120px, 72px"
                      fragment={member.picture.responsiveImage}
                    />
                  ) : (
                    <span
                      aria-hidden="true"
                      className="grid size-full place-items-center bg-tone-wash font-display text-[24px] font-medium tracking-[-0.02em] text-tone-text md:text-[36px]"
                    >
                      {initialsOf(member.name ?? '')}
                    </span>
                  )}
                </span>
              </span>

              <div className="min-w-0 pt-1.5 md:pt-0">
                <MemberHeading className="font-display text-[16px]/[1.3] font-medium tracking-[-0.01em] text-ink md:mt-3.5">
                  <Link
                    href={buildUrl(
                      globalPageProps,
                      `/posts/author/${stripStega(member.slug)}`,
                    )}
                    className="stretched-link decoration-line-strong underline-offset-4 group-hover:underline focus-visible:underline"
                  >
                    {member.name}
                  </Link>
                </MemberHeading>
                {member.bio && (
                  <p className="mt-0.5 text-caption text-ink-3">{member.bio}</p>
                )}
                {member.description && (
                  <p className="mt-2 text-[14px]/[1.55] text-pretty text-ink-2 max-md:line-clamp-3 md:mx-auto md:mt-3 md:max-w-[38ch] md:text-[14.5px]/[1.55]">
                    {member.description}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default PortraitGrid;
