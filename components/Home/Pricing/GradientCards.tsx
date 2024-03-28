import Highlighter from "@/components/Common/Highlighter";
import { PricingTierRecord } from "@/graphql/types/graphql";
import { Record, StructuredText } from "datocms-structured-text-utils";
import { Maybe } from "graphql/jsutils/Maybe";
import { StructuredText as StructuredTextField } from "react-datocms/structured-text";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";

type Props = {
  header: string;
  subheader: Maybe<string>;
  plans: PricingTierRecord[];
};

const GradientCards = ({ header, subheader, plans }: Props) => {
  const planInEvidence = plans.shift() as PricingTierRecord;
  const evidencePlanFeatures = planInEvidence.planFeatures.split(", ");

  return (
    <div className="bg-white py-6 sm:py-8 lg:py-12">
      <div className="mx-auto flex flex-col justify-center px-4 md:px-8">
        <div className="mb-10 md:mb-16">
          <h2 className="mb-4 text-center text-2xl font-bold text-gray-800 md:mb-6 lg:text-3xl">
            {header}
          </h2>

          <div className="mx-auto max-w-screen-md text-center text-gray-500 md:text-lg">
            <ReactMarkdown>{subheader || ""}</ReactMarkdown>
          </div>
        </div>

        <div className="flex w-full flex-row flex-wrap items-center justify-center gap-4">
          <div className="relative mr-4 flex h-[550px] max-w-md flex-col justify-center rounded-lg bg-gradient-to-tr from-indigo-500 to-primary/80 p-8 shadow-xl">
            <div className="h-96">
              <span className="absolute right-0 top-0 order-first m-8 inline-block rounded-full bg-indigo-200 bg-opacity-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white lg:order-none">
                Best value
              </span>
              <div className="mb-4 flex flex-col items-start justify-between gap-4 lg:flex-row">
                <div>
                  <h3 className="text-2xl font-semibold text-white sm:text-3xl">
                    {planInEvidence.tierName}
                  </h3>
                  <div className="h-24 text-indigo-100">
                    <StructuredTextField
                      data={
                        planInEvidence.tierDescription.value as StructuredText<
                          Record,
                          Record
                        >
                      }
                      renderNode={Highlighter}
                    />
                  </div>
                </div>
              </div>

              <div className="mb-4 space-x-2">
                <span className="text-4xl font-bold text-white">
                  ${planInEvidence.monthlyPrice}
                </span>
              </div>
            </div>

            <ul className="mb-6 h-96 space-y-2 text-indigo-100">
              {evidencePlanFeatures.map((feature) => {
                return (
                  <li key={feature} className="flex items-center gap-1.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 shrink-0"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>

                    <span>{feature}</span>
                  </li>
                );
              })}
            </ul>

            <a
              href="#"
              className="block rounded-lg bg-indigo-200 bg-opacity-50 px-8 py-3 text-center text-sm font-semibold text-white outline-none ring-indigo-300 transition duration-100 hover:bg-indigo-300 focus-visible:ring active:bg-indigo-400 md:text-base"
            >
              Get the Pro Bundle
            </a>
          </div>
          {plans.map((plan) => {
            const planFeatures = plan.planFeatures.split(", ");
            return (
              <div
                key={plan.id}
                className="flex h-[550px] w-96 flex-col justify-center rounded-lg bg-gray-800 p-8"
              >
                <div className="h-96">
                  <div className="mb-4">
                    <h3 className="text-2xl font-semibold text-gray-100 sm:text-3xl">
                      {plan.tierName}
                    </h3>
                    <div className="h-24 text-gray-300">
                      <StructuredTextField
                        data={
                          plan.tierDescription.value as StructuredText<
                            Record,
                            Record
                          >
                        }
                        renderNode={Highlighter}
                      />
                    </div>
                  </div>

                  <div className="mb-4 space-x-2">
                    <span className="text-4xl font-bold text-gray-100">
                      ${plan.monthlyPrice}
                    </span>
                  </div>
                </div>

                <ul className="mb-6 h-96 space-y-2 text-gray-300">
                  {planFeatures.map((feature) => {
                    return (
                      <li key={feature} className="flex items-center gap-1.5">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 shrink-0"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>

                        <span>{feature}</span>
                      </li>
                    );
                  })}
                </ul>

                <a
                  href="#"
                  className="block rounded-lg bg-gray-500 px-8 py-3 text-center text-sm font-semibold text-gray-100 outline-none ring-indigo-300 transition duration-100 hover:bg-gray-600 focus-visible:ring active:text-gray-300 md:text-base"
                >
                  Get the Basic Bundle
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default GradientCards;
