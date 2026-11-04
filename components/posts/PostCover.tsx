import DatoImage from '@/components/datocms/DatoImage';
import type { ResponsiveImageFragment } from '@/components/datocms/DatoImage/fragment';
import type { FragmentOf } from '@/lib/datocms/graphql';
import PostCoverFallback from './PostCoverFallback';

type Props = {
  cover?: FragmentOf<typeof ResponsiveImageFragment> | null;
  /** The post title, which seeds the stand-in's tone */
  title: string;
  /** The image's `sizes` attribute */
  sizes: string;
  /** Load the cover eagerly (cards above the fold) */
  priority?: boolean;
  /** Zoom the cover on hover of its card */
  zoom?: boolean;
};

/**
 * A post's cover image, or the wordless stand-in when the post has none.
 * Fills its positioned `photo` frame.
 */
const PostCover = ({ cover, title, sizes, priority, zoom = true }: Props) => {
  if (!cover) {
    return <PostCoverFallback seed={title} />;
  }

  const image = (
    <DatoImage
      layout="fill"
      objectFit="cover"
      objectPosition="50% 50%"
      fragment={cover}
      priority={priority}
      sizes={sizes}
    />
  );

  return zoom ? (
    <div className="media-zoom absolute inset-0">{image}</div>
  ) : (
    image
  );
};

export default PostCover;
