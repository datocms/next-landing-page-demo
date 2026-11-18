import type { ResponsiveImageFragment } from '@/components/datocms/DatoImage/fragment';
import { SharedElement } from '@/components/layout/PageTransition';
import Photo from '@/components/ui/Photo';
import type { FragmentOf } from '@/lib/datocms/graphql';
import { cn } from '@/utils/cn';

type Props = {
  /** The post's `coverImage`: `focalPoint` and a 16:10 `responsiveImage` */
  image?: {
    focalPoint?: { x: number; y: number } | null;
    responsiveImage?: FragmentOf<typeof ResponsiveImageFragment> | null;
  } | null;
  /** post: 3:2, every post listing (default). cover: 16:10. detail: 4:3 */
  frame?: 'post' | 'cover' | 'detail';
  /** The HTML `sizes` of the frame */
  sizes: string;
  /** Only for the cover at the top of a page */
  priority?: boolean;
  /** "" in cards, where the title next to it already names the link */
  alt?: string;
  /** Square corners: the cover sits flush with the top of a card that clips it */
  flush?: boolean;
  /**
   * The post's page (postPath), on a listing: opening it, the cover travels to
   * the top of the post, and back again
   */
  linksTo?: string | null;
  /** Placement only */
  className?: string;
};

const RATIO = {
  post: 'aspect-[3/2]',
  cover: 'aspect-[16/10]',
  detail: 'aspect-[4/3]',
};

/**
 * A post's cover in the 3:2 frame with the media radius, in colour. Without an
 * image the frame stays as a flat subtle block, so a row of posts keeps its rhythm.
 */
const PostCover = ({ linksTo, ...props }: Props) =>
  linksTo ? (
    <SharedElement kind="cover" href={linksTo}>
      <Cover {...props} />
    </SharedElement>
  ) : (
    <Cover {...props} />
  );

const Cover = ({
  image,
  frame = 'post',
  sizes,
  priority,
  alt,
  flush = false,
  className,
}: Omit<Props, 'linksTo'>) =>
  image?.responsiveImage ? (
    <Photo
      image={image.responsiveImage}
      // Photo has no 3:2 frame: its 16:10 is overridden (important) for `post`
      frame={frame === 'post' ? 'cover' : frame}
      focalPoint={image.focalPoint}
      sizes={sizes}
      priority={priority}
      alt={alt}
      radius={flush ? 'none' : 'card'}
      // Inside a linked card (PostLink's `group`), the photo leans in a little on hover
      className={cn(
        frame === 'post' && 'aspect-[3/2]!',
        'motion-safe:[&_img]:transition-transform motion-safe:[&_img]:duration-700 motion-safe:[&_img]:ease-[cubic-bezier(0.2,0.7,0.2,1)] motion-safe:group-hover:[&_img]:scale-[1.035]',
        className,
      )}
    />
  ) : (
    <div
      aria-hidden="true"
      className={cn(
        'w-full bg-subtle',
        !flush && 'rounded-media',
        RATIO[frame],
        className,
      )}
    />
  );

export default PostCover;
