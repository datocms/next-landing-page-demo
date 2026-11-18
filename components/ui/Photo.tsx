import DatoImage from '@/components/datocms/DatoImage';
import type { ResponsiveImageFragment } from '@/components/datocms/DatoImage/fragment';
import type { FragmentOf } from '@/lib/datocms/graphql';
import { cn } from '@/utils/cn';

/** The site's image frames, by where the image is used */
export type PhotoFrame =
  | 'hero'
  | 'detail'
  | 'landscape'
  | 'video'
  | 'cover'
  | 'portrait'
  | 'square';

type Props = {
  /** The asset's `responsiveImage` */
  image: FragmentOf<typeof ResponsiveImageFragment>;
  frame: PhotoFrame;
  /** The HTML `sizes` of the frame: how wide it renders at each breakpoint */
  sizes: string;
  /** A hairline border around the frame: for screenshots and other light images */
  bordered?: boolean;
  /**
   * card: the 24px media radius (default). large: the 28px card radius (the detail
   * image). frame: 36px, the panel radius. none: square corners, for a cover flush
   * with the top of a card
   */
  radius?: 'card' | 'large' | 'frame' | 'none';
  /** The asset's `focalPoint { x y }`: what stays in view when the frame crops the image */
  focalPoint?: { x: number; y: number } | null;
  /** Only for the image at the top of a page (the hero) */
  priority?: boolean;
  /** Replaces the asset's alt text; "" for a decorative image */
  alt?: string;
  /** Placement only (grid position, width) */
  className?: string;
};

// hero: 4:3 beside the copy; 16:10 once it stacks below 1024
const FRAME: Record<PhotoFrame, string> = {
  hero: 'aspect-[16/10] lg:aspect-[4/3]',
  detail: 'aspect-[4/3]',
  landscape: 'aspect-[5/4]',
  video: 'aspect-video',
  cover: 'aspect-[16/10]',
  portrait: 'aspect-[4/5]',
  square: 'aspect-square',
};

/**
 * A CMS image in one of the site's frames: cropped to the frame around its
 * focal point, with the card radius. Avatars use Avatar instead.
 */
const Photo = ({
  image,
  frame,
  sizes,
  bordered = false,
  radius = 'card',
  focalPoint,
  priority = false,
  alt,
  className,
}: Props) => (
  <div
    data-photo=""
    className={cn(
      'relative w-full overflow-hidden bg-subtle',
      radius === 'frame' && 'rounded-frame',
      radius === 'card' && 'rounded-media',
      radius === 'large' && 'rounded-card',
      FRAME[frame],
      bordered && 'border border-line',
      className,
    )}
  >
    <DatoImage
      fragment={image}
      alt={alt}
      layout="fill"
      objectFit="cover"
      objectPosition={
        focalPoint ? `${focalPoint.x * 100}% ${focalPoint.y * 100}%` : '50% 50%'
      }
      sizes={sizes}
      priority={priority}
    />
  </div>
);

export default Photo;
