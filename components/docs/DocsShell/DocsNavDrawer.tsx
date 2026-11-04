'use client';

import { ArrowLeft, X } from 'lucide-react';
import Link from 'next/link';
import {
  type MouseEvent,
  type ReactNode,
  type RefObject,
  useEffect,
  useRef,
} from 'react';
import { uiString } from '@/lib/i18n/uiStrings';

type Props = {
  id: string;
  open: boolean;
  onClose: () => void;
  /** The top bar's menu button, which gets the focus back when the drawer closes */
  menuButtonRef: RefObject<HTMLButtonElement | null>;
  /** 'site-sheet' while the drawer belongs to the current page (see DocsShell) */
  viewTransitionName?: string;
  brand: ReactNode;
  nav: ReactNode;
  siteHref: string;
  footerText?: string | null;
  locale: string;
};

/**
 * The docs tree below lg: an inset drawer card built on a modal <dialog> (the
 * page is inert while it is open, Escape closes it and focus returns to the
 * menu button). DocsShell owns the open state.
 */
const DocsNavDrawer = ({
  id,
  open,
  onClose,
  menuButtonRef,
  viewTransitionName,
  brand,
  nav,
  siteHref,
  footerText,
  locale,
}: Props) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
      closeButtonRef.current?.focus();
    } else if (!open && dialog.open) {
      dialog.close();
      // A closed modal dialog restores focus itself, but not when it closes
      // because the viewport grew past lg (the menu button is gone by then)
      if (menuButtonRef.current?.offsetParent) menuButtonRef.current.focus();
    }
  }, [open, menuButtonRef]);

  // Lock page scroll, and close if the viewport grows into the desktop layout
  useEffect(() => {
    if (!open) return;

    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = 'hidden';

    const desktop = window.matchMedia('(min-width: 64rem)');
    const onChange = () => {
      if (desktop.matches) onClose();
    };
    desktop.addEventListener('change', onChange);

    return () => {
      root.style.overflow = previousOverflow;
      desktop.removeEventListener('change', onChange);
    };
  }, [open, onClose]);

  // A click on the backdrop lands on the <dialog> itself; any link click also
  // closes it (the current page's link would not change the pathname)
  const onDrawerClick = (event: MouseEvent<HTMLDialogElement>) => {
    const target = event.target as Element;
    if (target === event.currentTarget || target.closest('a')) onClose();
  };

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: Escape already closes the dialog natively; the click only adds backdrop dismissal
    <dialog
      ref={dialogRef}
      id={id}
      aria-label={uiString(locale, 'documentation')}
      onClose={onClose}
      onClick={onDrawerClick}
      style={{ viewTransitionName }}
      className="fixed inset-y-2 start-2 end-auto m-0 h-auto max-h-none w-[min(20rem,calc(100vw-3rem))] max-w-none overflow-hidden rounded-[24px] border-0 bg-white p-0 text-ink opacity-0 shadow-pop transition-[opacity,translate,overlay,display] transition-discrete duration-[120ms] ease-standard backdrop:bg-white/60 backdrop:backdrop-blur-[6px] open:opacity-100 open:duration-[180ms] open:ease-out-quint starting:open:opacity-0 motion-safe:starting:open:ltr:-translate-x-4 motion-safe:starting:open:rtl:translate-x-4"
    >
      <div className="flex h-full flex-col">
        <div className="flex h-14 shrink-0 items-center justify-between gap-4 border-b border-line ps-4 pe-2 pointer-coarse:h-15">
          {brand}
          <button
            ref={closeButtonRef}
            type="button"
            aria-label={uiString(locale, 'closeDocsMenu')}
            onClick={onClose}
            className="btn btn-icon size-11 rounded-full bg-well text-ink hover:bg-surface [&_svg]:size-5"
          >
            <X strokeWidth={1.75} aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain px-2 py-4 [--row-hover:var(--bg-2)]">
          {nav}
        </div>

        <div className="grid gap-0.5 border-t border-line px-4 py-3">
          <Link
            href={siteHref}
            className="link-quiet inline-flex min-h-11 items-center gap-2 justify-self-start text-small"
          >
            <ArrowLeft
              strokeWidth={1.75}
              aria-hidden="true"
              className="size-3.5 rtl:rotate-180"
            />
            {uiString(locale, 'backToSite')}
          </Link>
          {footerText && (
            <p className="text-caption text-ink-3">{footerText}</p>
          )}
        </div>
      </div>
    </dialog>
  );
};

export default DocsNavDrawer;
