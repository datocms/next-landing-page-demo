import type { CSSProperties } from 'react';
import { SharedElement } from '@/components/layout/PageTransition';
import AppLink from '@/components/ui/AppLink';
import Chip from '@/components/ui/Chip';
import { ArrowRightIcon } from '@/components/ui/icons';
import { fieldEditUrl } from '@/lib/datocms/contentLink';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import { uiString } from '@/lib/i18n/uiStrings';
import { cn } from '@/utils/cn';
import type { ResolvedGlobalPageProps } from '@/utils/globalPageProps';
import { localDate } from '@/utils/localDate';
import { changelogUrl } from '@/utils/routes';
import { ChangelogSectionFragment } from './fragment';
import motion from './motion.module.css';
import { releaseSummary } from './summary';
import VersionName from './VersionName';

type Props = {
  fragment: FragmentOf<typeof ChangelogSectionFragment>;
  globalPageProps: ResolvedGlobalPageProps;
};

/**
 * The featured releases, newest first (undated ones
 * last, in CMS order). The newest dated release is a large navy tile: the
 * "Latest" badge and its date, its version number set big, its summary. The
 * others follow as a timeline: the date in a quiet column, a dot on a spine,
 * and a pale tile with the version number large and a short summary taken
 * from the notes. Every release links to its page. The newest tile rises in
 * on load (motion.module.css). Opening a release, its
 * tile grows into the release page's header (SharedElement).
 */
