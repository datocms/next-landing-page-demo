'use client';

import DatoImage from '@/components/DatoImage';
import Highlighter from '@/components/Highlighter';
import { type FragmentType, getFragmentData } from '@/graphql/types';
import { ReviewSectionFragmentDoc } from '@/graphql/types/graphql';
import { useState } from 'react';
import { StructuredText as StructuredTextField } from 'react-datocms/structured-text';
import Testimonial from './Testimonial';

type Props = {
  fragment: FragmentType<typeof ReviewSectionFragmentDoc>;
};

const Carousel = ({ fragment }: Props) => {
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
    <section className="mb-24 bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <main className="relative z-20 mt-8 w-full md:flex md:items-center xl:mt-12">
          <div className="absolute -z-10 w-full rounded-2xl bg-primary/70 md:h-96" />

          <Testimonial fragment={currentReview}>
            <button
              type="button"
              onClick={handlePrev}
              title="left arrow"
              className="rounded-full border p-2 text-white transition-colors duration-300 hover:bg-primary/80 rtl:-scale-x-100"
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
              onClick={handleNext}
              title="right arrow"
              className="rounded-full border p-2 text-white transition-colors duration-300 hover:bg-primary/80 rtl:-scale-x-100 md:mx-6"
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
          </Testimonial>
        </main>
      </div>
    </section>
  );
};

export default Carousel;
