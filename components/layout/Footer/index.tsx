import { stripStega } from '@datocms/content-link';
import Image from 'next/image';
import Link from 'next/link';
import type { CSSProperties, ReactNode } from 'react';
import DatoStructuredText from '@/components/datocms/DatoStructuredText';
import {
  type FragmentOf,
  readFragment,
  type SiteLocale,
} from '@/lib/datocms/graphql';
import { toLanguageTag } from '@/lib/i18n/languageTag';
import { uiString } from '@/lib/i18n/uiStrings';
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

const columnHeadingClass = 'label mb-2.5 max-md:mb-0.5';

/** Long single words (German legal titles in a half-width column) hyphenate, or break as a last resort */
const linkClass =
  'inline-flex min-h-[30px] items-center text-[14.5px] text-ink-2 underline-offset-[3px] transition-colors hyphens-auto wrap-anywhere hover:text-ink hover:underline aria-[current]:text-ink max-md:min-h-11 pointer-coarse:min-h-11';

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
    <h2 id={id} className={columnHeadingClass}>
      {title}
    </h2>
    {children}
  </nav>
);

/** The site footer: logo and subtitle, the Legal, Social and Language columns, then the copyright and social icons */
const Footer = ({ fragment, languages, globalPageProps }: Props) => {
  const layout = readFragment(FooterFragment, fragment);
  const locale = globalPageProps.params.locale;
  const footerLinks = layout?.footerLinks ?? [];
  const socialMediaLinks = layout?.socialMediaLinks ?? [];

  return (
    // lang lets the browser hyphenate the localized link titles
    <footer
      lang={toLanguageTag(locale)}
      className="bg-white pt-14 max-md:pt-12"
    >
      <div className="container-page">
        <div className="grid-page gap-y-8 pb-8">
          <div className="col-span-full lg:col-span-5">
            {layout?.footerLogo && (
              <Link
                href={pageUrl(globalPageProps, 'home')}
                aria-label={uiString(locale, 'home')}
                className="hit-44 inline-flex rounded-lg"
              >
                <Image
                  src={layout.footerLogo.url}
                  alt=""
                  className="h-6 w-auto"
                  width={layout.footerLogo.width || 100}
                  height={layout.footerLogo.height || 100}
                />
              </Link>
            )}
            {hasStructuredText(layout?.footerSubtitle) && (
              <div
                className={cn(
                  'max-w-[32ch] text-[14.5px]/[1.55] text-ink-2 [&_a]:text-ink [&_a]:underline [&_a]:decoration-ink/35 [&_a]:underline-offset-[3px] [&_p+p]:mt-2',
                  layout.footerLogo && 'mt-3.5',
                )}
              >
                <DatoStructuredText data={layout.footerSubtitle} />
              </div>
            )}
          </div>

          {footerLinks.length > 0 && (
            <FooterColumn
              id="footer-legal"
              title={uiString(locale, 'legal')}
              className="col-span-2 md:col-span-4 lg:col-span-2 lg:col-start-7"
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
              title={uiString(locale, 'social')}
              className="col-span-2 md:col-span-4 lg:col-span-2"
            >
              <ul>
                {socialMediaLinks.map((socialMedia) => {
                  const href = stripStega(socialMedia.url);
                  return (
                    <li key={socialMedia.id}>
                      <a href={href} className={linkClass}>
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
              title={uiString(locale, 'language')}
              className="col-span-full md:col-span-4 lg:col-span-2"
            >
              <FooterLanguages
                globalPageProps={globalPageProps}
                languages={languages}
                linkClassName={linkClass}
              />
            </FooterColumn>
          )}
        </div>

        <div aria-hidden="true" className="hairline rounded-full" />

        {/* The bottom clearance keeps the floating draft-mode button off the social buttons */}
        <div className="flex items-center justify-between gap-4 pt-5 pb-18 sm:pb-20">
          <p className="text-caption text-ink-3 tabular-nums">
            © {new Date().getFullYear()}
          </p>
          {/*
           * The round icons repeat the Social column for pointer users, so they
           * stay out of the accessibility tree and the tab order. The icon is
           * the uploaded SVG used as a mask over currentColor: drawn by CSS
           * alone (no JS), and it follows the hover colour.
           */}
          {socialMediaLinks.length > 0 && (
            <ul aria-hidden="true" className="flex gap-2">
              {socialMediaLinks.map((socialMedia) => (
                <li key={socialMedia.id}>
                  <a
                    href={stripStega(socialMedia.url)}
                    tabIndex={-1}
                    className="grid size-9 place-items-center rounded-full bg-well text-ink-2 transition-colors hover:bg-surface hover:text-ink max-md:size-11 pointer-coarse:size-11"
                  >
                    <span
                      className="size-4 bg-current [mask:var(--icon)_center/contain_no-repeat]"
                      style={
                        {
                          '--icon': `url(${JSON.stringify(socialMedia.icon.url)})`,
                        } as CSSProperties
                      }
                    />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
