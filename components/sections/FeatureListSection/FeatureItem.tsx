import type { FeatureListSectionFragment } from '@/components/sections/FeatureListSection/fragment';
import type { ResultOf } from '@/lib/datocms/graphql';
import { cn } from '@/utils/cn';
import FeatureDescription from './FeatureDescription';
import FeatureIcon from './FeatureIcon';

type Feature = ResultOf<typeof FeatureListSectionFragment>['features'][number];

type Props = {
  feature: Feature;
  /** compact: icon beside the title, text below (cards). stacked: icon above the text. inline: icon left of the text (list) */
  layout?: 'stacked' | 'inline' | 'compact';
};

/** One feature: its icon tile, title and description */
const FeatureItem = ({ feature, layout = 'stacked' }: Props) =>
  layout === 'compact' ? (
    <div>
      <div className="flex items-center gap-3">
        <FeatureIcon icon={feature.icon} size="sm" />
        <h2 className="text-h3">{feature.title}</h2>
      </div>
      <FeatureDescription
        description={feature.description}
        className="mt-3.5 text-small leading-[1.55]"
      />
    </div>
  ) : (
    <div className={cn(layout === 'inline' && 'flex items-start gap-4')}>
      <FeatureIcon
        icon={feature.icon}
        className={layout === 'stacked' ? 'mb-5' : undefined}
      />
      <div className="min-w-0">
        <h2 className={cn('text-h3', layout === 'inline' && 'pt-2')}>
          {feature.title}
        </h2>
        <FeatureDescription
          description={feature.description}
          className="mt-2 max-w-[48ch]"
        />
      </div>
    </div>
  );

export default FeatureItem;
