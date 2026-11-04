import type { ResponsiveImageFragment } from '@/components/datocms/DatoImage/fragment';
import type { FragmentOf } from '@/lib/datocms/graphql';
import { cn } from '@/utils/cn';
import ChartPanel from './ChartPanel';
import MediaPanel from './MediaPanel';
import PageHead from './PageHead';
import TablePanel from './TablePanel';
import TitleBar from './TitleBar';
import WindowSidebar from './WindowSidebar';

type Props = {
  /** The CMS hero image, shown as the media panel (the only content in the window) */
  image?: FragmentOf<typeof ResponsiveImageFragment> | null;
};

/**
 * GradientHero's wordless product window. Everything but the CMS image is
 * decorative and aria-hidden, and every colour comes from the accent.
 */
const ProductWindow = ({ image }: Props) => {
  // With an image the chart and table share the left column, the media panel takes the right
  const panelColumns = image
    ? 'grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]'
    : 'grid-cols-1';

  return (
    <div className="window grid h-[520px] grid-rows-[40px_minmax(0,1fr)] max-md:h-[340px] max-md:grid-rows-[32px_minmax(0,1fr)] max-md:rounded-tile">
      <TitleBar />

      <div className="grid min-h-0 grid-cols-[208px_minmax(0,1fr)] max-[900px]:grid-cols-1">
        <WindowSidebar />

        <div className="grid min-w-0 grid-rows-[56px_auto] content-start max-md:grid-rows-[48px_auto]">
          <PageHead />

          <div
            className={cn(
              'grid items-start gap-4 p-6 max-md:grid-cols-1 max-md:p-3.5',
              panelColumns,
            )}
          >
            <ChartPanel hideOnMobile={Boolean(image)} />
            {image && <MediaPanel image={image} />}
            <TablePanel />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductWindow;
