'use client';

import { Check, Copy } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '@/utils/cn';

type Props = {
  /** The text written to the clipboard (stega already stripped) */
  code: string;
  /** Resting label, for example "Copy" */
  label: string;
  /** Label shown and announced for two seconds after a successful copy */
  copiedLabel: string;
  /** Accessible name of the button, for example "Copy code"; it should start with the resting label */
  accessibleLabel?: string;
  className?: string;
};

/**
 * The code window's copy action. The label doubles as a polite live region, so
 * a successful copy is announced. The focus ring is drawn inside the button:
 * the code window clips anything outside it.
 */
const CopyButton = ({
  code,
  label,
  copiedLabel,
  accessibleLabel,
  className,
}: Props) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timeout = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timeout);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
    } catch {
      // Clipboard access denied: nothing to report beyond the unchanged label
    }
  };

  return (
    <button
      type="button"
      aria-label={accessibleLabel}
      onClick={copy}
      className={cn(
        'btn btn-ghost btn-sm h-8 px-2.5 text-ink-2 focus-visible:-outline-offset-2 pointer-coarse:h-11 pointer-coarse:px-3.5',
        className,
      )}
    >
      {copied ? (
        <Check strokeWidth={1.75} aria-hidden="true" className="pop-icon" />
      ) : (
        <Copy strokeWidth={1.75} aria-hidden="true" />
      )}
      <span aria-live="polite">{copied ? copiedLabel : label}</span>
    </button>
  );
};

export default CopyButton;
