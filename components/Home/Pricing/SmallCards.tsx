import { PricingTierRecord } from '@/graphql/types/graphql';
import { Maybe } from 'graphql/jsutils/Maybe';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';

type Props = {
  header: string;
  subheader: Maybe<string>;
  plans: PricingTierRecord[];
};

const SmallCards = ({ header, subheader, plans }: Props) => {
  return (
    <div className="bg-white dark:bg-gray-900">
      <div className="container mx-auto px-6 py-8">
        <h1 className="text-center text-2xl font-semibold capitalize text-gray-800 dark:text-white lg:text-3xl">
          {header}
        </h1>

        <div className="mx-auto mt-4 max-w-2xl text-center text-gray-500 dark:text-gray-300 xl:mt-6">
          <ReactMarkdown>{subheader || ''}</ReactMarkdown>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:mt-12 xl:gap-12">
          {plans.map((plan) => {
            return (
              <div
                key={plan.id}
                className="w-full space-y-8 rounded-lg border border-gray-200 p-8 text-center dark:border-gray-700"
              >
                <p className="font-medium uppercase text-gray-500 dark:text-gray-300">
                  {plan.tierName}
                </p>

                <h2 className="text-4xl font-semibold uppercase text-gray-800 dark:text-gray-100">
                  ${plan.monthlyPrice}
                </h2>

                <p className="font-medium text-gray-500 dark:text-gray-300">
                  Per month
                </p>

                <button className="mt-10 w-full transform rounded-md bg-blue-600 px-4 py-2 capitalize tracking-wide text-white transition-colors duration-300 hover:bg-blue-500 focus:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80">
                  Start Now
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SmallCards;
