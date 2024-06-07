import DatoImage from '@/components/DatoImage';
import { type FragmentType, getFragmentData } from '@/graphql/types';
import { FeatureListSectionFragmentDoc } from '@/graphql/types/graphql';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';

type Props = {
  fragment: FragmentType<typeof FeatureListSectionFragmentDoc>;
};

const MinimalCardsFeature = ({ fragment }: Props) => {
  const {
    feature: features,
    featuresHeader,
    featuresSubheader,
  } = getFragmentData(FeatureListSectionFragmentDoc, fragment);
  return (
    <div className="flex flex-wrap justify-center gap-8 px-8 lg:px-32 py-16  text-center md:grid md:grid-cols-2 md:text-primary lg:grid-cols-3">
      {features.map((feature) => {
        return (
          <div
            key={feature.id}
            className="mt-16 w-full max-w-md rounded-lg bg-white px-8 py-4 shadow-lg dark:bg-gray-800"
          >
            <div className="-mt-16 mb-3 flex justify-center">
              <div className="relative h-20 w-20 overflow-hidden rounded-full border-2 border-primary object-cover">
                <DatoImage
                  fragment={feature.featureIcon.responsiveImage}
                  className="h-full w-full object-contain"
                  layout="fill"
                  objectFit="cover"
                  objectPosition="50% 50%"
                />
              </div>
            </div>

            <h2 className="mt-2 text-xl font-semibold text-gray-800 dark:text-white md:mt-0">
              {feature.featureTitle}
            </h2>

            <div className="mt-2 text-sm text-gray-600 dark:text-gray-200">
              <ReactMarkdown>{feature.featureDescription || ''}</ReactMarkdown>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MinimalCardsFeature;
