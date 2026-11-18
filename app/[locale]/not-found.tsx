import NotFoundPage from '@/components/layout/NotFoundPage';

/** Fallback for a notFound() the group layouts cannot catch (their own data missing): rendered in the locale root layout, without header or footer */
export default function NotFound() {
  return <NotFoundPage />;
}
