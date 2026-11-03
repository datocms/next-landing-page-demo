import {
  hasChildren,
  isDocument,
  isEmptyDocument,
  isParagraph,
  isSpan,
  type Node,
} from 'datocms-structured-text-utils';

/** A Structured Text field queried as `{ value }` */
export type StructuredTextField = { value: unknown };

/** Does the field hold any text? */
export function hasStructuredText(
  field?: StructuredTextField | null,
): field is StructuredTextField {
  return Boolean(field) && !isEmptyDocument(field?.value);
}

/** The field's words without formatting, each paragraph or heading followed by a space */
export function structuredTextToPlainText(
  field?: StructuredTextField | null,
): string {
  const value = field?.value;
  if (!isDocument(value)) return '';

  const parts: string[] = [];
  const walk = (node: Node) => {
    if (isSpan(node)) {
      parts.push(node.value);
    } else if (hasChildren(node)) {
      node.children.forEach(walk);
      parts.push(' ');
    }
  };
  walk(value.document);
  return parts.join('').replace(/\s+/g, ' ').trim();
}

/**
 * The text of a field that is a single paragraph of unformatted text, or null.
 * Such a lead can be set inline, for example merged into a heading
 */
export function structuredTextToPlainParagraph(
  field?: StructuredTextField | null,
): string | null {
  const value = field?.value;
  if (!isDocument(value)) return null;

  const [paragraph, ...rest] = value.document.children;
  if (!paragraph || rest.length > 0 || !isParagraph(paragraph)) return null;

  let text = '';
  for (const child of paragraph.children) {
    if (!isSpan(child) || child.marks?.length || child.value.includes('\n')) {
      return null;
    }
    text += child.value;
  }
  return text.trim() ? text : null;
}
