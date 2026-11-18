'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { buttonClass } from '@/components/ui/Button';
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
  'fixed right-4 bottom-16 z-40 animate-[fade-in_100ms_linear] sm:right-6 sm:bottom-[72px]';

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

      {/* The same small button on every page: secondary to enter, ink while Draft Mode is on */}
      <button
        ref={triggerRef}
        type="button"
        onClick={handleTriggerClick}
        aria-haspopup={isDraft ? undefined : 'dialog'}
        aria-expanded={isDraft ? undefined : promptOpen}
        aria-controls={!isDraft && promptOpen ? promptId : undefined}
        // Anchored through route changes: the page fades under it, never over it
        style={{ viewTransitionName: 'draft-control' }}
        className={buttonClass({
          variant: isDraft ? 'ink' : 'secondary',
          size: 'sm',
          className: 'fixed right-4 bottom-4 z-40 sm:right-6 sm:bottom-6',
        })}
      >
        {uiString(locale, isDraft ? 'exitDraftMode' : 'enterDraftMode')}
      </button>
    </>
  );
}
