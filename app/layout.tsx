import '@/styles/global.css';
import 'node_modules/react-modal-video/css/modal-video.css';

type Params = {
  children: React.ReactNode;
};

export default async function RootLayout({ children }: Params) {
  return (
    <html>
      <body className={'tracking-tight antialiased'}>{children}</body>
    </html>
  );
}
