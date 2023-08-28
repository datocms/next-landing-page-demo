import { SiteLocale } from '@/graphql/generated';
import Link from 'next/link';
import { SetStateAction } from 'react';

type Props = {
  text: string;
  url: string | undefined | null;
  urlLabel: string | null | undefined;
  lng: SiteLocale;
  setNotificationStrip: React.Dispatch<SetStateAction<boolean>>;
};

const NotificationStrip = ({
  text,
  url,
  urlLabel,
  lng,
  setNotificationStrip,
}: Props) => {
  return (
    <div className="bg-primary px-4 py-3 text-white">
      <p className="text-center text-sm font-medium">
        {text}{' '}
        <Link href={'/' + lng + url || '#'} className="inline-block underline">
          {urlLabel}
        </Link>
      </p>
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
