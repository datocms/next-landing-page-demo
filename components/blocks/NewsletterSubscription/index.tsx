import { type ComponentPropsWithoutRef, useId } from 'react';
import DatoStructuredText from '@/components/datocms/DatoStructuredText';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import { uiString } from '@/lib/i18n/uiStrings';
import { cn } from '@/utils/cn';
import { hasStructuredText } from '@/utils/structuredText';
import { NewsletterSubscriptionFragment } from './fragment';
import NewsletterForm from './NewsletterForm';

type Props = {
  fragment: FragmentOf<typeof NewsletterSubscriptionFragment>;
  /** Site locale for the form's labels and messages (English when missing) */
  locale?: string | null;
} & Omit<ComponentPropsWithoutRef<'aside'>, 'children'>;

/**
 * The newsletter sign-up in a post: title, text and a labelled email field
 * with its button, on a pale tile. There is no endpoint, so the form only
 * confirms inline (see NewsletterForm). The title is a <p>, not a heading,
 * so it stays out of the article outline.
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
      className={cn('not-prose tile my-10 p-6 sm:p-8', className)}
    >
      {title && (
        <p id={titleId} className="max-w-[32ch] text-h3">
          {title}
        </p>
      )}

      {hasStructuredText(subtitle) && (
        <div className="mt-2 max-w-[52ch] text-body text-fg-muted [&_a]:text-accent-ink [&_a]:underline [&_a]:underline-offset-[3px] [&_p+p]:mt-3 [&_strong]:font-semibold [&_strong]:text-fg">
          <DatoStructuredText data={subtitle} />
        </div>
      )}

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
