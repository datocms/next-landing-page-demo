import ScrollUp from '@/components/Common/ScrollUp';
import Sections from '@/components/Sections/Sections';
import { homeQuery } from '@/queries/home';
import queryDatoCMS from '@/utils/queryDatoCMS';

export default async function Home() {
  const { home } = await queryDatoCMS(homeQuery);

  return (
    <>
      <ScrollUp />
      <Sections sections={home.sections} />
    </>
  );
}
