import { stripStega } from '@datocms/content-link';
import {
  isBlock,
  isBlockquote,
  isCode,
  isHeading,
  isLink,
} from 'datocms-structured-text-utils';
import Link from 'next/link';
import { renderNodeRule } from 'react-datocms/structured-text';
import AppCtaBlock from '@/components/blocks/AppCta';
import CtaButtonWithImageBlock from '@/components/blocks/CtaButtonWithImage';
import ImageBlock from '@/components/blocks/ImageBlock';
import NewsletterSubscriptionBlock from '@/components/blocks/NewsletterSubscription';
import DatoStructuredText from '@/components/datocms/DatoStructuredText';
import CodeBlock from '@/components/ui/CodeBlock';
import QuoteBlock from '@/components/ui/QuoteBlock';
import {
  buildUrl,
  type ResolvedGlobalPageProps,
} from '@/utils/globalPageProps';
import { rootNodes } from '@/utils/rootNodes';
import type { Query } from './meta';

type Props = {
  content: NonNullable<Query['post']>['content'];
  globalPageProps: ResolvedGlobalPageProps;
};

/** Heading tags the body can use: the page title is the only h1 */
type BodyHeadingTag = 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

/**
 * The id of the article's first image block when it sits among the first
 * three top-level nodes: on desktop it is then above the fold and the LCP, so
 * it loads eagerly.
 */
function leadImageId(
  value: unknown,
  blocks: readonly { id: string; __typename: string }[],
) {
  const nodes = rootNodes(value);
  const index = nodes.findIndex(
    (node) =>
      isBlock(node) &&
      blocks.some(
        (block) =>
          block.id === node.item && block.__typename === 'ImageBlockRecord',
      ),
  );
  const node = index !== -1 && index < 3 ? nodes[index] : undefined;
  return node && isBlock(node) ? node.item : null;
}

/**
 * The post's Structured Text: its embedded blocks, links and inline mentions
 * of other posts, and the rules that adapt headings, links, quotes and code to
 * the article's design
 */
const PostBody = ({ content, globalPageProps }: Props) => {
  const { locale } = globalPageProps.params;
  const priorityImageId = leadImageId(content.value, content.blocks);

  return (
    <DatoStructuredText
      data={content}
      renderBlock={({ record }) => {
        switch (record.__typename) {
          case 'ImageBlockRecord':
            return (
              <ImageBlock
                key={record.id}
                fragment={record}
                priority={record.id === priorityImageId}
              />
            );
          case 'NewsletterSubscriptionRecord':
            return (
              <NewsletterSubscriptionBlock key={record.id} fragment={record} />
            );
          case 'CtaButtonWithImageRecord':
            return (
              <CtaButtonWithImageBlock key={record.id} fragment={record} />
            );
          case 'AppCtaRecord':
            return (
              <AppCtaBlock key={record.id} fragment={record} locale={locale} />
            );
          default:
            return null;
        }
      }}
      // A link whose target is another record (only posts can be linked)
      renderLinkToRecord={({ record, children, transformedMeta }) => {
        switch (record.__typename) {
          case 'PostRecord':
            return (
              <Link
                key={record.id}
                {...transformedMeta}
                href={buildUrl(
                  globalPageProps,
                  `/posts/${stripStega(record.slug)}`,
                )}
              >
                {children}
              </Link>
            );
          default:
            return null;
        }
      }}
      // A record mentioned inline in the text: the post's title, linked
      renderInlineRecord={({ record }) => {
        switch (record.__typename) {
          case 'PostRecord':
            return (
              <Link
                key={record.id}
                href={buildUrl(
                  globalPageProps,
                  `/posts/${stripStega(record.slug)}`,
                )}
              >
                {record.title}
              </Link>
            );
          default:
            return null;
        }
      }}
      customNodeRules={[
        renderNodeRule(isHeading, ({ node, children, key }) => {
          const HeadingTag = `h${Math.max(node.level, 2)}` as BodyHeadingTag;
          return <HeadingTag key={key}>{children}</HeadingTag>;
        }),
        // The link's meta entries (target, rel…) become attributes
        renderNodeRule(isLink, ({ node, children, key }) => {
          const metaAttributes = Object.fromEntries(
            (node.meta ?? []).map(({ id, value }) => [id, value]),
          );

          return (
            <a href={node.url} key={key} {...metaAttributes}>
              {children}
            </a>
          );
        }),
        renderNodeRule(isBlockquote, ({ children, key }) => (
          <QuoteBlock key={key}>{children}</QuoteBlock>
        )),
        // The same code window (with its copy action) as docs and changelog entries
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
  );
};

export default PostBody;
