/** Whitespace runs, except U+FEFF: it is part of the invisible Content Link (stega) encoding */
const WHITESPACE = /[^\S\uFEFF]+/;
/** A word with a hyphen inside it, such as "Front-End" */
const HYPHENATED = /\S-\S/;

/**
 * Keeps hyphenated words on one line, so a narrow title breaks between words
 * ("Front-End Solutions") rather than after the hyphen. The text is only split
 * at whitespace, so the stega payload riding at the end of the last word stays
 * in one piece.
 */
export default function keepHyphenatedWordsTogether(text: string) {
  let offset = 0;
  return text.split(new RegExp(`(${WHITESPACE.source})`)).map((part) => {
    const key = offset;
    offset += part.length;
    return HYPHENATED.test(part) ? (
      <span key={key} className="whitespace-nowrap">
        {part}
      </span>
    ) : (
      part
    );
  });
}
