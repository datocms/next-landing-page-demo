import { notFound } from 'next/navigation';
import DatoImage from '@/components/datocms/DatoImage';
import type { ResponsiveImageFragment } from '@/components/datocms/DatoImage/fragment';
import DatoStructuredText from '@/components/datocms/DatoStructuredText';
import PostExcerpt, { postCardLayout } from '@/components/posts/PostExcerpt';
import PostsPageHeader from '@/components/posts/PostsPageHeader';
import type { FragmentOf } from '@/lib/datocms/graphql';
import type { ContentPage } from '@/lib/datocms/realtime/types';
import { uiString } from '@/lib/i18n/uiStrings';
import { cn } from '@/utils/cn';
import { hasStructuredText } from '@/utils/structuredText';
import { TONES, toneIndex } from '@/utils/tones';
import type { PageProps, Query } from './meta';

type AuthorPortraitProps = {
  image: FragmentOf<typeof ResponsiveImageFragment>;
  /** Raw CMS name: the ring's tone is hashed from it */
  name: string;
};

/**
 * The author's round portrait in a tone ring. It sits on top of the header
 * arches, which pass behind it.
 */
const AuthorPortrait = ({ image, name }: AuthorPortraitProps) => (
  <div
    className={cn(
      'ring-tone size-36 rounded-full max-lg:size-24',
      TONES[toneIndex(name)],
    )}
  >
    <div className="photo size-full rounded-full bg-white">
      <DatoImage
        fragment={image}
        layout="fill"
        objectFit="cover"
        objectPosition="50% 30%"
        sizes="144px"
      />
    </div>
  </div>
);

const Content: ContentPage<PageProps, Query> = ({
  data,
  ...globalPageProps
}) => {
  if (!data.author) {
    notFound();
  }

  const { locale } = globalPageProps.params;
  const { author } = data;
  const posts = author._allReferencingPosts;
  const postCount = author._allReferencingPostsMeta.count;
  const portrait = author.picture?.responsiveImage;

  return (
    <>
      <PostsPageHeader
        label={uiString(locale, 'author')}
        title={author.name}
        tone={toneIndex(author.name)}
        media={
          portrait ? (
            <AuthorPortrait image={portrait} name={author.name} />
          ) : undefined
        }
      >
        {author.bio && (
          <p className="mt-3 text-lead text-ink-2">{author.bio}</p>
        )}
        {hasStructuredText(author.description) && (
          <div className="prose prose-sm mt-4 max-w-[62ch]">
            <DatoStructuredText data={author.description} />
          </div>
        )}
      </PostsPageHeader>

      {posts.length > 0 && (
        <section
          aria-labelledby="author-posts-title"
          className="container-page mt-16 pb-24 max-md:mt-12 max-md:pb-16"
        >
          <div className="mb-8 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 max-md:mb-6">
            <h2 id="author-posts-title" className="text-h2 text-ink">
              {/* The raw name goes in, so Content Link can still target it */}
              {uiString(locale, 'postsBy', { name: author.name })}
            </h2>
            <p className="mono">
              {uiString(locale, 'postCount', { n: postCount })}
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-2 md:gap-4 lg:grid-cols-3">
            {posts.map((post, index) => (
              <PostExcerpt
                key={post.id}
                fragment={post}
                globalPageProps={globalPageProps}
                priority={index < 3}
                {...postCardLayout(index, posts.length)}
              />
            ))}
          </div>
        </section>
      )}
    </>
  );
};

export default Content;
