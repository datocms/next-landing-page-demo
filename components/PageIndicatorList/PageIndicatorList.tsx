import { SiteLocale } from '@/graphql/types/graphql';
import { buildUrl } from '@/utils/globalPageProps';
import type { GlobalPageProps } from '@/utils/globalPageProps';

type Props = {
  page: number;
  postCount: number;
  globalPageProps: GlobalPageProps;
};

const PageIndicatorList = ({ page, postCount, globalPageProps }: Props) => {
  const listOfPages = [];

  for (let i = 0; i * 9 < postCount; i++) {
    listOfPages.push(
      <li className="mx-1">
        <a
          href={
            i === 0
              ? buildUrl(globalPageProps, '/posts')
              : buildUrl(globalPageProps, `/posts/page/${i + 1}`)
          }
          className="flex h-9 min-w-[36px] items-center justify-center rounded-md bg-body-color bg-opacity-[15%] px-4 text-sm text-body-color transition hover:bg-primary hover:bg-opacity-100 hover:text-white"
        >
          {i + 1}
        </a>
      </li>,
    );
  }

  return (
    <>
      {listOfPages}
      {postCount >= page * 9 && (
        <li className="mx-1">
          <a
            href={buildUrl(globalPageProps, `/posts/page/${page + 1}`)}
            className="flex h-9 min-w-[36px] items-center justify-center rounded-md bg-body-color bg-opacity-[15%] px-4 text-sm text-body-color transition hover:bg-primary hover:bg-opacity-100 hover:text-white"
          >
            Next
          </a>
        </li>
      )}
    </>
  );
};

export default PageIndicatorList;
