/** Posts per blog index page (/posts and /posts/page/[page]) */
export const POSTS_PER_PAGE = 9;

/** How many index pages `postCount` posts fill (at least one) */
export const postsPageCount = (postCount: number) =>
  Math.max(1, Math.ceil(postCount / POSTS_PER_PAGE));
