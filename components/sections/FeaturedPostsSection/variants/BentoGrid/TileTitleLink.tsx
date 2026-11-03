import { stripStega } from '@datocms/content-link';
import Link from 'next/link';
import {
  buildUrl,
  type ResolvedGlobalPageProps,
} from '@/utils/globalPageProps';

type Props = {
  title: string;
  slug: string;
  globalPageProps: ResolvedGlobalPageProps;
};

/** A tile's post title: the link stretches over the whole tile and underlines on hover */
const TileTitleLink = ({ title, slug, globalPageProps }: Props) => (
  <Link
    href={buildUrl(globalPageProps, `/posts/${stripStega(slug)}`)}
    className="stretched-link flex underline decoration-transparent decoration-1 underline-offset-[3px] transition-[text-decoration-color] duration-200 [--stretched-offset:3px] [--stretched-radius:20px] group-hover:decoration-current"
  >
    <span className="line-clamp-2 text-pretty max-md:line-clamp-3">
      {title}
    </span>
  </Link>
);

export default TileTitleLink;
