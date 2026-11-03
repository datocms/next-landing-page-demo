import {
  isHeading,
  isThematicBreak,
  type Node,
} from 'datocms-structured-text-utils';

type Group = { key: string; nodes: Node[] };

/**
 * Splits the root nodes of a Structured Text value into groups that each
 * start at a heading (thematic breaks are dropped). Anything before the first
 * heading becomes group 0, with no heading of its own.
 */
export default function groupByHeading(value: unknown): Group[] {
  const children =
    (value as { document?: { children?: Node[] } } | null)?.document
      ?.children ?? [];
  const groups: Group[] = [];
  for (const node of children) {
    if (isThematicBreak(node)) continue;
    if (isHeading(node) || groups.length === 0) {
      groups.push({ key: `group-${groups.length}`, nodes: [node] });
    } else {
      groups[groups.length - 1].nodes.push(node);
    }
  }
  return groups;
}
