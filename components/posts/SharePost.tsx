'use client';

import { useEffect, useState } from 'react';
import { buttonClass } from '@/components/ui/Button';
import { useCopyToClipboard } from '@/components/ui/useCopyToClipboard';
import { cn } from '@/utils/cn';

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
    name: 'LinkedIn',
    buildHref: (url: string) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  },
  {
    name: 'X',
    buildHref: (url: string) =>
      `https://x.com/intent/post?url=${encodeURIComponent(url)}`,
  },
  {
    name: 'Facebook',
    buildHref: (url: string) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
];

// Small secondary buttons, text only
const LINK = buttonClass({ variant: 'secondary', size: 'sm' });

/**
 * The post's share row as small secondary buttons: copy the link, one link per network
 * and, where the browser has a share sheet, "Share". Copying swaps the label
 * to "Copied" for two seconds and announces it.
 */
const SharePost = ({ url: serverUrl, labels }: Props) => {
  const [url, setUrl] = useState(serverUrl ?? '');
  const [canShare, setCanShare] = useState(false);
  const { copied, copy } = useCopyToClipboard();

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

  return (
    <ul className="flex flex-wrap items-center gap-2">
      <li>
        <button
          type="button"
          onClick={() => copy(window.location.href)}
          className={LINK}
        >
          {/* Both labels share one grid cell, so the link keeps the width of the longer one */}
          <span className="grid text-start">
            <span
              className={cn('col-start-1 row-start-1', copied && 'invisible')}
            >
              {labels.copyLink}
            </span>
            <span
              aria-hidden="true"
              className={cn('col-start-1 row-start-1', !copied && 'invisible')}
            >
              {labels.copied}
            </span>
          </span>
        </button>
        <span aria-live="polite" className="sr-only">
          {copied ? labels.copied : ''}
        </span>
      </li>
      {SHARE_NETWORKS.map((network) => (
        <li key={network.name}>
          <a
            href={network.buildHref(url)}
            // In draft mode this island also hydrates inside the client preview tree,
            // which has no server origin: the browser address replaces it on mount
            suppressHydrationWarning
            target="_blank"
            rel="noopener noreferrer"
            aria-label={labels.shareOn.replace('{network}', network.name)}
            className={LINK}
          >
            {network.name}
          </a>
        </li>
      ))}
      {/* Last, because it only appears after hydration: nothing shifts */}
      {canShare && (
        <li>
          <button type="button" onClick={share} className={LINK}>
            {labels.share}
          </button>
        </li>
      )}
    </ul>
  );
};

export default SharePost;
