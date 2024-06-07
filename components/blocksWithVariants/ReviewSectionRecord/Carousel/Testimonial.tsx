import DatoImage from '@/components/DatoImage';
import Highlighter from '@/components/Highlighter';
import { type FragmentType, getFragmentData } from '@/graphql/types';
import { TestimonialFragmentDoc } from '@/graphql/types/graphql';
import type { ReactNode } from 'react';
import { StructuredText as StructuredTextField } from 'react-datocms/structured-text';

type Props = {
  fragment: FragmentType<typeof TestimonialFragmentDoc>;
  children: ReactNode;
};

const Testimonial = ({ fragment, children }: Props) => {
  const { reviewerName, reviewerPicture, review, reviewerTitle } =
    getFragmentData(TestimonialFragmentDoc, fragment);

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <main className="relative z-20 mt-8 w-full md:flex md:items-center xl:mt-12">
        <div className="absolute -z-10 w-full rounded-2xl bg-primary/70 md:h-96" />

        <div className="w-full rounded-2xl bg-primary p-6 md:flex md:items-center md:justify-evenly md:bg-transparent md:p-0 lg:px-12">
          <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-full object-cover object-center shadow-md md:mx-6 md:h-[32rem] md:w-80 md:rounded-2xl lg:h-[36rem] lg:w-[24rem]">
            <DatoImage
              layout="fill"
              objectFit="cover"
              objectPosition="50% 50%"
              fragment={reviewerPicture.responsiveImage}
            />
          </div>

          <div className="mt-2 md:mx-6">
            <div>
              <p className="text-xl font-medium tracking-tight text-white">
                {reviewerName}
              </p>
              <p className="text-gray-300 ">{reviewerTitle}</p>
            </div>

            <div className="mt-4 text-lg leading-relaxed text-white md:text-xl">
              <StructuredTextField data={review} renderNode={Highlighter} />
            </div>

            <div className="mt-6 flex items-center justify-between md:justify-start">
              {children}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Testimonial;
