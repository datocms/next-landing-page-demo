import { stripStega } from '@datocms/content-link';
import {
  isHeading,
  isList,
  isListItem,
  isParagraph,
  isSpan,
  type Node,
  type Root,
} from 'datocms-structured-text-utils';
import { renderNodeRule } from 'react-datocms/structured-text';
import DatoStructuredText from '@/components/datocms/DatoStructuredText';
import { CheckIcon } from '@/components/ui/icons';
import type { ResultOf } from '@/lib/datocms/graphql';
import { cn } from '@/utils/cn';
import {
  itemHeadingLevel,
  type SectionHeadingLevel,
} from '@/utils/headingLevel';
import { rootNodes } from '@/utils/structuredText';
import { titleSize } from '@/utils/titleSize';
import type { DetailSectionFragment } from './fragment';

type Props = {
  details: ResultOf<typeof DetailSectionFragment>['details'];
  /** The first heading's tag: h1 when the block opens a page */
  as: SectionHeadingLevel;
  /** The first heading's node, which titles the section */
  title?: Node;
  /** Id of the first heading, for the section's aria-labelledby */
  headingId: string;
  /**
   * How a bulleted list draws. chips (the default): pale chips with a check,
   * in two columns. plain: the check and the words straight on the surface
   */
  checklist?: 'chips' | 'plain';
  className?: string;
};

type RootChild = Root['children'][number];

/** The words of a node, without Content Link markers */
function plainText(node: Node): string {
  if (isSpan(node)) return stripStega(node.value);
  return 'children' in node
    ? (node.children as Node[]).map(plainText).join('')
    : '';
}

/** A paragraph made only of blank text (editors often leave a trailing one) */
const isBlankParagraph = (node: Node) =>
  isParagraph(node) && !plainText(node).trim();

/** Some top-level nodes as a field value of their own */
const asField = (children: RootChild[]) => ({
  value: { schema: 'dast' as const, document: { type: 'root', children } },
});

/**
 * With one heading the whole document is the intro (title, lead, checklist).
 * With several, every heading, the title included, starts a point that runs to
 * the next heading; anything before the first heading stays in the intro
 */
function splitPoints(children: RootChild[]) {
  const intro: RootChild[] = [];
  const points: RootChild[][] = [];
  const asPoints = children.filter((node) => isHeading(node)).length > 1;
  for (const node of children) {
    if (asPoints && isHeading(node)) points.push([node]);
    else if (points.length > 0) points[points.length - 1].push(node);
    else intro.push(node);
  }
  return { intro, points };
}

/**
 * The Detail block's Structured Text. With one heading, that heading at h2
 * size titles the section and the paragraphs under it are muted lead text; a
 * bulleted list is a two-column grid of pale chips with an accent check, a
 * numbered one keeps its numbers. With several headings (heading + text,
 * repeated) each pair is a point: a pale tile with the heading at h3 size and
 * the text under it, the tiles stacked 10px apart. The first heading keeps the
 * section's tag and id in either case; later ones sit one level below. Links
 * are accent text.
 */
const DetailText = ({
  details,
  as,
  title,
  headingId,
  checklist = 'chips',
  className,
}: Props) => {
  const plain = checklist === 'plain';
  const SubHeading = itemHeadingLevel(as);
  const { intro, points } = splitPoints(
    rootNodes(details?.value) as RootChild[],
  );

  const rules = (inPoint: boolean) => [
    renderNodeRule(isHeading, ({ node, children, key }) => {
      if (node === title && inPoint) {
        const Heading = as;
        return (
          <Heading key={key} id={headingId} className="text-h3">
            {children}
          </Heading>
        );
      }
      if (node === title) {
        const scale = titleSize(plainText(node), 'h2');
        const Heading = as;
        return (
          <Heading
            key={key}
            id={headingId}
            data-long={scale.long}
            className={cn(scale.className, 'max-w-[24ch] text-balance')}
          >
            {children}
          </Heading>
        );
      }
      return (
        <SubHeading key={key} className="text-h3">
          {children}
        </SubHeading>
      );
    }),
    renderNodeRule(isParagraph, ({ node, ancestors, children, key }) => {
      // Inside a list item the text sits beside its marker
      if (ancestors[0] && isListItem(ancestors[0])) {
        return <span key={key}>{children}</span>;
      }
      if (isBlankParagraph(node)) return null;
      return inPoint ? (
        <p
          key={key}
          className="mt-1.5 text-[0.96875rem] text-fg-muted leading-[1.55] first:mt-0"
        >
          {children}
        </p>
      ) : (
        <p
          key={key}
          className="mt-[18px] max-w-[60ch] text-lead text-fg-muted first:mt-0"
        >
          {children}
        </p>
      );
    }),
    renderNodeRule(isList, ({ node, children, key }) => {
      if (node.style === 'numbered') {
        return (
          <ol
            key={key}
            className={cn(
              'max-w-[60ch] list-decimal space-y-2 pl-5 marker:tabular-nums first:mt-0',
              inPoint
                ? 'mt-3 text-[0.96875rem] text-fg-muted'
                : 'mt-6 text-body',
            )}
          >
            {children}
          </ol>
        );
      }
      return (
        <ul
          key={key}
          className={cn(
            'grid font-medium text-[0.9375rem] leading-[1.4] first:mt-0 sm:grid-cols-2',
            plain ? 'gap-x-6 gap-y-3.5' : 'gap-2.5',
            inPoint ? 'mt-3' : plain ? 'mt-8' : 'mt-[30px]',
          )}
        >
          {children}
        </ul>
      );
    }),
    renderNodeRule(isListItem, ({ ancestors, children, key }) => {
      const list = ancestors[0];
      if (list && isList(list) && list.style === 'numbered') {
        return (
          <li key={key} className="pl-1">
            {children}
          </li>
        );
      }
      return (
        <li
          key={key}
          className={cn(
            'flex items-center gap-2.5',
            !plain && 'rounded-control px-3.5 py-3',
            // On a pale tile the chip turns white so it still reads
            !plain && (inPoint ? 'bg-surface' : 'bg-subtle'),
          )}
        >
          <CheckIcon
            aria-hidden="true"
            className="size-[15px] shrink-0 text-accent"
          />
          <span className="min-w-0">{children}</span>
        </li>
      );
    }),
  ];

  return (
    <div
      className={cn(
        '[&_a]:font-medium [&_a]:text-accent-ink [&_a]:underline-offset-[3px] hover:[&_a]:underline',
        className,
      )}
    >
      {intro.length > 0 && (
        <DatoStructuredText
          data={asField(intro)}
          customNodeRules={rules(false)}
        />
      )}
      {points.length > 0 && (
        <div className={cn('space-y-2.5', intro.length > 0 && 'mt-8')}>
          {points.map((point, index) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: points follow the document order and never reorder
              key={index}
              className="rounded-[20px] bg-subtle px-6 py-[22px]"
            >
              <DatoStructuredText
                data={asField(point)}
                customNodeRules={rules(true)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DetailText;
