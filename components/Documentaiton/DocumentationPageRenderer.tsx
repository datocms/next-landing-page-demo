"use client";

import {
  StructuredText as StructuredTextField,
  renderNodeRule,
} from "react-datocms/structured-text";
import SyntaxHighlighter from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";
import {
  Record,
  StructuredText,
  isBlockquote,
  isCode,
  isHeading,
  isList,
  isParagraph,
  isSpan,
} from "datocms-structured-text-utils";
import {
  DocumentationPageModelContentField,
  DocumentationPageQuery,
} from "@/graphql/types/graphql";
import QuoteBlock from "../Blog/Post/StructuredTextBlocks/QuoteBlock";
import React, { CSSProperties } from "react";
import Highlighter from "../Common/Highlighter";

type Props = {
  data: DocumentationPageQuery;
};

const DocumentaitonPageRenderer = ({ data }: Props) => {
  return (
    <div className="px-24 py-8">
      <StructuredTextField
        data={
          data.documentationPage!.content.value as StructuredText<
            Record,
            Record
          >
        }
        customNodeRules={[
          renderNodeRule(isHeading, ({ children, key }) => {
            return (
              <h3
                className="mb-4 mt-9 text-xl font-bold text-black dark:text-white sm:text-2xl lg:text-xl xl:text-2xl"
                key={key}
              >
                {children}
              </h3>
            );
          }),
          renderNodeRule(isParagraph, ({ children, key, node }) => {
            return (
              <div
                className="py-1 text-base font-medium leading-relaxed text-gray-500 sm:text-lg sm:leading-relaxed"
                key={key}
              >
                {children}
              </div>
            );
          }),
          renderNodeRule(isList, ({ children, key }) => {
            return (
              <ul
                className="list-disc pl-4 text-base font-medium leading-relaxed text-gray-500 sm:text-lg sm:leading-relaxed"
                key={key}
              >
                {children}
              </ul>
            );
          }),
          renderNodeRule(isBlockquote, ({ children, key }) => {
            return <QuoteBlock text={children} />;
          }),
          renderNodeRule(isCode, ({ node, key }) => {
            return (
              <div className="py-4">
                <SyntaxHighlighter
                  wrapLines={true}
                  showLineNumbers={true}
                  lineNumberStyle={{ display: "none" }}
                  lineProps={(lineNumber) => {
                    if (!node.highlight) return { display: "block" };
                    let style: CSSProperties = { display: "block" };
                    if (node.highlight.includes(lineNumber - 1)) {
                      style.backgroundColor = "rgb(235, 235, 245)";
                    }
                    return { style };
                  }}
                  language={node.language}
                  style={docco}
                >
                  {node.code}
                </SyntaxHighlighter>
              </div>
            );
          }),
        ]}
        renderNode={Highlighter}
      />
    </div>
  );
};

export default DocumentaitonPageRenderer;
