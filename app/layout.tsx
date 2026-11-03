/**
 * Every page lives under a locale, so <html lang> is rendered by
 * app/[locale]/layout.tsx. This layout only passes children through: it has to
 * exist because app/not-found.tsx (URLs no route matches, and unknown locales)
 * sits at the root.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
