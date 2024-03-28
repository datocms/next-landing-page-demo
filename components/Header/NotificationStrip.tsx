import {
  LayoutModelNotificationField,
  SiteLocale,
} from "@/graphql/types/graphql";
import { Record, StructuredText, isLink } from "datocms-structured-text-utils";
import Link from "next/link";
import { SetStateAction } from "react";
import {
  StructuredText as StructuredTextField,
  renderNodeRule,
} from "react-datocms/structured-text";
import Highlighter from "../Common/Highlighter";

type Props = {
  notification: LayoutModelNotificationField;
  lng: SiteLocale;
  setNotificationStrip: React.Dispatch<SetStateAction<boolean>>;
};

const NotificationStrip = ({
  notification,
  lng,
  setNotificationStrip,
}: Props) => {
  return (
    <div className="bg-primary px-4 py-3 text-white">
      <div className="text-center text-sm font-medium">
        <StructuredTextField
          data={notification.value as StructuredText<Record, Record>}
          renderNode={Highlighter}
          customNodeRules={[
            renderNodeRule(isLink, ({ node, children, key }) => {
              return (
                <Link
                  href={"/" + lng + node.url || "#"}
                  className="inline-block underline"
                  key={key}
                >
                  {children}
                </Link>
              );
            }),
          ]}
        />
      </div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="absolute right-4 top-3 h-5 w-5 cursor-pointer"
        onClick={() => setNotificationStrip(false)}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </div>
  );
};

export default NotificationStrip;
