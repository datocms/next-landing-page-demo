import '@/styles/global.css';

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
