'use client';

import { useState } from 'react';
import { Maybe } from 'graphql/jsutils/Maybe';
import { AnimatePresence, motion } from 'framer-motion';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import { PricingTierRecord } from '@/graphql/types/graphql';

type Props = {
  header: string;
  subheader: Maybe<string>;
  plans: PricingTierRecord[];
};

const FeatureListSelector = ({ header, subheader, plans }: Props) => {
  const [selectedPlan, setSelectedPlan] = useState(plans[1].tierName);

  const selectedPlanFeatures = plans
    .find((plan) => plan.tierName === selectedPlan)
    ?.planFeatures.split(', ');

  return (
    <div className="mt-16 bg-white py-16 dark:bg-gray-900">
      <div className="container mx-auto px-6 py-8">
        <h1 className="text-center text-2xl font-semibold capitalize text-gray-800 dark:text-white lg:text-3xl">
          {header}
        </h1>

        <div className="mx-auto mt-4 max-w-2xl text-center text-gray-500 dark:text-gray-300 xl:mt-6">
          <ReactMarkdown>{subheader || ''}</ReactMarkdown>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-3 xl:mt-12">
          {plans.map((plan) => {
            const planIsSelected = plan.tierName === selectedPlan;
            return (
              <div
                key={plan.id}
                onClick={() => setSelectedPlan(plan.tierName)}
                className={
                  'flex cursor-pointer items-center justify-between rounded-xl border px-8 py-4' +
                  (planIsSelected ? ' border-primary' : '')
                }
              >
                <div className="flex flex-col items-center space-y-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={
                      'h-5 w-5 sm:h-7 sm:w-7' +
                      (planIsSelected ? ' text-primary' : ' text-gray-400')
                    }
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>

                  <h2 className="text-lg font-medium text-gray-700 dark:text-gray-200 sm:text-xl">
                    {plan.tierName}
                  </h2>
                </div>

                <h2
                  className={
                    'text-2xl font-semibold sm:text-3xl' +
                    (planIsSelected ? ' text-primary' : ' text-gray-500')
                  }
                >
                  ${plan.monthlyPrice}{' '}
                  <span className="text-base font-medium">/Month</span>
                </h2>
              </div>
            );
          })}
        </div>

        <motion.div className="mt-8 space-y-8 rounded-xl bg-gray-100 p-8 dark:bg-gray-800">
          <AnimatePresence>
            {selectedPlanFeatures &&
              selectedPlanFeatures.map((feature) => {
                return (
                  <motion.div
                    key={feature}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20, transition: { duration: 0.1 } }}
                    className="flex items-center justify-between text-gray-800 dark:text-gray-200"
                  >
                    <p className="textlg sm:text-xl">{feature}</p>

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-blue-500 sm:h-7 sm:w-7"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </motion.div>
                );
              })}
          </AnimatePresence>
        </motion.div>

        <div className="mt-8 flex justify-center">
          <button className="transform rounded-md bg-blue-600 px-8 py-2 capitalize tracking-wide text-white transition-colors duration-300 hover:bg-blue-500 focus:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80">
            Choose Plan
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeatureListSelector;
