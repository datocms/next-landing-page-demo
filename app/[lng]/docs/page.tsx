'use client';

import Link from 'next/link';
import { Search } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import PreviewCard from '@/components/Documentaiton/PreviewCard';

type Props = {
  data: {
    content: {
      title?: string;
      tagLine?: string;
      markdown?: string;
    };
    // selection?: FoldersProps[];
  };
};

const variants = {
  hidden: { opacity: 0 },
  enter: { opacity: 1 },
  exit: { opacity: 0 },
};

const mainImage = {
  initial: { height: '75%' },
  hover: {
    height: '100%',
  },
};

const mainTextContainer = {
  initial: {
    y: 0,
    x: 0,
  },
  hover: {
    y: -16,
    x: 8,
  },
};

const mainText = {
  initial: {
    fontSize: '1rem',
    lineHeight: '1.5rem',
  },
  hover: {
    fontSize: '1.25rem',
    lineHeight: '1.75rem',
  },
};

const subText = {
  initial: {
    fontSize: '.75rem',
    lineHeight: '1rem',
  },
  hover: {
    fontSize: '.85rem',
    lineHeight: '1.25rem',
  },
};

const Documentation = () => {
  const data = {
    content: {
      title: 'Documentation',
      tagLine: 'Learn how to use Corndocs',
    },
  };

  return (
    <article className="not-prose w-full max-w-none">
      <section className="not-prose md:py-18 relative mx-auto max-w-6xl px-6 py-8">
        <h1 className="2xl:px-30 mb-4 text-4xl font-black text-slate-900 dark:text-white md:text-6xl lg:mb-8 lg:text-center lg:leading-tight">
          Step into our documentation: Master our platform in
          <span className="text-primary/90"> minutes</span>
        </h1>
        <p className="font-bold text-slate-600 dark:text-slate-100 lg:text-center lg:text-lg">
          Your Path to Front-End Expertise Made Effortless
        </p>

        <div className="mx-auto flex max-w-xl flex-col justify-center gap-2 py-8 md:flex-row">
          <button
            // onClick={() => toggleCommand()}
            className="hover:ring-primary-300 flex h-10 w-full flex-row items-center gap-2 truncate rounded-xl border border-slate-300 pl-4 pr-2 text-left text-sm text-slate-500 outline-none hover:ring-2 hover:ring-offset-2 hover:ring-offset-slate-50 dark:border-slate-700 dark:text-slate-100 dark:hover:ring-offset-slate-800"
          >
            <Search size={16} className="flex-none" />
            <span className="flex-1">Search Docs...</span>
            <kbd className="rounded-xl border border-slate-300 bg-slate-100 px-2 py-1 text-xs text-slate-600 dark:border-slate-500 dark:bg-slate-700 dark:text-white">
              CTRL + K
            </kbd>
          </button>
          <Link
            href="/Docs/getting-started"
            className="focus:ring-primary-400 dark:bg-primary-600 dark:hover:bg-primary-500 flex h-10 min-w-[6rem] flex-none items-center justify-center whitespace-nowrap rounded-xl bg-primary/90 px-6 text-base font-medium text-white hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-50 dark:ring-offset-slate-800"
          >
            Get Started
          </Link>
        </div>
      </section>
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
            <PreviewCard />
            <PreviewCard />
            <PreviewCard />
            <PreviewCard />
            <PreviewCard />
            <PreviewCard />
          </section>
        </motion.div>
      </AnimatePresence>
    </article>
  );
};

export default Documentation;
