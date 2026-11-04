import DatoImage from '@/components/datocms/DatoImage';
import { Threads } from '@/components/ui/Ornaments';
import type { ResultOf } from '@/lib/datocms/graphql';
import { cn } from '@/utils/cn';
import type { AboutIntroFragment } from './fragment';

type Props = {
  images: ResultOf<typeof AboutIntroFragment>['images'];
  /** The block opens the page: no scroll reveal, the cards float in on load and the first photo loads eagerly */
  leadsPage: boolean;
};

/** Photo card positions by photo count; narrower between lg and xl so the overlaps stay light */
const SLOTS = [
  {
    position:
      'left-5 top-5 md:left-10 md:top-10 lg:max-xl:left-6 lg:max-xl:top-6',
    photo:
      'h-[154px] w-[232px] md:h-[208px] md:w-[312px] lg:max-xl:h-[177px] lg:max-xl:w-[266px]',
    sizes: '(min-width: 768px) 312px, 232px',
  },
  {
    position:
      'right-4 bottom-5 md:right-8 md:bottom-auto md:top-44 lg:max-xl:right-4 lg:max-xl:top-[40%]',
    photo:
      'h-[112px] w-[150px] md:h-[150px] md:w-[200px] lg:max-xl:h-[128px] lg:max-xl:w-[170px]',
    sizes: '(min-width: 768px) 200px, 150px',
  },
  {
    position:
      'hidden md:block md:left-24 md:bottom-8 lg:max-xl:left-8 lg:max-xl:bottom-6',
    photo: 'h-[112px] w-[168px] lg:max-xl:h-[95px] lg:max-xl:w-[143px]',
    sizes: '168px',
  },
] as const;

const SINGLE_SLOT = {
  position: 'inset-0 m-auto h-fit w-fit',
  photo: 'h-[184px] w-[276px] md:h-[266px] md:w-[400px]',
  sizes: '(min-width: 768px) 400px, 276px',
} as const;

/** On the page opener the cards after the first float in on load; the first holds the LCP photo and stays put */
const FLOAT_IN = [undefined, 'hero-float [--d:1]', 'hero-float [--d:2]'];

/**
 * A threaded well holding up to three of the CMS photos as framed cards.
 * Renders nothing when no image has a responsive version.
 */
const PhotoPlinth = ({ images, leadsPage }: Props) => {
  const photos = images.filter((image) => image.responsiveImage).slice(0, 3);

  if (photos.length === 0) {
    return null;
  }

  const slots = photos.length === 1 ? [SINGLE_SLOT] : SLOTS;

  return (
    <div
      className={cn(
        'well mt-7 h-[300px] md:mt-10 md:h-[420px] lg:col-span-6 lg:mt-0 lg:h-[448px]',
        !leadsPage && 'reveal',
      )}
    >
      <Threads shape="plinth" draw="load" className="opacity-85" />
      {photos.map((image, index) => {
        const slot = slots[index];
        return (
          slot &&
          image.responsiveImage && (
            <div
              key={image.id}
              className={cn(
                'float absolute rounded-[18px] p-[5px]',
                slot.position,
                leadsPage && FLOAT_IN[index],
              )}
            >
              <div className={cn('photo rounded-[14px]', slot.photo)}>
                <DatoImage
                  fragment={image.responsiveImage}
                  layout="fill"
                  objectFit="cover"
                  objectPosition="50% 50%"
                  sizes={slot.sizes}
                  priority={index === 0 && leadsPage}
                />
              </div>
            </div>
          )
        );
      })}
    </div>
  );
};

export default PhotoPlinth;
