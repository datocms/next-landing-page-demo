import '@/styles/global.css';
import NotFoundPage from '@/components/layout/NotFoundPage';
import { fontVariables } from '@/styles/fonts';

/** URLs no route matches (and unknown locales). The root layout is a pass-through, so this page renders its own <html>. */
export default function NotFound() {
  return (
    <html lang="en" className={fontVariables}>
      <body className="font-sans">
        <NotFoundPage />
      </body>
    </html>
  );
}
