import { stripStega } from '@datocms/content-link';
import PostGrid from '@/components/posts/PostGrid';
import PostRows from '@/components/posts/PostRows';
import { ArrowRightIcon } from '@/components/ui/icons';
import TextLink from '@/components/ui/TextLink';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import { uiString } from '@/lib/i18n/uiStrings';
import { cn } from '@/utils/cn';
import type { ResolvedGlobalPageProps } from '@/utils/globalPageProps';
import { postsPageUrl } from '@/utils/routes';
import { FeaturedPostsSectionFragment } from './fragment';
import FeaturedPosts from './variants/FeaturedPosts';
import MosaicPosts from './variants/MosaicPosts';

type Props = {
  fragment: FragmentOf<typeof FeaturedPostsSectionFragment>;
  globalPageProps: ResolvedGlobalPageProps;
};

export type FeaturedPostsLayout = 'featured' | 'list' | 'grid' | 'mosaic';

/** The layout picked in the block's "Layout" field; `featured` for anything unknown or empty */
function postsLayout(layout?: string | null): FeaturedPostsLayout {
  const value = stripStega(layout ?? '').trim();
  return value === 'list' || value === 'grid' || value === 'mosaic'
    ? value
    : 'featured';
}

/**
 * Featured posts: the posts in the `featured`, `list`, `grid` or `mosaic` (the
 * mosaic landing page's tiles) layout, then a link to the whole blog, on the
 * left for the mosaic like its hero. Nothing without posts.
 */
const FeaturedPostsSection = ({ fragment, globalPageProps }: Props) => {
  const { locale } = globalPageProps.params;
  const { layout: layoutValue, featuredPosts } = readFragment(
    FeaturedPostsSectionFragment,
    fragment,
  );
  if (featuredPosts.length === 0) return null;

  const variantProps = {
    posts: featuredPosts,
    globalPageProps,
    headingLevel: 'h2' as const,
  };
  const layout = postsLayout(layoutValue);

  return (
    <section aria-label={uiString(locale, 'featuredPosts')} className="section">
      <div className="container-page">
        {layout === 'list' ? (
          <PostRows
            {...variantProps}
            className="reveal mx-auto max-w-[56rem]"
          />
        ) : layout === 'grid' ? (
          <PostGrid {...variantProps} className="reveal" />
        ) : layout === 'mosaic' ? (
          <MosaicPosts {...variantProps} />
        ) : (
          <FeaturedPosts {...variantProps} />
        )}

        <p
          className={cn(
            'reveal mt-12 lg:mt-14',
            layout === 'mosaic' ? 'text-left' : 'text-center',
          )}
        >
          <TextLink
            href={postsPageUrl(globalPageProps, 1)}
            className="group inline-flex items-center gap-1.5 text-body"
          >
            {uiString(locale, 'allPosts')}
            <ArrowRightIcon className="size-4 transition-transform duration-300 ease-[cubic-bezier(0.2,0.7,0.2,1)] motion-safe:group-hover:translate-x-1" />
          </TextLink>
        </p>
      </div>
    </section>
  );
};

export default FeaturedPostsSection;
