import { type FragmentType, getFragmentData } from '@/graphql/types';
import { DatoImage_ResponsiveImageFragmentDoc } from '@/graphql/types/graphql';
import { type ImagePropTypes, Image as ReactDatocmsImage } from 'react-datocms';

type Props =
  | ImagePropTypes
  | (Omit<ImagePropTypes, 'data'> & {
      fragment: FragmentType<typeof DatoImage_ResponsiveImageFragmentDoc>;
    });

export default function DatoImage(props: Props) {
  if ('fragment' in props) {
    const { fragment, ...rest } = props;
    const data = getFragmentData(
      DatoImage_ResponsiveImageFragmentDoc,
      fragment,
    );
    return <ReactDatocmsImage {...rest} data={data} />;
  }

  return <ReactDatocmsImage {...props} />;
}
