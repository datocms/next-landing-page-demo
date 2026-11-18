import {
  type FragmentOf,
  type ResultOf,
  readFragment,
} from '@/lib/datocms/graphql';
import { type ReviewSectionFragment, TestimonialFragment } from './fragment';

/** The reviews of a block, as every layout receives them */
export type Reviews = ResultOf<typeof ReviewSectionFragment>['testimonials'];

/** One testimonial's fields, unmasked */
export const readTestimonial = (
  review: FragmentOf<typeof TestimonialFragment>,
) => readFragment(TestimonialFragment, review);
