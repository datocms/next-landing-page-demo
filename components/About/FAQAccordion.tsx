'use client';

import { useState } from 'react';
import { StructuredText } from 'react-datocms/structured-text';
import { motion } from 'framer-motion';
import { QuestionRecord } from '@/graphql/generated';
import { Maybe } from 'graphql/jsutils/Maybe';

const closeIcon = (
  <span className="rounded-full bg-gray-200 text-gray-400">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M18 12H6"
      />
    </svg>
  </span>
);

const openIcon = (
  <span className="rounded-full bg-blue-500 text-white">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
      />
    </svg>
  </span>
);

type Props = {
  title: Maybe<string>;
  subtitle: Maybe<string>;
  questions: Array<QuestionRecord>;
};

const FAQAccordion = ({ title, subtitle, questions }: Props) => {
  const [openQuestions, setOpenQuestions] = useState<string[]>([]);

  function toggleQuestion(id: string) {
    if (openQuestions.includes(id)) {
      setOpenQuestions((openQuestions) => {
        return [...openQuestions.filter((qID) => qID !== id)];
      });
    } else {
      setOpenQuestions((openQuestions) => [...openQuestions, id]);
    }
  }

  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="container mx-auto px-6 py-12">
        <h1 className="mb-4 text-center text-2xl font-semibold text-gray-800 dark:text-white lg:text-4xl">
          {title}
        </h1>
        <h2 className=" text-center text-gray-500">{subtitle}</h2>

        <div className="mx-8 mt-8 grid gap-4 lg:mx-40">
          {questions.map((question) => {
            const isOpen = openQuestions.includes(question.id);
            return (
              <motion.div
                layout="position"
                key={question.id}
                className={
                  'rounded-lg bg-gray-100 p-8 hover:cursor-pointer dark:bg-gray-800'
                }
                onClick={() => {
                  toggleQuestion(question.id);
                }}
              >
                <button className="flex w-full items-center justify-between">
                  <h1 className="font-semibold text-gray-700 dark:text-white">
                    {question.question}
                  </h1>
                  {isOpen ? closeIcon : openIcon}
                </button>

                <motion.div
                  animate={isOpen ? 'open' : 'closed'}
                  variants={{
                    open: { opacity: 1 },
                    closed: { opacity: 0 },
                  }}
                  transition={{ duration: 0.5 }}
                  className={
                    'mt-6 text-sm text-gray-500 dark:text-gray-300' +
                    (isOpen ? '' : ' hidden')
                  }
                >
                  <StructuredText data={question.answer.value} />
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQAccordion;
