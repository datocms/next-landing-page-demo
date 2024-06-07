import DatoImage from '@/components/DatoImage';
import Highlighter from '@/components/Highlighter';
import { type FragmentType, getFragmentData } from '@/graphql/types';
import { TestimonialFragmentDoc } from '@/graphql/types/graphql';
import { StructuredText as StructuredTextField } from 'react-datocms/structured-text';

type Props = {
  fragment: FragmentType<typeof TestimonialFragmentDoc>;
};

const Testimonial = ({ fragment }: Props) => {
  const { rating, reviewerName, reviewerPicture, review, reviewerTitle } =
    getFragmentData(TestimonialFragmentDoc, fragment);

  return (
    <div className="flex flex-col items-center justify-between gap-4 rounded-lg bg-primary/80 px-8 py-6 md:gap-6">
      <div className="max-w-md text-center text-white lg:text-lg">
        <StructuredTextField data={review} renderNode={Highlighter} />
      </div>

      <div className="flex flex-col items-center gap-2 sm:flex-row md:gap-3">
        <div className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-indigo-100 bg-gray-100 md:h-14 md:w-14">
          <DatoImage
            layout="fill"
            objectFit="cover"
            objectPosition="80% 20%"
            fragment={reviewerPicture.responsiveImage}
          />
        </div>

        <div>
          <div className="text-center text-sm font-bold text-indigo-50 sm:text-left md:text-base">
            {reviewerName}
          </div>
          <p className="text-center text-sm text-indigo-200 sm:text-left md:text-sm">
            {reviewerTitle}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Testimonial;
