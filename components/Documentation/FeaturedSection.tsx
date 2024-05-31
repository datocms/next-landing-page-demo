'use client';
import PreviewCard from '@/components/Documentation/PreviewCard';
import type { DocumentationPageRecord } from '@/graphql/types/graphql';
import type { GlobalPageProps } from '@/utils/globalPageProps';
import { AnimatePresence, motion } from 'framer-motion';

const variants = {
  hidden: { opacity: 0 },
  enter: { opacity: 1 },
  exit: { opacity: 0 },
};

type Props = {
  featuredSections: DocumentationPageRecord[];
  globalPageProps: GlobalPageProps;
};

const FeaturedSection = ({ featuredSections, globalPageProps }: Props) => {
  return (
    <AnimatePresence>
      <motion.div
        variants={variants}
        initial="hidden"
        animate="enter"
        exit="exit"
        transition={{ duration: 0.75, type: 'spring' }}
        className="h-full w-full py-6"
      >
        <section className="grid h-full w-full grid-cols-1 gap-1 px-16 lg:grid-cols-2 xl:grid-cols-3">
          {featuredSections.map((featuredSection) => {
            return (
              <PreviewCard
                key={featuredSection.id}
                featuredSection={featuredSection}
                globalPageProps={globalPageProps}
              />
            );
          })}
        </section>
      </motion.div>
    </AnimatePresence>
  );
};

export default FeaturedSection;
