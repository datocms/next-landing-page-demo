import { stripStega } from '@datocms/content-link';

/** One row of a plan's limits in the CMS: an empty value is a plain yes */
type Limit = {
  id: string;
  group: string;
  label: string;
  value?: string | null;
};

export type ComparisonRow = {
  key: string;
  label: string;
  /** One cell per plan, in column order; undefined when the plan lacks the row */
  cells: (Limit | undefined)[];
};

export type ComparisonGroup = {
  key: string;
  name: string;
  rows: ComparisonRow[];
};

/** The visible text, for matching rows and groups across plans */
const comparable = (text: string) => stripStega(text).trim().toLowerCase();

/**
 * Lines the plans' limits up into grouped rows. Groups and rows follow the plan
 * with the most rows (usually the highest tier), then any rows that only other
 * plans have; a plan without a row gets an empty cell.
 */
export function comparisonGroups(
  plans: { id: string; planLimits: Limit[] }[],
): ComparisonGroup[] {
  const byRichness = [...plans].sort(
    (a, b) => b.planLimits.length - a.planLimits.length,
  );
  const groups = new Map<string, ComparisonGroup>();
  const seenRows = new Set<string>();

  for (const plan of byRichness) {
    for (const limit of plan.planLimits) {
      const groupKey = comparable(limit.group);
      const labelKey = comparable(limit.label);
      const rowKey = `${groupKey}/${labelKey}`;
      if (!groupKey || !labelKey || seenRows.has(rowKey)) continue;
      seenRows.add(rowKey);

      let group = groups.get(groupKey);
      if (!group) {
        group = { key: groupKey, name: limit.group, rows: [] };
        groups.set(groupKey, group);
      }
      group.rows.push({
        key: rowKey,
        label: limit.label,
        cells: plans.map((column) =>
          column.planLimits.find(
            (other) =>
              comparable(other.group) === groupKey &&
              comparable(other.label) === labelKey,
          ),
        ),
      });
    }
  }

  return [...groups.values()];
}
