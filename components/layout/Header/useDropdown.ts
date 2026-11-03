'use client';

import { usePathname } from 'next/navigation';
import {
  type FocusEvent,
  type KeyboardEvent,
  type PointerEvent,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';

/** How the panel was opened: hover-opened panels close on pointer leave, clicked ones stay */
type OpenState = false | 'hover' | 'click';

/** Grace period before a hover-opened panel closes once the pointer has left it */
const CLOSE_DELAY_MS = 120;

/** Closes the header menu that is currently open: opening another one closes it first */
let closeCurrentMenu: (() => void) | null = null;

const canHover = (event: PointerEvent) =>
  event.pointerType === 'mouse' &&
  window.matchMedia('(hover: hover) and (pointer: fine)').matches;

const focusableItems = (panel: HTMLElement | null) =>
  panel
    ? Array.from(
        panel.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'),
      )
    : [];

/**
 * Disclosure-style dropdown (button + panel of links) shared by the header
 * nav groups and the language selector: opens on click/Enter/Space (and on
 * hover for mouse users when `openOnHover` is set), closes on Escape, outside
 * click, focus leaving, route change and another header menu opening. Arrow
 * keys move between the links.
 *
 * Spread `rootProps` on the element wrapping both, `triggerProps` on the
 * button and `panelProps` on the panel.
 */
export function useDropdown({
  openOnHover = false,
}: {
  openOnHover?: boolean;
} = {}) {
  const [open, setOpen] = useState<OpenState>(false);
  const rootRef = useRef<HTMLDivElement & HTMLLIElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<number | undefined>(undefined);
  const focusFirstOnOpen = useRef(false);
  const panelId = useId();

  // Close when navigating (adjusting state on a changed value, no effect needed)
  const pathname = usePathname();
  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setOpen(false);
  }

  // Only one header menu open at a time
  const isOpen = Boolean(open);
  useEffect(() => {
    if (!isOpen) return;

    const close = () => setOpen(false);
    closeCurrentMenu?.();
    closeCurrentMenu = close;
    return () => {
      if (closeCurrentMenu === close) closeCurrentMenu = null;
    };
  }, [isOpen]);

  // Close on a press outside, and on Escape (focus goes back to the trigger if it was inside)
  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: globalThis.PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      const hadFocus = rootRef.current?.contains(document.activeElement);
      setOpen(false);
      if (hadFocus) triggerRef.current?.focus();
    };

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  // Opened from the keyboard with ArrowDown: move focus into the panel once it is visible
  useEffect(() => {
    if (open && focusFirstOnOpen.current) {
      focusFirstOnOpen.current = false;
      focusableItems(panelRef.current)[0]?.focus();
    }
  }, [open]);

  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  const rootProps = {
    ref: rootRef,
    onPointerEnter: (event: PointerEvent) => {
      if (!openOnHover || !canHover(event)) return;
      window.clearTimeout(closeTimer.current);
      setOpen((current) => current || 'hover');
    },
    onPointerLeave: (event: PointerEvent) => {
      if (!openOnHover || !canHover(event)) return;
      window.clearTimeout(closeTimer.current);
      closeTimer.current = window.setTimeout(() => {
        setOpen((current) => (current === 'hover' ? false : current));
      }, CLOSE_DELAY_MS);
    },
    onBlur: (event: FocusEvent) => {
      const nextFocused = event.relatedTarget as Node | null;
      // A null target means a click on a non-focusable area: the outside-click handler covers it
      if (nextFocused && !event.currentTarget.contains(nextFocused)) {
        setOpen(false);
      }
    },
  };

  const triggerProps = {
    ref: triggerRef,
    type: 'button' as const,
    'aria-expanded': Boolean(open),
    'aria-controls': panelId,
    onClick: () => {
      window.clearTimeout(closeTimer.current);
      // A click on a hover-opened panel pins it open instead of closing it
      setOpen((current) => (current === 'click' ? false : 'click'));
    },
    onKeyDown: (event: KeyboardEvent) => {
      if (event.key !== 'ArrowDown') return;
      event.preventDefault();
      if (open) {
        focusableItems(panelRef.current)[0]?.focus();
      } else {
        focusFirstOnOpen.current = true;
        setOpen('click');
      }
    },
  };

  const panelProps = {
    ref: panelRef,
    id: panelId,
    onKeyDown: (event: KeyboardEvent) => {
      const items = focusableItems(panelRef.current);
      const index = items.indexOf(document.activeElement as HTMLElement);
      const last = items.length - 1;
      const target = {
        ArrowDown: index >= last ? 0 : index + 1,
        ArrowUp: index <= 0 ? last : index - 1,
        Home: 0,
        End: last,
      }[event.key];
      if (target === undefined) return;
      event.preventDefault();
      items[target]?.focus();
    },
  };

  return { open: isOpen, rootProps, triggerProps, panelProps };
}

/** Shared open/closed classes for a `.menu-panel` (entry via @starting-style, exit fades) */
export const panelStateClass = (open: boolean) =>
  open ? 'block' : 'hidden opacity-0 duration-[120ms] ease-standard';
