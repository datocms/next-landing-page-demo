import { isHeading, type Node } from 'datocms-structured-text-utils';
import { notFound } from 'next/navigation';
import { renderNodeRule } from 'react-datocms/structured-text';
import DatoStructuredText from '@/components/datocms/DatoStructuredText';
import { longFormNodeRules } from '@/components/datocms/DatoStructuredText/longFormNodeRules';
import TableOfContents, {
  MIN_TOC_HEADINGS,
} from '@/components/ui/TableOfContents';
import type { ContentComponent } from '@/lib/datocms/realtime/types';
import { bodyHeadingTag } from '@/utils/headingLevel';
import { headingOutline, repeatsTitle } from '@/utils/headingOutline';
import { rootNodes } from '@/utils/structuredText';
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

  const { title, content } = data.documentationPage;
  const { locale } = globalPageProps.params;

  // Most pages open with a level-1 heading that repeats the page title: that
  // heading becomes the page's h1. Otherwise the title field is the h1 and any
  // level-1 content heading is rendered as an h2.
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

  const tocHeadings = headingOutline(rootChildren, leadingTitle);
  const anchorIds = new Map(tocHeadings.map(({ node, id }) => [node, id]));
  const showToc = tocHeadings.length >= MIN_TOC_HEADINGS;

  // Left-aligned at the docs home's inset, so its well and this title line up
  return (
    <div
      className={
        showToc
          ? 'px-(--pad) py-12 max-md:pt-10 lg:py-16 xl:px-12 min-[80rem]:grid min-[80rem]:grid-cols-[minmax(0,46rem)_13.75rem] min-[80rem]:gap-x-12'
          : 'px-(--pad) py-12 max-md:pt-10 lg:py-16 xl:px-12'
      }
    >
      <article className="min-w-0 max-w-docs">
        {!leadingTitle && <h1 className="mb-8 text-title text-ink">{title}</h1>}

        <div className="prose">
          <DatoStructuredText
            data={content}
            customNodeRules={[
              renderNodeRule(isHeading, ({ node, children, key }) => {
                if (node === leadingTitle) {
                  return (
                    <h1 key={key} className="mt-0 mb-8 text-title text-ink">
                      {children}
                    </h1>
                  );
                }
                const HeadingTag = bodyHeadingTag(
                  headingLevels.get(node) ?? node.level,
                );
                return (
                  <HeadingTag key={key} id={anchorIds.get(node)}>
                    {children}
                  </HeadingTag>
                );
              }),
              ...longFormNodeRules(locale),
            ]}
          />
        </div>
      </article>

      {showToc && (
        <TableOfContents
          headings={tocHeadings}
          locale={locale}
          className="hidden min-[80rem]:block"
        />
      )}
    </div>
  );
};

export default Content;
