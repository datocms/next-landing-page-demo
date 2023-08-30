import { ReactMarkdown } from 'react-markdown/lib/react-markdown';

type Params = {
  title: string;
  subtitle: string;
  buttonLabel: string;
};

const NewsletterCTABlock = ({ title, subtitle, buttonLabel }: Params) => {
  return (
    <section className="mt-8 rounded-xl bg-gray-50">
      <div className="p-8 md:p-8 lg:px-16 lg:py-16">
        <div className="mx-auto max-w-lg text-center">
          <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
            {title}
          </h2>

          <div className="hidden text-gray-500 sm:mt-4 sm:block">
            <ReactMarkdown>{subtitle || ''}</ReactMarkdown>
          </div>
        </div>

        <div className="mx-auto mt-8 max-w-xl">
          <form action="#" className="sm:flex sm:gap-4">
            <div className="sm:flex-1">
              <label htmlFor="email" className="sr-only">
                Email
              </label>

              <input
                type="email"
                placeholder="Email address"
                className="focus:ring-yellow-400 w-full rounded-md border-gray-200 bg-white p-3 text-gray-700 shadow-sm transition focus:border-white focus:outline-none focus:ring"
              />
            </div>

            <button
              type="submit"
              className={`focus:ring-yellow-400 group mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 text-white transition focus:outline-none focus:ring sm:mt-0 sm:w-auto`}
            >
              <span className="text-sm font-medium"> {buttonLabel} </span>

              <svg
                className="h-5 w-5 rtl:rotate-180"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default NewsletterCTABlock;
