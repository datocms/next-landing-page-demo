import DatoImage from '@/components/datocms/DatoImage';
import { ResponsiveImageFragment } from '@/components/datocms/DatoImage/fragment';
import { MINI_UIS } from '@/components/ui/Ornaments';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';

type Props = {
  /** The feature's CMS image (featureIcon.responsiveImage) */
  image?: FragmentOf<typeof ResponsiveImageFragment> | null;
  /** The feature's position in its list: picks the drawing shown without an image */
  index: number;
  /** `sizes` for a photo that covers the whole media box */
  sizes: string;
};

/**
 * The CMS image of a big-image feature, decided on the server. Near-square
 * icon art (ratio 0.8–1.25) becomes a floating tile of `--tile` px centred in
 * the media box (frame `--tile-p`, radii `--tile-r` / `--tile-ir`, default
 * 5 / 16 / 12), tinted to the nearest tone like FeatureIcon; anything else is
 * treated as a photo, keeps its own colours and covers the box (the box must
 * be `relative` and carry its own radius). Without a usable image (none
 * uploaded, or an SVG, which has no responsiveImage) the box shows the
 * feature's wordless mini-UI instead, so it is never an empty well.
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
      <div className="float relative rounded-[var(--tile-r,16px)] p-[var(--tile-p,5px)]">
        <div className="photo size-(--tile) rounded-[var(--tile-ir,12px)] bg-tone [&_img]:mix-blend-luminosity">
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
