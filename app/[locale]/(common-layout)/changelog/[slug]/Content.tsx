import {
  type Document,
  isDocument,
  isHeading,
} from 'datocms-structured-text-utils';
import { notFound } from 'next/navigation';
import type { CSSProperties } from 'react';
import { renderNodeRule } from 'react-datocms/structured-text';
import DatoStructuredText from '@/components/datocms/DatoStructuredText';
import { longFormNodeRules } from '@/components/datocms/DatoStructuredText/longFormNodeRules';
import { SharedElement } from '@/components/layout/PageTransition';
import motion from '@/components/sections/ChangelogSection/motion.module.css';
import VersionName from '@/components/sections/ChangelogSection/VersionName';
import AppLink from '@/components/ui/AppLink';
import Chip from '@/components/ui/Chip';
import { ArrowRightIcon } from '@/components/ui/icons';
import { fieldEditUrl } from '@/lib/datocms/contentLink';
import type { ContentComponent } from '@/lib/datocms/realtime/types';
import { uiLabel, uiString } from '@/lib/i18n/uiStrings';
import { cn } from '@/utils/cn';
import { bodyHeadingTag } from '@/utils/headingLevel';
import { localDate } from '@/utils/localDate';
import { changelogUrl, pageUrl } from '@/utils/routes';
import { rootNodes } from '@/utils/structuredText';
import type { PageProps, Query } from './meta';

/**
 * A release's page, in the changelog list's language. A large tile opens it:
 * navy when this is the newest release (with the "Latest" badge), the pale
 * tint otherwise, holding the way back to the changelog, the version number
 * set big and the release date. It rises in on load (the list's
 * motion.module.css); opened from the changelog, the release's tile grows into
 * it. Then the notes, and the previous (older) and next (newer) releases as two
 * pale tiles, which move along the sequence (their rel).
 */
