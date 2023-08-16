import SvgRenderer from '@/components/Common/SvgRenderer';
import { FeatureRecord } from '@/graphql/generated';
import { Maybe } from 'graphql/jsutils/Maybe';

type Props = {
  features: FeatureRecord[];
  featuresHeader: string;
  featuresSubheader: Maybe<string>;
};

const FeatureCards = ({
  features,
  featuresHeader,
  featuresSubheader,
}: Props) => {
  return (
    <section className="relative">
      {/* Section background (needs .relative class on parent and next sibling elements) */}
      <div
        className="pointer-events-none absolute inset-0 top-1/2 bg-primary/5 md:mt-24 lg:mt-0"
        aria-hidden="true"
      ></div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="py-12 md:py-20">
          {/* Section header */}
          <div className="mx-auto max-w-3xl pb-12 text-center md:pb-20">
            <h1 className="mb-4 text-3xl font-bold !leading-tight text-black dark:text-white sm:text-4xl md:text-[45px]">
              {featuresHeader}
            </h1>
            <p className="text-xl text-gray-600">{featuresSubheader}</p>
          </div>

          {/* Items */}
          <div className="mx-auto grid max-w-sm items-start gap-6 md:max-w-2xl md:grid-cols-2 lg:max-w-none lg:grid-cols-3">
            {/* 1st item */}
            {features.map((feature) => {
              return (
                <div
                  key={feature.id}
                  className="relative flex h-64 flex-col items-center justify-center rounded bg-white p-6 shadow-xl"
                >
                  <div className="-mt-1 mb-2 flex h-20 w-20 items-center justify-center rounded-full bg-primary/5">
                    <SvgRenderer url={feature.featureIcon.url} />
                  </div>
                  <h4 className="mb-1 text-xl font-bold leading-snug tracking-tight">
                    {feature.featureTitle}
                  </h4>
                  <p className="text-center text-gray-600">
                    {feature.featureDescription}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureCards;
