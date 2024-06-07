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

const MinimalCarousel = ({ fragment }: Props) => {
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
    <section className="bg-primary/10 py-16 dark:bg-gray-900">
      <div className="container mx-auto flex flex-col items-center justify-center px-6 py-10">
        <h1 className="text-center text-2xl font-semibold capitalize text-gray-800 dark:text-white lg:text-3xl">
          {header}
        </h1>

        <Testimonial
          fragment={currentReview}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      </div>
    </section>
  );
};

export default MinimalCarousel;
