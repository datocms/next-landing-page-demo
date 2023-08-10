import Image from 'next/image';
import SvgRenderer from '../Common/SvgRenderer';

function formatNumber(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  } else {
    return num.toString();
  }
}

const StatsSection = ({ title, subtitle, statistic }) => {
  return (
    <section className="body-font text-gray-600">
      <div className="container mx-auto px-5 py-24">
        <div className="mb-20 flex w-full flex-col text-center">
          <h1 className="title-font mb-4 text-2xl font-semibold text-gray-900 sm:text-4xl">
            {title}
          </h1>
          <p className="mx-auto text-base leading-relaxed lg:w-2/3">
            {subtitle}
          </p>
        </div>
        <div className="-m-4 flex flex-wrap text-center">
          {statistic.map((stat) => {
            return (
              <div className="w-full p-4 text-primary sm:w-1/2 md:w-1/4">
                <div className="flex flex-col items-center justify-center rounded-lg border-2 border-gray-200 px-4 py-6 text-center text-primary">
                  <div className="mb-4 h-24 w-24 text-primary">
                    <SvgRenderer url={stat.icon.url} />
                  </div>
                  <h2 className="title-font text-3xl font-medium text-gray-800">
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
