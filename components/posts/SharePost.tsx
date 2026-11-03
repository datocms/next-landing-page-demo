'use client';

import { ArrowUpRight, Check, Link2, Share2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

/** Interface copy, resolved on the server for the page's locale */
type SharePostLabels = {
  share: string;
  copyLink: string;
  copied: string;
  /** Accessible name of a network link, with a {network} placeholder */
  shareOn: string;
};

type Props = {
  /**
   * The post's absolute URL when the server knows the site's origin, so the
   * share links work before hydration and without JS. Once mounted, the
   * address in the browser takes over.
   */
  url?: string;
  labels: SharePostLabels;
};

const SHARE_NETWORKS = [
  {
    name: 'X',
    buildHref: (url: string) =>
      `https://x.com/intent/post?url=${encodeURIComponent(url)}`,
  },
  {
    name: 'LinkedIn',
    buildHref: (url: string) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  },
  {
    name: 'Facebook',
    buildHref: (url: string) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
];

/** How long the "Copied" confirmation stays before the button resets */
const COPIED_MS = 2000;

const BUTTON_CLASS = 'btn btn-secondary btn-sm pointer-coarse:h-11';

/** One of the copy button's two stacked labels; the hidden one keeps its size */
const SWAP_LABEL_CLASS =
  'col-start-1 row-start-1 inline-flex items-center justify-center gap-1.5 transition-[opacity,scale,visibility] duration-300 ease-spring';
const HIDDEN_LABEL_CLASS = 'invisible scale-90 opacity-0';

/**
 * Copies the browser address and confirms it in place for two seconds, with a
 * polite announcement for screen readers
 */
const CopyLinkButton = ({
  labels,
}: {
  labels: Pick<SharePostLabels, 'copyLink' | 'copied'>;
}) => {
  const [copied, setCopied] = useState(false);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  useEffect(() => () => clearTimeout(resetTimer.current), []);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      clearTimeout(resetTimer.current);
      resetTimer.current = setTimeout(() => setCopied(false), COPIED_MS);
    } catch {
      // Clipboard access can be denied; the share links still work
    }
  };

  return (
    <>
      <button type="button" onClick={copyLink} className={BUTTON_CLASS}>
        {/* Both labels share one grid cell, so the button keeps the width of the longer one */}
        <span className="grid">
          <span
            className={`${SWAP_LABEL_CLASS} ${copied ? HIDDEN_LABEL_CLASS : ''}`}
          >
            <Link2 strokeWidth={1.75} aria-hidden="true" />
            {labels.copyLink}
          </span>
          <span
            className={`${SWAP_LABEL_CLASS} ${copied ? '' : HIDDEN_LABEL_CLASS}`}
          >
            <Check
              strokeWidth={2}
              aria-hidden="true"
              className="text-accent-text"
            />
            {labels.copied}
          </span>
        </span>
      </button>
      <span aria-live="polite" className="sr-only">
        {copied ? labels.copied : ''}
      </span>
    </>
  );
};

/**
 * The post's share row: copy link, one link per network and, where the
 * browser has a share sheet, a native Share button
 */
const SharePost = ({ url: serverUrl, labels }: Props) => {
  const [url, setUrl] = useState(serverUrl ?? '');
  const [canShare, setCanShare] = useState(false);

  useEffect(() => {
    setUrl(window.location.href);
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const share = async () => {
    try {
      await navigator.share({
        title: document.title,
        url: window.location.href,
      });
    } catch {
      // The person dismissed the share sheet
    }
  };

  // Phones: an even two-column grid, so no button is left alone on a row (the
  // native Share button spans a full row). From sm up: one wrapping row. Share
  // comes last because it only appears after hydration: nothing shifts.
  return (
    <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
      <CopyLinkButton labels={labels} />
      {SHARE_NETWORKS.map((network) => (
        <a
          key={network.name}
          href={network.buildHref(url)}
          // In draft mode this island also hydrates inside the client preview tree,
          // which has no server origin: the browser address replaces it on mount
          suppressHydrationWarning
          target="_blank"
          rel="noopener noreferrer"
          aria-label={labels.shareOn.replace('{network}', network.name)}
          className={BUTTON_CLASS}
        >
          {network.name}
          <ArrowUpRight
            strokeWidth={1.75}
            aria-hidden="true"
            className="text-ink-3"
          />
        </a>
      ))}
      {canShare && (
        <button
          type="button"
          onClick={share}
          className="btn btn-secondary btn-sm col-span-2 pointer-coarse:h-11"
        >
          <Share2 strokeWidth={1.75} aria-hidden="true" />
          {labels.share}
        </button>
      )}
    </div>
  );
};

export default SharePost;
