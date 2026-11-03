import '@/styles/global.css';
import { draftMode } from 'next/headers';
import { notFound } from 'next/navigation';
import { toNextMetadata } from 'react-datocms/seo';
import ContentLink from '@/components/datocms/ContentLink';
import DraftModeToggle from '@/components/datocms/DraftModeToggle';
import CustomColor from '@/components/layout/CustomColor';
import InstantHistoryScroll from '@/components/layout/InstantHistoryScroll';
import { TagFragment } from '@/lib/datocms/commonFragments';
import { executeQuery } from '@/lib/datocms/executeQuery';
import { graphql } from '@/lib/datocms/graphql';
import type { AsyncPageProps } from '@/lib/datocms/routeContext';
import { getAvailableLocales } from '@/lib/i18n/locales';
import { fontVariables } from '@/styles/fonts';

type Props = AsyncPageProps & {
  children: React.ReactNode;
};

const query = graphql(
  /* GraphQL */ `
    query LayoutQuery {
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
 * The layout of every page: pages live under a locale, so <html> is rendered
 * here with that locale as its `lang` (app/layout.tsx only passes children
 * through). It rejects unknown locales, applies the
 * project's accent color and adds the Draft Mode toggle (plus, while Draft Mode
 * is on, the Content Link overlay) and the Back/Forward scroll fix.
 *
 * Switching locale swaps the root layout, so it is a full page load.
 */
export default async function LocaleLayout({ children, params }: Props) {
  const { isEnabled: isDraft } = await draftMode();
  const { locale } = await params;
  const allLocales: string[] = await getAvailableLocales();

  // Only the project's own locales are valid: any other first segment is a 404
  if (!allLocales.includes(locale)) {
    notFound();
  }

  const data = await executeQuery(query, { includeDrafts: isDraft });

  return (
    <html
      // DatoCMS writes regional locales with an underscore (pt_BR), HTML with a hyphen (pt-BR)
      lang={locale.replace('_', '-')}
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
