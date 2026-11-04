'use client';

import { useEffect, useRef, useState } from 'react';

/** Writes text to the clipboard; `copied` stays true for `resetMs` after the last successful copy */
export function useCopyToClipboard(resetMs = 2000) {
  const [copied, setCopied] = useState(false);
  const resetTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(resetTimer.current), []);

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Clipboard access can be denied: `copied` simply stays false
      return;
    }
    setCopied(true);
    clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => setCopied(false), resetMs);
  };

  return { copied, copy };
}
