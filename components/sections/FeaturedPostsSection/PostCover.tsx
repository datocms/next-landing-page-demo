import DatoImage from '@/components/datocms/DatoImage';
import type { ResponsiveImageFragment } from '@/components/datocms/DatoImage/fragment';
import CoverFallback from '@/components/posts/PostExcerpt/CoverFallback';
import type { FragmentOf } from '@/lib/datocms/graphql';

type Props = {
  cover?: FragmentOf<typeof ResponsiveImageFragment> | null;
  /** The post title, which seeds the stand-in's tone */
  title: string;
  /** The image's `sizes` attribute */
  sizes: string;
};

/**
 * A post cover that zooms on hover of its card, or the wordless stand-in when
 * the post has none. Fills its positioned `photo` frame.
 */
const PostCover = ({ cover, title, sizes }: Props) =>
  cover ? (
    <div className="media-zoom absolute inset-0">
      <DatoImage
        layout="fill"
        objectFit="cover"
        objectPosition="50% 50%"
        fragment={cover}
        sizes={sizes}
      />
    </div>
  ) : (
    <CoverFallback seed={title} />
  );

export default PostCover;
