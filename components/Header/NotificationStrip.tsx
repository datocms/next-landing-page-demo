import { SiteLocale } from '@/graphql/generated';
import { NotificationStripType } from './GetMenuData';
import Link from 'next/link';

type Props = {
  notificationStripObject: NotificationStripType;
  lng: SiteLocale;
  setNotificationStrip: React.Dispatch<React.SetStateAction<boolean>>;
};

const NotificationStrip = ({
  notificationStripObject,
  lng,
  setNotificationStrip,
}: Props) => {
  return (
    <div className="bg-primary px-4 py-3 text-white">
      <p className="text-center text-sm font-medium">
        {notificationStripObject.text}{' '}
        <Link
          href={'/' + lng + notificationStripObject.url || '#'}
          className="inline-block underline"
        >
          {notificationStripObject.urlLabel}
        </Link>
      </p>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        className="absolute right-4 top-3 h-5 w-5 cursor-pointer"
        onClick={() => setNotificationStrip(false)}
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </div>
  );
};

export default NotificationStrip;
