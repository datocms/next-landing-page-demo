'use client';

import {
  AboutIntroModelIntroductionTextField,
  ImageFileField,
} from '@/graphql/generated';
import { isHeading, isParagraph } from 'datocms-structured-text-utils';
import { Maybe } from 'graphql/jsutils/Maybe';
import {
  Image as DatoImage,
  ResponsiveImageType,
  StructuredText,
  renderNodeRule,
} from 'react-datocms';
import { motion, useScroll, useTransform } from 'framer-motion';

type Props = {
  header: string;
  subheader: Maybe<string>;
  images: ImageFileField[];
  introduction: Maybe<AboutIntroModelIntroductionTextField>;
  preHeader: Maybe<string>;
};

const AboutIntro = ({
  header,
  subheader,
  images,
  introduction,
  preHeader,
}: Props) => {
  let [firstWord, ...restOfTheStringArray] = header.split(/\s+/);
  const restOfTheString = restOfTheStringArray.join(' ');
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '600%']);
  const x = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <div className="mx-auto mt-24 px-4 py-12 sm:max-w-xl md:max-w-full md:px-24 lg:max-w-screen-xl lg:px-8 lg:py-20">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.2 }}
        className="mb-10 max-w-xl sm:text-center md:mx-auto md:mb-12 lg:max-w-2xl"
      >
        <div>
          <p className="bg-teal-accent-400 mb-4 inline-block rounded-full px-3 py-px text-xs font-semibold uppercase tracking-wider text-primary ">
            {preHeader}
          </p>
        </div>
        <h2 className="mb-6 max-w-lg font-sans text-3xl font-bold leading-none tracking-tight text-gray-900 sm:text-4xl md:mx-auto">
          <span className="relative inline-block text-primary">
            <motion.svg
              style={{ y, x }}
              viewBox="0 0 52 24"
              fill="currentColor"
              className="text-blue-gray-100 absolute left-0 top-0 z-0 -ml-20 -mt-8 hidden w-32 sm:block lg:-ml-28 lg:-mt-10 lg:w-32"
            >
              <defs>
                <pattern
                  id="2feffae2-9edf-414e-ab8c-f0e6396a0fc1"
                  x="0"
                  y="0"
                  width=".135"
                  height=".30"
                >
                  <circle cx="1" cy="1" r=".7" />
                </pattern>
              </defs>
              <rect
                fill="url(#2feffae2-9edf-414e-ab8c-f0e6396a0fc1)"
                width="52"
                height="24"
              />
            </motion.svg>
            <span className="relative text-gray-700">{firstWord}</span>
          </span>{' '}
          {restOfTheString}
        </h2>
        <p className="text-base text-gray-700 md:text-lg">{subheader}</p>
      </motion.div>
      <div className="grid max-w-screen-lg gap-8 sm:mx-auto lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ ease: 'easeOut', duration: 0.5, delay: 0.6 }}
          className="grid grid-cols-2 gap-5 shadow-2xl drop-shadow-2xl"
        >
          <div className="relative z-50 col-span-2 h-56 w-full rounded object-cover shadow-lg">
            {
              // I can narrow down the type of the data prop to ResponsiveImageType because i know from
              // Dato's validation that the array will have exactly 3 images
            }
            <DatoImage
              key={images[0].id}
              data={images[0].responsiveImage as ResponsiveImageType}
              className="h-full w-full object-contain"
              layout="fill"
              objectFit="cover"
              objectPosition="50% 50%"
            />
          </div>
          <div className="relative h-48 w-full rounded object-cover shadow-lg">
            <DatoImage
              key={images[1].id}
              data={images[1].responsiveImage as ResponsiveImageType}
              className="h-full w-full object-contain"
              layout="fill"
              objectFit="cover"
              objectPosition="50% 50%"
            />
          </div>
          <div className="relative h-48 w-full rounded object-cover shadow-lg">
            <DatoImage
              key={images[2].id}
              data={images[2].responsiveImage as ResponsiveImageType}
              className="h-full w-full object-contain"
              layout="fill"
              objectFit="cover"
              objectPosition="50% 50%"
            />
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ ease: 'easeOut', duration: 0.3, delay: 1 }}
          className="z-0 flex flex-col justify-center"
        >
          {introduction && (
            <StructuredText
              data={introduction.value}
              customNodeRules={[
                renderNodeRule(isHeading, ({ children, key }) => {
                  return (
                    <h3
                      className="mb-2 mt-4 text-lg font-semibold leading-5"
                      key={key}
                    >
                      {children}
                    </h3>
                  );
                }),
                renderNodeRule(isParagraph, ({ children, key }) => {
                  return (
                    <div className="mb-4 text-sm text-body-color" key={key}>
                      {children}
                    </div>
                  );
                }),
              ]}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AboutIntro;
