'use client';

import { Play } from 'lucide-react';
import { type ReactNode, useState } from 'react';
import VideoModal, { type VideoProvider } from '@/components/ui/VideoModal';
import { uiString } from '@/lib/i18n/uiStrings';

type Props = {
  /** Provider id, already free of Content Link markers */
  videoId: string;
  provider: VideoProvider;
  /** Plain-text section title, used for the accessible names */
  title?: string;
  /** Server-rendered poster and player chrome, painted under the button */
  children?: ReactNode;
  locale: string;
};

/**
 * The play button covers the whole poster, so the frame is the target, and
 * opens the video dialog. The poster stays a sibling of the button (a button
 * may only hold phrasing content). Focus returns here when the dialog closes.
 */
const VideoLauncher = ({
  videoId,
  provider,
  title,
  children,
  locale,
}: Props) => {
  const [isOpen, setOpen] = useState(false);

  return (
    <>
      {children}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={
          title
            ? uiString(locale, 'playVideoTitled', { title })
            : uiString(locale, 'playVideo')
        }
        aria-haspopup="dialog"
        className="group absolute inset-0 z-[2] grid place-items-center rounded-[inherit] focus-visible:outline-none"
      >
        <span className="video-play btn btn-primary size-14 rounded-full p-0 transition-[scale,background-color,box-shadow] duration-250 ease-out-expo motion-safe:group-hover:scale-105 md:size-16">
          <Play
            aria-hidden="true"
            strokeWidth={0}
            className="size-4 translate-x-px fill-current md:size-[18px]"
          />
        </span>
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
