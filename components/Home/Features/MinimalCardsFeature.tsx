import { FeatureRecord } from '@/graphql/types/graphql';
import { Maybe } from 'graphql/jsutils/Maybe';
import { Image as DatoImage } from 'react-datocms';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';

type Props = {
  features: FeatureRecord[];
  featuresHeader: string;
  featuresSubheader: Maybe<string>;
};

const MinimalCardsFeature = ({
  features,
  featuresHeader,
  featuresSubheader,
}: Props) => {
  return (
    <div className="flex flex-wrap justify-center gap-8 px-32 py-16  text-center md:grid md:grid-cols-2 md:text-primary lg:grid-cols-3">
      {features.map((feature) => {
        return (
          <div
            key={feature.id}
            className="mt-16 w-full max-w-md rounded-lg bg-white px-8 py-4 shadow-lg dark:bg-gray-800"
          >
            <div className="-mt-16 flex justify-center md:justify-end">
              <div className="relative h-20 w-20 overflow-hidden rounded-full border-2 border-primary object-cover">
                <DatoImage
                  data={feature.featureIcon.responsiveImage}
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
