import { fallbackLng } from '@/app/i18n/settings';
import { MenuDocument, SiteLocale } from '@/graphql/generated';
import queryDatoCMS from '@/utils/queryDatoCMS';

export type Menu = {
  id: string;
  title: string;
  path?: string;
  newTab: boolean;
  submenu?: Menu[];
};

export type NotificationStripType = {
  displayNotification: boolean;
  text: string;
  urlLabel: string | null | undefined;
  url: string | undefined | null;
};

export default async function GetMenuData(lng: SiteLocale, isEnabled: boolean) {
  const menuData: Menu[] = [];

  const { header } = await queryDatoCMS(
    MenuDocument,
    {
      locale: lng,
      fallbackLocale: [fallbackLng],
    },
    isEnabled
  );

  header!.pages.map((page) => {
    menuData.push({
      id: page.id,
      title: page.label,
      path: `/${page.slug}`,
      newTab: false,
    });
  });

  menuData.push({
    id: '1',
    title: 'Other Demos',
    newTab: false,
    submenu: [
      {
        id: '2',
        title: 'Landing Page Variation One',
        path: `/HomeVariationOne`,
        newTab: true,
      },
      {
        id: '3',
        title: 'Landing Page Variation Two',
        path: `/HomeVariationTwo`,
        newTab: true,
      },
    ],
  });

  const notificationStripObject: NotificationStripType = {
    displayNotification: header!.displayNotification || false,
    text: header!.text,
    urlLabel: header!.urlLabel,
    url: header!.url,
  };

  return {
    menuData,
    logoImage: header!.logo.url,
    notificationStripObject,
    headerDisplayOption: header!.displayOptions,
  };
}
