'use client';

import { useEffect, useId, useRef, useState } from 'react';

/**
 * Open state, refs and id for the password prompt, a non-modal popover: the
 * page stays usable, and Escape or pressing or moving focus anywhere outside
 * the prompt and its trigger closes it.
 *
 * Put `triggerRef` on the button and `promptRef` on the prompt's wrapper.
 */
export function usePromptPopover() {
  const [promptOpen, setPromptOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const promptRef = useRef<HTMLDivElement>(null);
  const wasPromptOpen = useRef(false);
  // Off when the prompt is dismissed by interacting elsewhere, so focus stays where the visitor went
  const returnFocusOnClose = useRef(true);
  const promptId = useId();

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

  return { promptOpen, setPromptOpen, triggerRef, promptRef, promptId };
}
