import Image from 'next/image';
import { StructuredText, renderNodeRule } from 'react-datocms/structured-text';
import {
  isHeading,
  isParagraph,
  isListItem,
  isList,
} from 'datocms-structured-text-utils';
import { DetailSectionModelDetailsField } from '@/graphql/generated';

const checkIcon = (
  <svg width="16" height="13" viewBox="0 0 16 13" className="fill-current">
    <path d="M5.8535 12.6631C5.65824 12.8584 5.34166 12.8584 5.1464 12.6631L0.678505 8.1952C0.483242 7.99994 0.483242 7.68336 0.678505 7.4881L2.32921 5.83739C2.52467 5.64193 2.84166 5.64216 3.03684 5.83791L5.14622 7.95354C5.34147 8.14936 5.65859 8.14952 5.85403 7.95388L13.3797 0.420561C13.575 0.22513 13.8917 0.225051 14.087 0.420383L15.7381 2.07143C15.9333 2.26669 15.9333 2.58327 15.7381 2.77854L5.8535 12.6631Z" />
  </svg>
);

type Props = {
  details: DetailSectionModelDetailsField;
  imageURL: string;
  imagePosition: boolean;
};

const DetailSection = ({ details, imageURL, imagePosition }: Props) => {
  return (
    <section className="py-16 text-center md:py-20 lg:py-28 lg:text-start">
      <div className="container">
        <div className="-mx-4 flex flex-col items-center justify-center lg:flex-row lg:flex-wrap ">
          {!imagePosition && (
            <div className="w-full px-4 lg:w-1/2">
              <div className=" relative mx-auto mb-12 aspect-[25/24] max-w-[500px] text-center lg:m-0">
                <Image src={imageURL} alt="about image" fill />
              </div>
            </div>
          )}
          <div className="w-full px-4 lg:w-1/2">
            <div className="sm:ml-6 md:px-24 lg:px-0">
              <StructuredText
                data={details.value}
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
                  renderNodeRule(isListItem, ({ children, key }) => {
                    return (
                      <div
                        key={key}
                        className="mb-5 flex items-center text-lg font-medium text-body-color"
                      >
                        <span className="mr-4 flex h-[30px] w-[30px] items-center justify-center rounded-md bg-primary bg-opacity-10 text-primary">
                          {checkIcon}
                        </span>
                        <div>{children}</div>
                      </div>
                    );
                  }),
                  renderNodeRule(isList, ({ children, key }) => {
                    return (
                      <div
                        key={key}
                        className="mb-6 mt-6 grid w-full grid-cols-2 gap-4 text-center lg:ml-0"
                      >
                        {children}
                      </div>
                    );
                  }),
                ]}
              />
            </div>
          </div>
          {imagePosition && (
            <div className="w-full px-4 pt-8 lg:w-1/2">
              <div className="relative mx-auto mb-12 aspect-[25/24] max-w-[500px] text-center lg:m-0">
                <Image src={imageURL} alt="about image" fill />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default DetailSection;
