import {
  LegalPageModelContentField,
  LegalQuery,
  SiteLocale,
} from '@/graphql/generated';
import { isHeading, isParagraph } from 'datocms-structured-text-utils';
import { notFound } from 'next/navigation';
import { StructuredText, renderNodeRule } from 'react-datocms';

type Props = {
  data: LegalQuery;
  lng: SiteLocale;
};

const Legal = ({ data, lng }: Props) => {
  if (!data.legalPage) notFound();
  return (
    <section className="mt-24 pb-[120px]">
      <div className="container">
        <div className="-mx-4 flex flex-wrap justify-center">
          <div className="w-full px-4 lg:w-8/12">
            <div>
              <div>
                <StructuredText
                  data={
                    (data.legalPage.content as LegalPageModelContentField).value
                  }
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

export default Legal;