const ChangelogSection = ({ fragment, globalPageProps }: Props) => {
  const { featuredVersions } = readFragment(ChangelogSectionFragment, fragment);
  const { locale } = globalPageProps.params;
  // The section has no heading of its own: each release is a heading under the page's h1
  const RowHeading = 'h2';

  const releases = featuredVersions
    .map((release, order) => ({
      ...release,
      order,
      date: localDate(release.timeOfRelease, locale),
      summary: releaseSummary(release.content?.value),
    }))
    .sort(
      (a, b) =>
        (b.date?.time ?? Number.NEGATIVE_INFINITY) -
          (a.date?.time ?? Number.NEGATIVE_INFINITY) || a.order - b.order,
    );
  const latest = releases[0]?.date ? releases[0] : null;
  const older = latest ? releases.slice(1) : releases;

  return (
    <section className="section">
      <div className="container-page">
        {releases.length > 0 && (
          <ol className="mx-auto max-w-[60rem]">
            {latest && (
              <li className={cn(older.length > 0 && 'mb-14 sm:mb-20')}>
                <SharedElement
                  kind="release"
                  href={changelogUrl(globalPageProps, latest.slug)}
                >
                  <AppLink
                    href={changelogUrl(globalPageProps, latest.slug)}
                    style={{ '--delay': '80ms' } as CSSProperties}
                    className={cn(
                      'group relative grid overflow-hidden rounded-card bg-ink p-7 text-surface sm:p-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,21rem)] lg:gap-x-14 lg:p-12',
                      motion.enter,
                    )}
                  >
                    {/* The faint rings of the strong tiles (stats, feature mosaic) */}
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute -top-[90px] -right-[90px] max-sm:-top-[140px] max-sm:-right-[140px] size-[190px] rounded-full shadow-[0_0_0_52px_rgb(255_255_255/0.07),0_0_0_108px_rgb(255_255_255/0.045),0_0_0_168px_rgb(255_255_255/0.025)]"
                    />
                    <span className="relative flex flex-wrap items-center gap-x-3 gap-y-2 lg:col-span-2">
                      <Chip tone="solid">{uiString(locale, 'latest')}</Chip>
                      {latest.date && (
                        <time
                          dateTime={latest.date.iso}
                          data-datocms-content-link-url={fieldEditUrl(
                            latest.versionName,
                            'time_of_release',
                          )}
                          className="text-small text-surface/70 tabular-nums"
                        >
                          {latest.date.label}
                        </time>
                      )}
                    </span>
                    <RowHeading className="relative mt-12 sm:mt-16 lg:self-end">
                      <VersionName
                        name={latest.versionName}
                        labelClassName="mb-3 text-surface/70"
                        numberClassName="text-[clamp(4.5rem,13vw,9rem)]"
                        plainClassName="text-h1"
                      />
                    </RowHeading>
                    <span className="relative mt-8 flex flex-col gap-8 lg:mt-12 lg:self-end">
                      {latest.summary && (
                        <span
                          data-datocms-content-link-url={fieldEditUrl(
                            latest.versionName,
                            'content.{locale}',
                            locale,
                          )}
                          className="line-clamp-6 text-lead text-surface/80"
                        >
                          {latest.summary}
                        </span>
                      )}
                      <span
                        aria-hidden="true"
                        className="grid size-12 place-items-center rounded-full bg-accent text-on-accent"
                      >
                        <ArrowRightIcon className="size-5 transition-transform duration-200 ease-out motion-safe:group-hover:translate-x-0.5" />
                      </span>
                    </span>
                  </AppLink>
                </SharedElement>
              </li>
            )}

            {older.map((release, index) => {
              const last = index === older.length - 1;
              return (
                <li
                  key={release.id}
                  className={cn(
                    'grid grid-cols-[1.75rem_minmax(0,1fr)] gap-x-3 sm:grid-cols-[9rem_3.5rem_minmax(0,1fr)] sm:gap-x-0',
                  )}
                >
                  {/* The date: above the tile on phones, in its own quiet column from 640px */}
                  {release.date ? (
                    <time
                      dateTime={release.date.iso}
                      data-datocms-content-link-url={fieldEditUrl(
                        release.versionName,
                        'time_of_release',
                      )}
                      className="col-start-2 pb-2 text-small text-fg-muted tabular-nums sm:col-start-1 sm:row-start-1 sm:pt-[1.875rem] sm:pr-2 sm:pb-0 sm:text-end"
                    >
                      {release.date.label}
                    </time>
                  ) : (
                    <span className="max-sm:hidden" />
                  )}

                  {/* The spine: a dot level with the date, a line down to the next dot */}
                  <span
                    aria-hidden="true"
                    className="relative col-start-1 row-span-2 row-start-1 sm:col-start-2 sm:row-span-1"
                  >
                    {!last && (
                      <span
                        className={cn(
                          'absolute top-[0.6875rem] -bottom-[0.6875rem] left-1/2 w-0.5 -translate-x-1/2 rounded-full bg-tint sm:top-[2.4375rem] sm:-bottom-[2.4375rem]',
                        )}
                      />
                    )}
                    <span
                      className={cn(
                        'absolute top-1.5 left-1/2 size-3 -translate-x-1/2 rounded-full border-[2.5px] border-accent bg-surface ring-4 ring-surface sm:top-[1.9375rem]',
                      )}
                    />
                  </span>

                  <div
                    className={cn(
                      'col-start-2 min-w-0 sm:col-start-3 sm:row-start-1',
                      !last && 'pb-6 sm:pb-8',
                    )}
                  >
                    <SharedElement
                      kind="release"
                      href={changelogUrl(globalPageProps, release.slug)}
                    >
                      <AppLink
                        href={changelogUrl(globalPageProps, release.slug)}
                        className="tile group grid gap-x-8 gap-y-4 p-6 transition-colors duration-150 hover:bg-tint sm:p-7 md:grid-cols-[minmax(0,10rem)_minmax(0,1fr)]"
                      >
                        <RowHeading>
                          <VersionName
                            name={release.versionName}
                            // "Version" shows once, on the latest release: here it is only read
                            labelClassName="sr-only"
                            numberClassName="text-[clamp(2.5rem,5vw,3.5rem)]"
                            plainClassName="text-h3"
                          />
                        </RowHeading>
                        {release.summary && (
                          <span
                            data-datocms-content-link-url={fieldEditUrl(
                              release.versionName,
                              'content.{locale}',
                              locale,
                            )}
                            className="line-clamp-6 self-center text-body md:line-clamp-4 text-fg"
                          >
                            <span className="title-underline">
                              {release.summary}
                            </span>
                          </span>
                        )}
                      </AppLink>
                    </SharedElement>
                  </div>
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
