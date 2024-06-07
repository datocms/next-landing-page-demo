'use client';

import { type FragmentType, getFragmentData } from '@/graphql/types';
import { FeaturedDocumentationPagesFragmentDoc } from '@/graphql/types/graphql';
import type { GlobalPageProps } from '@/utils/globalPageProps';
import { AnimatePresence, motion } from 'framer-motion';
import PreviewCard from './PreviewCard';

const variants = {
  hidden: { opacity: 0 },
  enter: { opacity: 1 },
  exit: { opacity: 0 },
};

type Props = {
  fragment: FragmentType<typeof FeaturedDocumentationPagesFragmentDoc>;
  globalPageProps: GlobalPageProps;
};

const FeaturedDocumentationPages = ({ fragment, globalPageProps }: Props) => {
  const { featuredPages } = getFragmentData(
    FeaturedDocumentationPagesFragmentDoc,
    fragment,
  );

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
          {featuredPages.map((page) => {
            return (
              <PreviewCard
                key={page.id}
                fragment={page}
                globalPageProps={globalPageProps}
              />
            );
          })}
        </section>
      </motion.div>
    </AnimatePresence>
  );
};

export default FeaturedDocumentationPages;
