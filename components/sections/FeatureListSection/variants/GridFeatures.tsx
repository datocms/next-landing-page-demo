import FeatureItem from '@/components/sections/FeatureListSection/FeatureItem';
import { FeatureListSectionFragment } from '@/components/sections/FeatureListSection/fragment';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';

type Props = {
  fragment: FragmentOf<typeof FeatureListSectionFragment>;
};

/**
 * `cards`: the features as small pale tiles in a grid of up to three columns,
 * icon and title on one line and the text below. The tiles settle in as
 * they enter the view.
 */
const GridFeatures = ({ fragment }: Props) => {
  const { features } = readFragment(FeatureListSectionFragment, fragment);

  return (
    <section className="section container-page">
      {features.length > 0 && (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <li key={feature.id} className="reveal tile p-6 sm:p-7">
              <FeatureItem feature={feature} layout="compact" />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default GridFeatures;
