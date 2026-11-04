import { stripStega } from '@datocms/content-link';
import { type ComponentPropsWithoutRef, type ReactNode, useId } from 'react';
import DatoStructuredText from '@/components/datocms/DatoStructuredText';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import { uiString } from '@/lib/i18n/uiStrings';
import { cn } from '@/utils/cn';
import { hasStructuredText } from '@/utils/structuredText';
import AppStoreGlyph from './AppStoreGlyph';
import { AppCtaFragment } from './fragment';
import GooglePlayGlyph from './GooglePlayGlyph';
import PhoneMiniUi from './PhoneMiniUi';

type Props = {
  fragment: FragmentOf<typeof AppCtaFragment>;
  /** Site locale for the store links' labels and new-tab hint (English when missing) */
  locale?: string | null;
} & Omit<ComponentPropsWithoutRef<'aside'>, 'children'>;

type StoreLinkProps = {
  /** Raw CMS URL (stega is stripped here) */
  href: string;
  glyph: ReactNode;
  label: string;
  /** Screen-reader hint that the store opens in a new tab */
  newTabHint: string;
};

/** An ink pill linking to an app store page in a new tab */
const StoreLink = ({ href, glyph, label, newTabHint }: StoreLinkProps) => (
  <a
    href={stripStega(href)}
    target="_blank"
    rel="noopener noreferrer"
    className="btn btn-ink max-md:h-12 max-md:w-full"
  >
    {glyph}
    {label}
    <span className="sr-only">{newTabHint}</span>
  </a>
);

/**
 * In-article app download card: copy and store buttons beside a wordless phone
 * mini-UI. The title is a <p>, not a heading, so it stays out of the article
 * outline; the aside is named by it.
 */
const AppCtaBlock = ({ fragment, locale, className, ...rest }: Props) => {
  const { title, text, googlePlayUrl, appstoreUrl } = readFragment(
    AppCtaFragment,
    fragment,
  );
  const titleId = useId();
  // The leading space keeps the hint apart from the label it is read after
  const newTabHint = ` ${uiString(locale, 'opensInNewTab')}`;

  return (
    <aside
      {...rest}
      aria-labelledby={title ? titleId : undefined}
      className={cn(
        'prose-block not-prose reveal card grid items-start gap-7 p-7 max-md:p-5 md:grid-cols-[minmax(0,1fr)_148px]',
        className,
      )}
    >
      <div className="min-w-0">
        {title && (
          <p id={titleId} className="max-w-[28ch] text-h3-lg text-ink">
            {title}
          </p>
        )}

        {hasStructuredText(text) && (
          <div className="mt-2.5 text-body text-ink-2 [&_a]:text-ink [&_a]:underline [&_a]:decoration-accent-solid/45 [&_a]:underline-offset-[3px] [&_p+p]:mt-3 [&_strong]:font-medium [&_strong]:text-ink">
            <DatoStructuredText data={text} />
          </div>
        )}

        {(appstoreUrl || googlePlayUrl) && (
          <div className="mt-5 flex flex-wrap gap-2 max-md:flex-col">
            {appstoreUrl && (
              <StoreLink
                href={appstoreUrl}
                glyph={<AppStoreGlyph />}
                label={uiString(locale, 'getOnAppStore')}
                newTabHint={newTabHint}
              />
            )}

            {googlePlayUrl && (
              <StoreLink
                href={googlePlayUrl}
                glyph={<GooglePlayGlyph />}
                label={uiString(locale, 'getOnGooglePlay')}
                newTabHint={newTabHint}
              />
            )}
          </div>
        )}
      </div>

      <PhoneMiniUi />
    </aside>
  );
};

export default AppCtaBlock;
