import Highlighter from '@/components/Highlighter';
import type { ContentPage } from '@/components/WithRealTimeUpdates/types';
import { isHeading, isParagraph } from 'datocms-structured-text-utils';
import { notFound } from 'next/navigation';
import {
  StructuredText as StructuredTextField,
  renderNodeRule,
} from 'react-datocms';
import type { PageProps, Query } from './meta';

const Content: ContentPage<PageProps, Query> = ({ data, params }) => {
  if (!data.legalPage) {
    notFound();
  }

  return (
    <section className="mt-24 pb-[120px]">
      <div className="container">
        <div className="-mx-4 flex flex-wrap justify-center">
          <div className="w-full px-4 lg:w-8/12">
            <div>
              <div>
                <StructuredTextField
                  data={data.legalPage.content}
                  renderNode={Highlighter}
                  customNodeRules={[
                    renderNodeRule(isHeading, ({ children, key }) => {
                      return (
                        <h3
                          className="mb-4 mt-9 text-xl font-bold text-black dark:text-white sm:text-2xl lg:text-xl xl:text-2xl"
                          key={key}
                        >
                          {children}
                        </h3>
                      );
                    }),
                    renderNodeRule(isParagraph, ({ children, key }) => {
                      return (
                        <p
                          className="text-base font-medium leading-relaxed text-body-color sm:text-lg sm:leading-relaxed"
                          key={key}
                        >
                          {children}
                        </p>
                      );
                    }),
                  ]}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Content;
