import AboutSectionOne from '@/components/About/AboutSectionOne';
import AboutSectionTwo from '@/components/About/AboutSectionTwo';
import Blog from '@/components/Blog';
import Brands from '@/components/Brands';
import ScrollUp from '@/components/Common/ScrollUp';
import Contact from '@/components/Contact';
import Features from '@/components/Features';
import Hero from '@/components/Hero';
import Pricing from '@/components/Pricing';
import Testimonials from '@/components/Testimonials';
import Video from '@/components/Video';
import queryDatoCMS from '@/utils/queryDatoCMS';
import { Inter } from '@next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default async function Home() {
  const { home, about } = await queryDatoCMS(`query MyQuery {
    home {
      heroSubtitle
      heroTitle
      featuresHeader
      featuresSubheader
      features {
        id
        featureTitle
        featureDescription
        featureIcon {
          url
        }
      }
      videoHeader
      videoSubheader
      video {
        providerUid
        thumbnailUrl
        provider
      }
    }
    about {
      brandShowcase {
        id
        brandName
        brandUrl
        brandLogo {
          url
        }
      }
    }
  }`);

  return (
    <>
      <ScrollUp />
      <Hero heroTitle={home.heroTitle} heroSubtitle={home.heroSubtitle} />
      <Features
        features={home.features}
        featuresHeader={home.featuresHeader}
        featuresSubheader={home.featuresSubheader}
      />
      <Video
        videoHeader={home.videoHeader}
        videoSubheader={home.videoSubheader}
        videoUid={home.video.providerUid}
        videoThumbnail={home.video.thumbnailUrl}
        videoProvider={home.video.provider}
      />
      <Brands brandShowcase={about.brandShowcase} />
      <AboutSectionOne />
      <AboutSectionTwo />
      <Testimonials />
      <Pricing />
      <Blog />
      <Contact />
    </>
  );
}
