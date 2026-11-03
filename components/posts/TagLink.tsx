import { stripStega } from '@datocms/content-link';
import Link from 'next/link';
import { cn } from '@/utils/cn';
import {
  buildUrl,
  type ResolvedGlobalPageProps,
} from '@/utils/globalPageProps';
import { TONES, toneIndex } from '@/utils/tones';

type Props = {
  /** Raw CMS tag (stega kept for visual editing); its tone is hashed on the visible text */
  tag: string;
  /** Raw CMS slug of the tag page */
  slug: string;
  globalPageProps: ResolvedGlobalPageProps;
};

/**
 * A tag chip (28px) linking to its tag page. Its tone is hashed from the tag
 * text, so it matches the chips on the post cards and the dot on the tag page
 * header. `a.chip` already adds the 44px coarse-pointer hit area.
 */
const TagLink = ({ tag, slug, globalPageProps }: Props) => {
  return (
    <Link
      href={buildUrl(globalPageProps, `/posts/tag/${stripStega(slug)}`)}
      className={cn('chip h-7 pr-3 pl-2.5 text-[13px]', TONES[toneIndex(tag)])}
    >
      {tag}
    </Link>
  );
};

export default TagLink;
