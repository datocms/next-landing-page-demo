'use client';
import DatoImage from '@/components/DatoImage';
import { type FragmentType, getFragmentData } from '@/graphql/types';
import {
  FeaturedPostsSectionFragmentDoc,
  PostExcerptFragmentDoc,
} from '@/graphql/types/graphql';
import { type GlobalPageProps, buildUrl } from '@/utils/globalPageProps';
import Link from 'next/link';
import { useState } from 'react';

type Props = {
  fragment: FragmentType<typeof FeaturedPostsSectionFragmentDoc>;
  globalPageProps: GlobalPageProps;
};

const CarouselFeaturedPosts = ({ fragment, globalPageProps }: Props) => {
  const {
    featuredPosts: blogData,
    featuredPostsHeader: blogHeader,
    featuredPostsSubheader: blogSubheader,
  } = getFragmentData(FeaturedPostsSectionFragmentDoc, fragment);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % blogData.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? blogData.length - 1 : prevIndex - 1,
    );
  };

  const currentReview = getFragmentData(
    PostExcerptFragmentDoc,
    blogData[currentIndex],
  );

  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="container mx-auto px-6 py-10">
        <h1 className="text-2xl font-semibold capitalize text-gray-800 dark:text-white lg:text-3xl">
          {blogHeader}
        </h1>

        <div className="mt-8 lg:-mx-6 lg:flex lg:items-center">
          {currentReview.seoTags?.image?.responsiveImage && (
            <div className="relative h-72 w-full overflow-hidden rounded-xl object-cover lg:mx-6 lg:h-96 lg:w-1/2">
              <DatoImage
                layout="fill"
                objectFit="cover"
                objectPosition="50% 20%"
                fragment={currentReview.seoTags?.image?.responsiveImage}
              />
            </div>
          )}

          <div className="mt-6 lg:mx-6 lg:mt-0 lg:w-1/2">
            <p className="text-sm uppercase text-blue-500">
              {currentReview.tags[0].tag}
            </p>

            <a
              href="#"
              className="mt-4 block text-2xl font-semibold text-gray-800 hover:underline dark:text-white"
            >
              {currentReview.title}
            </a>

            <p className="mt-3 text-sm text-gray-500 dark:text-gray-300 md:text-sm">
              {currentReview.seoTags?.description}
            </p>

            <Link
              href={buildUrl(globalPageProps, `/posts/${currentReview.slug}`)}
              className="mt-2 inline-block text-blue-500 underline hover:text-blue-400"
            >
              Read more
            </Link>

            <div className="mt-6 flex items-center">
              <div className="relative h-10 w-10 overflow-hidden rounded-full object-cover object-center">
                <DatoImage
                  layout="fill"
                  objectFit="cover"
                  objectPosition="50% 20%"
                  fragment={currentReview.author.picture.responsiveImage}
                />
              </div>
              <div className="mx-4">
                <h1 className="text-sm text-gray-700 dark:text-gray-200">
                  {currentReview.author.name}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {currentReview.author.bio}
                </p>
              </div>
            </div>
            <div className="mt-8">
              <button
                type="button"
                onClick={handlePrev}
                title="left arrow"
                className="rounded-full border p-2 text-black transition-colors duration-300 hover:bg-primary/80 rtl:-scale-x-100"
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
                className="rounded-full border p-2 text-black transition-colors duration-300 hover:bg-primary/80 rtl:-scale-x-100 md:mx-6"
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
      </div>
    </section>
  );
};

export default CarouselFeaturedPosts;
