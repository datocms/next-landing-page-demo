import '@/styles/global.css';
import NotFoundPage from '@/components/layout/NotFoundPage';
import { fontVariables } from '@/styles/fonts';

/**
 * The 404 for URLs that match no route (and for an unknown locale). The root
 * layout only passes children through, so this page brings its own <html>. It
 * can't know the locale: NotFoundPage reads it from the URL and sets `lang` on
 * its content.
 */
export default function NotFound() {
  return (
    <html lang="en" className={fontVariables}>
      <body className="font-sans">
        <NotFoundPage />
      </body>
    </html>
  );
}
