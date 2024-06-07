import { type FragmentType, getFragmentData } from '@/graphql/types';
import {
  DatoImage_ResponsiveImageFragmentDoc,
  HeroSectionFragmentDoc,
} from '@/graphql/types/graphql';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';

type Props = {
  fragment: FragmentType<typeof HeroSectionFragmentDoc>;
};

const BackgroundImageHero = ({ fragment }: Props) => {
  const {
    heroTitle,
    heroSubtitle,
    buttons,
    heroImage: heroImageFragment,
  } = getFragmentData(HeroSectionFragmentDoc, fragment);
  const heroResponsiveImage = heroImageFragment
    ? getFragmentData(
        DatoImage_ResponsiveImageFragmentDoc,
        heroImageFragment.responsiveImage,
      )
    : null;

  return (
    <div
      className="mt-20 h-[48rem] w-full bg-cover bg-center object-cover"
      style={{
        backgroundSize: 'cover',
        backgroundImage: `url('${heroResponsiveImage?.src}')`,
      }}
    >
      <div className="flex h-full w-full flex-col items-center justify-center bg-gray-900/30 px-8 lg:px-32">
        <div className="flex flex-col items-center gap-8 text-center">
          <h1 className="text-7xl font-bold text-white">{heroTitle}</h1>
          <div className="leading-relaxed text-white xl:text-xl">
            <ReactMarkdown>{heroSubtitle || ''}</ReactMarkdown>
          </div>
          <div className="flex gap-4">
            {buttons.map((button) => {
              const primary =
                'inline-block rounded-lg bg-primary/90 px-8 py-3 text-center text-sm font-semibold text-white outline-none ring-indigo-300 transition duration-100 hover:bg-indigo-600 focus-visible:ring active:bg-indigo-700 md:text-base';
              const secondary =
                'inline-block rounded-lg bg-gray-200 px-8 py-3 text-center text-sm font-semibold text-gray-500 outline-none ring-indigo-300 transition duration-100 hover:bg-gray-300 focus-visible:ring active:text-gray-700 md:text-base';
              return (
                <a
                  key={button.id}
                  className={button.primary ? primary : secondary}
                  href={button.url || '#'}
                >
                  {button.label}
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackgroundImageHero;
