"use client";

import { TestimonialRecord } from "@/graphql/types/graphql";
import { Maybe } from "graphql/jsutils/Maybe";
import { StructuredText as StructuredTextField } from "react-datocms/structured-text";
import { Image as DatoImage } from "react-datocms";
import { useState } from "react";
import Highlighter from "@/components/Common/Highlighter";
import { Record, StructuredText } from "datocms-structured-text-utils";

type Props = {
  reviews: TestimonialRecord[];
  header: string;
  subheader: Maybe<string>;
};

const MinimalCarrousel = ({ reviews, header, subheader }: Props) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % reviews.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? reviews.length - 1 : prevIndex - 1
    );
  };

  const currentReview = reviews[currentIndex];

  return (
    <section className="bg-primary/10 py-16 dark:bg-gray-900">
      <div className="container mx-auto flex flex-col items-center justify-center px-6 py-10">
        <h1 className="text-center text-2xl font-semibold capitalize text-gray-800 dark:text-white lg:text-3xl">
          {header}
        </h1>

        <div className="mx-auto mt-6 flex justify-center">
          <span className="inline-block h-1 w-40 rounded-full bg-primary"></span>
          <span className="mx-1 inline-block h-1 w-3 rounded-full bg-primary"></span>
          <span className="inline-block h-1 w-1 rounded-full bg-primary"></span>
        </div>

        <div className="mx-auto mt-16 flex w-full max-w-6xl flex-row items-center justify-center text-center">
          <button
            title="left arrow"
            className="rounded-full border p-2 text-gray-800 transition-colors duration-300 hover:bg-gray-100 rtl:-scale-x-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800 lg:block"
            onClick={handlePrev}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <div className="flex items-center text-center text-gray-500 lg:mx-8">
            <StructuredTextField
              data={
                currentReview.review.value as StructuredText<Record, Record>
              }
              renderNode={Highlighter}
            />
          </div>
          <button
            title="right arrow"
            className="rounded-full border p-2 text-gray-800 transition-colors duration-300 hover:bg-gray-100 rtl:-scale-x-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800 lg:block"
            onClick={handleNext}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
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
              data={currentReview.reviewerPicture.responsiveImage}
            />
          </div>

          <div className="mt-4 text-center">
            <h1 className="font-semibold text-gray-800 dark:text-white">
              {currentReview.reviewerName}
            </h1>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {currentReview.reviewerTitle}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MinimalCarrousel;
