import { stripStega } from '@datocms/content-link';
import {
  isHeading,
  isList,
  isListItem,
  isParagraph,
  isSpan,
  type Node,
} from 'datocms-structured-text-utils';
import { Check } from 'lucide-react';
import { renderNodeRule } from 'react-datocms/structured-text';
import DatoStructuredText from '@/components/datocms/DatoStructuredText';
import type { ResultOf } from '@/lib/datocms/graphql';
import { cn } from '@/utils/cn';
import { markerShapeClass, toneClass } from '@/utils/tones';
import type { DetailSectionFragment } from './fragment';

type Props = {
  details: ResultOf<typeof DetailSectionFragment>['details'];
  /** The document's top-level (level 1–2) headings */
  topHeadings: Node[];
  /** The top heading rendered as the page h1, when the section opens the page */
  pageTitle?: Node;
  /** Several top headings: each one starts a point marked with a tone shape */
  stacked: boolean;
  /** Id given to the single top heading, which labels the section */
  headingId: string;
};

const ITEM_HEADING =
  'mt-6 flex items-start gap-3 font-display text-[17px]/[1.3] font-medium tracking-[-0.01em] text-ink first:mt-0 md:mt-7 md:text-[18px]/[1.3]';

/** A paragraph made only of blank text (editors often leave a trailing one) */
const isBlankParagraph = (node: Node) =>
  isParagraph(node) &&
  node.children.every(
    (child) => isSpan(child) && stripStega(child.value).trim() === '',
  );

/**
 * The Detail block's Structured Text: top headings as a title or as stacked
 * points, deeper headings one level below, and lists as a cloud of tone pills
 * (a check, or the number in a numbered list).
 */
const DetailCopy = ({
  details,
  topHeadings,
  pageTitle,
  stacked,
  headingId,
}: Props) => {
  // Sub-headings sit one level below the section title
  const SubHeading = pageTitle && !stacked ? 'h2' : 'h3';

  return (
    <DatoStructuredText
      data={details}
      customNodeRules={[
        renderNodeRule(isHeading, ({ node, children, key }) => {
          if (node.level > 2) {
            return (
              <SubHeading
                key={key}
                className="mt-6 text-h3 text-ink first:mt-0"
              >
                {children}
              </SubHeading>
            );
          }
          const Heading = node === pageTitle ? 'h1' : 'h2';
          if (stacked) {
            const shape = markerShapeClass(topHeadings.indexOf(node));
            return (
              <Heading key={key} className={ITEM_HEADING}>
                <span
                  aria-hidden="true"
                  className={cn(shape, 'mt-[calc(0.65em-5px)]')}
                />
                <span className="min-w-0">{children}</span>
              </Heading>
            );
          }
          return (
            <Heading
              key={key}
              id={node === topHeadings[0] ? headingId : undefined}
              className="max-w-[486px] text-h2 text-ink"
            >
              {children}
            </Heading>
          );
        }),
        renderNodeRule(isParagraph, ({ node, ancestors, children, key }) => {
          // Inside a pill the text is rendered as-is
          if (ancestors[0] && isListItem(ancestors[0])) {
            return <span key={key}>{children}</span>;
          }
          if (isBlankParagraph(node)) {
            return null;
          }
          return (
            <p
              key={key}
              className={cn(
                'max-w-[62ch] text-body text-ink-2 first:mt-0',
                stacked ? 'mt-2' : 'mt-3.5 [p+&]:mt-3',
              )}
            >
              {children}
            </p>
          );
        }),
        renderNodeRule(isList, ({ node, children, key }) => {
          const className = 'mt-6 flex flex-wrap gap-2 first:mt-0';
          return node.style === 'numbered' ? (
            <ol key={key} className={className}>
              {children}
            </ol>
          ) : (
            <ul key={key} className={className}>
              {children}
            </ul>
          );
        }),
        renderNodeRule(isListItem, ({ node, ancestors, children, key }) => {
          const list = ancestors[0];
          const index = list && isList(list) ? list.children.indexOf(node) : 0;
          const numbered = list && isList(list) && list.style === 'numbered';
          return (
            <li key={key} className={cn('detail-pill', toneClass(index))}>
              <span
                aria-hidden="true"
                className="grid size-5 flex-none place-items-center rounded-full bg-tone-grad text-white"
              >
                {numbered ? (
                  <span className="font-mono text-[11px] leading-none">
                    {index + 1}
                  </span>
                ) : (
                  <Check strokeWidth={3} className="size-3" />
                )}
              </span>
              <span className="min-w-0">{children}</span>
            </li>
          );
        }),
      ]}
    />
  );
};

export default DetailCopy;
