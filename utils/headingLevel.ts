/** h1 when the section opens a page without a hero (decided in [slug]/Content.tsx), else h2 */
export type SectionHeadingLevel = 'h1' | 'h2';

/** The level of the titles inside a section */
export type ItemHeadingLevel = 'h2' | 'h3';

/** Titles inside a section sit one level below its heading */
export const itemHeadingLevel = (
  as: SectionHeadingLevel = 'h2',
): ItemHeadingLevel => (as === 'h1' ? 'h2' : 'h3');

/** Heading tags inside long-form text: the page title is the only h1 */
type BodyHeadingTag = 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

/** The tag for a long-form heading of `level`, kept between h2 and h6 */
export const bodyHeadingTag = (level: number) =>
  `h${Math.min(6, Math.max(2, level))}` as BodyHeadingTag;
