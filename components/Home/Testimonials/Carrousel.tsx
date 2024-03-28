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

const Carrousel = ({ reviews, header, subheader }: Props) => {
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
    <section className="mb-24 bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <main className="relative z-20 mt-8 w-full md:flex md:items-center xl:mt-12">
          <div className="absolute -z-10 w-full rounded-2xl bg-primary/70 md:h-96"></div>

          <div className="w-full rounded-2xl bg-primary p-6 md:flex md:items-center md:justify-evenly md:bg-transparent md:p-0 lg:px-12">
            <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-full object-cover object-center shadow-md md:mx-6 md:h-[32rem] md:w-80 md:rounded-2xl lg:h-[36rem] lg:w-[24rem]">
              <DatoImage
                layout="fill"
                objectFit="cover"
                objectPosition="50% 50%"
                data={currentReview.reviewerPicture.responsiveImage}
              />
            </div>

            <div className="mt-2 md:mx-6">
              <div>
                <p className="text-xl font-medium tracking-tight text-white">
                  {currentReview.reviewerName}
                </p>
                <p className="text-gray-300 ">{currentReview.reviewerTitle}</p>
              </div>

              <div className="mt-4 text-lg leading-relaxed text-white md:text-xl">
                <StructuredTextField
                  data={
                    currentReview.review.value as StructuredText<Record, Record>
                  }
                  renderNode={Highlighter}
                />
              </div>

              <div className="mt-6 flex items-center justify-between md:justify-start">
                <button
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
                    stroke-width="2"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>

                <button
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
            </div>
          </div>
        </main>
      </div>
    </section>
  );
};

export default Carrousel;
