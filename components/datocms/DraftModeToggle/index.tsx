'use client';

import { Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useId, useRef, useState } from 'react';
import { uiString } from '@/lib/i18n/uiStrings';
import { cn } from '@/utils/cn';
import DraftModeEnabledToast from './DraftModeEnabledToast';
import DraftPasswordPrompt from './DraftPasswordPrompt';

type Props = {
  isDraft: boolean;
  locale: string;
};

/** Where the password prompt and the confirmation float: just above the toggle */
const floatingPanelClass =
  'pop-in fixed right-4 bottom-16 z-40 sm:right-6 sm:bottom-[72px]';

/**
 * Floating Draft Mode control, mounted on every page. Outside Draft Mode it
 * opens the password prompt (then confirms with a toast); in Draft Mode it
 * turns it off.
 */
export default function DraftModeToggle({ isDraft, locale }: Props) {
  const router = useRouter();
  const [promptOpen, setPromptOpen] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const promptRef = useRef<HTMLDivElement>(null);
  const wasPromptOpen = useRef(false);
  // Off when the prompt is dismissed by interacting elsewhere, so focus stays where the visitor went
  const returnFocusOnClose = useRef(true);
  const promptId = useId();

  async function toggleDraftMode() {
    if (isDraft) {
      await fetch('/api/draft/disable');
      router.refresh();
    } else setPromptOpen((open) => !open);
  }

  const onDraftModeEnabled = () => {
    router.refresh();
    setPromptOpen(false);
    setToastVisible(true);
  };

  // Auto-hide the confirmation after 5s (restarts if it is shown again)
  useEffect(() => {
    if (!toastVisible) return;
    const timeout = setTimeout(() => setToastVisible(false), 5000);
    return () => clearTimeout(timeout);
  }, [toastVisible]);

  // Non-modal popover: Escape closes it, and so does pressing or moving focus anywhere outside it and its trigger
  useEffect(() => {
    if (!promptOpen) return;

    const isOutside = (target: EventTarget | null) =>
      target instanceof Node &&
      !promptRef.current?.contains(target) &&
      !triggerRef.current?.contains(target);

    const dismissIfOutside = (event: Event) => {
      if (!isOutside(event.target)) return;
      returnFocusOnClose.current = false;
      setPromptOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setPromptOpen(false);
    };

    document.addEventListener('pointerdown', dismissIfOutside);
    document.addEventListener('focusin', dismissIfOutside);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', dismissIfOutside);
      document.removeEventListener('focusin', dismissIfOutside);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [promptOpen]);

  // Give focus back to the trigger when the prompt closes from Escape, Cancel or a successful sign-in
  useEffect(() => {
    if (wasPromptOpen.current && !promptOpen && returnFocusOnClose.current) {
      triggerRef.current?.focus();
    }
    if (promptOpen) returnFocusOnClose.current = true;
    wasPromptOpen.current = promptOpen;
  }, [promptOpen]);

  return (
    <>
      {toastVisible && (
        <div
          className={cn(floatingPanelClass, 'w-[min(26rem,calc(100vw-2rem))]')}
        >
          <DraftModeEnabledToast
            locale={locale}
            onDismiss={() => setToastVisible(false)}
          />
        </div>
      )}
      {promptOpen && !isDraft && (
        <div
          ref={promptRef}
          className={cn(floatingPanelClass, 'w-[min(25rem,calc(100vw-2rem))]')}
        >
          <DraftPasswordPrompt
            id={promptId}
            locale={locale}
            onCancel={() => setPromptOpen(false)}
            onEnabled={onDraftModeEnabled}
          />
        </div>
      )}

      {/* Icon-only below sm so it doesn't sit over body text on phones; the label stays available to assistive tech */}
      <button
        ref={triggerRef}
        type="button"
        onClick={toggleDraftMode}
        aria-label={isDraft ? uiString(locale, 'exitDraftMode') : undefined}
        aria-haspopup={isDraft ? undefined : 'dialog'}
        aria-expanded={isDraft ? undefined : promptOpen}
        aria-controls={!isDraft && promptOpen ? promptId : undefined}
        // Anchored through route changes: the page fades under it, never over it
        style={{ viewTransitionName: 'draft-control' }}
        className="btn btn-secondary btn-sm fixed right-4 bottom-4 z-40 shadow-card max-sm:size-11 max-sm:px-0 max-sm:[&_svg]:size-[18px] sm:right-6 sm:bottom-6"
      >
        {isDraft ? (
          <>
            <span
              aria-hidden="true"
              className="size-1.5 shrink-0 rounded-full bg-accent-solid max-sm:absolute max-sm:top-1 max-sm:right-1 max-sm:size-2.5 max-sm:ring-2 max-sm:ring-white sm:mr-0.5"
            />
            <span className="text-ink max-sm:hidden">
              {uiString(locale, 'draftMode')}
            </span>
            <span
              aria-hidden="true"
              className="mx-0.5 h-3.5 w-px bg-line max-sm:hidden"
            />
            <span className="flex items-center gap-1.5 text-ink-2 max-sm:text-ink">
              <EyeOff strokeWidth={1.75} aria-hidden="true" />
              <span className="max-sm:hidden">{uiString(locale, 'exit')}</span>
            </span>
          </>
        ) : (
          <>
            <Eye strokeWidth={1.75} aria-hidden="true" />
            <span className="max-sm:sr-only">
              {uiString(locale, 'enterDraftMode')}
            </span>
          </>
        )}
      </button>
    </>
  );
}
