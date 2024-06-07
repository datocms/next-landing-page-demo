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
    <div className="mt-10 lg:mt-20 lg:flex lg:items-center">
      <div className="relative h-96 w-full overflow-hidden rounded-lg object-cover object-center lg:w-[32rem]">
        <DatoImage
          layout="fill"
          objectFit="cover"
          objectPosition="80% 20%"
          fragment={reviewerPicture.responsiveImage}
        />
      </div>

      <div className="mt-8 lg:mt-0 lg:px-10">
        <div className="mt-6 max-w-lg text-gray-500 dark:text-gray-400">
          <StructuredTextField data={review} renderNode={Highlighter} />
        </div>

        <h3 className="mt-6 text-lg font-medium text-primary">
          {reviewerName}
        </h3>
        <p className="text-gray-600 dark:text-gray-300">{reviewerTitle}</p>
      </div>
    </div>
  );
};

export default Testimonial;
