import { stripStega } from '@datocms/content-link';
import { type ComponentPropsWithoutRef, useId } from 'react';
import DatoStructuredText from '@/components/datocms/DatoStructuredText';
import Button from '@/components/ui/Button';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import { uiString } from '@/lib/i18n/uiStrings';
import { cn } from '@/utils/cn';
import { hasStructuredText } from '@/utils/structuredText';
import { AppCtaFragment } from './fragment';

type Props = {
  fragment: FragmentOf<typeof AppCtaFragment>;
  /** Site locale for the store links' labels and new-tab hint (English when missing) */
  locale?: string | null;
} & Omit<ComponentPropsWithoutRef<'aside'>, 'children'>;

/**
 * The app download aside in a post: title and text on the left, one button
 * per store on the right, on a pale tile (the block has no image).
 * The title is a <p>, not a heading, so it stays out of the article outline;
 * the aside is named by it.
 */
const AppCtaBlock = ({ fragment, locale, className, ...rest }: Props) => {
  const { title, subtitle, googlePlayUrl, appstoreUrl } = readFragment(
    AppCtaFragment,
    fragment,
  );
  const titleId = useId();
  // The leading space keeps the hint apart from the label it is read after
  const newTabHint = ` ${uiString(locale, 'opensInNewTab')}`;
  const stores = [
    { url: appstoreUrl, label: uiString(locale, 'getOnAppStore') },
    { url: googlePlayUrl, label: uiString(locale, 'getOnGooglePlay') },
  ]
    .map((store) => ({ ...store, href: stripStega(store.url ?? '').trim() }))
    .filter((store) => store.href);

  return (
    <aside
      {...rest}
      aria-labelledby={title ? titleId : undefined}
      className={cn(
        'not-prose tile my-10 flex flex-col gap-6 p-6 sm:p-8 md:flex-row md:items-center md:justify-between md:gap-8',
        className,
      )}
    >
      <div className="min-w-0">
        {title && (
          <p id={titleId} className="max-w-[32ch] text-h3">
            {title}
          </p>
        )}
        {hasStructuredText(subtitle) && (
          <div className="mt-2 max-w-[48ch] text-body text-fg-muted [&_a]:text-accent-ink [&_a]:underline [&_a]:underline-offset-[3px] [&_p+p]:mt-3 [&_strong]:font-semibold [&_strong]:text-fg">
            <DatoStructuredText data={subtitle} />
          </div>
        )}
      </div>

      {stores.length > 0 && (
        <div className="flex shrink-0 flex-wrap gap-3 md:flex-col md:items-stretch">
          {stores.map((store, index) => (
            <Button
              key={store.label}
              href={store.href}
              // The first store is the main action; the second sits beside it
              variant={index === 0 ? 'primary' : 'secondary'}
              target="_blank"
              rel="noopener noreferrer"
            >
              {store.label}
              <span className="sr-only">{newTabHint}</span>
            </Button>
          ))}
        </div>
      )}
    </aside>
  );
};

export default AppCtaBlock;
