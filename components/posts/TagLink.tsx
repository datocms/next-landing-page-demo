import { stripStega } from '@datocms/content-link';
import type { ResolvedGlobalPageProps } from '@/utils/globalPageProps';
import { tagUrl } from '@/utils/routes';
import { TagPillLink } from './PostTags';

type Props = {
  /** Raw CMS tag name */
  tag: string;
  /** Raw CMS slug of the tag page */
  slug: string;
  globalPageProps: ResolvedGlobalPageProps;
};

/** A tag as a pale pill linking to its tag page, with a 44px hit area */
const TagLink = ({ tag, slug, globalPageProps }: Props) => (
  <TagPillLink href={tagUrl(globalPageProps, stripStega(slug))}>
    {tag}
  </TagPillLink>
);

export default TagLink;
