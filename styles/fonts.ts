import {
  Funnel_Display,
  Funnel_Sans,
  Spline_Sans_Mono,
} from 'next/font/google';

// Every family here is variable, so no `weight` is passed. `subsets` only picks what
// is preloaded: every subset (latin-ext included) stays declared through
// unicode-range and downloads when a page uses it. Latin covers en, it, de, fr and es.
const display = Funnel_Display({
  subsets: ['latin'],
  variable: '--font-funnel-display',
  display: 'swap',
});

const sans = Funnel_Sans({
  subsets: ['latin'],
  variable: '--font-funnel-sans',
  display: 'swap',
});

// Only long-form emphasis (.prose em) uses the italic, so it loads on demand
const sansItalic = Funnel_Sans({
  subsets: ['latin'],
  style: 'italic',
  preload: false,
  variable: '--font-funnel-sans-italic',
  display: 'swap',
});

const mono = Spline_Sans_Mono({
  subsets: ['latin'],
  variable: '--font-spline-mono',
  display: 'swap',
});

/** Put on <html>: defines the font custom properties that styles/theme.css reads */
export const fontVariables = `${display.variable} ${sans.variable} ${sansItalic.variable} ${mono.variable}`;
