import Link from 'next/link';
import type { ResolvedGlobalPageProps } from '@/utils/globalPageProps';
import { postUrl } from '@/utils/routes';

type Props = {
  title: string;
  slug: string;
  globalPageProps: ResolvedGlobalPageProps;
};

/** A tile's post title: the link stretches over the whole tile and underlines on hover */
const TileTitleLink = ({ title, slug, globalPageProps }: Props) => (
  <Link
    href={postUrl(globalPageProps, slug)}
    className="stretched-link flex underline decoration-transparent decoration-1 underline-offset-[3px] transition-[text-decoration-color] duration-200 [--stretched-offset:3px] [--stretched-radius:20px] group-hover:decoration-current"
  >
    <span className="line-clamp-2 text-pretty max-md:line-clamp-3">
      {title}
    </span>
  </Link>
);

export default TileTitleLink;
