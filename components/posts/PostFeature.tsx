import { UNDER_HEADER } from '@/components/sections/HeroSection/variants/SplitHero';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import { cn } from '@/utils/cn';
import type { ResolvedGlobalPageProps } from '@/utils/globalPageProps';
import type { ItemHeadingLevel } from '@/utils/headingLevel';
import { titleSize } from '@/utils/titleSize';
import PostCover from './PostCover';
import { PostExcerptFragment } from './PostExcerpt/fragment';
import PostLink, { postPath } from './PostLink';
import PostMeta from './PostMeta';
import PostTags from './PostTags';
import PostTitle from './PostTitle';
import { postExcerptText } from './postExcerptText';

type Props = {
  fragment: FragmentOf<typeof PostExcerptFragment>;
  globalPageProps: ResolvedGlobalPageProps;
  /** The title's tag: h2 under the page h1 */
  headingLevel?: ItemHeadingLevel;
};

/**
 * The cover's width: 7 of 12 columns from 1024px (650px once the container
 * stops growing), the panel's content width below. Inside the panel the
 * container loses the panel's inset too.
 */
const FEATURE_SIZES =
  '(min-width: 1240px) 650px, (min-width: 1024px) calc((100vw - 456px) * 7 / 12 + 192px), (min-width: 640px) calc(100vw - 64px), calc(100vw - 56px)';

/**
 * The newest post opening the blog: on the tinted rounded panel (reaching up
 * behind the header, like a hero), the cover large on the left with the photo
 * shadow, then the tags, a section-size title, the excerpt and the byline.
 * Stacked below 1024px. The whole block is one link; its title underlines on hover.
 */
const PostFeature = ({
  fragment,
  globalPageProps,
  headingLevel: Heading = 'h2',
}: Props) => {
  const { locale } = globalPageProps.params;
  const {
    title,
    slug,
    seoMeta,
    coverImage,
    author,
    tags,
    content,
    _publishedAt,
  } = readFragment(PostExcerptFragment, fragment);
  const excerpt = postExcerptText(title, seoMeta?.description, content);
  const scale = titleSize(title ?? '', 'h2');

  return (
    <div className={cn('panel panel-tint', UNDER_HEADER)}>
      <article className="container-page pt-6 pb-10 sm:pt-10 sm:pb-14 lg:pt-14 lg:pb-20">
        <PostLink
          slug={slug}
          globalPageProps={globalPageProps}
          className="grid items-center gap-8 lg:grid-cols-12 lg:gap-x-8"
        >
          <PostCover
            linksTo={postPath(slug, globalPageProps)}
            image={coverImage}
            frame="cover"
            sizes={FEATURE_SIZES}
            priority
            alt=""
            className="shadow-glow lg:col-span-7"
          />
          <div className="lg:col-span-5 lg:pl-4">
            <PostTags tags={tags.slice(0, 3)} onTint />
            <Heading
              data-long={scale.long}
              className={cn(scale.className, 'mt-4 lg:mt-5')}
            >
              <PostTitle
                title={title}
                locale={locale}
                className="title-underline"
              />
            </Heading>
            {excerpt && (
              <p className="mt-4 line-clamp-4 text-lead text-fg-muted lg:mt-5">
                {excerpt}
              </p>
            )}
            <PostMeta
              locale={locale}
              date={_publishedAt}
              author={author}
              className="mt-6 lg:mt-8"
            />
          </div>
        </PostLink>
      </article>
    </div>
  );
};

export default PostFeature;
