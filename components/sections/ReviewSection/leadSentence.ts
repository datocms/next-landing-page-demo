/**
 * Marks the first sentence of a review with the custom DAST mark
 * `lead-sentence`, so the variants can paint it (a highlighter, or ink in a
 * two-tone quote) through `customMarkRules`. Pure: only the nodes on the
 * edited path are cloned, the rest of the document is shared.
 */

import { createElement } from 'react';
import {
  renderMarkRule,
  type StructuredTextPropTypes,
} from 'react-datocms/structured-text';

type MarkRules = NonNullable<StructuredTextPropTypes['customMarkRules']>;

// Just the parts of the DAST document this module reads
type Span = { type: 'span'; value: string; marks?: string[] };
type Inline = { type: string; value?: unknown; children?: unknown[] };
type Paragraph = { type: 'paragraph'; children: Inline[] };
type Root = { type: 'root'; children: { type: string }[] };

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

const isSpan = (node: Inline): node is Span =>
  node.type === 'span' && typeof node.value === 'string';

const isRoot = (node: unknown): node is Root =>
  typeof node === 'object' &&
  node !== null &&
  (node as Root).type === 'root' &&
  Array.isArray((node as Root).children);

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
function markInlines(children: Inline[]): [Inline[], boolean] {
  const next: Inline[] = [];
  let sentenceEnded = false;

  for (const child of children) {
    if (sentenceEnded) {
      next.push(child);
    } else if (isSpan(child)) {
      const [parts, ended] = markSpan(child);
      next.push(...parts);
      sentenceEnded = ended;
    } else if (
      (child.type === 'link' || child.type === 'itemLink') &&
      Array.isArray(child.children)
    ) {
      const [linkChildren, ended] = markInlines(child.children as Inline[]);
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
  const value = field?.value as { document?: unknown } | null | undefined;
  const document = value?.document;
  if (!isRoot(document)) return field;

  const index = document.children.findIndex(
    (node) =>
      node.type === 'paragraph' && Array.isArray((node as Paragraph).children),
  );
  if (index < 0) return field;

  const paragraph = document.children[index] as Paragraph;
  const [children] = markInlines(paragraph.children);
  const nextChildren = [...document.children];
  nextChildren[index] = { ...paragraph, children } as Paragraph;

  return {
    ...field,
    value: { ...value, document: { ...document, children: nextChildren } },
  };
}
