import { type GlobalPageProps, buildUrl } from '@/utils/globalPageProps';
import Link from 'next/link';

type Props = {
  tag: string;
  globalPageProps: GlobalPageProps;
  slug: string;
};

const TagButton = ({ tag, globalPageProps, slug }: Props) => {
  return (
    <Link
      href={buildUrl(globalPageProps, `/posts/tag/${slug}`)}
      className="mb-3 mr-3 inline-flex items-center justify-center rounded-md bg-primary bg-opacity-10 px-4 py-2 text-body-color duration-300 hover:bg-opacity-100 hover:text-white"
    >
      {tag}
    </Link>
  );
};

export default TagButton;
