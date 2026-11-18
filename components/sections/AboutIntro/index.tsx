import { useId } from 'react';
import DatoStructuredText from '@/components/datocms/DatoStructuredText';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import {
  itemHeadingLevel,
  type SectionHeadingLevel,
} from '@/utils/headingLevel';
import { hasStructuredText } from '@/utils/structuredText';
import { titleSize } from '@/utils/titleSize';
import { AboutIntroFragment } from './fragment';
import Introduction from './Introduction';
import PhotoStrip from './PhotoStrip';

type Props = {
  fragment: FragmentOf<typeof AboutIntroFragment>;
  as?: SectionHeadingLevel;
};

/**
 * The About page opener: a centred header (the block's eyebrow in accent
 * text, the title, the lead), the photos in a row of three and the
 * introduction in three columns under them.
 */
const AboutIntro = ({ fragment, as: Heading = 'h2' }: Props) => {
  const {
    eyebrow,
    title,
    subtitle,
    images,
    introductionText: introduction,
  } = readFragment(AboutIntroFragment, fragment);
  const headingId = useId();
  const leadsPage = Heading === 'h1';
  const scale = title ? titleSize(title, leadsPage ? 'h1' : 'h2') : null;

  return (
    <section
      aria-labelledby={title ? headingId : undefined}
      className={leadsPage ? 'section-lead' : 'section'}
    >
      <div className="container-page">
        <header className="mx-auto max-w-[44rem] text-center">
          {eyebrow && (
            <p className="mb-3 text-small font-medium text-accent-ink">
              {eyebrow}
            </p>
          )}
          {title && scale && (
            <Heading
              id={headingId}
              data-long={scale.long}
              className={scale.className}
            >
              {title}
            </Heading>
          )}
          {hasStructuredText(subtitle) && (
            <div className="mx-auto mt-4 max-w-[40rem] text-lead text-fg-muted [&_p]:text-balance [&_p+p]:mt-3">
              <DatoStructuredText data={subtitle} />
            </div>
          )}
        </header>

        <PhotoStrip
          images={images}
          leadsPage={leadsPage}
          className="mt-12 lg:mt-16"
        />

        {introduction && (
          <Introduction
            introduction={introduction}
            headingLevel={itemHeadingLevel(Heading)}
            className="mt-12 lg:mt-16"
          />
        )}
      </div>
    </section>
  );
};

export default AboutIntro;
