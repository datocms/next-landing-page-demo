import type { ResponsiveImageFragment } from '@/components/datocms/DatoImage/fragment';
import type { FragmentOf } from '@/lib/datocms/graphql';

type Image = FragmentOf<typeof ResponsiveImageFragment>;

/** A plain, serialisable post: the server wrapper resolves fragments and hrefs */
export type SpotlightPost = {
  id: string;
  title: string;
  href: string;
  tag?: string | null;
  date?: string | null;
  description?: string | null;
  cover?: Image | null;
  author?: {
    name: string;
    bio?: string | null;
    href: string;
    picture?: Image | null;
  } | null;
};

/** Interface copy, resolved on the server for the page's locale */
export type SpotlightLabels = {
  /** Names the carousel when the section has no heading to point at */
  carousel: string;
  previous: string;
  next: string;
  readMore: string;
  /** Slide position, with {n} and {total} placeholders ("{n} of {total}") */
  slideOf: string;
  /** aria-roledescription of the carousel ("carousel") */
  carouselRole: string;
  /** aria-roledescription of each slide ("slide") */
  slideRole: string;
};
