import { Image as DatoImage } from 'react-datocms';

const CompactTeam = ({ header, subheader, members }) => {
  return (
    <section className="body-font text-gray-600">
      <div className="container mx-auto px-5 py-16">
        <div className="mb-20 flex w-full flex-col text-center">
          <h1 className="mb-4 text-center text-2xl font-semibold text-gray-800 dark:text-white lg:text-3xl">
            {header}
          </h1>
          <p className="mx-auto text-base leading-relaxed text-gray-500 lg:w-2/3">
            {subheader}
          </p>
        </div>
        <div className="-m-2 flex flex-wrap">
          {members.map((member) => {
            return (
              <div key={member.id} className="w-full p-2 md:w-1/2 lg:w-1/3">
                <div className="flex h-full items-center rounded-lg border border-gray-200 p-4">
                  <div className="mr-4 block w-28 flex-shrink-0 overflow-hidden rounded-md">
                    <DatoImage
                      className="h-full w-full object-cover"
                      data={member.picture.responsiveImage}
                    />
                  </div>

                  <div className="flex-grow">
                    <h2 className="title-font font-medium text-gray-900">
                      {member.name}
                    </h2>
                    <p className="text-gray-500">{member.bio}</p>
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

export default CompactTeam;
