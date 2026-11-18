import DatoImage from '@/components/datocms/DatoImage';
import type { ResponsiveImageFragment } from '@/components/datocms/DatoImage/fragment';
import ProductCard, {
  type ProductCardData,
} from '@/components/product/ProductCard';
import type { FragmentOf } from '@/lib/datocms/graphql';
import { cn } from '@/utils/cn';

type Asset = {
  focalPoint?: { x: number; y: number } | null;
  responsiveImage: FragmentOf<typeof ResponsiveImageFragment>;
};

type Props = {
  /** The hero's image: the tall capsule */
  image: Asset;
  /** The hero's secondary image: the smaller capsule beside it */
  secondary?: Asset | null;
  /** Up to three product cards, placed over the capsules in a fixed spot each */
  cards?: (ProductCardData & { id: string })[];
  /** A short line in a pill above the capsules, beside a small check */
  highlight?: string | null;
  locale: string;
  className?: string;
};

const position = (asset: Asset) =>
  asset.focalPoint
    ? `${asset.focalPoint.x * 100}% ${asset.focalPoint.y * 100}%`
    : '50% 50%';

const CAPSULE =
  'absolute overflow-hidden rounded-full bg-tint shadow-[0_50px_90px_-34px_rgb(9_14_52/0.6)]';
const FLOAT = 'arrive-float loop absolute z-10 rounded-[18px] shadow-float';

// Where the first, second and third card sit on the stage, and how wide; then when it
// arrives and its own slow hover (styles/motion.css .arrive-float), so no two move together.
// Below 1024px the stage stands alone under the copy, so the capsules and the pill move
// 75px left to sit on its centre line and the last card hangs out as far as the first
const SLOTS = [
  'top-[92px] left-[-40px] w-[272px] [--arrive:560ms] [--float-time:15s] [--float-y:-6px]',
  'top-[424px] left-[-8px] w-[284px] [--arrive:700ms] [--float-time:19s] [--float-y:-5px]',
  'top-[512px] left-[308px] w-[272px] max-lg:left-[348px] [--arrive:840ms] [--float-time:17s] [--float-y:-7px]',
];

/**
 * The picture beside the hero copy: the block's images as two tall capsules,
 * with small pieces of the product floating over them. It is drawn on a fixed
 * 580 by 650 stage and scaled down as a whole on smaller screens (to 80% from
 * 1024 to 1279px, so the copy beside it keeps room), so the composition never
 * reflows. Decorative: hidden from assistive technology.
 *
 * Motion (styles/motion.css), once on load: the capsules settle, the live
 * status and the cards pop in one after another and their charts draw; after
 * that the cards hover a few pixels on their own slow rhythms and the two rings
 * behind breathe. All of it pauses off screen and is off under reduced motion.
 */
const HeroStage = ({
  image,
  secondary,
  cards = [],
  highlight,
  locale,
  className,
}: Props) => (
  <div
    aria-hidden="true"
    className={cn(
      'relative mx-auto h-[650px] w-[580px] shrink-0 select-none text-[12.5px] leading-[1.45] [zoom:0.43] min-[375px]:[zoom:0.5] min-[420px]:[zoom:0.56] sm:[zoom:0.7] lg:[zoom:0.8] xl:[zoom:1]',
      className,
    )}
  >
    <span className="breathe loop absolute top-1/2 left-1/2 size-[560px] -translate-1/2 rounded-full shadow-[inset_0_0_0_1px_rgb(255_255_255/0.75)] [--loop-scale:1.035] [--loop-time:26s]" />
    <span className="breathe loop absolute top-1/2 left-1/2 size-[840px] -translate-1/2 rounded-full shadow-[inset_0_0_0_1px_rgb(255_255_255/0.5)] [--loop-delay:-13s] [--loop-scale:0.975] [--loop-time:38s]" />

    <div
      className={cn(
        CAPSULE,
        'arrive-settle top-[30px] left-[150px] max-lg:left-[75px] h-[596px] w-[250px] [--arrive:120ms]',
      )}
    >
      <DatoImage
        fragment={image.responsiveImage}
        alt=""
        layout="fill"
        objectFit="cover"
        objectPosition={position(image)}
        sizes="250px"
        priority
      />
    </div>
    {secondary && (
      <div
        className={cn(
          CAPSULE,
          'arrive-settle top-[122px] left-[422px] max-lg:left-[347px] h-[412px] w-[158px] [--arrive:260ms]',
        )}
      >
        <DatoImage
          fragment={secondary.responsiveImage}
          alt=""
          layout="fill"
          objectFit="cover"
          objectPosition={position(secondary)}
          sizes="158px"
          priority
        />
      </div>
    )}

    {highlight && (
      <div
        className={cn(
          FLOAT,
          '[--arrive:440ms] [--float-time:21s] [--float-y:-4px] top-[-4px] left-[300px] max-lg:left-[225px] flex h-10 items-center gap-2 rounded-full bg-surface pr-4 pl-2.5 font-semibold whitespace-nowrap text-fg',
        )}
      >
        <span className="grid size-5 shrink-0 place-items-center rounded-full bg-accent text-on-accent">
          <svg viewBox="0 0 12 12" className="size-3" aria-hidden="true">
            <path
              d="m2.5 6.3 2.3 2.3 4.7-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        {highlight}
      </div>
    )}

    {cards.slice(0, SLOTS.length).map((card, index) => (
      <ProductCard
        key={card.id}
        card={card}
        locale={locale}
        className={cn(FLOAT, SLOTS[index])}
      />
    ))}
  </div>
);

export default HeroStage;
