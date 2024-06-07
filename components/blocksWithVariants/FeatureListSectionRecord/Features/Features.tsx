import DatoImage from '@/components/DatoImage';
import SectionTitle from '@/components/SectionTitle';
import { type FragmentType, getFragmentData } from '@/graphql/types';
import { FeatureListSectionFragmentDoc } from '@/graphql/types/graphql';
import ReactMarkdown from 'react-markdown';

type Props = {
  fragment: FragmentType<typeof FeatureListSectionFragmentDoc>;
};

const Features = ({ fragment }: Props) => {
  const {
    feature: features,
    featuresHeader,
    featuresSubheader,
  } = getFragmentData(FeatureListSectionFragmentDoc, fragment);
  return (
    <>
      <section
        id="features"
        className="bg-primary/[.03] py-16 md:py-20 lg:py-28"
      >
        <div className="container">
          <SectionTitle
            title={featuresHeader}
            paragraph={featuresSubheader}
            center
          />

          <div className="grid grid-cols-1 gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
            {features.map(
              ({ id, featureIcon, featureTitle, featureDescription }) => (
                <div key={id} className="w-full">
                  <div className="flex flex-col items-center justify-center px-16 text-center  md:px-0">
                    <div className="relative mb-10 flex h-[70px] w-[70px] items-center justify-center overflow-hidden rounded-md bg-primary bg-opacity-10 text-primary">
                      <DatoImage
                        fragment={featureIcon.responsiveImage}
                        className="h-full w-full object-contain"
                        layout="fill"
                        objectFit="cover"
                        objectPosition="50% 50%"
                      />
                    </div>
                    <h3 className="mb-5 text-xl font-bold text-black dark:text-white sm:text-2xl lg:text-xl xl:text-2xl">
                      {featureTitle}
                    </h3>
                    <div className="pr-[10px] text-base font-medium leading-relaxed text-body-color">
                      <ReactMarkdown>{featureDescription || ''}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default Features;
