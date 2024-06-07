import DatoImage from '@/components/DatoImage';
import { type FragmentType, getFragmentData } from '@/graphql/types';
import { FeatureListSectionFragmentDoc } from '@/graphql/types/graphql';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';

type Props = {
  fragment: FragmentType<typeof FeatureListSectionFragmentDoc>;
};

const BigImageVerticalFeatures = ({ fragment }: Props) => {
  const {
    feature: features,
    featuresHeader,
    featuresSubheader,
  } = getFragmentData(FeatureListSectionFragmentDoc, fragment);
  return (
    <div className="bg-white py-6 sm:py-8 lg:py-12">
      <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
        <div className="mb-10 md:mb-16">
          <h2 className="mb-4 text-center text-2xl font-bold text-gray-800 md:mb-6 lg:text-3xl">
            {featuresHeader}
          </h2>

          <div className="mx-auto max-w-screen-md text-center text-gray-500 md:text-lg">
            <ReactMarkdown>{featuresSubheader || ''}</ReactMarkdown>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-8">
          {features.map((feature) => {
            return (
              <div
                key={feature.id}
                className="group flex flex-col overflow-hidden rounded-lg border bg-white"
              >
                <div className="group relative block h-48 overflow-hidden bg-gray-100 md:h-64">
                  <div className="absolute inset-0 h-full w-full overflow-hidden object-cover object-center transition duration-200 group-hover:scale-110">
                    <DatoImage
                      className="h-full w-full object-cover"
                      layout="fill"
                      objectFit="cover"
                      objectPosition="50% 50%"
                      fragment={feature.featureIcon.responsiveImage}
                    />
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-4 sm:p-6">
                  <h2 className="mb-2 text-lg font-semibold text-gray-800">
                    <div className="transition duration-100 group-hover:text-primary">
                      {feature.featureTitle}
                    </div>
                  </h2>

                  <div className="mb-8 text-gray-500">
                    <ReactMarkdown>
                      {feature.featureDescription || ''}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BigImageVerticalFeatures;
