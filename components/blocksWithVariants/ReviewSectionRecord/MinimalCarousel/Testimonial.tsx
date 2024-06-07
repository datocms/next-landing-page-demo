import DatoImage from '@/components/DatoImage';
import Highlighter from '@/components/Highlighter';
import { type FragmentType, getFragmentData } from '@/graphql/types';
import { TestimonialFragmentDoc } from '@/graphql/types/graphql';
import { ReactNode } from 'react';
import { StructuredText as StructuredTextField } from 'react-datocms/structured-text';

type Props = {
  fragment: FragmentType<typeof TestimonialFragmentDoc>;
  onPrev: () => void;
  onNext: () => void;
};

const Testimonial = ({ fragment, onPrev, onNext }: Props) => {
  const { reviewerName, reviewerPicture, review, reviewerTitle } =
    getFragmentData(TestimonialFragmentDoc, fragment);

  return (
    <>
      <div className="mx-auto mt-6 flex justify-center">
        <span className="inline-block h-1 w-40 rounded-full bg-primary" />
        <span className="mx-1 inline-block h-1 w-3 rounded-full bg-primary" />
        <span className="inline-block h-1 w-1 rounded-full bg-primary" />
      </div>
      <div className="mx-auto mt-16 flex w-full max-w-6xl flex-row items-center justify-center text-center">
        <button
          type="button"
          title="left arrow"
          className="rounded-full border p-2 text-gray-800 transition-colors duration-300 hover:bg-gray-100 rtl:-scale-x-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800 lg:block"
          onClick={onPrev}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <div className="flex items-center text-center text-gray-500 lg:mx-8">
          <StructuredTextField data={review} renderNode={Highlighter} />
        </div>
        <button
          type="button"
          title="right arrow"
          className="rounded-full border p-2 text-gray-800 transition-colors duration-300 hover:bg-gray-100 rtl:-scale-x-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800 lg:block"
          onClick={onNext}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
      <div className="mt-8 flex flex-col items-center justify-center">
        <div className="relative h-14 w-14 overflow-hidden rounded-full">
          <DatoImage
            layout="fill"
            objectFit="cover"
            objectPosition="80% 20%"
            fragment={reviewerPicture.responsiveImage}
          />
        </div>

        <div className="mt-4 text-center">
          <h1 className="font-semibold text-gray-800 dark:text-white">
            {reviewerName}
          </h1>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {reviewerTitle}
          </span>
        </div>
      </div>
    </>
  );
};

export default Testimonial;
