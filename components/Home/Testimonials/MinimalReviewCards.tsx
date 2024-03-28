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

const MinimalReviewCards = ({ reviews, header, subheader }: Props) => {
  return (
    <div className="bg-white py-16 sm:py-8 lg:py-12">
      <div className="mx-auto max-w-screen-xl px-4 md:px-8">
        <h2 className="mb-8 text-center text-2xl font-bold text-gray-800 md:mb-12 lg:text-3xl">
          {header}
        </h2>

        <div className="grid gap-4 md:grid-cols-3 md:gap-8">
          {reviews.map((review) => {
            return (
              <div
                key={review.id}
                className="flex flex-col items-center justify-between gap-4 rounded-lg bg-primary/80 px-8 py-6 md:gap-6"
              >
                <div className="max-w-md text-center text-white lg:text-lg">
                  <StructuredTextField
                    data={review.review.value as StructuredText<Record, Record>}
                    renderNode={Highlighter}
                  />
                </div>

                <div className="flex flex-col items-center gap-2 sm:flex-row md:gap-3">
                  <div className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-indigo-100 bg-gray-100 md:h-14 md:w-14">
                    <DatoImage
                      layout="fill"
                      objectFit="cover"
                      objectPosition="80% 20%"
                      data={review.reviewerPicture.responsiveImage}
                    />
                  </div>

                  <div>
                    <div className="text-center text-sm font-bold text-indigo-50 sm:text-left md:text-base">
                      {review.reviewerName}
                    </div>
                    <p className="text-center text-sm text-indigo-200 sm:text-left md:text-sm">
                      {review.reviewerTitle}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MinimalReviewCards;
