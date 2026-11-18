import FeatureItem from '@/components/sections/FeatureListSection/FeatureItem';
import { FeatureListSectionFragment } from '@/components/sections/FeatureListSection/fragment';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';

type Props = {
  fragment: FragmentOf<typeof FeatureListSectionFragment>;
};

/**
 * `list`: the features in a list of two columns (three from 1024px), icon
 * beside the text, a hairline above each row.
 */
const ListFeatures = ({ fragment }: Props) => {
  const { features } = readFragment(FeatureListSectionFragment, fragment);

  return (
    <section className="section">
      <div className="container-page">
        {features.length > 0 && (
          <ul className="grid gap-x-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <li key={feature.id} className="reveal border-line border-t py-6">
                <FeatureItem feature={feature} layout="inline" />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};

export default ListFeatures;
