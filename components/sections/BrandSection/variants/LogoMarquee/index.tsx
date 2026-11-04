import { stripStega } from '@datocms/content-link';
import BrandLogo from '@/components/sections/BrandSection/BrandLogo';
import { BrandSectionFragment } from '@/components/sections/BrandSection/fragment';
import {
  type FragmentOf,
  type ResultOf,
  readFragment,
} from '@/lib/datocms/graphql';
import { uiString } from '@/lib/i18n/uiStrings';
import { cn } from '@/utils/cn';
import MarqueeToggle from './MarqueeToggle';

type Props = {
  fragment: FragmentOf<typeof BrandSectionFragment>;
  locale: string;
};

type Brand = ResultOf<typeof BrandSectionFragment>['brand'][number];

const LOGO_BOX = 'h-[22px] w-[120px] max-md:h-[18px] max-md:w-24';

/** One run of logos */
const LogoList = ({
  brands,
  newTabHint,
  duplicate = false,
  isStatic = false,
}: {
  brands: Brand[];
  /** Suffix for each logo link's accessible name, e.g. "(opens in a new tab)" */
  newTabHint: string;
  /** The second run that closes the loop: hidden from assistive tech, without links */
  duplicate?: boolean;
  /** A centred row that never moves (three logos or fewer) */
  isStatic?: boolean;
}) => (
  <ul
    className={cn('marquee-list', isStatic && 'marquee-static')}
    aria-hidden={duplicate || undefined}
  >
    {brands.map((brand) => {
      const href = brand.brandUrl ? stripStega(brand.brandUrl) : '';
      return (
        <li key={brand.id} className="shrink-0">
          {href && !duplicate ? (
            <a
              href={href}
              target="_blank"
              rel="nofollow noreferrer"
              aria-label={`${stripStega(brand.brandName)} ${newTabHint}`}
              className="hit-44 block rounded-[6px] hover:[--logo-o:0.9] focus-visible:[--logo-o:0.9]"
            >
              <BrandLogo brand={brand} className={LOGO_BOX} decorative />
            </a>
          ) : (
            <BrandLogo
              brand={brand}
              className={LOGO_BOX}
              decorative={duplicate}
            />
          )}
        </li>
      );
    })}
  </ul>
);

/**
 * "brand_cards" brand section: the logo marquee. A slim band of ink
 * silhouettes that drifts behind a soft fade at both ends, with a pause
 * control. It pauses on hover and when paused; keyboard focus on a logo
 * stops it at its start so the focused logo is in view. Under reduced motion
 * it is a static centred row. Three logos or fewer never move.
 */
const LogoMarquee = ({ fragment, locale }: Props) => {
  const { brand: brands } = readFragment(BrandSectionFragment, fragment);
  const newTabHint = uiString(locale, 'opensInNewTab');
  const label = uiString(locale, 'brands');

  if (brands.length <= 3) {
    return (
      <section aria-label={label} className="reveal py-2">
        <div className="marquee-band container-page flex items-center justify-center">
          <LogoList brands={brands} newTabHint={newTabHint} isStatic />
        </div>
      </section>
    );
  }

  return (
    <section aria-label={label} data-marquee className="reveal py-2">
      <div className="marquee-band container-page flex items-center gap-4">
        {/* The viewport scrolls only while it holds focus, so the browser can bring a focused logo
            fully into view; the side padding keeps its focus ring unclipped */}
        <div className="marquee-viewport -mx-1.5 min-w-0 flex-1 scroll-px-[104px] overflow-clip px-1.5 py-3.5 focus-within:overflow-hidden motion-safe:not-focus-within:mask-fade-x md:scroll-px-[128px]">
          <div className="marquee-track">
            <LogoList brands={brands} newTabHint={newTabHint} />
            <LogoList brands={brands} newTabHint={newTabHint} duplicate />
          </div>
        </div>
        <MarqueeToggle locale={locale} />
      </div>
    </section>
  );
};

export default LogoMarquee;
