type Menu = {
  id: number;
  title: string;
  path?: string;
  newTab: boolean;
  submenu?: Menu[];
};

const menuData: Menu[] = [
  {
    id: 1,
    title: 'Home',
    path: '/',
    newTab: false,
  },
  {
    id: 2,
    title: 'About',
    path: '/about',
    newTab: false,
  },
  {
    id: 3,
    title: 'Posts',
    path: '/posts',
    newTab: false,
  },
  {
    id: 4,
    title: 'Other Demos',
    newTab: false,
    submenu: [
      {
        id: 41,
        title: 'Landing Page Variation One',
        path: '/HomeVariationOne',
        newTab: false,
      },
      {
        id: 42,
        title: 'Landing Page Variation Two',
        path: '/HomeVariationTwo',
        newTab: false,
      },
    ],
  },
];
export default menuData;
