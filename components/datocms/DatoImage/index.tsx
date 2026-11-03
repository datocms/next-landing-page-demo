import {
  type ImagePropTypes,
  Image as ReactDatocmsImage,
} from 'react-datocms/image';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import { ResponsiveImageFragment } from './fragment';

type Props =
  | ImagePropTypes
  | (Omit<ImagePropTypes, 'data'> & {
      fragment: FragmentOf<typeof ResponsiveImageFragment>;
    });

/**
 * The blur-up placeholder is sized by the image's own ratio, so inside a fixed
 * frame (portrait, square) it would stop short and leave a hard band while the
 * image loads. With layout="fill" stretch it over the whole frame instead.
 */
function withFillPlaceholder<T extends Omit<ImagePropTypes, 'data'>>(props: T) {
  if (props.layout !== 'fill') return props;
  return {
    ...props,
    placeholderStyle: {
      height: '110%',
      objectFit: 'cover' as const,
      ...props.placeholderStyle,
    },
  };
}

/**
 * react-datocms's Image. It also takes a masked ResponsiveImageFragment as
 * `fragment` (in place of `data`), and fills fixed frames with the blur-up
 * placeholder
 */
export default function DatoImage(props: Props) {
  if ('fragment' in props) {
    const { fragment, ...rest } = props;
    const data = readFragment(ResponsiveImageFragment, fragment);
    return <ReactDatocmsImage {...withFillPlaceholder(rest)} data={data} />;
  }

  return <ReactDatocmsImage {...withFillPlaceholder(props)} />;
}
