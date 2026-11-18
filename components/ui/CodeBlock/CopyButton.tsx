'use client';

import { CheckIcon } from '@/components/ui/icons';
import { useCopyToClipboard } from '@/components/ui/useCopyToClipboard';
import { cn } from '@/utils/cn';
import styles from './copy.module.css';

type Props = {
  /** The text written to the clipboard (stega already stripped) */
  code: string;
  /** Resting label, for example "Copy" */
  label: string;
  /** Label shown and announced for two seconds after a successful copy */
  copiedLabel: string;
  /** Accessible name of the button, for example "Copy code"; it should start with the resting label */
  accessibleLabel?: string;
  /** Shows a clipboard glyph that turns into a check, popping in, after a copy (the docs) */
  withIcon?: boolean;
  className?: string;
};

/** Two overlapping sheets: the clipboard glyph, drawn like the other 16px icons */
const CopyGlyph = ({ className }: { className?: string }) => (
  <svg
    aria-hidden="true"
    viewBox="0 0 16 16"
    width={16}
    height={16}
    fill="none"
    className={className}
  >
    <rect
      x="5.5"
      y="5.5"
      width="8"
      height="8"
      rx="2"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path
      d="M10.5 3.5v-.25A1.75 1.75 0 0 0 8.75 1.5h-5.5A1.75 1.75 0 0 0 1.5 3.25v5.5c0 .97.78 1.75 1.75 1.75h.25"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

/**
 * The code block's copy action: a small text button on the navy block (dimmed
 * label, white on a faint white well on hover) whose label turns to "Copied" for two seconds. The label doubles as a polite live region, so a successful
 * copy is announced. The focus ring is drawn inside the button: the block
 * clips anything outside it.
 */
const CopyButton = ({
  code,
  label,
  copiedLabel,
  accessibleLabel,
  withIcon = false,
  className,
}: Props) => {
  const { copied, copy } = useCopyToClipboard();

  return (
    <button
      type="button"
      aria-label={accessibleLabel}
      onClick={() => copy(code)}
      className={cn(
        'inline-flex h-7 items-center rounded-chip px-2.5 text-ui font-medium transition-colors duration-150 hover:bg-surface/10 hover:text-surface focus-visible:-outline-offset-2 pointer-coarse:h-11',
        // The docs' button stays lit while it says "Copied"
        withIcon && copied ? 'bg-surface/10 text-surface' : 'text-surface/65',
        withIcon && 'gap-1.5',
        className,
      )}
    >
      {withIcon &&
        (copied ? (
          <CheckIcon key="done" className={cn('size-3.5', styles.pop)} />
        ) : (
          <CopyGlyph className="size-3.5" />
        ))}
      <span aria-live="polite">{copied ? copiedLabel : label}</span>
    </button>
  );
};

export default CopyButton;
