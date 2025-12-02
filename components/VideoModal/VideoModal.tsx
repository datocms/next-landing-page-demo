'use client';

import { useCallback, useEffect } from 'react';

type Props = {
  isOpen: boolean;
  videoId: string;
  onClose: () => void;
  channel?: 'youtube' | 'vimeo';
};

const VideoModal = ({ isOpen, videoId, onClose, channel = 'youtube' }: Props) => {
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleEscape]);

  if (!isOpen) return null;

  const getVideoUrl = () => {
    if (channel === 'vimeo') {
      return `https://player.vimeo.com/video/${videoId}?autoplay=1`;
    }
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      {/* Modal Content */}
      <div
        className="relative z-10 w-full max-w-4xl mx-4 aspect-video animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors"
          aria-label="Close video"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Video iframe */}
        <iframe
          src={getVideoUrl()}
          className="w-full h-full rounded-lg"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="Video player"
        />
      </div>
    </div>
  );
};

export default VideoModal;

