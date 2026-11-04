import DatoImage from '@/components/datocms/DatoImage';
import type { ResponsiveImageFragment } from '@/components/datocms/DatoImage/fragment';
import type { FragmentOf } from '@/lib/datocms/graphql';
import { cn } from '@/utils/cn';
import { toneClassFor } from '@/utils/tones';

type Props = {
  image: FragmentOf<typeof ResponsiveImageFragment>;
  /** The image's `sizes` attribute */
  sizes: string;
  /** Size and placement */
  className?: string;
  /** Raw CMS author name: frames the photo in a tone ring hashed from it */
  ringName?: string;
  /** Extra classes for the photo inside the ring */
  photoClassName?: string;
};

/** An author's round photo, optionally in the tone ring that marks the author across the blog */
const AuthorAvatar = ({
  image,
  sizes,
  className,
  ringName,
  photoClassName,
}: Props) => {
  const photo = (
    <div
      className={cn(
        'photo rounded-full',
        ringName ? 'size-full' : className,
        photoClassName,
      )}
    >
      <DatoImage
        layout="fill"
        objectFit="cover"
        objectPosition="50% 30%"
        fragment={image}
        sizes={sizes}
      />
    </div>
  );

  if (!ringName) {
    return photo;
  }

  return (
    <div
      className={cn(
        'ring-tone rounded-full',
        toneClassFor(ringName),
        className,
      )}
    >
      {photo}
    </div>
  );
};

export default AuthorAvatar;
