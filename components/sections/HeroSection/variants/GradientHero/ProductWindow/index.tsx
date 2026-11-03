import { Check } from 'lucide-react';
import DatoImage from '@/components/datocms/DatoImage';
import type { ResponsiveImageFragment } from '@/components/datocms/DatoImage/fragment';
import type { FragmentOf } from '@/lib/datocms/graphql';
import { cn } from '@/utils/cn';
import ChartPanel from './ChartPanel';
import SkeletonBar from './SkeletonBar';
import WindowSidebar from './WindowSidebar';

type ResponsiveImage = FragmentOf<typeof ResponsiveImageFragment>;

type Props = {
  /** The CMS hero image, shown as the media panel (the only content in the window) */
  image?: ResponsiveImage | null;
};

/** The table's rows: a tone dot, a name and a value of these widths */
const TABLE_ROWS = [
  { tone: 'tone-0', nameWidth: '30%', valueWidth: '16%' },
  { tone: 'tone-2', nameWidth: '38%', valueWidth: '12%' },
  { tone: 'tone-4', nameWidth: '24%', valueWidth: '18%' },
] as const;

/** Window dots, an address bar and two round buttons */
const TitleBar = () => (
  <div
    aria-hidden="true"
    className="window-bar max-md:h-8 max-md:gap-3 max-md:px-3"
  >
    <span className="window-dots">
      <i />
      <i />
      <i />
    </span>
    <span className="mx-auto flex h-5 w-60 items-center justify-center gap-1.5 rounded-md bg-surface max-md:w-32">
      <b className="size-2 rounded-[2px] border-[1.5px] border-sk-3" />
      <SkeletonBar className="h-1.5 bg-sk-2" width="96px" />
    </span>
    <span className="flex gap-1.5">
      <i className="size-5 rounded-full bg-surface" />
      <i className="size-5 rounded-full bg-surface" />
    </span>
  </div>
);

/** The page head: a title, a three-way segmented control, stacked faces and an ink button */
const PageHead = () => (
  <div
    aria-hidden="true"
    className="flex items-center gap-4 border-line border-b px-6 max-md:gap-3 max-md:px-3.5"
  >
    <i className="h-3 w-40 rounded-md bg-[color-mix(in_oklch,var(--ink)_16%,white)] max-md:w-[72px]" />
    <span className="flex h-7 gap-0.5 rounded-lg bg-surface p-[3px]">
      <i className="grid w-10 place-items-center rounded-md bg-white shadow-[0_0_0_1px_var(--line),var(--shadow-xs)]">
        <SkeletonBar className="h-[5px] bg-sk-3" width="18px" />
      </i>
      <i className="grid w-10 place-items-center rounded-md">
        <SkeletonBar className="h-[5px] bg-sk-2" width="18px" />
      </i>
      <i className="grid w-10 place-items-center rounded-md">
        <SkeletonBar className="h-[5px] bg-sk-2" width="18px" />
      </i>
    </span>
    <span className="ml-auto flex items-center gap-3.5">
      <span className="flex">
        <i className="tone-0 size-6 rounded-full bg-tone-grad shadow-[0_0_0_2px_#fff]" />
        <i className="tone-2 -ml-1.5 size-6 rounded-full bg-tone-grad shadow-[0_0_0_2px_#fff]" />
        <i className="tone-4 -ml-1.5 size-6 rounded-full bg-tone-grad shadow-[0_0_0_2px_#fff]" />
      </span>
      <i className="grid h-7 w-[72px] place-items-center rounded-full bg-ink max-md:hidden">
        <SkeletonBar className="h-[5px] bg-white/70" width="32px" />
      </i>
    </span>
  </div>
);

/** The CMS image in a card with a wordless caption, spanning the chart and table rows */
const MediaPanel = ({ image }: { image: ResponsiveImage }) => (
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

/** A short table of checked rows. Hidden below 768 */
const TablePanel = () => (
  <div
    aria-hidden="true"
    className="grid rounded-panel border border-line bg-white max-md:hidden"
  >
    {TABLE_ROWS.map((row, i) => (
      <div
        key={row.tone}
        className={cn(
          'flex h-10 items-center gap-3 px-3.5',
          i > 0 && 'border-line border-t',
        )}
      >
        <i className={cn('dot', row.tone)} />
        <SkeletonBar className="bg-sk-2" width={row.nameWidth} />
        <SkeletonBar className="ml-auto bg-sk" width={row.valueWidth} />
        <span className="grid size-4 flex-none place-items-center rounded-full bg-accent text-white">
          <Check className="size-2.5" strokeWidth={3} />
        </span>
      </div>
    ))}
  </div>
);

/**
 * GradientHero's wordless product window: title bar, sidebar, a
 * page head, then a chart, the CMS image as a media panel and a short table.
 * Everything but the image is decorative and aria-hidden; every colour comes
 * from the accent. Below 900 the sidebar goes; below 768 only the media panel
 * stays (the chart when there is no image).
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
