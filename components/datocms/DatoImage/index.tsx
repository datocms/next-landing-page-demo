import {
  type ImagePropTypes,
  Image as ReactDatocmsImage,
} from 'react-datocms/image';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import { ResponsiveImageFragment } from './fragment';

type ImageProps = Omit<ImagePropTypes, 'data'>;

type Props = ImageProps & {
  fragment: FragmentOf<typeof ResponsiveImageFragment>;
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
export default function DatoImage({ fragment, ...rest }: Props) {
  return (
    <ReactDatocmsImage
      {...withFillPlaceholder(rest)}
      data={readFragment(ResponsiveImageFragment, fragment)}
    />
  );
}
