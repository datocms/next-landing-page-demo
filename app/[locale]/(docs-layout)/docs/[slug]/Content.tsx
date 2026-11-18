import { isCode, isHeading, type Node } from 'datocms-structured-text-utils';
import { notFound } from 'next/navigation';
import type { CSSProperties } from 'react';
import { renderNodeRule } from 'react-datocms/structured-text';
import DatoStructuredText from '@/components/datocms/DatoStructuredText';
import { longFormNodeRules } from '@/components/datocms/DatoStructuredText/longFormNodeRules';
import DocsPager from '@/components/docs/DocsPager';
import AppLink from '@/components/ui/AppLink';
import CodeBlock from '@/components/ui/CodeBlock';
import { ArrowRightIcon } from '@/components/ui/icons';
import TableOfContents, {
  MIN_TOC_HEADINGS,
} from '@/components/ui/TableOfContents';
import { fieldEditUrl } from '@/lib/datocms/contentLink';
import type { ContentComponent } from '@/lib/datocms/realtime/types';
import { uiString } from '@/lib/i18n/uiStrings';
import { cn } from '@/utils/cn';
import { bodyHeadingTag } from '@/utils/headingLevel';
import { headingOutline, repeatsTitle } from '@/utils/headingOutline';
import { docsHomeUrl, docsPageUrl } from '@/utils/routes';
import { rootNodes } from '@/utils/structuredText';
import { titleSize } from '@/utils/titleSize';
import type { PageProps, Query } from './meta';

/**
 * The heading level each content heading renders at. Content headings start at
 * h2 (levels 1 and 2 both render as h2) and never skip a level, whatever levels
 * the CMS text uses: each one nests one level under the nearest earlier heading
 * with a smaller level (siblings stay siblings)
 */
function nestedHeadingLevels(rootChildren: Node[], leadingTitle: Node | null) {
  const levelByNode = new Map<Node, number>();
  // The headings the current one sits under, each with the level it renders at
  const parents: { cmsLevel: number; renderedLevel: number }[] = [];

  for (const node of rootChildren) {
    if (!isHeading(node) || node === leadingTitle) continue;
    const cmsLevel = Math.max(node.level, 2);
    while (parents.length && (parents.at(-1)?.cmsLevel ?? 0) >= cmsLevel) {
      parents.pop();
    }
    const renderedLevel = Math.min(6, (parents.at(-1)?.renderedLevel ?? 1) + 1);
    parents.push({ cmsLevel, renderedLevel });
    levelByNode.set(node, renderedLevel);
  }

  return levelByNode;
}

