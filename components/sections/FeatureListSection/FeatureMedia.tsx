import DatoImage from '@/components/datocms/DatoImage';
import { ResponsiveImageFragment } from '@/components/datocms/DatoImage/fragment';
import { MINI_UIS } from '@/components/ui/Ornaments';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';

/**
 * Icon art is sized by the parent's --media-tile-size, with optional
 * --media-tile-padding, --media-tile-radius and --media-tile-inner-radius.
 */
type Props = {
  /** The feature's CMS image (featureIcon.responsiveImage) */
  image?: FragmentOf<typeof ResponsiveImageFragment> | null;
  /** The feature's position in its list: picks the drawing shown without an image */
  index: number;
  /** `sizes` for a photo that covers the whole media box */
  sizes: string;
};

/**
 * A big-image feature's CMS image: near-square icon art becomes a tinted tile,
 * anything else covers the parent as a photo. Without a usable image (none, or
 * an SVG, which has no responsiveImage) it shows the feature's mini-UI.
 */
const FeatureMedia = ({ image, index, sizes }: Props) => {
  if (!image) {
    const MiniUi = MINI_UIS[index % MINI_UIS.length];
    return <MiniUi className="absolute inset-0 size-full" />;
  }

  const { width, height } = readFragment(ResponsiveImageFragment, image);
  const ratio = width && height ? width / height : 1;
  const isIconArt = ratio >= 0.8 && ratio <= 1.25;

  if (isIconArt) {
    return (
      <div className="float relative rounded-[var(--media-tile-radius,16px)] p-[var(--media-tile-padding,5px)]">
        <div className="photo size-(--media-tile-size) rounded-[var(--media-tile-inner-radius,12px)] bg-tone [&_img]:mix-blend-luminosity">
          <DatoImage
            fragment={image}
            layout="fill"
            objectFit="cover"
            sizes="140px"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="photo absolute inset-0 rounded-[inherit]">
      <DatoImage
        fragment={image}
        layout="fill"
        objectFit="cover"
        sizes={sizes}
      />
    </div>
  );
};

export default FeatureMedia;
