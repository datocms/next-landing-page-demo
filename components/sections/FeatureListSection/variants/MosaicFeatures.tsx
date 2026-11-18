import type { CSSProperties, ReactNode } from 'react';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import { cn } from '@/utils/cn';
import FeatureDescription from '../FeatureDescription';
import FeatureIcon from '../FeatureIcon';
import { FeatureListSectionFragment } from '../fragment';

type Props = {
  fragment: FragmentOf<typeof FeatureListSectionFragment>;
};

/** A flat shape tile from the mosaic hero, between the features (decorative) */
const ShapeTile = ({
  kind,
  className,
}: {
  kind: 'sun' | 'quarter';
  className?: string;
}) => (
  <li
    aria-hidden="true"
    className={cn(
      'reveal relative min-h-44 overflow-hidden rounded-card max-md:hidden',
      kind === 'sun' ? 'bg-accent' : 'bg-ink',
      className,
    )}
  >
    {kind === 'sun' ? (
      // A white half disc rising from the tile's bottom edge
      <span className="absolute bottom-0 left-1/2 aspect-[2/1] w-[68%] -translate-x-1/2 translate-y-[12%] rounded-t-full bg-surface" />
    ) : (
      // An accent quarter circle growing out of the bottom-right corner
      <span className="absolute right-0 bottom-0 aspect-square w-[70%] rounded-tl-full bg-accent" />
    )}
  </li>
);

/**
 * `mosaic` (the mosaic page's look): the features as pale tiles on the mosaic
 * hero's 12px gap, each with its icon on a white chip, the title and the
 * text; two of the hero's flat shapes sit among them, an accent tile with a
 * white half disc and a navy tile with an accent quarter circle, so the
 * section reads as a piece of the hero. Four across from 1024px (six features
 * and the two shapes make two rows), two from 768px, one on phones without
 * the shapes. The features' product cards are left out.
 */
const MosaicFeatures = ({ fragment }: Props) => {
  const { features } = readFragment(FeatureListSectionFragment, fragment);
  // The shapes go in after the first and the fifth feature
  const items: ReactNode[] = [];
  features.forEach((feature, index) => {
    items.push(
      <li
        key={feature.id}
        style={{ '--reveal-delay': `${(index % 4) * 70}ms` } as CSSProperties}
        className="reveal flex min-h-44 flex-col rounded-card bg-subtle p-6 sm:p-7"
      >
        <FeatureIcon icon={feature.icon} className="bg-surface!" />
        <h2 className="mt-auto pt-8 text-h3">{feature.title}</h2>
        <FeatureDescription
          description={feature.description}
          className="mt-2 text-small leading-[1.55]"
        />
      </li>,
    );
    if (index === 0 && features.length > 2) {
      items.push(<ShapeTile key="sun" kind="sun" />);
    }
    if (index === 4 && features.length > 5) {
      items.push(<ShapeTile key="quarter" kind="quarter" />);
    }
  });

  return (
    <section className="section">
      <div className="container-page">
        <ul className="grid gap-2.5 md:grid-cols-2 lg:grid-cols-4 lg:gap-3">
          {items}
        </ul>
      </div>
    </section>
  );
};

export default MosaicFeatures;
