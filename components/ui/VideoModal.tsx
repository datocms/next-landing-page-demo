'use client';

import { X } from 'lucide-react';
import { type MouseEvent, useEffect, useRef, useState } from 'react';
import { uiString } from '@/lib/i18n/uiStrings';

type VideoChannel = 'youtube' | 'vimeo';

type Props = {
  isOpen: boolean;
  videoId: string;
  onClose: () => void;
  channel?: VideoChannel;
  /** Accessible name for the dialog and the player (usually the section title) */
  title?: string;
  locale: string;
};

/** The provider's embed player URL, autoplaying */
const embedUrl = (channel: VideoChannel, videoId: string) => {
  const id = encodeURIComponent(videoId);
  if (channel === 'vimeo') {
    return `https://player.vimeo.com/video/${id}?autoplay=1`;
  }
  return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
};

/**
 * Native modal <dialog>, always mounted: it sits in the top layer, makes the rest of the page
 * inert, closes on Escape and gives focus back to the play button by itself. CSS fades it in and
 * out (@starting-style plus a discrete display transition). The player loads on open and stays
 * mounted through the fade-out, so the panel never blinks to an empty box
 */
const VideoModal = ({
  isOpen,
  videoId,
  onClose,
  channel = 'youtube',
  title,
  locale,
}: Props) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [playerMounted, setPlayerMounted] = useState(false);
  if (isOpen && !playerMounted) setPlayerMounted(true);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (!isOpen) {
      if (dialog.open) dialog.close();
      // Unmount the player once the 150ms fade-out is over
      const timeout = setTimeout(() => setPlayerMounted(false), 150);
      return () => clearTimeout(timeout);
    }

    if (!dialog.open) dialog.showModal();
    closeButtonRef.current?.focus();

    // Lock page scroll, restoring whatever value was there before
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = 'hidden';
    return () => {
      root.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  // Clicks on the backdrop (outside the player and the close button) close it
  const closeOnBackdropClick = (event: MouseEvent<HTMLDialogElement>) => {
    const target = event.target as HTMLElement;
    if (target.closest('[data-video-modal-content]') === null) {
      onClose();
    }
  };

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: Escape closes the dialog natively; the click only adds scrim dismissal
    <dialog
      ref={dialogRef}
      aria-label={title || uiString(locale, 'video')}
      onClose={onClose}
      onClick={closeOnBackdropClick}
      className="group fixed inset-0 m-0 size-full max-h-none max-w-none overflow-hidden border-0 bg-transparent p-0 opacity-0 transition-[opacity,overlay,display] transition-discrete duration-150 ease-standard backdrop:bg-transparent open:opacity-100 open:duration-200 open:ease-out-quint starting:open:opacity-0"
    >
      <div className="relative grid size-full place-items-center px-(--gutter) py-16">
        {/* Light scrim: the page stays visible, softly blurred */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-white/80 backdrop-blur-[8px]"
        />

        <div
          data-video-modal-content
          className="relative w-[min(60rem,calc(100vw_-_2*var(--gutter)),calc((100svh_-_8rem)*16/9))] scale-[.98] rounded-well bg-white p-2 shadow-pop transition-[scale] duration-150 ease-standard group-open:scale-100 group-open:duration-200 group-open:ease-out-quint max-md:rounded-[20px] max-md:p-1.5 starting:group-open:scale-[.98]"
        >
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label={uiString(locale, 'closeVideo')}
            className="btn btn-secondary btn-icon absolute -top-13 right-0 max-md:-top-14"
          >
            <X aria-hidden="true" strokeWidth={1.75} />
          </button>

          <div className="aspect-video overflow-hidden rounded-zone bg-ink max-md:rounded-[14px]">
            {playerMounted && (
              <iframe
                src={embedUrl(channel, videoId)}
                className="size-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={title || uiString(locale, 'videoPlayer')}
              />
            )}
          </div>
        </div>
      </div>
    </dialog>
  );
};

export default VideoModal;
