/**
 * Marks the first sentence of a review with the custom DAST mark
 * `lead-sentence`, so the variants can paint it (a highlighter, or ink in a
 * two-tone quote) through `customMarkRules`. Pure: only the nodes on the
 * edited path are cloned, the rest of the document is shared.
 */

import {
  type InlineNode,
  isDocument,
  isItemLink,
  isLink,
  isParagraph,
  isSpan,
  type Span,
} from 'datocms-structured-text-utils';
import { createElement } from 'react';
import {
  renderMarkRule,
  type StructuredTextPropTypes,
} from 'react-datocms/structured-text';

type MarkRules = NonNullable<StructuredTextPropTypes['customMarkRules']>;

const LEAD_MARK = 'lead-sentence';

/*
 * End of a sentence: terminal punctuation, then closing quotes or brackets,
 * then any zero-width (format) characters such as the stega payload, followed
 * by whitespace or the end of the span.
 */
const SENTENCE_END = /[.!?…]['"”’)\]]*\p{Cf}*(?=\s|$)/u;

/** Highlighter cards: the lead sentence sits on the accent highlighter, which sweeps in on scroll */
export const leadHighlightRules: MarkRules = [
  renderMarkRule(LEAD_MARK, ({ children, key }) =>
    createElement('mark', { key, className: 'mark-sweep' }, children),
  ),
];

/** Two-tone quotes: the lead sentence in ink, the rest in the blockquote's ink-2 */
export const leadInkRules: MarkRules = [
  renderMarkRule(LEAD_MARK, ({ children, key }) =>
    createElement('span', { key, className: 'text-ink' }, children),
  ),
];

const withLeadMark = (span: Span): Span => ({
  ...span,
  marks: [...(span.marks ?? []), LEAD_MARK],
});

/**
 * Marks a span up to the end of its first sentence, splitting it there.
 * Returns the new spans and whether the sentence ended in this span
 */
function markSpan(span: Span): [Span[], boolean] {
  const match = SENTENCE_END.exec(span.value);
  if (!match) return [[withLeadMark(span)], false];

  const end = match.index + match[0].length;
  const head = span.value.slice(0, end);
  const tail = span.value.slice(end);
  const parts: Span[] = [];
  if (head) parts.push(withLeadMark({ ...span, value: head }));
  if (tail) parts.push({ ...span, value: tail });
  return [parts, true];
}

/**
 * Marks inline nodes (descending into links) until the first sentence ends.
 * Returns the new nodes and whether the sentence ended among them
 */
function markInlines<T extends InlineNode>(
  children: T[],
): [(T | Span)[], boolean] {
  const next: (T | Span)[] = [];
  let sentenceEnded = false;

  for (const child of children) {
    if (sentenceEnded) {
      next.push(child);
    } else if (isSpan(child)) {
      const [parts, ended] = markSpan(child);
      next.push(...parts);
      sentenceEnded = ended;
    } else if (isLink(child) || isItemLink(child)) {
      const [linkChildren, ended] = markInlines(child.children);
      next.push({ ...child, children: linkChildren });
      sentenceEnded = ended;
    } else {
      next.push(child);
    }
  }

  return [next, sentenceEnded];
}

/** A copy of the review field whose first sentence carries `lead-sentence` */
export function withLeadSentence<T extends { value: unknown }>(field: T): T {
  const { value } = field;
  if (!isDocument(value)) return field;

  const { children } = value.document;
  const paragraph = children.find(isParagraph);
  if (!paragraph) return field;

  const [markedChildren] = markInlines(paragraph.children);
  const document = {
    ...value.document,
    children: children.map((node) =>
      node === paragraph ? { ...paragraph, children: markedChildren } : node,
    ),
  };

  return { ...field, value: { ...value, document } };
}
