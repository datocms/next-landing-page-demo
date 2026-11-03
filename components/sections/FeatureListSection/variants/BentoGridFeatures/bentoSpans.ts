/**
 * Column spans for the feature bento. Walking the items, positions 0 and 5 of
 * every six are wide (2 columns, capped at `columns`), the rest take one column.
 * An item that doesn't fit starts a new row, and the item before it grows to
 * close the gap; the last item grows to fill the last row. Every row is full,
 * whatever the item count.
 *
 * Six items give [2,1,1] [1,1,2] at 4 columns and [2] [1,1] [1,1] [2] at 2.
 */
export function bentoSpans(count: number, columns: number): number[] {
  const spans: number[] = [];
  // Columns already taken in the current row
  let used = 0;

  for (let i = 0; i < count; i++) {
    const isWide = i % 6 === 0 || i % 6 === 5;
    const span = Math.min(isWide ? 2 : 1, columns);
    if (used + span > columns) {
      spans[spans.length - 1] += columns - used;
      used = 0;
    }
    spans.push(span);
    used = (used + span) % columns;
  }

  if (used > 0 && spans.length > 0) {
    spans[spans.length - 1] += columns - used;
  }

  return spans;
}

/* Span → class, from 1200 (XL) and from 768 (MD). Literal class maps: Tailwind
   only generates classes it can see */
export const XL_SPAN: Record<number, string> = {
  1: 'xl:col-span-1',
  2: 'xl:col-span-2',
  3: 'xl:col-span-3',
  4: 'xl:col-span-4',
};

export const MD_SPAN: Record<number, string> = {
  1: 'md:col-span-1',
  2: 'md:col-span-2',
};
