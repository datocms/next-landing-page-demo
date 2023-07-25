import { Menu } from '@/types/menu';

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
    newTab: false,
    path: '/posts',
  },
  {
    id: 4,
    title: 'Support',
    path: '/contact',
    newTab: false,
  },
];
export default menuData;
