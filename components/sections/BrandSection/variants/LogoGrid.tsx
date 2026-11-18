import type { CSSProperties } from 'react';
import BrandLogo from '@/components/sections/BrandSection/BrandLogo';
import { BrandSectionFragment } from '@/components/sections/BrandSection/fragment';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import { uiString } from '@/lib/i18n/uiStrings';

type Props = {
  fragment: FragmentOf<typeof BrandSectionFragment>;
  locale: string;
};

/** Cells per line for `count` logos when a line holds at most `max`: as many lines as needed, filled evenly */
const perLine = (count: number, max: number) =>
  Math.ceil(count / Math.ceil(count / max));

/**
 * `grid`: each logo centred in a pale tile of equal width (20px radius, no
 * border, no shadow), the tiles in centred
 * lines that wrap evenly (5 logos make 3 + 2, never 4 + 1), so there are
 * exactly as many cells as logos: up to three per line on phones, four from
 * 640px, one line of up to eight from 1024px (more go in even lines of up to
 * six). Also what `row` falls back to with more than twelve logos.
 */
const LogoGrid = ({ fragment, locale }: Props) => {
  const { brands } = readFragment(BrandSectionFragment, fragment);
  const count = brands.length;

  return (
    <section
      aria-label={uiString(locale, 'brands')}
      data-brands=""
      className="container-page section"
    >
      <ul
        style={
          {
            '--per-base': perLine(count, 3),
            '--per-sm': perLine(count, 4),
            '--per-lg': count <= 8 ? count : perLine(count, 6),
          } as CSSProperties
        }
        className="flex flex-wrap justify-center gap-2.5 [--per:var(--per-base)] sm:[--per:var(--per-sm)] lg:[--per:var(--per-lg)]"
      >
        {brands.map((brand) => (
          <li
            key={brand.id}
            className="flex h-20 w-[calc((100%-(var(--per)-1)*0.625rem)/var(--per))] min-w-0 items-center justify-center rounded-[20px] bg-subtle px-4 sm:h-24 sm:px-6"
          >
            <BrandLogo
              brand={brand}
              locale={locale}
              className="h-[26px] max-w-full"
            />
          </li>
        ))}
      </ul>
    </section>
  );
};

export default LogoGrid;
