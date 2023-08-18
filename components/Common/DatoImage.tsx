
// import { graphql } from 'graphql';
// import { Image as ReactDatocmsImage, type ImagePropTypes } from 'react-datocms';

// const DatoImage_responsiveImage = graphql(/* GraphQL */ `
//   fragment DatoImage_responsiveImage on ResponsiveImage {
//     src
//     srcSet
//     base64
//     width
//     height
//     alt
//     title
//   }
// `);

// type Props = Omit<ImagePropTypes, 'data'> & {
//   fragment: FragmentType<typeof DatoImage_responsiveImage>;
// };

// export default function DatoImage({ fragment, ...rest }: Props) {
//   const data = getFragmentData(DatoImage_responsiveImage, fragment);
//   return <ReactDatocmsImage {...rest} data={data} />;
// }
