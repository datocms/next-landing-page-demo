import { stripStega } from '@datocms/content-link';
import {
  hasChildren,
  isDocument,
  isParagraph,
  isSpan,
  type Node,
} from 'datocms-structured-text-utils';

/** Shorter paragraphs are labels ("Feature 1: …"), not sentences */
const MIN_LENGTH = 40;

/** The words of a node, without formatting */
const textOf = (node: Node): string =>
  isSpan(node)
    ? node.value
    : hasChildren(node)
      ? node.children.map((child) => textOf(child as Node)).join('')
      : '';

/**
 * A release's summary for the changelog list: the first paragraph of its
 * notes that reads as a sentence (at least 40 characters, not set entirely
 * in bold), or null. The text keeps its Draft Mode markers, for Content Link
 */
export function releaseSummary(value: unknown): string | null {
  if (!isDocument(value)) return null;

  let found: string | null = null;
  const walk = (node: Node) => {
    if (found) return;
    if (isParagraph(node)) {
      const allBold = node.children.every(
        (child) => isSpan(child) && child.marks?.includes('strong'),
      );
      const text = textOf(node).trim();
      if (!allBold && stripStega(text).trim().length >= MIN_LENGTH) {
        found = text;
      }
      return;
    }
    if (hasChildren(node)) {
      for (const child of node.children) walk(child as Node);
    }
  };
  walk(value.document);
  return found;
}
