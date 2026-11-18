'use client';

import {
  type MouseEvent,
  type ReactNode,
  type RefObject,
  useEffect,
  useRef,
} from 'react';
import MobileLanguageList from '@/components/layout/Header/MobileLanguageList';
import { CloseIcon } from '@/components/ui/icons';
import TextLink from '@/components/ui/TextLink';
import type { SiteLocale } from '@/lib/datocms/graphql';
import { uiString } from '@/lib/i18n/uiStrings';
import type { ResolvedGlobalPageProps } from '@/utils/globalPageProps';
import DocsNav from '../DocsNav';

type Props = {
  id: string;
  open: boolean;
  onClose: () => void;
  /** The header's menu button: focus goes back to it when the drawer closes */
  menuButtonRef: RefObject<HTMLButtonElement | null>;
  /** 'site-sheet' while the drawer belongs to the current page (see DocsShell) */
  viewTransitionName?: string;
  /** The header's logo link, repeated where it sits so nothing moves */
  brand: ReactNode;
  siteHref: string;
  globalPageProps: ResolvedGlobalPageProps;
  languages: SiteLocale[];
};

/** Same breakpoint as the sidebar (`lg`) */
const DESKTOP_QUERY = '(min-width: 64rem)';

/**
 * The docs tree below 1024px, in the site's navigation sheet: a modal
 * <dialog> covering the screen (the page is inert, Escape closes it, focus
 * returns to the menu button) that repeats the header row, then the tree, the
 * languages and the way back to the site. DocsShell owns the open state.
 */
const DocsDrawer = ({
  id,
  open,
  onClose,
  menuButtonRef,
  viewTransitionName,
  brand,
  siteHref,
  globalPageProps,
  languages,
}: Props) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const { locale } = globalPageProps.params;
  const languageHeadingId = `${id}-language`;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
      closeButtonRef.current?.focus();
      // Start with the current page in view (a deep page sits low in the tree)
      dialog
        .querySelector('[aria-current="page"]')
        ?.scrollIntoView({ block: 'center' });
    } else if (!open && dialog.open) {
      dialog.close();
      // A modal dialog gives focus back by itself, except when it closes
      // because the viewport grew past lg and the menu button is gone
      if (menuButtonRef.current?.offsetParent) menuButtonRef.current.focus();
    }
  }, [open, menuButtonRef]);

  // Lock page scroll, and close once the sidebar is back (the viewport grew past 1024px)
  useEffect(() => {
    if (!open) return;

    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = 'hidden';

    const desktop = window.matchMedia(DESKTOP_QUERY);
    const onChange = () => {
      if (desktop.matches) onClose();
    };
    desktop.addEventListener('change', onChange);

    return () => {
      root.style.overflow = previousOverflow;
      desktop.removeEventListener('change', onChange);
    };
  }, [open, onClose]);

  // Following any link closes the sheet, the current page's link included
  // (it does not change the pathname, so the route change would not)
  const closeOnLinkClick = (event: MouseEvent<HTMLDialogElement>) => {
    if ((event.target as Element).closest('a')) onClose();
  };

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: Escape closes the dialog natively and links follow on Enter; the click only closes the sheet after a link
    <dialog
      ref={dialogRef}
      id={id}
      aria-label={uiString(locale, 'documentation')}
      onClose={onClose}
      onClick={closeOnLinkClick}
      style={{ viewTransitionName }}
      className="fixed inset-0 m-0 size-full max-h-none max-w-none overflow-hidden border-0 bg-surface p-0 text-fg opacity-0 transition-[opacity,overlay,display] transition-discrete duration-100 ease-linear backdrop:bg-transparent open:opacity-100 starting:open:opacity-0"
    >
      <div className="flex h-full flex-col">
        <div className="container-page flex h-(--header-h) shrink-0 items-center justify-between gap-4 border-line border-b">
          {brand}
          <button
            ref={closeButtonRef}
            type="button"
            aria-label={uiString(locale, 'closeDocsMenu')}
            onClick={onClose}
            className="-mr-2.5 grid size-11 place-items-center rounded-full text-fg transition-colors duration-150 hover:bg-subtle"
          >
            <CloseIcon className="size-5" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <div className="container-page pt-2 pb-10">
            <DocsNav globalPageProps={globalPageProps} size="sheet" />

            <div className="mt-8 divide-y divide-line border-line border-y">
              {languages.length > 1 && (
                <div className="py-5">
                  <p
                    id={languageHeadingId}
                    className="text-small text-fg-muted"
                  >
                    {uiString(locale, 'language')}
                  </p>
                  <MobileLanguageList
                    globalPageProps={globalPageProps}
                    languages={languages}
                    onNavigate={onClose}
                    labelledBy={languageHeadingId}
                  />
                </div>
              )}
              <div className="py-3">
                <TextLink
                  href={siteHref}
                  className="inline-flex min-h-11 items-center text-body"
                >
                  {uiString(locale, 'backToSite')}
                </TextLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </dialog>
  );
};

export default DocsDrawer;
