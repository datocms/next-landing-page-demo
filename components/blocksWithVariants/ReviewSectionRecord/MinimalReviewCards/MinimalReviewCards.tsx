import DatoImage from '@/components/DatoImage';
import Highlighter from '@/components/Highlighter';
import { type FragmentType, getFragmentData } from '@/graphql/types';
import { ReviewSectionFragmentDoc } from '@/graphql/types/graphql';
import { StructuredText as StructuredTextField } from 'react-datocms/structured-text';
import Testimonial from './Testimonial';

type Props = {
  fragment: FragmentType<typeof ReviewSectionFragmentDoc>;
};

const MinimalReviewCards = ({ fragment }: Props) => {
  const {
    reviews,
    reviewSectionHeader: header,
    reviewSectionSubheader: subheader,
  } = getFragmentData(ReviewSectionFragmentDoc, fragment);
  return (
    <div className="bg-white py-16 sm:py-8 lg:py-12">
      <div className="mx-auto max-w-screen-xl px-4 md:px-8">
        <h2 className="mb-8 text-center text-2xl font-bold text-gray-800 md:mb-12 lg:text-3xl">
          {header}
        </h2>

        <div className="grid gap-4 md:grid-cols-3 md:gap-8">
          {reviews.map((review) => (
            <Testimonial key={review.id} fragment={review} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MinimalReviewCards;
