import { TestimonialRecord } from '@/graphql/generated';
import { Image as DatoImage } from 'react-datocms';
import { StructuredText } from 'react-datocms/structured-text';
const starIcon = (
  <svg width="18" height="16" viewBox="0 0 18 16" className="fill-current">
    <path d="M9.09815 0.361679L11.1054 6.06601H17.601L12.3459 9.59149L14.3532 15.2958L9.09815 11.7703L3.84309 15.2958L5.85035 9.59149L0.595291 6.06601H7.0909L9.09815 0.361679Z" />
  </svg>
);

type Props = {
  testimonial: TestimonialRecord;
};

const SingleTestimonial = ({ testimonial }: Props) => {
  const { rating, reviewerName, reviewerPicture, review, reviewerTitle } =
    testimonial;

  let ratingIcons = [];
  for (let index = 0; index < rating; index++) {
    ratingIcons.push(
      <span key={index} className="text-yellow">
        {starIcon}
      </span>
    );
  }

  return (
    <div className="h-96 w-full">
      <div className="flex h-full flex-col items-center justify-center rounded-md bg-white p-8 shadow-one dark:bg-[#1D2144] lg:items-start lg:px-5 xl:px-8">
        <div className="mb-5 flex items-center space-x-1">{ratingIcons}</div>
        <div className="mb-8 h-36 border-b border-body-color border-opacity-10 pb-8 text-base leading-relaxed text-body-color dark:border-white dark:border-opacity-10 dark:text-white">
          <StructuredText data={review.value} />
        </div>
        <div className="flex w-96 items-center px-16 md:w-full md:px-4 lg:px-0">
          <div className="relative mr-4 h-[50px] w-full max-w-[50px] overflow-hidden rounded-full">
            <DatoImage
              data={reviewerPicture.responsiveImage}
              className="h-full w-full object-contain"
              layout="fill"
              objectFit="cover"
              objectPosition="50% 50%"
            />
          </div>
          <div className="w-full">
            <h5 className="mb-1 text-lg font-semibold text-dark dark:text-white lg:text-base xl:text-lg">
              {reviewerName}
            </h5>
            <p className="text-sm text-body-color">{reviewerTitle}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleTestimonial;
