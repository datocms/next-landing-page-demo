import { stripStega } from '@datocms/content-link';
import { useId } from 'react';
import DatoImage from '@/components/datocms/DatoImage';
import { Threads } from '@/components/ui/Ornaments';
import SectionTitle from '@/components/ui/SectionTitle';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import type { SectionHeadingLevel } from '@/utils/headingLevel';
import { VideoSectionFragment } from './fragment';
import PlayerBar from './PlayerBar';
import VideoLauncher from './VideoLauncher';

type Props = {
  fragment: FragmentOf<typeof VideoSectionFragment>;
  as?: SectionHeadingLevel;
  locale: string;
};

/**
 * Video well: the title and lead beside a framed player, with a loop of accent
 * threads behind them. Everything is server-rendered except the play button,
 * a small client island that opens the video dialog.
 */
const VideoSection = ({ fragment, as = 'h2', locale }: Props) => {
  const { videoHeader, videoSubheader, videoThumbnail, video } = readFragment(
    VideoSectionFragment,
    fragment,
  );
  const headingId = `video-${useId()}`;

  // Used as accessible names, so it must not carry Content Link markers
  const plainTitle = stripStega(videoHeader || '');
  const videoId = video?.providerUid ?? '';
  const rawProvider = (video?.provider ?? '').toLowerCase();
  // The dialog embeds YouTube and Vimeo; any other video shows its poster only
  const provider =
    videoId && (rawProvider === 'youtube' || rawProvider === 'vimeo')
      ? rawProvider
      : null;
  const fallbackPoster = video?.thumbnailUrl ?? '';
  const hasPoster = Boolean(videoThumbnail?.responsiveImage || fallbackPoster);

  const poster = (
    <>
      {videoThumbnail?.responsiveImage ? (
        <DatoImage
          fragment={videoThumbnail.responsiveImage}
          layout="fill"
          objectFit="cover"
          objectPosition="50% 50%"
          sizes="(min-width: 1024px) 620px, (min-width: 768px) 690px, 100vw"
        />
      ) : (
        fallbackPoster && (
          // biome-ignore lint/performance/noImgElement: a provider thumbnail URL, not a DatoCMS asset
          <img
            src={fallbackPoster}
            alt=""
            loading="lazy"
            className="absolute inset-0"
          />
        )
      )}
      {/* Player chrome only over a real poster of a video that can play here */}
      {provider && hasPoster && <PlayerBar />}
    </>
  );

  return (
    <section
      className="section"
      aria-labelledby={videoHeader ? headingId : undefined}
    >
      <div className="container-page">
        <div className="well reveal p-5 md:p-12">
          {/* The loop sits on the well's floor, so longer copy grows the well */}
          <Threads
            shape="loop"
            draw="view"
            className="hidden opacity-50 lg:top-auto lg:block lg:h-auto lg:aspect-[1200/461]"
          />
          <div className="grid items-start lg:grid-cols-12 lg:gap-x-6">
            {/* Bottom padding keeps the copy clear of the loop */}
            <div className="max-w-[560px] lg:col-span-5 lg:max-w-[420px] lg:pt-1 lg:pb-[55%]">
              <SectionTitle
                as={as}
                gap="none"
                id={headingId}
                title={videoHeader}
                paragraph={videoSubheader}
              />
            </div>

            <div className="mt-6 rounded-[16px] border border-line bg-white p-1.5 shadow-card md:mt-7 md:rounded-card md:p-2 lg:col-span-7 lg:col-start-6 lg:mt-0">
              <div className="photo aspect-video rounded-[11px] has-[button:focus-visible]:outline-2 has-[button:focus-visible]:outline-offset-4 has-[button:focus-visible]:outline-accent-solid md:rounded-[14px]">
                {provider ? (
                  <VideoLauncher
                    videoId={videoId}
                    provider={provider}
                    title={plainTitle}
                    locale={locale}
                  >
                    {poster}
                  </VideoLauncher>
                ) : (
                  poster
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoSection;
