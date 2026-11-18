import { stripStega } from '@datocms/content-link';
import Image from 'next/image';
import type { ResultOf } from '@/lib/datocms/graphql';
import { uiString } from '@/lib/i18n/uiStrings';
import { cn } from '@/utils/cn';
import type { BrandSectionFragment } from './fragment';

type Brand = ResultOf<typeof BrandSectionFragment>['brands'][number];

type Props = {
  brand: Brand;
  locale: string;
  /** Height and largest width of the logo, for example `h-7 max-w-36` */
  className: string;
};

/**
 * A brand logo, quiet until hovered: an SVG becomes a dark silhouette (so
 * marks drawn in colour or in white still read), a bitmap goes greyscale and is
 * multiplied onto the page, which drops its white background. Both sit at 70%
 * opacity and come to full opacity on hover. A brand with a URL links to it.
 */
const BrandLogo = ({ brand, locale, className }: Props) => {
  const href = brand.url ? stripStega(brand.url) : '';
  const name = stripStega(brand.name);
  const isVector = brand.logo.format === 'svg';

  const logo = (
    <Image
      src={brand.logo.url}
      // Inside a link the link carries the name
      alt={href ? '' : name}
      width={brand.logo.width ?? 120}
      height={brand.logo.height ?? 28}
      sizes="160px"
      className={cn(
        'w-auto object-contain opacity-70 transition-opacity duration-150 hover:opacity-100',
        isVector ? 'brightness-0' : 'mix-blend-multiply grayscale',
        className,
      )}
    />
  );

  if (!href) return logo;

  return (
    <a
      href={href}
      target="_blank"
      rel="nofollow noreferrer"
      aria-label={`${name} ${uiString(locale, 'opensInNewTab')}`}
      className="inline-flex max-w-full rounded-[6px]"
    >
      {logo}
    </a>
  );
};

export default BrandLogo;
