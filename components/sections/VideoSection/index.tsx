import { stripStega } from '@datocms/content-link';
import { useId } from 'react';
import Photo from '@/components/ui/Photo';
import SectionHeader from '@/components/ui/SectionHeader';
import { siblingEditUrl } from '@/lib/datocms/contentLink';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import type { SectionHeadingLevel } from '@/utils/headingLevel';
import { VideoSectionFragment } from './fragment';
import VideoLauncher from './VideoLauncher';

type Props = {
  fragment: FragmentOf<typeof VideoSectionFragment>;
  as?: SectionHeadingLevel;
  locale: string;
};

/**
 * A pale rounded panel holding two columns (4fr / 7fr from 1024px, stacked
 * below): the title and lead on the left (the one section that keeps a header:
 * it says what the video is), the 16:9 poster on the right with a white play
 * button in its middle that opens the video dialog. Only YouTube and Vimeo play
 * here: any other video shows its poster alone.
 */
const VideoSection = ({ fragment, as = 'h2', locale }: Props) => {
  const headingId = useId();
  const { title, subtitle, thumbnail, video } = readFragment(
    VideoSectionFragment,
    fragment,
  );

  // Accessible names must not carry Content Link markers
  const plainTitle = stripStega(title ?? '');
  const videoId = stripStega(video?.providerUid ?? '');
  const rawProvider = stripStega(video?.provider ?? '').toLowerCase();
  const provider =
    videoId && (rawProvider === 'youtube' || rawProvider === 'vimeo')
      ? rawProvider
      : null;
  const fallbackPoster = video?.thumbnailUrl ?? '';

  if (!thumbnail?.responsiveImage && !fallbackPoster && !title) return null;

  return (
    <section
      aria-labelledby={title ? headingId : undefined}
      className="panel bg-subtle py-14 sm:py-16 lg:py-20"
    >
      <div className="container-page grid items-center gap-10 lg:grid-cols-[4fr_7fr] lg:gap-[72px]">
        <SectionHeader
          id={headingId}
          as={as}
          title={title}
          subtitle={subtitle}
          align="left"
          gap="none"
        />

        {/* The frame is the positioned box the play button's hit area fills */}
        <div className="frame-media relative isolate grid aspect-video place-items-center overflow-hidden rounded-media bg-tint">
          <div className="absolute inset-0 -z-10">
            {thumbnail?.responsiveImage ? (
              <Photo
                image={thumbnail.responsiveImage}
                frame="video"
                focalPoint={thumbnail.focalPoint}
                alt=""
                sizes="(min-width: 1184px) 680px, (min-width: 1024px) 60vw, 100vw"
              />
            ) : (
              fallbackPoster && (
                // biome-ignore lint/performance/noImgElement: a provider thumbnail URL, not a DatoCMS asset
                <img
                  src={fallbackPoster}
                  alt=""
                  data-datocms-content-link-url={siblingEditUrl(title, 'video')}
                  loading="lazy"
                  className="size-full object-cover"
                />
              )
            )}
          </div>
          {provider && (
            <VideoLauncher
              videoId={videoId}
              provider={provider}
              title={plainTitle}
              locale={locale}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default VideoSection;
