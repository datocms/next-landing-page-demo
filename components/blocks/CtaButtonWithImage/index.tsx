import { type ComponentPropsWithoutRef, useId } from 'react';
import DatoImage from '@/components/datocms/DatoImage';
import DatoStructuredText from '@/components/datocms/DatoStructuredText';
import { PresencePill } from '@/components/ui/Ornaments';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import { hasStructuredText } from '@/utils/structuredText';
import { CtaButtonWithImageFragment } from './fragment';

type Props = {
  fragment: FragmentOf<typeof CtaButtonWithImageFragment>;
} & Omit<ComponentPropsWithoutRef<'aside'>, 'children'>;

/**
 * In-article promo card: a photo inside an 8px card gutter with a wordless
 * presence pill pinned to it, copy on the right. The block has no URL field, so
 * the button label is a soft accent tag with no interactive role rather than a
 * fake link. It renders a single root so content-link props can be cloned onto
 * it. The title is not a heading, so the promo does not reshape the article
 * outline.
 */
const CtaButtonWithImageBlock = ({
  fragment,
  className = '',
  ...rest
}: Props) => {
  const { title, subtitle, buttonLabel, image } = readFragment(
    CtaButtonWithImageFragment,
    fragment,
  );
  const photo = image?.responsiveImage;
  const titleId = useId();

  return (
    <aside
      {...rest}
      aria-labelledby={title ? titleId : undefined}
      className={`prose-block not-prose reveal card grid overflow-hidden p-2 ${photo ? 'sm:grid-cols-[5fr_7fr]' : ''} ${className}`}
    >
      {photo && (
        <div className="photo relative aspect-[16/10] rounded-zone sm:aspect-auto sm:min-h-56">
          <DatoImage
            fragment={photo}
            layout="fill"
            objectFit="cover"
            objectPosition="50% 50%"
          />
          {/* Bottom-left beside the copy; bottom-right on the short stacked phone
              crop, where the left corner tends to land on the subject */}
          <PresencePill
            size="sm"
            className="absolute bottom-3 left-3 z-[2] max-sm:right-3 max-sm:left-auto"
          />
        </div>
      )}

      <div className="flex flex-col justify-center px-6 py-5 max-sm:px-3 max-sm:pt-4 max-sm:pb-3">
        {title && (
          <p id={titleId} className="text-h3-lg text-ink">
            {title}
          </p>
        )}

        {hasStructuredText(subtitle) && (
          <div className="mt-2 text-body text-ink-2 [&_a]:text-ink [&_a]:underline [&_a]:decoration-accent-solid/45 [&_a]:underline-offset-[3px] [&_p+p]:mt-2 [&_strong]:font-medium [&_strong]:text-ink">
            <DatoStructuredText data={subtitle} />
          </div>
        )}

        {buttonLabel && (
          <span className="badge badge-accent mt-5 h-8 w-fit px-3.5 text-[13.5px]">
            {buttonLabel}
          </span>
        )}
      </div>
    </aside>
  );
};

export default CtaButtonWithImageBlock;
