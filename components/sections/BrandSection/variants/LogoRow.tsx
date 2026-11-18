import BrandLogo from '@/components/sections/BrandSection/BrandLogo';
import { BrandSectionFragment } from '@/components/sections/BrandSection/fragment';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import { uiString } from '@/lib/i18n/uiStrings';

type Props = {
  fragment: FragmentOf<typeof BrandSectionFragment>;
  locale: string;
};

/**
 * `row` (the default): the logos in one line spread across the container,
 * 26px tall at 70% opacity, with the page's air above and little below. Below
 * 1024px they wrap to a centred grid: two a line on phones, three from 640px.
 */
const LogoRow = ({ fragment, locale }: Props) => {
  const { brands } = readFragment(BrandSectionFragment, fragment);

  return (
    <section
      aria-label={uiString(locale, 'brands')}
      data-brands=""
      className="container-page section"
    >
      <ul className="grid grid-cols-2 items-center justify-items-center gap-x-6 gap-y-8 sm:grid-cols-3 lg:flex lg:justify-between lg:gap-x-8">
        {brands.map((brand) => (
          <li key={brand.id} className="reveal flex min-w-0 items-center">
            <BrandLogo
              brand={brand}
              locale={locale}
              className="h-[26px] max-w-36"
            />
          </li>
        ))}
      </ul>
    </section>
  );
};

export default LogoRow;
