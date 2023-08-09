import { fallbackLng } from '@/app/i18n/settings';
import { legalQuery } from '@/queries/legal';
import queryDatoCMS from '@/utils/queryDatoCMS';
import { isHeading, isParagraph } from 'datocms-structured-text-utils';
import { draftMode } from 'next/headers';
import { StructuredText, renderNodeRule } from 'react-datocms';

const BlogDetailsPage = async ({ params: { slug, lng } }) => {
  const { isEnabled } = draftMode();

  const { legalPage } = await queryDatoCMS(
    legalQuery,
    {
      slug,
      locale: lng,
      fallbackLocale: [fallbackLng],
    },
    isEnabled
  );

  return (
    <>
      <section className="pb-[120px] pt-[150px]">
        <div className="container">
          <div className="-mx-4 flex flex-wrap justify-center">
            <div className="w-full px-4 lg:w-8/12">
              <div>
                <div>
                  <StructuredText
                    data={legalPage.content}
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
    </>
  );
};

export default BlogDetailsPage;
