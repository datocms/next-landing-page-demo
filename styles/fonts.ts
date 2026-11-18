import { Geist_Mono, Inter } from 'next/font/google';

// Both families are variable, so no `weight` is passed. `subsets` only picks what
// is preloaded: every subset (latin-ext included) stays declared through
// unicode-range and downloads when a page uses it. Latin covers en, it, de, fr and es.

// The one typeface of the site: text and headings
const sans = Inter({
  subsets: ['latin'],
  // The optical-size axis: headlines get Inter's tighter display shapes automatically
  axes: ['opsz'],
  variable: '--font-inter',
  display: 'swap',
});

// Only emphasis in long-form text uses the italic, so it loads on demand
const sansItalic = Inter({
  subsets: ['latin'],
  style: 'italic',
  preload: false,
  variable: '--font-inter-italic',
  display: 'swap',
});

// Code blocks and inline code
const code = Geist_Mono({
  subsets: ['latin'],
  preload: false,
  variable: '--font-code',
  display: 'swap',
});

/** Put on <html>: defines the font custom properties that styles/theme.css reads */
export const fontVariables = `${sans.variable} ${sansItalic.variable} ${code.variable}`;
