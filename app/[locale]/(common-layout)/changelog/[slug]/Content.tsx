import { stripStega } from '@datocms/content-link';
import { isBlockquote, isCode, isHeading } from 'datocms-structured-text-utils';
import { notFound } from 'next/navigation';
import { renderNodeRule } from 'react-datocms/structured-text';
import DatoStructuredText from '@/components/datocms/DatoStructuredText';
import CodeBlock from '@/components/ui/CodeBlock';
import QuoteBlock from '@/components/ui/QuoteBlock';
import type { ContentPage } from '@/lib/datocms/realtime/types';
import { uiString } from '@/lib/i18n/uiStrings';
import { cn } from '@/utils/cn';
import formatPostDate from '@/utils/formatPostDate';
import { buildUrl } from '@/utils/globalPageProps';
import { rootNodes } from '@/utils/rootNodes';
import { MARKER_SHAPES } from '@/utils/tones';
import type { PageProps, Query } from './meta';
import ReleaseRail, { type Release } from './ReleaseRail';

const Content: ContentPage<PageProps, Query> = ({
  data,
  ...globalPageProps
}) => {
  if (!data.changeLog) {
    notFound();
  }

  const { changeLog } = data;
  const { locale } = globalPageProps.params;
  const releaseDate = changeLog.timeOfRelease
    ? formatPostDate(changeLog.timeOfRelease)
    : null;

  // The top headings of the entry (its section titles) carry a tone shape
  const headings = rootNodes(changeLog.content?.value).filter(isHeading);
  const topLevel = headings.length
    ? Math.min(...headings.map((node) => node.level))
    : 0;
  const topHeadings = headings.filter((node) => node.level === topLevel);

  const currentSlug = stripStega(changeLog.slug);
  const releases: Release[] = data.allChangeLogs.map((release) => ({
    ...release,
    date: release.timeOfRelease ? formatPostDate(release.timeOfRelease) : null,
    href: buildUrl(globalPageProps, `/changelog/${stripStega(release.slug)}`),
    isCurrent: stripStega(release.slug) === currentSlug,
  }));

  return (
    <div className="container-page pt-12 pb-24 max-md:pt-8 max-md:pb-16 lg:grid lg:grid-cols-12 lg:gap-x-6">
      <ReleaseRail
        releases={releases}
        changelogHref={buildUrl(globalPageProps, '/changelog')}
        locale={locale}
      />

      {/* Capped at the reading measure, like posts and legal pages */}
      <article className="min-w-0 max-w-reading max-lg:mt-8 lg:col-span-8 lg:col-start-5">
        {releaseDate && (
          <p className="mono">
            <span className="sr-only">{`${uiString(locale, 'released')} `}</span>
            <time dateTime={releaseDate.iso}>{releaseDate.label}</time>
          </p>
        )}
        <h1 className={cn('text-title text-ink', releaseDate && 'mt-3')}>
          {changeLog.versionName}
        </h1>

        <div className="prose mt-10 max-md:mt-8">
          <DatoStructuredText
            data={changeLog.content}
            customNodeRules={[
              // The version name is the only h1: levels shift so the top
              // headings render as h2, right below it
              renderNodeRule(isHeading, ({ node, children, key }) => {
                const level = Math.min(
                  6,
                  Math.max(2, node.level - (topLevel || node.level) + 2),
                );
                const HeadingTag = `h${level}` as
                  | 'h2'
                  | 'h3'
                  | 'h4'
                  | 'h5'
                  | 'h6';
                const markIndex = topHeadings.indexOf(node);
                if (markIndex === -1) {
                  return <HeadingTag key={key}>{children}</HeadingTag>;
                }
                return (
                  <HeadingTag key={key} className="flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className={
                        MARKER_SHAPES[markIndex % MARKER_SHAPES.length]
                      }
                    />
                    <span className="min-w-0">{children}</span>
                  </HeadingTag>
                );
              }),
              renderNodeRule(isBlockquote, ({ children, key }) => (
                <QuoteBlock key={key}>{children}</QuoteBlock>
              )),
              renderNodeRule(isCode, ({ node, key }) => (
                <CodeBlock
                  key={key}
                  code={node.code}
                  language={node.language}
                  highlight={node.highlight}
                  locale={locale}
                />
              )),
            ]}
          />
        </div>
      </article>
    </div>
  );
};

export default Content;
