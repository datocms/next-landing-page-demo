import type { ReactNode } from 'react';
import { titleSize } from '@/utils/titleSize';

type Props = {
  /** The page h1: a raw CMS string (Content Link stays on it) or an interface string */
  title: string;
  /** Id on the h1, for aria-labelledby on the section that follows */
  titleId?: string;
  /** One line under the title in fg-muted, at lead size (a post count, a role) */
  lead?: ReactNode;
  /** Above the title (the author's portrait) */
  media?: ReactNode;
  /** More copy under the lead (the author's bio and areas) */
  children?: ReactNode;
};

/**
 * The opener of the blog's list pages (posts index and its pages, tag and
 * author pages): a centred h1 with a muted line under it.
 */
const PostsPageHeader = ({ title, titleId, lead, media, children }: Props) => {
  const scale = titleSize(title, 'h1');

  return (
    <header className="container-page pt-(--page-top) text-center">
      <div className="mx-auto flex max-w-[44rem] flex-col items-center">
        {media && <div className="mb-6">{media}</div>}
        <h1 id={titleId} data-long={scale.long} className={scale.className}>
          {title}
        </h1>
        {lead && (
          <p className="mt-4 max-w-[40rem] text-lead text-fg-muted">{lead}</p>
        )}
        {children}
      </div>
    </header>
  );
};

export default PostsPageHeader;
