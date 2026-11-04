import { isHeading } from 'datocms-structured-text-utils';
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

const Content: ContentComponent<PageProps, Query> = ({
  data,
  ...globalPageProps
}) => {
  if (!data.legalPage) {
    notFound();
  }

  const { title, content } = data.legalPage;
  const { locale } = globalPageProps.params;

  // The title field is already the h1, so an opening heading that repeats it is skipped
  const rootChildren = rootNodes(content?.value);
  const firstNode = rootChildren[0];
  const leadingTitle =
    firstNode && isHeading(firstNode) && repeatsTitle(firstNode, title)
      ? firstNode
      : null;

  // The h2s get anchor ids and, when there are enough, an "On this page" rail
  const headings = headingOutline(rootChildren, leadingTitle);
  const anchorIds = new Map(headings.map(({ node, id }) => [node, id]));
  const showToc = headings.length >= MIN_TOC_HEADINGS;

  return (
    <div className="container-page pt-12 pb-24 max-lg:pt-10 max-lg:pb-20 max-md:pt-8 max-md:pb-16 lg:grid lg:grid-cols-12 lg:gap-x-6">
      <article
        className={
          showToc
            ? 'mx-auto min-w-0 max-w-reading lg:col-span-7 lg:col-start-2 lg:mx-0'
            : 'mx-auto min-w-0 max-w-reading lg:col-span-12'
        }
      >
        <h1 className="text-title text-ink">{title}</h1>

        <div className="prose mt-10 max-md:mt-8">
          <DatoStructuredText
            data={content}
            customNodeRules={[
              renderNodeRule(isHeading, ({ node, children, key }) => {
                if (node === leadingTitle) return null;

                // Native heading levels; the page title is the only h1
                const HeadingTag = bodyHeadingTag(node.level);
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
          headings={headings}
          locale={locale}
          className="hidden lg:col-span-3 lg:col-start-10 lg:block"
        />
      )}
    </div>
  );
};

export default Content;
