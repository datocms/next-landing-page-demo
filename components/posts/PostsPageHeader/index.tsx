import type { ReactNode } from 'react';
import { Threads } from '@/components/ui/Ornaments';
import { cn } from '@/utils/cn';
import { toneClass } from '@/utils/tones';
import headerArches from './headerArches';

type Props = {
  /** Small label pill above the title ("Blog", "Tag", "Author") */
  label: string;
  /** The page h1 */
  title: ReactNode;
  /** Id on the h1, for aria-labelledby on the section that follows */
  titleId?: string;
  /** A mono line under the title (post count, page) */
  meta?: ReactNode;
  /** Tone 0–5 of the label dot (the tag page passes its tag's tone) */
  tone?: number;
  /** Right-hand media (the author portrait); it sits over the arches */
  media?: ReactNode;
  /** Extra copy under the title (author bio and description) */
  children?: ReactNode;
};

/**
 * The blog's page opener: a tinted well with the page label, a two-line-max
 * h1 and a mono meta line, framed on the right by nested accent arches.
 * Used by the posts index and its pages, the tag pages and the author pages.
 */
const PostsPageHeader = ({
  label,
  title,
  titleId,
  meta,
  tone,
  media,
  children,
}: Props) => (
  <header className="container-page pt-8 max-md:pt-6">
    <div className="well grid min-h-[232px] items-center gap-y-6 px-14 py-12 max-lg:px-8 max-lg:py-10 max-md:min-h-0 max-md:px-5 max-md:py-7 lg:grid-cols-12 lg:gap-x-6">
      {/* A fixed-height box capped at 46% of the well: taller copy never makes the arches grow toward it */}
      <Threads
        shape={headerArches}
        className="top-auto left-auto h-[240px] w-[min(600px,46%)] opacity-[.62] max-lg:hidden"
      />
      <div className="min-w-0 lg:col-span-6">
        <p className={cn('pill-label', toneClass(tone ?? 0))}>{label}</p>
        <h1
          id={titleId}
          className="mt-4 -ms-[0.03em] text-balance text-h1 text-ink"
        >
          {title}
        </h1>
        {meta && <p className="mono mt-3">{meta}</p>}
        {children}
      </div>
      {media && (
        <div className="max-lg:order-first lg:col-span-5 lg:col-start-8 lg:justify-self-center">
          {media}
        </div>
      )}
    </div>
  </header>
);

export default PostsPageHeader;
