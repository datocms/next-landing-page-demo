import { stripStega } from '@datocms/content-link';
import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';
import DatoStructuredText from '@/components/datocms/DatoStructuredText';
import { altWithMarker } from '@/lib/datocms/contentLink';
import {
  type FragmentOf,
  readFragment,
  type SiteLocale,
} from '@/lib/datocms/graphql';
import { toLanguageTag } from '@/lib/i18n/languageTag';
import { uiLabel, uiString } from '@/lib/i18n/uiStrings';
import { cn } from '@/utils/cn';
import type { ResolvedGlobalPageProps } from '@/utils/globalPageProps';
import { legalPageUrl, pageUrl } from '@/utils/routes';
import { hasStructuredText } from '@/utils/structuredText';
import FooterLanguages from './FooterLanguages';
import FooterPageLink from './FooterPageLink';
import { FooterFragment } from './fragment';

type Props = {
  fragment: FragmentOf<typeof FooterFragment> | null;
  languages: SiteLocale[];
  globalPageProps: ResolvedGlobalPageProps;
};

/**
 * A footer link: dimmed white, white on hover, white and medium weight when it is
 * the current page or language. Long single words (German legal titles) hyphenate, or break as
 * a last resort
 */
const linkClass =
  'inline-flex min-h-7 items-center text-small text-surface/70 hyphens-auto wrap-anywhere transition-colors duration-150 hover:text-surface aria-[current]:font-medium aria-[current]:text-surface pointer-coarse:min-h-11';

/** The visible name of a social link: its CMS name, or the site's host when the name is empty */
const socialLabel = (name: string | null | undefined, url: string) => {
  if (name) return name;
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
};

/** A column of links, named by its heading */
const FooterColumn = ({
  id,
  title,
  className,
  children,
}: {
  /** Id of the heading, which labels the nav */
  id: string;
  title: string;
  /** Grid placement */
  className: string;
  children: ReactNode;
}) => (
  <nav aria-labelledby={id} className={className}>
    <h2 id={id} className="mb-2 text-small font-semibold text-surface">
      {title}
    </h2>
    {children}
  </nav>
);

/**
 * The site footer, a navy rounded panel: the logo and one sentence, the Legal,
 * Social and Language columns, then the copyright year under a hairline. After a
 * closing call to action (the last block of a page, also navy) it loses its top
 * corners and its top margin, so the two read as one panel
 */
const Footer = ({ fragment, languages, globalPageProps }: Props) => {
  const layout = readFragment(FooterFragment, fragment);
  const locale = globalPageProps.params.locale;
  const footerLinks = layout?.footerLinks ?? [];
  const socialMediaLinks = layout?.socialMediaLinks ?? [];

  return (
    // lang lets the browser hyphenate the localized link titles
    <footer
      lang={toLanguageTag(locale)}
      className="on-ink panel relative isolate mt-(--section-space) overflow-hidden mb-(--inset) bg-ink text-surface [main:has([data-closing])+&]:mt-0 [main:has([data-closing])+&]:rounded-t-none"
    >
      {/* Faint rings breathing in the bottom-left corner, answering the closing panel's top-right ones */}
      <span
        aria-hidden="true"
        className="breathe loop pointer-events-none absolute -bottom-[130px] -left-[130px] -z-10 size-[260px] rounded-full shadow-[0_0_0_64px_rgb(255_255_255/0.04),0_0_0_136px_rgb(255_255_255/0.026),0_0_0_216px_rgb(255_255_255/0.016)] [--loop-delay:-20s] [--loop-scale:1.06] [--loop-time:52s]"
      />
      <div className="container-page pt-9 pb-8 lg:pt-10 [main:has([data-closing])+footer_&]:border-surface/15 [main:has([data-closing])+footer_&]:border-t">
        <div className="grid-12 gap-y-8">
          <div className="col-span-full flex flex-col lg:col-span-5">
            {layout?.footerLogo?.url && (
              <Link
                href={pageUrl(globalPageProps, 'home')}
                aria-label={uiString(locale, 'home')}
                className="inline-flex"
              >
                <Image
                  src={layout.footerLogo.url}
                  alt={altWithMarker('', layout.footerLogo.alt)}
                  className="h-7 w-auto"
                  width={layout.footerLogo.width ?? 111}
                  height={layout.footerLogo.height ?? 28}
                />
              </Link>
            )}
            {hasStructuredText(layout?.footerSubtitle) && (
              <div
                className={cn(
                  'max-w-[36ch] text-small text-surface/70 [&_a]:font-medium [&_a]:text-surface [&_a:hover]:underline [&_p+p]:mt-3',
                  layout.footerLogo?.url && 'mt-4',
                )}
              >
                <DatoStructuredText data={layout.footerSubtitle} />
              </div>
            )}
            {/* The year sits at the foot of this column, level with the last links */}
            <p className="mt-6 text-small text-surface/60 lg:mt-auto lg:pt-6">
              © {new Date().getFullYear()}
            </p>
          </div>

          {footerLinks.length > 0 && (
            <FooterColumn
              id="footer-legal"
              title={uiLabel(locale, 'legal')}
              className="col-span-2 lg:col-start-7"
            >
              <ul>
                {footerLinks.map((pageLink) => (
                  <li key={pageLink.id}>
                    {/* A client link, so the current legal page is marked */}
                    <FooterPageLink
                      href={legalPageUrl(globalPageProps, pageLink.slug)}
                      className={linkClass}
                    >
                      {pageLink.title}
                    </FooterPageLink>
                  </li>
                ))}
              </ul>
            </FooterColumn>
          )}

          {socialMediaLinks.length > 0 && (
            <FooterColumn
              id="footer-social"
              title={uiLabel(locale, 'social')}
              className="col-span-2"
            >
              <ul>
                {socialMediaLinks.map((socialMedia) => {
                  const href = stripStega(socialMedia.url);
                  return (
                    <li key={socialMedia.id}>
                      <a
                        href={href}
                        className={cn(
                          linkClass,
                          'inline-flex items-center gap-2',
                        )}
                      >
                        {socialMedia.icon?.url && (
                          <Image
                            src={socialMedia.icon.url}
                            alt={altWithMarker('', socialMedia.icon.alt)}
                            width={16}
                            height={16}
                            className="size-4 shrink-0 object-contain opacity-70 brightness-0 invert"
                          />
                        )}
                        {socialLabel(socialMedia.name, href)}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </FooterColumn>
          )}

          {languages.length > 1 && (
            <FooterColumn
              id="footer-language"
              title={uiLabel(locale, 'language')}
              className="col-span-2"
            >
              <FooterLanguages
                globalPageProps={globalPageProps}
                languages={languages}
                linkClassName={linkClass}
              />
            </FooterColumn>
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
