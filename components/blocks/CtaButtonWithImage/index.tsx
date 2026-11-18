import { stripStega } from '@datocms/content-link';
import { type ComponentPropsWithoutRef, useId } from 'react';
import DatoStructuredText from '@/components/datocms/DatoStructuredText';
import Button from '@/components/ui/Button';
import Photo from '@/components/ui/Photo';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import { cn } from '@/utils/cn';
import { hasStructuredText } from '@/utils/structuredText';
import { CtaButtonWithImageFragment } from './fragment';

type Props = {
  fragment: FragmentOf<typeof CtaButtonWithImageFragment>;
} & Omit<ComponentPropsWithoutRef<'aside'>, 'children'>;

/**
 * A call to action in the text: title, text and a primary button on the
 * left, the image on the right, in a white card. The button only
 * appears when the block has a URL. The title is a <p>, not a heading, so it
 * stays out of the article outline; the aside is named by it.
 */
const CtaButtonWithImageBlock = ({ fragment, className, ...rest }: Props) => {
  const { title, subtitle, image, buttonLabel, buttonUrl } = readFragment(
    CtaButtonWithImageFragment,
    fragment,
  );
  const photo = image?.responsiveImage;
  const titleId = useId();
  // stripStega: Draft Mode's invisible markers must not end up in the href
  const href = stripStega(buttonUrl ?? '').trim();
  const showButton = Boolean(href && stripStega(buttonLabel ?? '').trim());

  return (
    <aside
      {...rest}
      aria-labelledby={title ? titleId : undefined}
      className={cn(
        'not-prose card my-10 grid items-center gap-6 p-6 sm:gap-8 sm:p-8',
        photo && 'sm:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]',
        className,
      )}
    >
      <div>
        {title && (
          <p id={titleId} className="text-h3">
            {title}
          </p>
        )}
        {hasStructuredText(subtitle) && (
          <div className="mt-2 text-body text-fg-muted [&_a]:text-accent-ink [&_a]:underline [&_a]:underline-offset-[3px] [&_p+p]:mt-3 [&_strong]:font-semibold [&_strong]:text-fg">
            <DatoStructuredText data={subtitle} />
          </div>
        )}
        {showButton && (
          <Button href={href} className="mt-6">
            {buttonLabel}
          </Button>
        )}
      </div>
      {photo && (
        <Photo
          image={photo}
          frame="detail"
          focalPoint={image?.focalPoint}
          sizes="(min-width: 768px) 240px, (min-width: 640px) 36vw, calc(100vw - 88px)"
          alt=""
          className="max-sm:order-first"
        />
      )}
    </aside>
  );
};

export default CtaButtonWithImageBlock;
