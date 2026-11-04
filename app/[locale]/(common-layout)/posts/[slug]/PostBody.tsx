import { isBlock, isHeading, isLink } from 'datocms-structured-text-utils';
import Link from 'next/link';
import { renderNodeRule } from 'react-datocms/structured-text';
import AppCtaBlock from '@/components/blocks/AppCta';
import CtaButtonWithImageBlock from '@/components/blocks/CtaButtonWithImage';
import ImageBlock from '@/components/blocks/ImageBlock';
import NewsletterSubscriptionBlock from '@/components/blocks/NewsletterSubscription';
import DatoStructuredText from '@/components/datocms/DatoStructuredText';
import { longFormNodeRules } from '@/components/datocms/DatoStructuredText/longFormNodeRules';
import type { ResolvedGlobalPageProps } from '@/utils/globalPageProps';
import { bodyHeadingTag } from '@/utils/headingLevel';
import { postUrl } from '@/utils/routes';
import { rootNodes } from '@/utils/structuredText';
import type { Query } from './meta';

type Props = {
  content: NonNullable<Query['post']>['content'];
  globalPageProps: ResolvedGlobalPageProps;
};

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

/** The post's Structured Text body: embedded blocks and links to other posts */
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
              <NewsletterSubscriptionBlock
                key={record.id}
                fragment={record}
                locale={locale}
              />
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
                href={postUrl(globalPageProps, record.slug)}
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
                href={postUrl(globalPageProps, record.slug)}
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
          const HeadingTag = bodyHeadingTag(node.level);
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
        ...longFormNodeRules(locale),
      ]}
    />
  );
};

export default PostBody;
