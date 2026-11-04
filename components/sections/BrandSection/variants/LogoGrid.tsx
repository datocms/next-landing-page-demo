import { stripStega } from '@datocms/content-link';
import BrandLogo from '@/components/sections/BrandSection/BrandLogo';
import { BrandSectionFragment } from '@/components/sections/BrandSection/fragment';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import { uiString } from '@/lib/i18n/uiStrings';
import { cn } from '@/utils/cn';

type Props = {
  fragment: FragmentOf<typeof BrandSectionFragment>;
  locale: string;
};

/* Column counts that fill every row when the logo count allows it.
   Literal class maps: Tailwind only generates classes it can see. */
const BASE_COLS = { 2: 'grid-cols-2', 3: 'grid-cols-3' } as const;
const SM_COLS = { 2: 'sm:grid-cols-2', 3: 'sm:grid-cols-3' } as const;
const LG_COLS = {
  3: 'lg:grid-cols-3',
  4: 'lg:grid-cols-4',
  5: 'lg:grid-cols-5',
  6: 'lg:grid-cols-6',
} as const;

const baseCols = (count: number): keyof typeof BASE_COLS =>
  count % 3 === 0 ? 3 : 2;
const smCols = (count: number): keyof typeof SM_COLS =>
  count % 3 === 0 || count % 2 !== 0 ? 3 : 2;
const lgCols = (count: number): keyof typeof LG_COLS => {
  if (count % 6 === 0) return 6;
  if (count % 4 === 0) return 4;
  if (count % 5 === 0) return 5;
  if (count % 3 === 0) return 3;
  return 4;
};

const CELL =
  'grid h-[88px] grid-cols-[minmax(0,1fr)] place-items-center px-4 max-sm:h-16';
const LOGO_BOX = 'h-[22px] w-[120px] max-w-full max-sm:h-[18px] max-sm:w-24';

/**
 * Default brand section: logo cells. One rounded hairline grid of ink
 * silhouettes (no double borders; a partial last row stays white). Linked
 * cells brighten their logo and tint on hover.
 */
const LogoGrid = ({ fragment, locale }: Props) => {
  const { brand: brands } = readFragment(BrandSectionFragment, fragment);
  const count = brands.length;

  return (
    <section aria-label={uiString(locale, 'brands')} className="py-10 md:py-12">
      <div className="container-page">
        <ul
          className={cn(
            'cells reveal [--logo-o:0.66]',
            BASE_COLS[baseCols(count)],
            SM_COLS[smCols(count)],
            LG_COLS[lgCols(count)],
          )}
        >
          {brands.map((brand) => {
            const href = brand.brandUrl ? stripStega(brand.brandUrl) : '';
            return (
              <li key={brand.id}>
                {href ? (
                  <a
                    href={href}
                    target="_blank"
                    rel="nofollow noreferrer"
                    aria-label={stripStega(brand.brandName)}
                    className={cn(
                      CELL,
                      'transition-colors duration-200 hover:bg-well hover:[--logo-o:1] focus-visible:-outline-offset-2 focus-visible:[--logo-o:1]',
                    )}
                  >
                    <BrandLogo brand={brand} className={LOGO_BOX} decorative />
                  </a>
                ) : (
                  <div className={CELL}>
                    <BrandLogo brand={brand} className={LOGO_BOX} />
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};

export default LogoGrid;
