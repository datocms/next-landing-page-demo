'use client';

import { type FragmentType, getFragmentData } from '@/graphql/types';
import { ReviewSectionFragmentDoc } from '@/graphql/types/graphql';
import { useState } from 'react';
import Testimonial from './Testimonial';

type Props = {
  fragment: FragmentType<typeof ReviewSectionFragmentDoc>;
};

const ModernCarousel = ({ fragment }: Props) => {
  const {
    reviews,
    reviewSectionHeader: header,
    reviewSectionSubheader: subheader,
  } = getFragmentData(ReviewSectionFragmentDoc, fragment);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % reviews.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? reviews.length - 1 : prevIndex - 1,
    );
  };

  const currentReview = reviews[currentIndex];

  return (
    <section className="bg-white py-16 dark:bg-gray-900">
      <div className="relative flex">
        <div className="min-h-screen lg:w-1/3" />
        <div className="mt-32 hidden h-[750px] w-3/4 rounded-xl bg-primary/10 dark:bg-gray-800 lg:block" />

        <div className="container mx-auto flex min-h-screen w-full flex-col justify-center px-6 py-10 lg:absolute lg:inset-x-0">
          <h1 className="text-2xl font-semibold capitalize text-gray-800 dark:text-white lg:text-3xl">
            {header}
          </h1>

          <Testimonial fragment={currentReview} />

          <div className="mt-12 flex items-center justify-between lg:justify-start">
            <button
              type="button"
              title="left arrow"
              className="rounded-full border p-2 text-gray-800 transition-colors duration-300 hover:bg-gray-100 rtl:-scale-x-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
              onClick={handlePrev}
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

            <button
              type="button"
              title="right arrow"
              className="rounded-full border p-2 text-gray-800 transition-colors duration-300 hover:bg-gray-100 rtl:-scale-x-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800 lg:mx-6"
              onClick={handleNext}
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
        </div>
      </div>
    </section>
  );
};

export default ModernCarousel;
