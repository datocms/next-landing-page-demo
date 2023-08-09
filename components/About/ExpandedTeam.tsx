import { Image as DatoImage } from 'react-datocms';

const ExpandedTeam = ({ header, subheader, members }) => {
  return (
    <section className="body-font text-gray-600">
      <div className="container mx-auto px-5 py-24">
        <div className="mb-20 flex w-full flex-col text-center">
          <h1 className="mb-4 text-center text-2xl font-semibold text-gray-800 dark:text-white lg:text-3xl">
            {header}
          </h1>
          <p className="mx-auto leading-relaxed text-gray-500 lg:w-2/3">
            {subheader}
          </p>
        </div>
        <div className="-m-4 grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {members.map((member) => {
            return (
              <div key={member.id} className="p-4">
                <div className="flex h-full flex-col items-center text-center">
                  <DatoImage
                    className="mb-8 rounded-md shadow-2xl drop-shadow-xl"
                    data={member.picture.responsiveImage}
                  />
                  <div className="w-full">
                    <h2 className="title-font text-lg font-medium text-gray-900">
                      {member.name}
                    </h2>
                    <h3 className="mb-3 text-gray-500">{member.bio}</h3>
                    <p className="mb-4">{member.description}</p>
                    <span className="inline-flex">
                      <a className="text-gray-500">
                        <svg
                          fill="none"
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          className="h-5 w-5"
                          viewBox="0 0 24 24"
                        >
                          <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
                        </svg>
                      </a>
                      <a className="ml-2 text-gray-500">
                        <svg
                          fill="none"
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          className="h-5 w-5"
                          viewBox="0 0 24 24"
                        >
                          <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
                        </svg>
                      </a>
                      <a className="ml-2 text-gray-500">
                        <svg
                          fill="none"
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          className="h-5 w-5"
                          viewBox="0 0 24 24"
                        >
                          <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"></path>
                        </svg>
                      </a>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ExpandedTeam;
