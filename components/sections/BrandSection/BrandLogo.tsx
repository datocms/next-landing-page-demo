import Image from 'next/image';
import { cn } from '@/utils/cn';

type Props = {
  brand: { brandName: string; brandLogo: { url: string } };
  /** Size of the logo box (the logo is contained inside it, at most 120px wide) */
  className?: string;
  /** Duplicate or linked logos: the name is given elsewhere, so alt is empty */
  decorative?: boolean;
};

/**
 * A brand logo as an ink silhouette, so marks drawn for dark or coloured
 * backdrops (white wordmarks) read on the light page. Its opacity comes from
 * `--logo-o` on an ancestor, which lets a cell or link brighten it on hover.
 */
const BrandLogo = ({ brand, className, decorative = false }: Props) => (
  <span className={cn('relative block', className)}>
    <Image
      src={brand.brandLogo.url}
      alt={decorative ? '' : brand.brandName}
      fill
      sizes="120px"
      className="object-contain opacity-(--logo-o) brightness-0 transition-opacity duration-200"
    />
  </span>
);

export default BrandLogo;
