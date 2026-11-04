import { stripStega } from '@datocms/content-link';

const SENTENCE_BREAK = /[.?!]\s/g;
const JOINERS = /\s(with|for)\s|,\s/gi;
const MARKDOWN = /[\n*_`[\]#>|]/;

/** The last match of a global `pattern` in `text`, or null */
function lastMatch(text: string, pattern: RegExp) {
  let found: RegExpExecArray | null = null;
  for (const match of text.matchAll(pattern)) found = match;
  return found;
}

/** Where to cut a clean (stega-free, trimmed) title in two, or -1 */
function splitIndex(cleanTitle: string): number {
  if (cleanTitle.split(/\s+/).length < 3) return -1;

  // 1. After the last sentence boundary: "Step into our documentation." / "Master…"
  const sentence = lastMatch(cleanTitle, SENTENCE_BREAK);
  if (sentence) return sentence.index + 1;

  // 2. Before the last " with ", " for ", or after the last ", " (the comma stays first)
  const joiner = lastMatch(cleanTitle, JOINERS);
  if (joiner) {
    return joiner[0].startsWith(',') ? joiner.index + 1 : joiner.index;
  }

  // 3. The space nearest the middle; a tie goes to the earlier space
  const middle = cleanTitle.length / 2;
  let best = -1;
  for (let i = 0; i < cleanTitle.length; i++) {
    if (cleanTitle[i] !== ' ') continue;
    if (best === -1 || Math.abs(i - middle) < Math.abs(best - middle)) best = i;
  }
  return best;
}

/**
 * Splits a CMS title for a two-tone heading: the first part renders in ink,
 * the second in ink-2. The stega payload (a suffix that Content Link appends)
 * stays in the second part, so the overlay still targets the field. Returns
 * `[raw, '']` when the title must not be split.
 */
export function splitTwoToneTitle(
  raw: string,
): [first: string, second: string] {
  const cleanTitle = stripStega(raw).trim();
  const cut = splitIndex(cleanTitle);
  if (cut <= 0 || !raw.startsWith(cleanTitle)) return [raw, ''];
  return [raw.slice(0, cut).trimEnd(), raw.slice(cut).trimStart()];
}

/** A period between the title and the lead, and whether the lead starts its own line */
export type TitleLeadMerge = { addPeriod: boolean; stack: boolean };

/**
 * Can a section title and its (plain, one-sentence) lead merge into one
 * two-tone H2? Returns null when they must stay separate.
 */
export function mergeTitleWithLead(
  title?: string | null,
  lead?: string | null,
): TitleLeadMerge | null {
  const cleanTitle = stripStega(title ?? '').trim();
  const cleanLead = stripStega(lead ?? '').trim();
  if (!cleanTitle || !cleanLead) return null;
  if (MARKDOWN.test(cleanLead)) return null;
  if (lastMatch(cleanLead, SENTENCE_BREAK)) return null;

  // A title that already ends in punctuation needs no period of its own
  const joiner = /[.!?:]$/.test(cleanTitle) ? ' ' : '. ';
  const length = (cleanTitle + joiner + cleanLead).length;
  if (length > 64) return null;
  return { addPeriod: joiner === '. ', stack: length > 48 };
}
