'use client';

import { ButtonRecord, FileField } from '@/graphql/types/graphql';
import { Maybe } from 'graphql/jsutils/Maybe';
import Link from 'next/link';
import { delay, motion } from 'framer-motion';
import { Image as DatoImage } from 'react-datocms';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';

type Props = {
  heroTitle: string;
  heroSubtitle: Maybe<string>;
  buttons: ButtonRecord[];
  image: Maybe<FileField> | undefined;
};

const RightImageHero = ({ heroTitle, heroSubtitle, buttons, image }: Props) => {
  return (
    <div className="mt-40 bg-white pb-6 sm:pb-8 lg:pb-12">
      <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
        <section className="flex flex-col justify-between gap-6 sm:gap-10 md:gap-16 lg:flex-row">
          <div className="flex flex-col items-start sm:text-center lg:py-12 lg:text-left xl:w-10/12 xl:py-24 ">
            <h1 className="mb-8 text-4xl font-bold text-black sm:text-5xl md:mb-12 md:text-6xl">
              {heroTitle}
            </h1>

            <div className="mb-8 leading-relaxed text-gray-500 md:mb-12 lg:w-4/5 xl:text-lg">
              <ReactMarkdown>{heroSubtitle || ''}</ReactMarkdown>
            </div>

            <div className="flex w-full flex-row items-center justify-center gap-2.5 sm:justify-center lg:justify-start">
              {buttons.map((button) => {
                const primary =
                  'inline-block rounded-lg bg-primary/90 px-8 py-3 text-center text-sm font-semibold text-white outline-none ring-indigo-300 transition duration-100 hover:bg-indigo-600 focus-visible:ring active:bg-indigo-700 md:text-base';
                const secondary =
                  'inline-block rounded-lg bg-gray-200 px-8 py-3 text-center text-sm font-semibold text-gray-500 outline-none ring-indigo-300 transition duration-100 hover:bg-gray-300 focus-visible:ring active:text-gray-700 md:text-base';
                return (
                  <a
                    key={button.id}
                    href={button.url || '#'}
                    className={button.primary ? primary : secondary}
                  >
                    {button.label}
                  </a>
                );
              })}
            </div>
          </div>

          {image && image.responsiveImage && (
            <div className="relative w-3/5 overflow-hidden rounded-lg bg-gray-100 shadow-lg lg:h-auto">
              <DatoImage
                data={image.responsiveImage}
                layout="fill"
                objectFit="cover"
                objectPosition="50% 50%"
              />
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default RightImageHero;
