/**
 * The site's public origin: Vercel sets VERCEL_PROJECT_PRODUCTION_URL, Netlify
 * (and .env locally) sets URL. Server-only: neither variable is NEXT_PUBLIC_,
 * so it is undefined in client components
 */
export const websiteBaseUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : process.env.URL;
