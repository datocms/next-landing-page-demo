import Sections from '@/components/Sections/Sections';
import queryDatoCMS from '@/utils/queryDatoCMS';
import { fallbackLng } from '../../i18n/settings';
import { draftMode } from 'next/headers';
import RealTimeSections from '@/components/Sections/RealTimeSections';
import {
  CollectionMetadata,
  PageDocument,
  PageModelSectionsField,
  PageRecord,
  PostRecord,
  SiteLocale,
} from '@/graphql/generated';
import { notFound } from 'next/navigation';

type Params = {
  params: {
    lng: SiteLocale;
  };
};

const HomeVariationOne = async ({ params: { lng } }: Params) => {
  const { isEnabled } = draftMode();
  const slug = 'home';

  const data = await queryDatoCMS(
    PageDocument,
    {
      locale: lng,
      fallbackLocale: [fallbackLng],
      slug,
    },
    isEnabled
  );

  if (!data.page) notFound();

  //todo: hydrate data

  return (
    <>
      <div className="mt-24 bg-white pb-6 sm:pb-8 lg:pb-12">
        <div className="h-full w-full md:px-8">
          <section className="min-h-96 relative flex flex-1 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-100 py-16 shadow-lg md:py-20 xl:py-48">
            <img
              src="https://images.unsplash.com/photo-1618004652321-13a63e576b80?auto=format&q=75&fit=crop&w=1500"
              loading="lazy"
              alt="Photo by Fakurian Design"
              className="absolute inset-0 h-full w-full object-cover object-center"
            />

            <div className="absolute inset-0 bg-primary mix-blend-multiply"></div>

            <div className="relative flex flex-col items-center p-4 sm:max-w-xl">
              <h1 className="mb-4 text-center text-4xl font-bold text-white sm:text-5xl md:mb-8 md:text-6xl">
                SaaS Frontend Solutions
              </h1>
              <p className="mb-4 text-center text-lg text-indigo-200 sm:text-xl md:mb-8">
                A better way to build
              </p>

              <div className="flex w-full flex-col gap-2.5 sm:flex-row sm:justify-center">
                <a
                  href="#"
                  className="inline-block rounded-lg bg-primary px-8 py-3 text-center text-sm font-semibold text-white outline-none ring-indigo-300 transition duration-100 hover:bg-indigo-600 focus-visible:ring active:bg-indigo-700 md:text-base"
                >
                  Start now
                </a>

                <a
                  href="#"
                  className="inline-block rounded-lg bg-gray-200 px-8 py-3 text-center text-sm font-semibold text-gray-500 outline-none ring-indigo-300 transition duration-100 hover:bg-gray-300 focus-visible:ring active:text-gray-700 md:text-base"
                >
                  Take tour
                </a>
              </div>
            </div>
          </section>
        </div>
      </div>

      <div className="bg-white py-6 sm:py-8 lg:py-12">
        <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
          <div className="mb-10 md:mb-16">
            <h2 className="mb-4 text-center text-2xl font-bold text-gray-800 md:mb-6 lg:text-3xl">
              Our competitive advantage
            </h2>

            <p className="mx-auto max-w-screen-md text-center text-gray-500 md:text-lg">
              This is a section of some simple filler text, also known as
              placeholder text. It shares some characteristics of a real written
              text but is random or otherwise generated.
            </p>
          </div>

          <div className="grid gap-12 sm:grid-cols-2 xl:grid-cols-3 xl:gap-16">
            <div className="flex flex-col items-center">
              <div className="mb-2 flex h-12 w-12 items-center justify-center text-primary sm:mb-4 md:h-14 md:w-14">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-full w-full"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>

              <h3 className="mb-2 text-center text-lg font-semibold md:text-xl">
                Growth
              </h3>
              <p className="mb-2 text-center text-gray-500">
                Filler text is dummy text which has no meaning however looks
                very similar to real text.
              </p>
              <a
                href="#"
                className="font-bold text-primary transition duration-100 hover:text-indigo-600 active:text-indigo-700"
              >
                More
              </a>
            </div>

            <div className="flex flex-col items-center">
              <div className="mb-2 flex h-12 w-12 items-center justify-center text-primary sm:mb-4 md:h-14 md:w-14">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-full w-full"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>

              <h3 className="mb-2 text-center text-lg font-semibold md:text-xl">
                Security
              </h3>
              <p className="mb-2 text-center text-gray-500">
                Filler text is dummy text which has no meaning however looks
                very similar to real text.
              </p>
              <a
                href="#"
                className="font-bold text-primary transition duration-100 hover:text-indigo-600 active:text-indigo-700"
              >
                More
              </a>
            </div>

            <div className="flex flex-col items-center">
              <div className="mb-2 flex h-12 w-12 items-center justify-center text-primary sm:mb-4 md:h-14 md:w-14">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-full w-full"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                  />
                </svg>
              </div>

              <h3 className="mb-2 text-center text-lg font-semibold md:text-xl">
                Cloud
              </h3>
              <p className="mb-2 text-center text-gray-500">
                Filler text is dummy text which has no meaning however looks
                very similar to real text.
              </p>
              <a
                href="#"
                className="font-bold text-primary transition duration-100 hover:text-indigo-600 active:text-indigo-700"
              >
                More
              </a>
            </div>

            <div className="flex flex-col items-center">
              <div className="mb-2 flex h-12 w-12 items-center justify-center text-primary sm:mb-4 md:h-14 md:w-14">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-full w-full"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>

              <h3 className="mb-2 text-center text-lg font-semibold md:text-xl">
                Speed
              </h3>
              <p className="mb-2 text-center text-gray-500">
                Filler text is dummy text which has no meaning however looks
                very similar to real text.
              </p>
              <a
                href="#"
                className="font-bold text-primary transition duration-100 hover:text-indigo-600 active:text-indigo-700"
              >
                More
              </a>
            </div>

            <div className="flex flex-col items-center">
              <div className="mb-2 flex h-12 w-12 items-center justify-center text-primary sm:mb-4 md:h-14 md:w-14">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-full w-full"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>

              <h3 className="mb-2 text-center text-lg font-semibold md:text-xl">
                Support
              </h3>
              <p className="mb-2 text-center text-gray-500">
                Filler text is dummy text which has no meaning however looks
                very similar to real text.
              </p>
              <a
                href="#"
                className="font-bold text-primary transition duration-100 hover:text-indigo-600 active:text-indigo-700"
              >
                More
              </a>
            </div>

            <div className="flex flex-col items-center">
              <div className="mb-2 flex h-12 w-12 items-center justify-center text-primary sm:mb-4 md:h-14 md:w-14">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-full w-full"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              </div>

              <h3 className="mb-2 text-center text-lg font-semibold md:text-xl">
                Dark Mode
              </h3>
              <p className="mb-2 text-center text-gray-500">
                Filler text is dummy text which has no meaning however looks
                very similar to real text.
              </p>
              <a
                href="#"
                className="font-bold text-primary transition duration-100 hover:text-indigo-600 active:text-indigo-700"
              >
                More
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white py-6 sm:py-8 lg:py-12">
        <div className="mx-auto max-w-screen-lg px-4 md:px-8">
          <div className="mb-10 md:mb-16">
            <h2 className="mb-4 text-center text-2xl font-bold text-gray-800 md:mb-6 lg:text-3xl">
              Choose a Bundle
            </h2>

            <p className="mx-auto max-w-screen-md text-center text-gray-500 md:text-lg">
              This is a section of some simple filler text, also known as
              placeholder text. It shares some characteristics of a real written
              text but is random or otherwise generated.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-0">
            <div className="w-full rounded-lg bg-gray-800 p-6 sm:w-1/2 sm:rounded-r-none sm:p-8 lg:w-1/3">
              <div className="mb-4">
                <h3 className="text-2xl font-semibold text-gray-100 sm:text-3xl">
                  Basic Bundle
                </h3>
                <p className="text-gray-300">Ebook</p>
              </div>

              <div className="mb-4 space-x-2">
                <span className="text-4xl font-bold text-gray-100">$29</span>
                <span className="text-2xl text-gray-300 line-through">$49</span>
              </div>

              <ul className="mb-6 space-y-2 text-gray-300">
                <li className="flex items-center gap-1.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 shrink-0"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clip-rule="evenodd"
                    />
                  </svg>

                  <span>Ebook</span>
                </li>

                <li className="flex items-center gap-1.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 shrink-0"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clip-rule="evenodd"
                    />
                  </svg>

                  <span>Multiple examples</span>
                </li>

                <li className="flex items-center gap-1.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 shrink-0"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clip-rule="evenodd"
                    />
                  </svg>

                  <span>Basic support</span>
                </li>
              </ul>

              <a
                href="#"
                className="block rounded-lg bg-gray-500 px-8 py-3 text-center text-sm font-semibold text-gray-100 outline-none ring-indigo-300 transition duration-100 hover:bg-gray-600 focus-visible:ring active:text-gray-300 md:text-base"
              >
                Get the Basic Bundle
              </a>
            </div>

            <div className="w-full rounded-lg bg-gradient-to-tr from-primary to-primary/70 p-6 shadow-xl sm:w-1/2 sm:p-8">
              <div className="mb-4 flex flex-col items-start justify-between gap-4 lg:flex-row">
                <div>
                  <h3 className="text-2xl font-semibold text-white sm:text-3xl">
                    Pro Bundle
                  </h3>
                  <p className="text-indigo-100">Ebook + Video course</p>
                </div>

                <span className="order-first inline-block rounded-full bg-indigo-200 bg-opacity-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white lg:order-none">
                  Best value
                </span>
              </div>

              <div className="mb-4 space-x-2">
                <span className="text-4xl font-bold text-white">$49</span>
                <span className="text-2xl text-indigo-100 line-through">
                  $89
                </span>
              </div>

              <ul className="mb-6 space-y-2 text-indigo-100">
                <li className="flex items-center gap-1.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 shrink-0"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clip-rule="evenodd"
                    />
                  </svg>

                  <span>Ebook</span>
                </li>

                <li className="flex items-center gap-1.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 shrink-0"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clip-rule="evenodd"
                    />
                  </svg>

                  <span>Video course</span>
                </li>

                <li className="flex items-center gap-1.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 shrink-0"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clip-rule="evenodd"
                    />
                  </svg>

                  <span>Multiple examples</span>
                </li>

                <li className="flex items-center gap-1.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 shrink-0"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clip-rule="evenodd"
                    />
                  </svg>

                  <span>Work sheets</span>
                </li>

                <li className="flex items-center gap-1.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 shrink-0"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clip-rule="evenodd"
                    />
                  </svg>

                  <span>Premium support</span>
                </li>
              </ul>

              <a
                href="#"
                className="block rounded-lg bg-indigo-200 bg-opacity-50 px-8 py-3 text-center text-sm font-semibold text-white outline-none ring-indigo-300 transition duration-100 hover:bg-indigo-300 focus-visible:ring active:bg-indigo-400 md:text-base"
              >
                Get the Pro Bundle
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white py-6 sm:py-8 lg:py-12">
        <div className="mx-auto max-w-screen-xl px-4 md:px-8">
          <h2 className="mb-8 text-center text-2xl font-bold text-gray-800 md:mb-12 lg:text-3xl">
            What others say about us
          </h2>

          <div className="grid gap-y-10 sm:grid-cols-2 sm:gap-y-12 lg:grid-cols-3 lg:divide-x">
            <div className="flex flex-col items-center gap-4 sm:px-4 md:gap-6 lg:px-8">
              <div className="text-center text-gray-600">
                “This is a section of some simple filler text, also known as
                placeholder text.”
              </div>

              <div className="flex flex-col items-center gap-2 sm:flex-row md:gap-3">
                <div className="h-12 w-12 overflow-hidden rounded-full bg-gray-100 shadow-lg md:h-14 md:w-14">
                  <img
                    src="https://images.unsplash.com/photo-1567515004624-219c11d31f2e??auto=format&q=75&fit=crop&w=112"
                    loading="lazy"
                    alt="Photo by Radu Florin"
                    className="h-full w-full object-cover object-center"
                  />
                </div>

                <div>
                  <div className="text-center text-sm font-bold text-indigo-500 sm:text-left md:text-base">
                    John McCulling
                  </div>
                  <p className="text-center text-sm text-gray-500 sm:text-left md:text-sm">
                    CEO / Datadrift
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center gap-4 sm:px-4 md:gap-6 lg:px-8">
              <div className="text-center text-gray-600">
                “This is a section of some simple filler text, also known as
                placeholder text.”
              </div>

              <div className="flex flex-col items-center gap-2 sm:flex-row md:gap-3">
                <div className="h-12 w-12 overflow-hidden rounded-full bg-gray-100 shadow-lg md:h-14 md:w-14">
                  <img
                    src="https://images.unsplash.com/photo-1532073150508-0c1df022bdd1?auto=format&q=75&fit=crop&w=112"
                    loading="lazy"
                    alt="Photo by christian ferrer"
                    className="h-full w-full object-cover object-center"
                  />
                </div>

                <div>
                  <div className="text-center text-sm font-bold text-indigo-500 sm:text-left md:text-base">
                    Kate Berg
                  </div>
                  <p className="text-center text-sm text-gray-500 sm:text-left md:text-sm">
                    CFO / Dashdash
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center gap-4 sm:px-4 md:gap-6 lg:px-8">
              <div className="text-center text-gray-600">
                “This is a section of some simple filler text, also known as
                placeholder text.”
              </div>

              <div className="flex flex-col items-center gap-2 sm:flex-row md:gap-3">
                <div className="h-12 w-12 overflow-hidden rounded-full bg-gray-100 shadow-lg md:h-14 md:w-14">
                  <img
                    src="https://images.unsplash.com/photo-1463453091185-61582044d556?auto=format&q=75&fit=crop&w=500"
                    loading="lazy"
                    alt="Photo by Ayo Ogunseinde"
                    className="h-full w-full object-cover object-center"
                  />
                </div>

                <div>
                  <div className="text-center text-sm font-bold text-indigo-500 sm:text-left md:text-base">
                    Greg Jackson
                  </div>
                  <p className="text-center text-sm text-gray-500 sm:text-left md:text-sm">
                    CTO / Uptime
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomeVariationOne;
