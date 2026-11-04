import { type ComponentPropsWithoutRef, useId } from 'react';
import DatoStructuredText from '@/components/datocms/DatoStructuredText';
import { Threads } from '@/components/ui/Ornaments';
import TwoTone from '@/components/ui/TwoTone';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import { uiString } from '@/lib/i18n/uiStrings';
import { cn } from '@/utils/cn';
import { hasStructuredText } from '@/utils/structuredText';
import { NewsletterSubscriptionFragment } from './fragment';
import NewsletterForm from './NewsletterForm';
import { newsletterArches } from './newsletterArches';

type Props = {
  fragment: FragmentOf<typeof NewsletterSubscriptionFragment>;
  /** Site locale for the form's labels and messages (English when missing) */
  locale?: string | null;
} & Omit<ComponentPropsWithoutRef<'aside'>, 'children'>;

/**
 * In-article newsletter sign-up: a well with arch threads in a lane the copy
 * and the form never enter. There is no endpoint, so the form only confirms
 * inline (see NewsletterForm). The title is a <p>, not a heading, so it stays
 * out of the article outline.
 */
const NewsletterSubscriptionBlock = ({
  fragment,
  locale,
  className,
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
      className={cn(
        'prose-block not-prose reveal well px-9 py-9 max-md:px-5 max-md:py-7',
        className,
      )}
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

      <NewsletterForm
        buttonLabel={buttonLabel}
        labels={{
          emailAddress: uiString(locale, 'emailAddress'),
          emailPlaceholder: uiString(locale, 'emailPlaceholder'),
          subscribe: uiString(locale, 'subscribe'),
          invalidEmail: uiString(locale, 'invalidEmail'),
          subscribed: uiString(locale, 'subscribed'),
        }}
      />
    </aside>
  );
};

export default NewsletterSubscriptionBlock;
