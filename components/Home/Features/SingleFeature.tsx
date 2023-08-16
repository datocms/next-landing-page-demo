import SvgRenderer from '../../Common/SvgRenderer';
import { FeatureRecord } from '@/graphql/generated';

type Props = {
  feature: FeatureRecord;
};

const SingleFeature = ({ feature }: Props) => {
  const { featureIcon, featureTitle, featureDescription } = feature;

  return (
    <div className="w-full">
      <div className="flex flex-col items-center justify-center px-16 text-center md:items-start md:px-0 md:text-start">
        <div className="mb-10 flex h-[70px] w-[70px] items-center justify-center rounded-md bg-primary bg-opacity-10 text-primary">
          <SvgRenderer url={featureIcon.url} />
        </div>
        <h3 className="mb-5 text-xl font-bold text-black dark:text-white sm:text-2xl lg:text-xl xl:text-2xl">
          {featureTitle}
        </h3>
        <p className="pr-[10px] text-base font-medium leading-relaxed text-body-color">
          {featureDescription}
        </p>
      </div>
    </div>
  );
};

export default SingleFeature;
