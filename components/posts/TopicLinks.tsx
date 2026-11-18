import { stripStega } from '@datocms/content-link';
import AppLink from '@/components/ui/AppLink';
import { uiLabel, uiString } from '@/lib/i18n/uiStrings';
import { cn } from '@/utils/cn';
import type { ResolvedGlobalPageProps } from '@/utils/globalPageProps';
import { postsPageUrl, tagUrl } from '@/utils/routes';
import { hasText } from './postText';

export type Topic = {
  /** Raw CMS tag name */
  name: string;
  /** Raw CMS tag slug */
  slug: string;
};

type Props = {
  topics: readonly Topic[];
  globalPageProps: ResolvedGlobalPageProps;
  /** The page being shown: the index ("all") or a tag's slug */
  current: 'all' | (string & {});
  /** Centre the rows from 640px (under a centred page title) */
  centered?: boolean;
  /** Placement only */
  className?: string;
};

/** A 40px pill (44px hit area); the current one on the tint, in the accent */
const PILL =
  'hit-44 inline-flex min-h-10 items-center rounded-chip px-4 text-small font-medium whitespace-nowrap transition-colors duration-150';
const PILL_CURRENT = 'bg-tint text-accent-ink';
const PILL_OTHER = 'bg-subtle text-fg hover:bg-tint';

/**
 * The blog's topics as a row of pills: "All posts" first, then a link to each
 * tag page. Used at the top of the index, its pages and the tag pages. On
 * phones the row scrolls sideways instead of wrapping into a tall block.
 */
const TopicLinks = ({
  topics,
  globalPageProps,
  current,
  centered = false,
  className,
}: Props) => {
  const { locale } = globalPageProps.params;
  const visible = topics.filter(
    (topic) => hasText(topic.name) && hasText(topic.slug),
  );
  if (visible.length === 0) return null;

  const pill = (isCurrent: boolean) =>
    cn(PILL, isCurrent ? PILL_CURRENT : PILL_OTHER);

  return (
    <nav aria-label={uiString(locale, 'tags')} className={className}>
      {/* On phones one row that scrolls sideways, out to the screen edges */}
      <ul
        className={cn(
          'flex gap-2 sm:flex-wrap',
          'max-sm:-mx-(--gutter) max-sm:overflow-x-auto max-sm:px-(--gutter) max-sm:py-1 max-sm:[scrollbar-width:none]',
          centered && 'sm:justify-center',
        )}
      >
        <li>
          <AppLink
            href={postsPageUrl(globalPageProps, 1)}
            aria-current={current === 'all' ? 'page' : undefined}
            className={pill(current === 'all')}
          >
            {uiLabel(locale, 'allPosts')}
          </AppLink>
        </li>
        {visible.map((topic) => {
          const slug = stripStega(topic.slug).trim();
          const isCurrent = slug === current;

          return (
            <li key={slug}>
              <AppLink
                href={tagUrl(globalPageProps, slug)}
                aria-current={isCurrent ? 'page' : undefined}
                className={pill(isCurrent)}
              >
                {topic.name}
              </AppLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

/**
 * The distinct tags of some posts, by name (the index derives its topics
 * from the posts it shows)
 */
export function topicsOf(
  posts: readonly { tags: readonly Topic[] }[],
): Topic[] {
  const bySlug = new Map<string, Topic>();
  for (const post of posts) {
    for (const tag of post.tags) {
      const slug = stripStega(tag.slug ?? '').trim();
      if (slug && !bySlug.has(slug)) bySlug.set(slug, tag);
    }
  }
  return [...bySlug.values()].sort((a, b) =>
    stripStega(a.name).localeCompare(stripStega(b.name)),
  );
}

export default TopicLinks;
