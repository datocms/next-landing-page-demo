import Link from 'next/link';
import { cn } from '@/utils/cn';
import type { ResolvedGlobalPageProps } from '@/utils/globalPageProps';
import { tagUrl } from '@/utils/routes';
import { toneClassFor } from '@/utils/tones';

type Props = {
  /** Raw CMS tag (stega kept for visual editing); its tone is hashed on the visible text */
  tag: string;
  /** Raw CMS slug of the tag page */
  slug: string;
  globalPageProps: ResolvedGlobalPageProps;
};

/**
 * A tag chip linking to its tag page. Its tone is hashed from the tag
 * text, so it matches the chips on the post cards and the dot on the tag page
 * header. `a.chip` already adds the 44px coarse-pointer hit area.
 */
const TagLink = ({ tag, slug, globalPageProps }: Props) => {
  return (
    <Link
      href={tagUrl(globalPageProps, slug)}
      className={cn('chip h-7 pr-3 pl-2.5 text-[13px]', toneClassFor(tag))}
    >
      {tag}
    </Link>
  );
};

export default TagLink;
