import { ButtonRecord, FileField } from '@/graphql/types/graphql';
import { Maybe } from 'graphql/jsutils/Maybe';
import { Image as DatoImage } from 'react-datocms';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';

type Props = {
  heroTitle: string;
  heroSubtitle: Maybe<string>;
  buttons: ButtonRecord[];
  image: Maybe<FileField> | undefined;
};

const SplitImage = ({ heroTitle, heroSubtitle, buttons, image }: Props) => {
  return (
    <div className="relative mt-24 flex flex-col-reverse py-16 lg:flex-col lg:pb-0 lg:pt-0">
      <div className="inset-y-0 right-0 top-0 z-0 mx-auto w-full max-w-xl px-4 md:px-0 lg:absolute lg:mx-0 lg:mb-0 lg:w-7/12 lg:max-w-full lg:pr-0 xl:px-0">
        <svg
          className="absolute left-0 z-50 hidden h-full -translate-x-1/2 transform text-white lg:block"
          viewBox="0 0 100 100"
          fill="currentColor"
          preserveAspectRatio="none slice"
        >
          <path d="M50 0H100L50 100H0L50 0Z" />
        </svg>
        {image?.responsiveImage && (
          <DatoImage
            className="hidden h-56 w-full rounded object-cover shadow-lg md:h-96 lg:block lg:h-full lg:rounded-none lg:shadow-none"
            layout="fill"
            objectFit="cover"
            objectPosition="left"
            data={image?.responsiveImage}
          />
        )}
      </div>
      <div className="relative mx-auto flex w-full max-w-xl flex-col items-start px-4 md:px-0 lg:max-w-screen-xl lg:px-8">
        <div className="mb-16 lg:my-40 lg:max-w-lg lg:pr-5">
          <h2 className="mb-5 font-sans text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl sm:leading-none">
            {heroTitle}
          </h2>
          <div className="mb-5 pr-5 text-base text-gray-700 md:text-lg">
            <ReactMarkdown>{heroSubtitle || ''}</ReactMarkdown>
          </div>
          <div className="flex items-center">
            {buttons.map((button) => {
              const primary =
                'hover:bg-primary/90 focus:shadow-outline mr-6 inline-flex h-12 items-center justify-center rounded bg-primary px-6 font-medium tracking-wide text-white shadow-md transition duration-200 focus:outline-none';
              const secondary =
                'hover:text-deep-purple-accent-700 inline-flex items-center font-semibold text-gray-800 transition-colors duration-200';
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
      </div>
    </div>
  );
};

export default SplitImage;
