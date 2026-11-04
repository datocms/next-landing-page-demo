import { stripStega } from '@datocms/content-link';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { type CSSProperties, useId } from 'react';
import DatoStructuredText from '@/components/datocms/DatoStructuredText';
import SectionTitle from '@/components/ui/SectionTitle';
import TwoTone from '@/components/ui/TwoTone';
import {
  type FragmentOf,
  type ResultOf,
  readFragment,
} from '@/lib/datocms/graphql';
import { uiString } from '@/lib/i18n/uiStrings';
import { cn } from '@/utils/cn';
import { formatDate } from '@/utils/formatDate';
import type { ResolvedGlobalPageProps } from '@/utils/globalPageProps';
import {
  itemHeadingLevel,
  type SectionHeadingLevel,
} from '@/utils/headingLevel';
import { changelogUrl } from '@/utils/routes';
import { hasStructuredText } from '@/utils/structuredText';
import { toneClass } from '@/utils/tones';
import { ChangelogSectionFragment } from './fragment';

type Release = ResultOf<
  typeof ChangelogSectionFragment
>['featuredVersions'][number];

type Props = {
  fragment: FragmentOf<typeof ChangelogSectionFragment>;
  globalPageProps: ResolvedGlobalPageProps;
  as?: SectionHeadingLevel;
};

/** Release time in ms, or null when the CMS value is missing or not a date */
const releaseTime = (value?: string | null) => {
  if (!value) return null;
  const time = new Date(stripStega(value)).getTime();
  return Number.isNaN(time) ? null : time;
};

/** Id of the release with the newest valid date (ties go to the first in CMS order) */
const newestReleaseId = (releases: Release[]) => {
  let newestId: string | null = null;
  let newestTime = Number.NEGATIVE_INFINITY;
  for (const release of releases) {
    const time = releaseTime(release.timeOfRelease);
    if (time !== null && time > newestTime) {
      newestTime = time;
      newestId = release.id;
    }
  }
  return newestId;
};

/**
 * Release timeline: a sticky head on the left and, on the right, row cards
 * joined by an accent-gradient rail through tone nodes. Only the newest
 * release carries "Latest".
 */
const ChangelogSection = ({ fragment, globalPageProps, as = 'h2' }: Props) => {
  const { title, subtitle, featuredVersions } = readFragment(
    ChangelogSectionFragment,
    fragment,
  );
  const headingId = useId();

  const leadsPage = as === 'h1';
  const RowHeading = itemHeadingLevel(as);
  const latestLabel = uiString(globalPageProps.params.locale, 'latest');
  const latestId = newestReleaseId(featuredVersions);

  return (
    <section
      aria-labelledby={title ? headingId : undefined}
      className={leadsPage ? 'pt-12 pb-24 max-md:pt-8 max-md:pb-16' : 'section'}
    >
      <div className="container-page lg:grid lg:grid-cols-12 lg:gap-x-6">
        <div className="lg:sticky lg:top-[calc(var(--header-h)+2rem)] lg:col-span-5 lg:self-start">
          {leadsPage ? (
            <header className="max-w-[620px]">
              {title && (
                // One Visual Editing target for both halves of the split title
                <h1
                  id={headingId}
                  data-datocms-content-link-group
                  className="text-h1 text-ink"
                >
                  <TwoTone text={title} lineBreak="always" />
                </h1>
              )}
              {hasStructuredText(subtitle) && (
                <div className="section-lead mt-4 [--lead-max:40ch]">
                  <DatoStructuredText data={subtitle} />
                </div>
              )}
            </header>
          ) : (
            <SectionTitle
              title={title}
              paragraph={subtitle}
              id={headingId}
              gap="none"
              className="[--lead-max:40ch]"
            />
          )}
        </div>

        {featuredVersions.length > 0 && (
          <ol
            className="changelog-rail changelog-rail-draw reveal-stagger grid auto-rows-fr gap-3 max-lg:mt-10 max-md:mt-8 lg:col-span-7 lg:col-start-6"
            style={{ '--rail-rows': featuredVersions.length } as CSSProperties}
          >
            {featuredVersions.map((release, index) => {
              const date = release.timeOfRelease
                ? formatDate(release.timeOfRelease)
                : null;

              return (
                <li
                  key={release.id}
                  className={cn(toneClass(index), 'relative ps-8')}
                >
                  <span
                    aria-hidden="true"
                    className="absolute start-[7px] top-1/2 size-2.5 -translate-y-1/2 rounded-full bg-tone-grad shadow-[0_0_0_3px_var(--bg),0_0_0_4px_var(--line)]"
                  />
                  <Link
                    href={changelogUrl(globalPageProps, release.slug)}
                    className="card card-hover group grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-[18px] max-md:p-4"
                  >
                    <div className="min-w-0">
                      <div className="flex h-6 items-center gap-2.5">
                        {date && (
                          <time dateTime={date.iso} className="mono">
                            {date.label}
                          </time>
                        )}
                        {release.id === latestId && (
                          <span className="chip tone-0">{latestLabel}</span>
                        )}
                      </div>
                      <RowHeading className="mt-1.5 font-display text-[1.125rem]/[1.3] font-medium tracking-[-0.01em] text-ink decoration-line-strong underline-offset-4 group-hover:underline max-md:text-h3">
                        {release.versionName}
                      </RowHeading>
                    </div>
                    <span
                      aria-hidden="true"
                      className="grid size-8 place-items-center rounded-full bg-well text-ink-2 transition-colors duration-200 group-hover:bg-accent-solid group-hover:text-white group-focus-visible:bg-accent-solid group-focus-visible:text-white"
                    >
                      <ArrowRight
                        strokeWidth={1.75}
                        className="size-4 duration-200 ease-out-quint motion-safe:transition-transform motion-safe:group-hover:translate-x-0.5 rtl:-scale-x-100"
                      />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </section>
  );
};

export default ChangelogSection;
