'use client';

import { usePathname } from 'next/navigation';
import Button from '@/components/ui/Button';
import { resolveUiLocale, uiLabel, uiString } from '@/lib/i18n/uiStrings';
import { cn } from '@/utils/cn';

/**
 * The 404 page. Inside a locale, a missing page renders in its layout's not-found
 * (app/[locale]/(common-layout)/not-found.tsx with the header and footer,
 * app/[locale]/(docs-layout)/not-found.tsx in the docs shell) with `inLayout`:
 * that layout already renders <main>, so this is a plain block. The fallbacks,
 * app/[locale]/not-found.tsx (a layout that cannot render) and app/not-found.tsx
 * (a URL no route matches), stand on their own as a full-height <main>.
 * Inside a locale it picks up the project's accent color; the root one uses
 * the default accent of styles/tokens.css.
 *
 * Not-found pages receive no params, so the copy follows the first path
 * segment (the proxy always puts a locale there); anything unknown reads in
 * English. That needs the pathname, which makes this a client component. The
 * `lang` on <main> keeps the copy's language right on the root 404, whose
 * <html> can't know the locale.
 */
type Props = {
  /** Rendered inside a layout that has the header, footer and <main> already */
  inLayout?: boolean;
};

const NotFoundPage = ({ inLayout = false }: Props) => {
  const segment = usePathname().split('/')[1] ?? '';
  const locale = resolveUiLocale(segment);
  // Back to this locale's home when the path names one; the root redirects by browser language
  const homeHref = segment === locale ? `/${locale}/home` : '/';
  const title = uiString(locale, 'notFoundTitle');

  const Root = inLayout ? 'div' : 'main';

  return (
    <Root
      id={inLayout ? undefined : 'main'}
      lang={locale}
      className={cn(
        'container-page flex flex-col items-center justify-center text-center',
        inLayout ? 'min-h-[60svh] py-24' : 'min-h-svh py-16',
      )}
    >
      {/* Hoisted into <head> by React: Next only reads `metadata` from the root not-found */}
      <title>{title}</title>
      <h1 className="text-h1">{uiLabel(locale, 'notFoundTitle')}</h1>
      <p className="mt-4 max-w-[40ch] text-lead text-fg-muted">
        {uiLabel(locale, 'notFoundBody')}
      </p>
      <div className="mt-8">
        <Button href={homeHref} size="lg">
          {uiLabel(locale, 'backToHome')}
        </Button>
      </div>
    </Root>
  );
};

export default NotFoundPage;
