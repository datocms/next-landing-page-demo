import { isParagraph } from 'datocms-structured-text-utils';
import {
  rootNodes,
  type StructuredTextField,
  structuredTextToPlainText,
} from '@/utils/structuredText';
import { isRedundantExcerpt } from './isRedundantExcerpt';
import { hasText } from './postText';

/**
 * The text under a post's title in a card: its SEO description, unless that
 * only repeats the title (the demo's descriptions do), then the first
 * paragraph of the body. Cards clamp it to two lines, so its length does not matter.
 */
export function postExcerptText(
  title: string | null | undefined,
  description: string | null | undefined,
  content: StructuredTextField | null | undefined,
): string | null {
  if (hasText(description) && !isRedundantExcerpt(title, description)) {
    return description;
  }

  const paragraph = rootNodes(content?.value).find(isParagraph);
  if (!paragraph) return null;

  const text = structuredTextToPlainText({
    value: {
      schema: 'dast',
      document: { type: 'root', children: [paragraph] },
    },
  });
  return hasText(text) ? text : null;
}
