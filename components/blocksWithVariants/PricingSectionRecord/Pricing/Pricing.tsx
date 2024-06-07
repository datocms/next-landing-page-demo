'use client';

import { primaryColor } from '@/app/i18n/settings';
import Highlighter from '@/components/Highlighter';
import SectionTitle from '@/components/SectionTitle';
import OfferList from '@/components/blocksWithVariants/PricingSectionRecord/OfferList';
import { type FragmentType, getFragmentData } from '@/graphql/types';
import { PricingSectionFragmentDoc } from '@/graphql/types/graphql';
import { useState } from 'react';
import { StructuredText as StructuredTextField } from 'react-datocms/structured-text';

type Props = {
  fragment: FragmentType<typeof PricingSectionFragmentDoc>;
};

const Pricing = ({ fragment }: Props) => {
  const {
    pricingSectionHeader: header,
    pricingSectionSubheader: subheader,
    plans,
  } = getFragmentData(PricingSectionFragmentDoc, fragment);
  const [isMonthly, setIsMonthly] = useState(true);
  return (
    <section id="pricing" className="relative z-10 py-16 md:py-20 lg:py-28">
      <div className="container">
        <SectionTitle
          title={header}
          paragraph={subheader}
          center
          width="665px"
        />

        <div className="w-full">
          <div className="mb-8 flex justify-center md:mb-12 lg:mb-16">
            <span
              onClick={() => setIsMonthly(true)}
              className={`${
                isMonthly
                  ? 'pointer-events-none text-primary'
                  : 'text-dark dark:text-white'
              } mr-4 cursor-pointer text-base font-semibold`}
            >
              Monthly
            </span>
            <div
              onClick={() => setIsMonthly(!isMonthly)}
              className="flex cursor-pointer items-center"
            >
              <div className="relative">
                <div className="h-5 w-14 rounded-full bg-[#1D2144] shadow-inner" />
                <div
                  className={`${
                    isMonthly ? '' : 'translate-x-full'
                  } shadow-switch-1 absolute left-0 top-[-4px] flex h-7 w-7 items-center justify-center rounded-full bg-primary transition`}
                >
                  <span className="active h-4 w-4 rounded-full bg-white" />
                </div>
              </div>
            </div>
            <span
              onClick={() => setIsMonthly(false)}
              className={`${
                isMonthly
                  ? 'text-dark dark:text-white'
                  : 'pointer-events-none text-primary'
              } ml-4 cursor-pointer text-base font-semibold`}
            >
              Yearly
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => {
            const planFeatures = plan.planFeatures.split(', ');
            const packageName = plan.tierName;
            const price = isMonthly ? plan.monthlyPrice : plan.yearlyPrice;
            const duration = isMonthly ? 'mo' : 'yr';
            const subtitle = plan.tierDescription;

            return (
              <div key={plan.id} className="w-full">
                <div className="relative z-10 h-full rounded-md bg-white px-8 py-10 shadow-signUp dark:bg-[#1D2144]">
                  <div className="flex items-center justify-between">
                    <h3 className="price mb-2 text-3xl font-bold text-black dark:text-white">
                      $<span className="amount">{price}</span>
                      <span className="time text-body-color">/{duration}</span>
                    </h3>
                    <h4 className="mb-2 text-xl font-bold text-dark dark:text-white">
                      {packageName}
                    </h4>
                  </div>
                  <div className="mb-7 h-20 text-base text-body-color">
                    <StructuredTextField
                      data={subtitle}
                      renderNode={Highlighter}
                    />
                  </div>
                  <div className="mb-8 border-b border-body-color border-opacity-10 pb-8 dark:border-white dark:border-opacity-10">
                    <button
                      type="button"
                      className="flex w-full items-center justify-center rounded-md bg-primary p-3 text-base font-semibold text-white transition duration-300 ease-in-out hover:bg-opacity-80 hover:shadow-signUp"
                    >
                      Start Free Trial
                    </button>
                  </div>
                  <div>
                    {planFeatures.map((feature) => (
                      <OfferList key={feature} text={feature} status="active" />
                    ))}
                  </div>
                  <div className="absolute bottom-0 right-0 z-[-1]">
                    <svg
                      width="179"
                      height="158"
                      viewBox="0 0 179 158"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        opacity="0.5"
                        d="M75.0002 63.256C115.229 82.3657 136.011 137.496 141.374 162.673C150.063 203.47 207.217 197.755 202.419 167.738C195.393 123.781 137.273 90.3579 75.0002 63.256Z"
                        fill="url(#paint0_linear_70:153)"
                      />
                      <path
                        opacity="0.3"
                        d="M178.255 0.150879C129.388 56.5969 134.648 155.224 143.387 197.482C157.547 265.958 65.9705 295.709 53.1024 246.401C34.2588 174.197 100.939 83.7223 178.255 0.150879Z"
                        fill="url(#paint1_linear_70:153)"
                      />
                      <defs>
                        <linearGradient
                          id="paint0_linear_70:153"
                          x1="69.6694"
                          y1="29.9033"
                          x2="196.108"
                          y2="83.2919"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stopColor={primaryColor} stopOpacity="0.62" />
                          <stop
                            offset="1"
                            stopColor={primaryColor}
                            stopOpacity="0"
                          />
                        </linearGradient>
                        <linearGradient
                          id="paint1_linear_70:153"
                          x1="165.348"
                          y1="-75.4466"
                          x2="-3.75136"
                          y2="103.645"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stopColor={primaryColor} stopOpacity="0.62" />
                          <stop
                            offset="1"
                            stopColor={primaryColor}
                            stopOpacity="0"
                          />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 z-[-1]">
        <svg
          width="239"
          height="601"
          viewBox="0 0 239 601"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            opacity="0.3"
            x="-184.451"
            y="600.973"
            width="196"
            height="541.607"
            rx="2"
            transform="rotate(-128.7 -184.451 600.973)"
            fill="url(#paint0_linear_93:235)"
          />
          <rect
            opacity="0.3"
            x="-188.201"
            y="385.272"
            width="59.7544"
            height="541.607"
            rx="2"
            transform="rotate(-128.7 -188.201 385.272)"
            fill="url(#paint1_linear_93:235)"
          />
          <defs>
            <linearGradient
              id="paint0_linear_93:235"
              x1="-90.1184"
              y1="420.414"
              x2="-90.1184"
              y2="1131.65"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor={primaryColor} />
              <stop offset="1" stopColor={primaryColor} stopOpacity="0" />
            </linearGradient>
            <linearGradient
              id="paint1_linear_93:235"
              x1="-159.441"
              y1="204.714"
              x2="-159.441"
              y2="915.952"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor={primaryColor} />
              <stop offset="1" stopColor={primaryColor} stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </section>
  );
};

export default Pricing;
