'use client';

import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';

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

const PreviewCard = () => {
  return (
    <Link href={`/`}>
      <motion.div
        initial="initial"
        whileHover="hover"
        animate="initial"
        className="hover:bg-primary-200/20 hover:ring-primary-300 dark:hover:bg-primary-500/10 hover:dark:ring-primary-500/30 relative h-60 w-full cursor-pointer overflow-hidden rounded-xl p-2 transition-all hover:ring"
      >
        <motion.div
          variants={mainImage}
          className="relative h-1/2 w-full overflow-hidden rounded-xl border border-slate-300 bg-slate-200/70 dark:border-slate-700 dark:bg-slate-800/50"
        >
          <div className="flex h-full w-full flex-col justify-center p-6">
            <p className="whitespace-nowrap text-4xl font-black text-slate-400 dark:text-slate-500">
              Getting Started
            </p>
            <p className="whitespace-nowrap text-2xl font-bold text-slate-400 dark:text-slate-500">
              The firsts steps on our platform
            </p>
          </div>
        </motion.div>
        <motion.div
          variants={mainTextContainer}
          className="absolute bottom-0 rounded-xl px-4 py-2 backdrop-blur-md md:bg-white/90 md:dark:bg-slate-900/90"
        >
          <motion.h3
            variants={mainText}
            className="truncate text-base font-bold text-slate-900 dark:text-white"
          >
            title
          </motion.h3>
          <motion.p
            variants={subText}
            className="line-clamp-3 text-xs text-slate-700 dark:text-slate-50"
          >
            description
          </motion.p>
        </motion.div>
      </motion.div>
    </Link>
  );
};

export default PreviewCard;
