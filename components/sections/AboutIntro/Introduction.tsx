import {
  isHeading,
  isParagraph,
  type Node,
} from 'datocms-structured-text-utils';
import { renderNodeRule, StructuredText } from 'react-datocms/structured-text';
import DatoStructuredText from '@/components/datocms/DatoStructuredText';
import type { ResultOf } from '@/lib/datocms/graphql';
import { cn } from '@/utils/cn';
import type { ItemHeadingLevel } from '@/utils/headingLevel';
import { rootNodes } from '@/utils/structuredText';
import { markerShapeClass } from '@/utils/tones';
import type { AboutIntroFragment } from './fragment';
import { groupByHeading } from './groupByHeading';

type Props = {
  introduction: NonNullable<
    ResultOf<typeof AboutIntroFragment>['introductionText']
  >;
  /** Its headings sit one level below the block's title */
  headingLevel: ItemHeadingLevel;
};

/** Lookup so Tailwind sees every column class */
const POINT_COLUMNS = {
  2: 'lg:grid-cols-2',
  3: 'lg:grid-cols-3',
} as const;

/** A run of root nodes as a standalone Structured Text value */
const asValue = (nodes: Node[]) => ({
  value: { schema: 'dast', document: { type: 'root', children: nodes } },
});

/**
 * The introduction text under the opener. With two or more headings it turns
 * into columns of points divided by hairlines, each heading marked with a tone
 * shape and any text before the first heading leading them; otherwise it is
 * plain prose.
 */
const Introduction = ({ introduction, headingLevel: Heading }: Props) => {
  const groups = groupByHeading(rootNodes(introduction.value));
  const pointGroups = groups.filter((group) => isHeading(group.nodes[0]));

  if (pointGroups.length < 2) {
    return (
      <div className="prose mt-12 max-w-[62ch] md:mt-16">
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

  // Whatever the editor wrote before the first heading leads the points
  const leadGroup =
    groups.length > 0 && !isHeading(groups[0].nodes[0]) ? groups[0] : null;
  const columns =
    pointGroups.length % 3 === 0 || pointGroups.length > 4 ? 3 : 2;

  return (
    // One Content Link group for the whole field: the field's single
    // stega marker then makes the lead and every column one target
    <div data-datocms-content-link-group className="mt-12 md:mt-16">
      {leadGroup && (
        <div className="prose mb-12 max-w-[62ch]">
          <StructuredText data={asValue(leadGroup.nodes)} />
        </div>
      )}
      <ul
        className={cn(
          'intro-points grid max-w-[640px] gap-y-8 lg:max-w-none lg:gap-x-14',
          POINT_COLUMNS[columns],
        )}
        data-cols={columns}
      >
        {pointGroups.map((group, index) => (
          <li
            key={group.key}
            className="relative max-lg:[&+&]:border-t max-lg:[&+&]:border-line max-lg:[&+&]:pt-8"
          >
            <StructuredText
              data={asValue(group.nodes)}
              customNodeRules={[
                renderNodeRule(isHeading, ({ children, key }) => (
                  <Heading
                    key={key}
                    className="flex items-start gap-3 font-display text-[18px]/[1.3] font-medium tracking-[-0.01em] text-ink max-md:text-[17px]"
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        markerShapeClass(index),
                        'mt-[calc(0.65em-5px)]',
                      )}
                    />
                    <span className="min-w-0">{children}</span>
                  </Heading>
                )),
                renderNodeRule(isParagraph, ({ children, key }) => (
                  <p
                    key={key}
                    className="mt-2 max-w-[62ch] text-body text-ink-2"
                  >
                    {children}
                  </p>
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
