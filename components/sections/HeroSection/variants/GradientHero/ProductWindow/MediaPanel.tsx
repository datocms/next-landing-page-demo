import DatoImage from '@/components/datocms/DatoImage';
import type { ResponsiveImageFragment } from '@/components/datocms/DatoImage/fragment';
import type { FragmentOf } from '@/lib/datocms/graphql';
import SkeletonBar from './SkeletonBar';

type Props = {
  image: FragmentOf<typeof ResponsiveImageFragment>;
};

/** The CMS image in a card with a wordless caption, spanning the chart and table rows */
const MediaPanel = ({ image }: Props) => (
  <figure className="row-span-2 rounded-panel border border-line bg-white p-3 max-md:row-span-1">
    <div className="photo aspect-[3/2] rounded-lg">
      <DatoImage
        fragment={image}
        layout="fill"
        objectFit="cover"
        objectPosition="50% 50%"
        sizes="(min-width: 768px) 272px, 100vw"
        priority
      />
    </div>
    <span aria-hidden="true" className="grid gap-2 px-0.5 pt-3 pb-0.5">
      <SkeletonBar className="bg-sk-2" width="62%" />
      <SkeletonBar className="bg-sk" width="40%" />
    </span>
  </figure>
);

export default MediaPanel;
