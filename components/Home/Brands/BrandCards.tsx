import { BrandRecord } from '@/graphql/generated';
import Image from 'next/image';

type Props = {
  brandShowcase: BrandRecord[];
};

const BrandCards = ({ brandShowcase }: Props) => {
  return (
    <div className="bg-white py-6 sm:py-8 lg:py-12">
      <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
        <div className="grid grid-cols-1 gap-4 rounded-lg md:grid-cols-3 lg:gap-6">
          {brandShowcase.map((brand) => {
            return (
              <div
                key={brand.id}
                className="relative flex h-16 items-center justify-center rounded-lg bg-primary/20 p-20 text-gray-400 sm:h-32"
              >
                <Image
                  src={brand.brandLogo.url}
                  alt={brand.brandLogo.alt || 'Logo'}
                  width={400}
                  height={400}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BrandCards;
