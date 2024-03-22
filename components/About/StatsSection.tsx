import SvgRenderer from '../Common/SvgRenderer';
import { StatisticRecord } from '@/graphql/types/graphql';
import { Maybe } from 'graphql/jsutils/Maybe';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';

function formatNumber(num: number) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  } else {
    return num.toString();
  }
}

type Props = {
  title: string;
  subtitle: Maybe<string>;
  statistic: Array<StatisticRecord>;
};

const StatsSection = ({ title, subtitle, statistic }: Props) => {
  return (
    <section className="body-font flex flex-col items-center justify-center text-gray-600">
      <div className="container mx-auto px-5 py-4 md:py-12">
        <div className="flex w-full flex-col pb-12 text-center">
          <h1 className="title-font mb-4 text-2xl font-semibold text-gray-900 sm:text-4xl">
            {title}
          </h1>
          <div className="mx-auto text-base leading-relaxed lg:w-2/3">
            <ReactMarkdown>{subtitle || ''}</ReactMarkdown>
          </div>
        </div>
        <div className="-m-4 flex flex-col flex-wrap items-center justify-center text-center md:flex-row">
          {statistic.map((stat) => {
            return (
              <div key={stat.id} className="w-4/5 p-4 text-primary md:w-1/4">
                <div className="flex flex-col items-center justify-center rounded-lg border-2 border-gray-200 px-4 py-6 text-center text-primary">
                  <div className="mb-4 h-24 w-24 text-primary">
                    <SvgRenderer url={stat.icon.url} />
                  </div>
                  <h2 className="title-font mt-8 text-3xl font-medium text-gray-800">
                    {formatNumber(stat.quantity)}
                  </h2>
                  <p className="leading-relaxed text-gray-500">{stat.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