const Content: ContentComponent<PageProps, Query> = ({
  data,
  ...globalPageProps
}) => {
  if (!data.documentationPage) {
    notFound();
  }

  const { title, subtitle, content, parent, children } = data.documentationPage;
  const subtopics = children.filter(
    (child): child is NonNullable<typeof child> => !!child,
  );
  const { locale } = globalPageProps.params;
  const scale = titleSize(title, 'h1');

  // Most pages open with a level-1 heading that repeats the page title: the
  // title field is the page's h1 already, so that heading is left out. Any
  // other level-1 content heading renders as an h2.
  const rootChildren = rootNodes(content?.value);
  const firstNode = rootChildren[0];
  const leadingTitle =
    firstNode &&
    isHeading(firstNode) &&
    firstNode.level === 1 &&
    repeatsTitle(firstNode, title)
      ? firstNode
      : null;
  const headingLevels = nestedHeadingLevels(rootChildren, leadingTitle);

  // The outline follows the rendered levels: a page whose top headings are
  // level 3 in the CMS still lists them
  const tocHeadings = headingOutline(
    rootChildren,
    leadingTitle,
    (node) => headingLevels.get(node) === 2,
  );
  const anchorIds = new Map(tocHeadings.map(({ node, id }) => [node, id]));
  const showToc = tocHeadings.length >= MIN_TOC_HEADINGS;

  // The way up, from the docs home down to the page's parent
  type Crumb = { id: string; slug: string; title: string };
  const ancestors = [parent?.parent?.parent, parent?.parent, parent].filter(
    (page): page is Crumb => !!page,
  );
  const crumbs = [
    {
      key: 'home',
      href: docsHomeUrl(globalPageProps),
      title: uiString(locale, 'docsHome'),
    },
    ...ancestors.map((page) => ({
      key: page.id,
      href: docsPageUrl(globalPageProps, page.slug),
      title: page.title,
    })),
  ];

  return (
    <div className="pt-6 lg:pt-8">
      {/* The title block: the tinted panel with the site's faint corner rings */}
      <header className="panel-tint relative isolate overflow-hidden rounded-frame px-6 py-8 sm:px-10 sm:py-10 lg:px-12 lg:py-12">
        <span
          aria-hidden="true"
          style={
            { '--loop-time': '36s', '--loop-scale': 1.06 } as CSSProperties
          }
          className="breathe loop pointer-events-none absolute -top-[120px] -right-[120px] -z-10 size-[200px] rounded-full shadow-[0_0_0_50px_rgb(255_255_255/0.45),0_0_0_104px_rgb(255_255_255/0.3),0_0_0_164px_rgb(255_255_255/0.18)] max-sm:-top-[150px] max-sm:-right-[150px]"
        />
        <ol className="arrive flex flex-wrap items-center gap-x-2 gap-y-1 text-small">
          {crumbs.map((crumb) => (
            <li key={crumb.key} className="flex items-center gap-2">
              <AppLink
                href={crumb.href}
                className="font-medium text-accent-ink underline decoration-transparent underline-offset-[0.18em] transition-colors duration-150 hover:decoration-current"
              >
                {crumb.title}
              </AppLink>
              <span aria-hidden="true" className="text-fg-faint">
                /
              </span>
            </li>
          ))}
        </ol>
        <h1
          className={`arrive mt-4 max-w-[24ch] text-balance ${scale.className}`}
          data-long={scale.long}
          style={{ '--arrive': '90ms' } as CSSProperties}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            className="arrive mt-4 max-w-[52ch] text-balance text-lead text-fg-muted"
            style={{ '--arrive': '180ms' } as CSSProperties}
          >
            {subtitle}
          </p>
        )}
      </header>

      <div
        className={cn(
          'mt-10 lg:mt-12',
          showToc &&
            'xl:grid xl:grid-cols-[minmax(0,68ch)_13rem] xl:justify-between xl:gap-x-12',
        )}
      >
        <article className="min-w-0 max-w-measure">
          <div
            // Content Link: the field's only marker can sit on the skipped
            // opening heading, so the text opens the content field itself
            data-datocms-content-link-url={fieldEditUrl(
              title,
              'content.{locale}',
            )}
            className="prose prose-docs"
          >
            <DatoStructuredText
              data={content}
              customNodeRules={[
                renderNodeRule(isHeading, ({ node, children, key }) => {
                  if (node === leadingTitle) return null;
                  const HeadingTag = bodyHeadingTag(
                    headingLevels.get(node) ?? node.level,
                  );
                  return (
                    <HeadingTag key={key} id={anchorIds.get(node)}>
                      {children}
                    </HeadingTag>
                  );
                }),
                // The docs' own code block comes first: the first matching rule wins
                renderNodeRule(isCode, ({ node, key }) => (
                  <CodeBlock
                    key={key}
                    code={node.code}
                    language={node.language}
                    highlight={node.highlight}
                    locale={locale}
                    variant="docs"
                  />
                )),
                ...longFormNodeRules(locale),
              ]}
            />
          </div>

          {subtopics.length > 0 && (
            // The page's own subtopics: the way down the tree, as the breadcrumb is the way up
            <section aria-labelledby="subtopics-title" className="mt-16">
              <h2
                id="subtopics-title"
                className="font-semibold text-h3 tracking-[-0.02em]"
              >
                {uiString(locale, 'inThisTopic')}
              </h2>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {subtopics.map((topic) => (
                  <li key={topic.id}>
                    <AppLink
                      href={docsPageUrl(globalPageProps, topic.slug)}
                      className="tile group flex h-full items-center gap-4 p-5 transition-colors duration-150 hover:bg-tint"
                    >
                      <span className="min-w-0 flex-1">
                        <span className="block font-semibold text-fg tracking-[-0.01em]">
                          <span className="title-underline">{topic.title}</span>
                        </span>
                        {topic.subtitle && (
                          <span className="mt-1 block text-small text-fg-muted">
                            {topic.subtitle}
                          </span>
                        )}
                      </span>
                      <span
                        aria-hidden="true"
                        className="grid size-9 shrink-0 place-items-center rounded-full bg-surface text-accent-ink transition-colors duration-150 group-hover:bg-accent group-hover:text-on-accent"
                      >
                        <ArrowRightIcon className="size-4" />
                      </span>
                    </AppLink>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <DocsPager globalPageProps={globalPageProps} className="mt-16" />
        </article>

        {showToc && (
          <TableOfContents
            headings={tocHeadings}
            locale={locale}
            variant="rail"
            className="max-xl:hidden"
          />
        )}
      </div>
    </div>
  );
};

export default Content;
