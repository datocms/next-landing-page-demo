import { useId } from 'react';
import DatoStructuredText from '@/components/datocms/DatoStructuredText';
import TwoTone from '@/components/ui/TwoTone';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import { cn } from '@/utils/cn';
import {
  itemHeadingLevel,
  type SectionHeadingLevel,
} from '@/utils/headingLevel';
import { hasStructuredText } from '@/utils/structuredText';
import { AboutIntroFragment } from './fragment';
import Introduction from './Introduction';
import PhotoPlinth from './PhotoPlinth';

type Props = {
  fragment: FragmentOf<typeof AboutIntroFragment>;
  as?: SectionHeadingLevel;
};

/**
 * Page opener in the hero's language: a label pill, a two-tone title and a
 * lead beside a threaded plinth holding the CMS photos as framed cards, then
 * the introduction as columns of points divided by hairlines.
 */
const AboutIntro = ({ fragment, as: Heading = 'h2' }: Props) => {
  const {
    header,
    subheader,
    images,
    introductionText: introduction,
    preHeader,
  } = readFragment(AboutIntroFragment, fragment);
  const headingId = `about-${useId()}`;
  const leadsPage = Heading === 'h1';

  return (
    <section
      className={
        leadsPage ? 'pt-8 pb-16 md:pt-10 md:pb-20 lg:pt-12' : 'section'
      }
      aria-labelledby={header ? headingId : undefined}
    >
      <div className="container-page">
        <div className="grid items-center lg:grid-cols-12 lg:gap-x-6">
          <div
            className={cn(
              'max-w-[620px] lg:col-span-6 lg:max-w-none',
              !leadsPage && 'reveal',
            )}
          >
            {preHeader && <p className="pill-label tone-2">{preHeader}</p>}
            {header && (
              <Heading
                id={headingId}
                // Both halves form one Visual Editing target (the stega payload rides in the second)
                data-datocms-content-link-group
                className={cn(
                  'max-w-[588px] text-ink',
                  leadsPage ? 'text-h1' : 'text-h2',
                  preHeader && 'mt-5',
                )}
              >
                <TwoTone text={header} lineBreak="always" keepHyphenatedWords />
              </Heading>
            )}
            {hasStructuredText(subheader) && (
              <div
                data-hero-rise={leadsPage ? '' : undefined}
                className="section-lead mt-4 [--d:0] [--lead-max:456px] md:mt-[18px]"
              >
                <DatoStructuredText data={subheader} />
              </div>
            )}
          </div>

          <PhotoPlinth images={images} leadsPage={leadsPage} />
        </div>

        {introduction && (
          <Introduction
            introduction={introduction}
            headingLevel={itemHeadingLevel(Heading)}
          />
        )}
      </div>
    </section>
  );
};

export default AboutIntro;
