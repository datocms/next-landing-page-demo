import { stripStega } from '@datocms/content-link';
import type { CSSProperties } from 'react';
import { cn } from '@/utils/cn';

type Props = {
  /** CMS SVG url (Content Link markers are stripped here) */
  url: string;
  /** Size and colour (the glyph paints with the element's background colour, for example bg-tone) */
  className?: string;
};

/**
 * Paints a CMS SVG icon in any colour with a CSS mask, on the server, with no
 * fetch and no layout shift. DatoCMS assets are served with CORS headers, which
 * mask images need. Decorative.
 */
const MaskIcon = ({ url, className }: Props) => {
  // Only quotes, backslashes and whitespace could break out of url("…")
  const src = stripStega(url).replace(/["\\\s]/g, encodeURIComponent);
  const mask = `url("${src}") center / contain no-repeat`;
  return (
    <span
      aria-hidden="true"
      className={cn('block', className)}
      style={{ mask, WebkitMask: mask } as CSSProperties}
    />
  );
};

export default MaskIcon;
