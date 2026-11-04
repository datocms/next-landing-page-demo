'use client';

import { Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { uiString } from '@/lib/i18n/uiStrings';
import { cn } from '@/utils/cn';
import DraftModeEnabledToast from './DraftModeEnabledToast';
import DraftPasswordPrompt from './DraftPasswordPrompt';
import { usePromptPopover } from './usePromptPopover';

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
  const { promptOpen, setPromptOpen, triggerRef, promptRef, promptId } =
    usePromptPopover();
  const [toastVisible, setToastVisible] = useState(false);

  async function handleTriggerClick() {
    if (isDraft) {
      await fetch('/api/draft/disable');
      router.refresh();
    } else setPromptOpen((open) => !open);
  }

  const handleDraftModeEnabled = () => {
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
            onEnabled={handleDraftModeEnabled}
          />
        </div>
      )}

      {/* Icon-only below sm so it doesn't sit over body text on phones; the label stays available to assistive tech */}
      <button
        ref={triggerRef}
        type="button"
        onClick={handleTriggerClick}
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
