import {
  StructuredText as StructuredTextField,
  renderNodeRule,
} from "react-datocms/structured-text";
import {
  isHeading,
  isParagraph,
  isListItem,
  isList,
  StructuredText,
  Record,
} from "datocms-structured-text-utils";
import {
  DetailSectionModelDetailsField,
  FileField,
} from "@/graphql/types/graphql";
import { Image as DatoImage } from "react-datocms";
import Highlighter from "@/components/Common/Highlighter";

const checkIcon = (
  <svg width="16" height="13" viewBox="0 0 16 13" className="fill-current">
    <path d="M5.8535 12.6631C5.65824 12.8584 5.34166 12.8584 5.1464 12.6631L0.678505 8.1952C0.483242 7.99994 0.483242 7.68336 0.678505 7.4881L2.32921 5.83739C2.52467 5.64193 2.84166 5.64216 3.03684 5.83791L5.14622 7.95354C5.34147 8.14936 5.65859 8.14952 5.85403 7.95388L13.3797 0.420561C13.575 0.22513 13.8917 0.225051 14.087 0.420383L15.7381 2.07143C15.9333 2.26669 15.9333 2.58327 15.7381 2.77854L5.8535 12.6631Z" />
  </svg>
);

type Props = {
  details: DetailSectionModelDetailsField;
  image: FileField;
  imagePosition: boolean;
};

const DetailSection = ({ details, image, imagePosition }: Props) => {
  return (
    <section className="py-16 text-center md:py-20 lg:py-28 lg:text-start">
      <div className="container">
        <div className="-mx-4 flex flex-col items-center justify-center lg:flex-row lg:flex-wrap ">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            {!imagePosition && image.responsiveImage && (
              <div className="relative h-64 overflow-hidden rounded-lg bg-gray-100 shadow-lg md:h-auto">
                <DatoImage
                  className="h-full w-full object-cover object-center"
                  layout="fill"
                  objectFit="cover"
                  objectPosition="50% 50%"
                  data={image.responsiveImage}
                />
              </div>
            )}
            <div className="w-full">
              <div className="sm:ml-6 md:px-24 lg:px-0">
                <StructuredTextField
                  data={details.value as StructuredText<Record, Record>}
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
            {imagePosition && image.responsiveImage && (
              <div className="relative h-64 overflow-hidden rounded-lg bg-gray-100 shadow-lg md:h-auto">
                <DatoImage
                  className="h-full w-full object-cover"
                  layout="fill"
                  objectFit="cover"
                  objectPosition="50% 50%"
                  data={image.responsiveImage}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DetailSection;
