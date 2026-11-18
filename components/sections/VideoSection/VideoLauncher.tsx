'use client';

import { useState } from 'react';
import { PlayIcon } from '@/components/ui/icons';
import VideoModal, { type VideoProvider } from '@/components/ui/VideoModal';
import { uiString } from '@/lib/i18n/uiStrings';

type Props = {
  /** Provider id, already free of Content Link markers */
  videoId: string;
  provider: VideoProvider;
  /** Plain-text section title, used for the accessible names */
  title?: string;
  locale: string;
};

/**
 * The 76px white play button with a navy play icon in the middle of the poster,
 * and the dialog it opens. It sits unpositioned inside the positioned frame: its
 * ::before covers the whole frame, so a click anywhere on the poster plays the
 * video too. Focus returns here when the dialog closes.
 */
const VideoLauncher = ({ videoId, provider, title, locale }: Props) => {
  const [isOpen, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={
          title
            ? uiString(locale, 'playVideoTitled', { title })
            : uiString(locale, 'playVideo')
        }
        aria-haspopup="dialog"
        className="grid size-[76px] cursor-pointer place-items-center rounded-full bg-surface text-fg shadow-[0_12px_32px_rgb(9_14_52/0.35)] transition-colors duration-150 before:absolute before:inset-0 before:rounded-media before:content-[''] hover:bg-subtle"
      >
        <PlayIcon className="ml-0.5 size-6" />
      </button>

      <VideoModal
        isOpen={isOpen}
        videoId={videoId}
        provider={provider}
        title={title}
        locale={locale}
        onClose={() => setOpen(false)}
      />
    </>
  );
};

export default VideoLauncher;