const Content: ContentComponent<PageProps, Query> = ({
  data,
  ...globalPageProps
}) => {
  if (!data.changelogEntry) {
    notFound();
  }

  const { changelogEntry } = data;
  const { locale } = globalPageProps.params;
  const released = localDate(changelogEntry.timeOfRelease, locale);

  // Every release, newest first (undated ones last, in the order received)
  const releases = data.releases
    .map((release, order) => ({
      ...release,
      order,
      date: localDate(release.timeOfRelease, locale),
    }))
    .sort(
      (a, b) =>
        (b.date?.time ?? Number.NEGATIVE_INFINITY) -
          (a.date?.time ?? Number.NEGATIVE_INFINITY) || a.order - b.order,
    );
  const index = releases.findIndex(
    (release) => release.slug === changelogEntry.slug,
  );
  const isLatest = index === 0 && Boolean(released);
  const neighbours =
    index === -1
      ? []
      : [
          {
            release: releases[index + 1],
            label: uiLabel(locale, 'previousPage'),
            rel: 'prev',
          },
          {
            release: releases[index - 1],
            label: uiLabel(locale, 'nextPage'),
            rel: 'next',
          },
        ];
  const hasNeighbours = neighbours.some(({ release }) => release);

  // The version name is the only h1: the entry's top headings render as h2
  const headings = rootNodes(changelogEntry.content?.value).filter(isHeading);
  const topLevel = headings.length
    ? Math.min(...headings.map((node) => node.level))
    : 0;

  // The notes cut at every top heading: each chapter is its own box, so its heading
  // stays in view only beside its own changes (styles/prose.css, .prose-changelog)
  const { content } = changelogEntry;
  const notes = isDocument(content?.value) ? content.value : null;
  type Nodes = Document['document']['children'];
  const chapters: { heading: Nodes; body: Nodes }[] = [];
  for (const node of notes?.document.children ?? []) {
    if (isHeading(node) && node.level === topLevel) {
      chapters.push({ heading: [node], body: [] });
    } else if (chapters.length === 0) {
      chapters.push({ heading: [], body: [node] });
    } else {
      chapters[chapters.length - 1].body.push(node);
    }
  }
  const part = (children: Nodes) =>
    content && notes
      ? {
          ...content,
          value: { ...notes, document: { ...notes.document, children } },
        }
      : null;
  const nodeRules = [
    renderNodeRule(isHeading, ({ node, children, key }) => {
      const HeadingTag = bodyHeadingTag(
        node.level - (topLevel || node.level) + 2,
      );
      return <HeadingTag key={key}>{children}</HeadingTag>;
    }),
    ...longFormNodeRules(locale),
  ];

  return (
    <article className="container-page pt-(--page-top)">
      {/* The release's tile on the changelog that opened this page grows into it */}
      <SharedElement
        kind="release"
        href={changelogUrl(globalPageProps, globalPageProps.params.slug)}
      >
        <header
          style={{ '--delay': '60ms' } as CSSProperties}
          className={cn(
            'relative mx-auto flex max-w-[60rem] flex-col overflow-hidden rounded-card p-7 sm:p-10 lg:p-12',
            isLatest ? 'on-ink bg-ink text-surface' : 'bg-tint text-fg',
            motion.enter,
          )}
        >
          {isLatest && (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -top-[90px] -right-[90px] size-[190px] rounded-full shadow-[0_0_0_52px_rgb(255_255_255/0.07),0_0_0_108px_rgb(255_255_255/0.045),0_0_0_168px_rgb(255_255_255/0.025)] max-sm:-top-[140px] max-sm:-right-[140px]"
            />
          )}
          <div className="relative flex flex-wrap items-center gap-3">
            {/* The way back, as a pill */}
            <AppLink
              href={pageUrl(globalPageProps, 'changelog')}
              className={cn(
                'hit-44 inline-flex min-h-8 items-center gap-1.5 rounded-chip px-3.5 text-small font-semibold transition-colors duration-150',
                isLatest
                  ? 'bg-[rgb(255_255_255/0.1)] text-surface hover:bg-[rgb(255_255_255/0.18)]'
                  : 'bg-surface text-accent-ink hover:bg-subtle',
              )}
            >
              <ArrowRightIcon className="size-3.5 rotate-180" />
              {uiLabel(locale, 'changelog')}
            </AppLink>
            {isLatest && <Chip tone="solid">{uiLabel(locale, 'latest')}</Chip>}
          </div>
          <h1 className="relative mt-14 sm:mt-20">
            <VersionName
              name={changelogEntry.versionName}
              labelClassName={cn(
                'mb-3',
                isLatest ? 'text-surface/70' : 'text-fg-muted',
              )}
              numberClassName="text-[clamp(4.5rem,13vw,9rem)]"
              plainClassName="text-h1"
            />
          </h1>
          {released && (
            <p
              className={cn(
                'relative mt-5 text-small tabular-nums',
                isLatest ? 'text-surface/70' : 'text-fg-muted',
              )}
            >
              {`${uiLabel(locale, 'released')} `}
              <time
                dateTime={released.iso}
                data-datocms-content-link-url={fieldEditUrl(
                  changelogEntry.versionName,
                  'time_of_release',
                )}
              >
                {released.label}
              </time>
            </p>
          )}
        </header>
      </SharedElement>

      {/* As wide as the release's panel above: chapter names on the left, their changes on the right */}
      <div className="mx-auto max-w-[60rem]">
        <div
          // Content Link: the notes' only marker can sit on a part the page
          // leaves out, so the text opens the content field itself
          data-datocms-content-link-url={fieldEditUrl(
            changelogEntry.versionName,
            'content.{locale}',
            locale,
          )}
          className="prose prose-changelog mt-12 lg:mt-16"
        >
          {chapters.map(({ heading, body }, position) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: the chapters follow the notes' order
            <div key={position}>
              {heading.length > 0 && (
                <DatoStructuredText
                  data={part(heading)}
                  customNodeRules={nodeRules}
                />
              )}
              {body.length > 0 && (
                <DatoStructuredText
                  data={part(body)}
                  customNodeRules={nodeRules}
                />
              )}
            </div>
          ))}
        </div>

        {hasNeighbours && (
          <nav
            aria-label={uiString(locale, 'docsPagination')}
            className="mt-16 grid gap-4 sm:grid-cols-2 lg:mt-20"
          >
            {neighbours.map(({ release, label, rel }, position) =>
              release ? (
                <AppLink
                  key={release.id}
                  href={changelogUrl(globalPageProps, release.slug)}
                  rel={rel}
                  className={cn(
                    'tile group flex flex-col gap-4 p-6 transition-colors duration-150 hover:bg-tint',
                    position === 1 && 'sm:col-start-2 sm:items-end sm:text-end',
                  )}
                >
                  <span className="flex items-center gap-1.5 text-small font-medium text-fg-muted">
                    <ArrowRightIcon
                      className={cn(
                        'size-3.5 transition-transform duration-200 ease-out',
                        position === 0
                          ? 'rotate-180 motion-safe:group-hover:-translate-x-0.5'
                          : 'order-last motion-safe:group-hover:translate-x-0.5',
                      )}
                    />
                    {label}
                  </span>
                  <span>
                    <VersionName
                      name={release.versionName}
                      labelClassName="sr-only"
                      numberClassName="text-[2.5rem]"
                      plainClassName="text-h3"
                    />
                    {release.date && (
                      <time
                        dateTime={release.date.iso}
                        data-datocms-content-link-url={fieldEditUrl(
                          release.versionName,
                          'time_of_release',
                        )}
                        className="mt-2 block text-small text-fg-muted tabular-nums"
                      >
                        {release.date.label}
                      </time>
                    )}
                  </span>
                </AppLink>
              ) : null,
            )}
          </nav>
        )}
      </div>
    </article>
  );
};

export default Content;
