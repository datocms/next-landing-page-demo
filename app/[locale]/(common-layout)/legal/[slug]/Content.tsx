import { isHeading } from 'datocms-structured-text-utils';
import { notFound } from 'next/navigation';
import { renderNodeRule } from 'react-datocms/structured-text';
import DatoStructuredText from '@/components/datocms/DatoStructuredText';
import { longFormNodeRules } from '@/components/datocms/DatoStructuredText/longFormNodeRules';
import TableOfContents, {
  MIN_TOC_HEADINGS,
} from '@/components/ui/TableOfContents';
import type { ContentComponent } from '@/lib/datocms/realtime/types';
import { uiString } from '@/lib/i18n/uiStrings';
import { bodyHeadingTag } from '@/utils/headingLevel';
import { headingOutline, repeatsTitle } from '@/utils/headingOutline';
import { localDate } from '@/utils/localDate';
import { rootNodes } from '@/utils/structuredText';
import { titleSize } from '@/utils/titleSize';
import type { PageProps, Query } from './meta';

const Content: ContentComponent<PageProps, Query> = ({
  data,
  ...globalPageProps
}) => {
  if (!data.legalPage) {
    notFound();
  }

  const { title, content, updatedAt } = data.legalPage;
  const { locale } = globalPageProps.params;
  const scale = titleSize(title, 'h1');
  const updated = localDate(updatedAt, locale);

  // The title field is already the h1, so an opening heading that repeats it is skipped
  const rootChildren = rootNodes(content?.value);
  const firstNode = rootChildren[0];
  const leadingTitle =
    firstNode && isHeading(firstNode) && repeatsTitle(firstNode, title)
      ? firstNode
      : null;

  // The h2s get anchor ids and, when there are enough, an "On this page" list beside the text
  const headings = headingOutline(rootChildren, leadingTitle);
  const anchorIds = new Map(headings.map(({ node, id }) => [node, id]));
  const showToc = headings.length >= MIN_TOC_HEADINGS;

  return (
    <article className="container-page pt-(--page-top)">
      <header className="mx-auto max-w-measure text-center">
        <h1 className={scale.className} data-long={scale.long}>
          {title}
        </h1>
        {updated && (
          <p className="mt-4 text-small text-fg-muted">
            {uiString(locale, 'lastUpdated')}{' '}
            <time dateTime={updated.iso}>{updated.label}</time>
          </p>
        )}
      </header>

      {/* The text in the centred reading column; from 1280px the "On this page" list sits beside it */}
      <div className="mt-12 lg:mt-16 xl:grid xl:grid-cols-[minmax(0,1fr)_68ch_minmax(0,1fr)] xl:gap-x-12">
        {/* Rich text wraps list items in <p>: keep those items as tight as plain ones */}
        <div className="prose mx-auto w-full max-w-measure min-w-0 [&_li>p]:mt-0 xl:col-start-2">
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

        {showToc && (
          <TableOfContents
            headings={headings}
            locale={locale}
            className="hidden xl:col-start-3 xl:block"
          />
        )}
      </div>
    </article>
  );
};

export default Content;
