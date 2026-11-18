import {
  type ImagePropTypes,
  Image as ReactDatocmsImage,
} from 'react-datocms/image';
import { RSCImage } from 'react-datocms/rsc-image';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import { ResponsiveImageFragment } from './fragment';

type ImageProps = Omit<ImagePropTypes, 'data'>;

type Props = ImageProps & {
  fragment: FragmentOf<typeof ResponsiveImageFragment>;
  /** Replaces the asset's alt text: pass "" when the image repeats text next to it (an avatar beside a name) */
  alt?: string;
};

/**
 * The blur-up placeholder is sized by the image's own ratio, so inside a fixed
 * frame (portrait, square) it would stop short and leave a hard band while the
 * image loads. With layout="fill" stretch it over the whole frame instead.
 */
function withFillPlaceholder(props: ImageProps): ImageProps {
  if (props.layout !== 'fill') return props;
  return {
    ...props,
    placeholderStyle: {
      height: '110%',
      objectFit: 'cover',
      ...props.placeholderStyle,
    },
  };
}

/** react-datocms's Image for a masked ResponsiveImageFragment; fills fixed frames with the blur-up placeholder */
export default function DatoImage({ fragment, alt, ...rest }: Props) {
  const data = readFragment(ResponsiveImageFragment, fragment);
  return (
    <ReactDatocmsImage
      {...withFillPlaceholder(rest)}
      data={alt === undefined ? data : { ...data, alt }}
    />
  );
}

type InlineProps = {
  fragment: FragmentOf<typeof ResponsiveImageFragment>;
  /** Replaces the asset's alt text; "" for a decorative image */
  alt?: string;
  /** The HTML `sizes` of the frame, for example "32px" */
  sizes: string;
  priority?: boolean;
};

/**
 * A CMS image that fills a small frame inside a line of text (an avatar, a
 * pin): a plain <picture> with native lazy loading, valid inside <p> and
 * <span>, where DatoImage's <div> wrapper is not. The parent sets the size and
 * the shape; the image covers it.
 */
export function DatoInlineImage({
  fragment,
  alt,
  sizes,
  priority,
}: InlineProps) {
  const data = readFragment(ResponsiveImageFragment, fragment);
  return (
    <RSCImage
      data={alt === undefined ? data : { ...data, alt }}
      sizes={sizes}
      priority={priority}
      pictureStyle={{ display: 'contents' }}
      imgStyle={{
        width: '100%',
        height: '100%',
        maxWidth: 'none',
        aspectRatio: 'auto',
        objectFit: 'cover',
      }}
    />
  );
}
