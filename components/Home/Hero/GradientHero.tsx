'use client';

import { ButtonRecord } from '@/graphql/types/graphql';
import { Maybe } from 'graphql/jsutils/Maybe';
import Link from 'next/link';
import { delay, motion } from 'framer-motion';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';

type Props = {
  heroTitle: string;
  heroSubtitle: Maybe<string>;
  buttons: ButtonRecord[];
};

const GradientHero = ({ heroTitle, heroSubtitle, buttons }: Props) => {
  const heroTitleWords = heroTitle.split(/\s+/);
  const lastWord = heroTitleWords.pop();

  return (
    <section className="relative overflow-hidden">
      {/* Illustration behind hero content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="-z-1 pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 transform"
        aria-hidden="true"
      >
        <svg
          width="1360"
          height="578"
          viewBox="0 0 1360 578"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient
              x1="50%"
              y1="0%"
              x2="50%"
              y2="100%"
              id="illustration-01"
            >
              <stop stopColor="#FFF" offset="0%" />
              <stop stopColor="#EAEAEA" offset="77.402%" />
              <stop stopColor="#DFDFDF" offset="100%" />
            </linearGradient>
          </defs>
          <g fill="url(#illustration-01)" fillRule="evenodd">
            <circle cx="1232" cy="128" r="128" />
            <circle cx="155" cy="443" r="64" />
          </g>
        </svg>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="mx-auto max-w-4xl px-4 sm:px-6"
      >
        {/* Hero content */}
        <div className="pb-12 pt-32 md:pb-20 md:pt-40">
          <div className="pb-12 text-center md:pb-16">
            <h1
              className="leading-tighter mb-4 text-6xl font-extrabold tracking-tighter md:text-8xl"
              data-aos="zoom-y-out"
            >
              {heroTitleWords.join(' ')}{' '}
              <span className="bg-gradient-to-r from-primary to-teal-400 bg-clip-text text-transparent">
                {lastWord}
              </span>
            </h1>
            <div className="mx-auto max-w-3xl">
              <div
                className="mb-8 text-xl text-gray-600"
                data-aos="zoom-y-out"
                data-aos-delay="150"
              >
                <ReactMarkdown>{heroSubtitle || ''}</ReactMarkdown>
              </div>
              <div
                className="mx-auto flex max-w-xs flex-col justify-center sm:max-w-none sm:flex-row"
                data-aos="zoom-y-out"
                data-aos-delay="300"
              >
                {buttons.map((button) => {
                  const primary =
                    'mb-4 w-full cursor-pointer rounded-lg bg-gradient-to-r from-primary to-teal-400 p-4 text-xl font-bold text-white transition-all hover:opacity-80 sm:mb-0 sm:w-auto';
                  const secondary =
                    'btn -md w-full cursor-pointer rounded bg-gray-900 p-4 text-xl text-white transition-all hover:bg-gray-700 sm:ml-4 sm:w-auto';

                  return (
                    <Link
                      key={button.id}
                      href={button.url || '#'}
                      className={button.primary ? primary : secondary}
                      id={button.id}
                    >
                      {button.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default GradientHero;
