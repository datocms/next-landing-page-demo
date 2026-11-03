import type { Node } from 'datocms-structured-text-utils';

/** The top-level nodes of a Structured Text field's `value` (empty when there is none) */
export function rootNodes(value: unknown): Node[] {
  return (
    (value as { document?: { children?: Node[] } } | null | undefined)?.document
      ?.children ?? []
  );
}
