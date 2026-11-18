import { isHeading, type Node } from 'datocms-structured-text-utils';
import { renderNodeRule, StructuredText } from 'react-datocms/structured-text';
import DatoStructuredText from '@/components/datocms/DatoStructuredText';
import type { ResultOf } from '@/lib/datocms/graphql';
import { cn } from '@/utils/cn';
import type { ItemHeadingLevel } from '@/utils/headingLevel';
import { rootNodes } from '@/utils/structuredText';
import type { AboutIntroFragment } from './fragment';
import { groupByHeading } from './groupByHeading';

type Props = {
  introduction: NonNullable<
    ResultOf<typeof AboutIntroFragment>['introductionText']
  >;
  /** Its headings sit one level below the block's title */
  headingLevel: ItemHeadingLevel;
  className?: string;
};

/** A run of root nodes as a standalone Structured Text value */
const asValue = (nodes: Node[]) => ({
  value: { schema: 'dast', document: { type: 'root', children: nodes } },
});

/**
 * The introduction under the photos. With two or more headings it is set as
 * columns, each a heading and its text on a pale tile: three of them line up with the
 * photos above from 640px; other counts take two columns, three from 1024px.
 * Anything before the first heading leads them as centred prose. Without
 * headings it is plain prose, centred under the photos.
 */
const Introduction = ({
  introduction,
  headingLevel: Heading,
  className,
}: Props) => {
  const groups = groupByHeading(rootNodes(introduction.value));
  const pointGroups = groups.filter((group) => isHeading(group.nodes[0]));

  if (pointGroups.length < 2) {
    return (
      <div className={cn('prose mx-auto', className)}>
        <DatoStructuredText
          data={introduction}
          customNodeRules={[
            // Whatever level the editor picked, these sit one level below the title
            renderNodeRule(isHeading, ({ children, key }) => (
              <Heading key={key}>{children}</Heading>
            )),
          ]}
        />
      </div>
    );
  }

  const leadGroup =
    groups.length > 0 && !isHeading(groups[0].nodes[0]) ? groups[0] : null;

  return (
    // One Content Link group for the whole field: its single stega marker
    // makes the lead and every column one target
    <div data-datocms-content-link-group className={className}>
      {leadGroup && (
        <div className="prose mx-auto mb-12 text-center text-lead text-fg-muted">
          <StructuredText data={asValue(leadGroup.nodes)} />
        </div>
      )}
      <ul
        className={cn(
          'grid gap-[18px]',
          pointGroups.length === 3
            ? 'sm:grid-cols-3'
            : 'sm:grid-cols-2 lg:grid-cols-3',
        )}
      >
        {pointGroups.map((group) => (
          <li
            key={group.key}
            className="tile p-6 text-small md:p-7 [&_p]:mt-2 [&_p]:max-w-[44ch] [&_p]:text-fg-muted [&_p+p]:mt-2"
          >
            <StructuredText
              data={asValue(group.nodes)}
              customNodeRules={[
                renderNodeRule(isHeading, ({ children, key }) => (
                  <Heading key={key} className="text-h3">
                    {children}
                  </Heading>
                )),
              ]}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Introduction;
