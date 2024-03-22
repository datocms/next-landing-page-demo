'use client';

import { useState } from 'react';
import SectionTitle from '../../Common/SectionTitle';

import ModalVideo from 'react-modal-video';
import { Maybe } from 'graphql/jsutils/Maybe';
import { ImageFileField } from '@/graphql/types/graphql';
import { Image as DatoImage } from 'react-datocms';
import Image from 'next/image';

type Props = {
  videoHeader: string;
  videoSubheader: Maybe<string>;
  videoUid: string;
  videoThumbnail: ImageFileField;
  videoProvider: string;
};

const Video = ({
  videoHeader,
  videoSubheader,
  videoUid,
  videoThumbnail,
  videoProvider,
}: Props) => {
  const [isOpen, setOpen] = useState(false);

  return (
    <section className="relative z-10 py-16 md:py-20 lg:py-28">
      <div className="container">
        <SectionTitle
          title={videoHeader}
          paragraph={videoSubheader}
          center
          mb="80px"
        />

        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4">
            <div className="mx-auto max-w-[1024px] overflow-hidden rounded-md">
              <div className="relative aspect-[77/40] items-center justify-center">
                <DatoImage
                  className="h-full w-full object-cover"
                  layout="fill"
                  objectFit="cover"
                  objectPosition="top"
                  data={videoThumbnail.responsiveImage}
                />
                <div className="absolute right-0 top-0 flex h-full w-full items-center justify-center">
                  <button
                    onClick={() => setOpen(true)}
                    className="flex h-[70px] w-[70px] items-center justify-center rounded-full bg-white bg-opacity-75 text-primary transition hover:bg-opacity-100"
                  >
                    <svg
                      width="16"
                      height="18"
                      viewBox="0 0 16 18"
                      className="fill-current"
                    >
                      <path d="M15.5 8.13397C16.1667 8.51888 16.1667 9.48112 15.5 9.86602L2 17.6603C1.33333 18.0452 0.499999 17.564 0.499999 16.7942L0.5 1.20577C0.5 0.43597 1.33333 -0.0451549 2 0.339745L15.5 8.13397Z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ModalVideo
        isOpen={isOpen}
        videoId={videoUid}
        onClose={() => setOpen(false)}
      />

      <div className="absolute bottom-0 left-0 right-0 z-[-1]">
        <Image
          fill
          src="/images/video/shape.svg"
          alt="shape"
          className="w-full"
        />
      </div>
    </section>
  );
};

export default Video;
