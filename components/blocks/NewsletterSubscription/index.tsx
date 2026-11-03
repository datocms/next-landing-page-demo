import { type ComponentPropsWithoutRef, useId } from 'react';
import DatoStructuredText from '@/components/datocms/DatoStructuredText';
import { Threads } from '@/components/ui/Ornaments';
import TwoTone from '@/components/ui/SectionTitle/TwoTone';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import { hasStructuredText } from '@/utils/structuredText';
import { NewsletterSubscriptionFragment } from './fragment';
import NewsletterForm from './NewsletterForm';
import newsletterArches from './newsletterArches';

type Props = {
  fragment: FragmentOf<typeof NewsletterSubscriptionFragment>;
} & Omit<ComponentPropsWithoutRef<'aside'>, 'children'>;

/**
 * In-article newsletter sign-up: a well fitted to the reading column, with
 * nested arch threads bottom-right (768 and up) in a lane the copy and the
 * capture never enter. There is no endpoint, so the form only confirms inline
 * (see NewsletterForm). It renders a single root so content-link props can be
 * cloned onto it. The title is not a heading, so the block does not reshape the
 * article outline.
 */
const NewsletterSubscriptionBlock = ({
  fragment,
  className = '',
  ...rest
}: Props) => {
  const { title, subtitle, buttonLabel } = readFragment(
    NewsletterSubscriptionFragment,
    fragment,
  );
  const titleId = useId();

  return (
    <aside
      {...rest}
      aria-labelledby={title ? titleId : undefined}
      className={`prose-block not-prose reveal well px-9 py-9 max-md:px-5 max-md:py-7 ${className}`}
    >
      <Threads
        shape={newsletterArches}
        className="top-auto left-auto hidden h-[200px] w-[360px] opacity-50 md:block rtl:right-auto rtl:left-0 rtl:-scale-x-100"
      />

      <div className="relative max-w-[360px]">
        {title && (
          // One Visual Editing target for both halves of the split title
          <p
            id={titleId}
            data-datocms-content-link-group
            className="max-w-[22ch] text-h3-lg text-ink"
          >
            <TwoTone text={title} lineBreak="always" />
          </p>
        )}

        {hasStructuredText(subtitle) && (
          <div className="mt-2 text-body text-ink-2 [&_a]:text-ink [&_a]:underline [&_a]:decoration-accent-solid/45 [&_a]:underline-offset-[3px] [&_p+p]:mt-2 [&_strong]:font-medium [&_strong]:text-ink">
            <DatoStructuredText data={subtitle} />
          </div>
        )}
      </div>

      <NewsletterForm buttonLabel={buttonLabel} />
    </aside>
  );
};

export default NewsletterSubscriptionBlock;
