import { isBlockquote, isCode, isHeading } from 'datocms-structured-text-utils';
import { notFound } from 'next/navigation';
import { renderNodeRule } from 'react-datocms/structured-text';
import DatoStructuredText from '@/components/datocms/DatoStructuredText';
import CodeBlock from '@/components/ui/CodeBlock';
import QuoteBlock from '@/components/ui/QuoteBlock';
import TableOfContents from '@/components/ui/TableOfContents';
import type { ContentPage } from '@/lib/datocms/realtime/types';
import { headingOutline, repeatsTitle } from '@/utils/headingOutline';
import { rootNodes } from '@/utils/rootNodes';
import type { PageProps, Query } from './meta';

const Content: ContentPage<PageProps, Query> = ({
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
  const skipIndex =
    firstNode && isHeading(firstNode) && repeatsTitle(firstNode, title)
      ? 0
      : -1;

  // The h2s get anchor ids and, with three or more, an "On this page" rail
  const headings = headingOutline(rootChildren, skipIndex);
  const idByIndex = new Map(headings.map(({ index, id }) => [index, id]));
  const showToc = headings.length >= 3;

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
              renderNodeRule(
                isHeading,
                ({ node, children, key, ancestors }) => {
                  const parent = ancestors[0];
                  const index =
                    parent?.type === 'root'
                      ? parent.children.indexOf(node)
                      : -1;

                  // The opening heading that repeats the title
                  if (index !== -1 && index === skipIndex) return null;

                  // Native heading levels; the page title is the only h1
                  const HeadingTag = `h${Math.max(node.level, 2)}` as
                    | 'h2'
                    | 'h3'
                    | 'h4'
                    | 'h5'
                    | 'h6';
                  return (
                    <HeadingTag key={key} id={idByIndex.get(index)}>
                      {children}
                    </HeadingTag>
                  );
                },
              ),
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
