import '@/styles/global.css';
import { draftMode } from 'next/headers';
import { toNextMetadata } from 'react-datocms/seo';
import ContentLink from '@/components/datocms/ContentLink';
import DraftModeToggle from '@/components/datocms/DraftModeToggle';
import CustomColor from '@/components/layout/CustomColor';
import InstantHistoryScroll from '@/components/layout/InstantHistoryScroll';
import { TagFragment } from '@/lib/datocms/commonFragments';
import { executeQuery } from '@/lib/datocms/executeQuery';
import { graphql } from '@/lib/datocms/graphql';
import { toLanguageTag } from '@/lib/i18n/languageTag';
import { requireSiteLocale } from '@/lib/i18n/locales';
import { fontVariables } from '@/styles/fonts';
import type { GlobalPageProps } from '@/utils/globalPageProps';

type Props = GlobalPageProps & {
  children: React.ReactNode;
};

const query = graphql(
  /* GraphQL */ `
    query LocaleLayoutQuery {
      _site {
        faviconMetaTags {
          ...TagFragment
        }
      }
      layout {
        mainColor {
          red
          blue
          green
        }
      }
    }
  `,
  [TagFragment],
);

// Every page gets the favicon set in the DatoCMS project settings
export async function generateMetadata() {
  const { isEnabled: isDraft } = await draftMode();
  const data = await executeQuery(query, { includeDrafts: isDraft });
  return toNextMetadata(data._site.faviconMetaTags);
}

/**
 * Validates the locale and renders <html lang> for it, with what every page
 * shares: the accent color, the Draft Mode toggle and, in Draft Mode, Content Link
 */
export default async function LocaleLayout({ children, params }: Props) {
  const { isEnabled: isDraft } = await draftMode();
  const locale = await requireSiteLocale((await params).locale);

  const data = await executeQuery(query, { includeDrafts: isDraft });

  return (
    <html
      lang={toLanguageTag(locale)}
      className={fontVariables}
      // Next scrolls to the top inside the navigation commit only with this attribute; never remove it
      data-scroll-behavior="smooth"
      // Inline on purpose: React drops the root from a route's view transition when only the page
      // boundaries changed, so the footer and the announcement would pop over the fading page.
      // Named here, they crossfade instead (React only cancels an empty inline name)
      style={{ viewTransitionName: 'root' }}
    >
      <body className="font-sans">
        {/* Without a main color in the Layout record, the theme's default accent (#4a6cf7) */}
        <CustomColor
          r={data.layout?.mainColor.red ?? 74}
          g={data.layout?.mainColor.green ?? 108}
          b={data.layout?.mainColor.blue ?? 247}
        />
        {isDraft && <ContentLink />}
        {children}
        <DraftModeToggle isDraft={isDraft} locale={locale} />
        <InstantHistoryScroll />
      </body>
    </html>
  );
}
