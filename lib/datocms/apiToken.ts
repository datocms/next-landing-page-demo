import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { cache } from 'react';

/*
 * This deployment serves the demo projects that try.datocms.com creates, all
 * from one website. Each project has its own API token, which reaches the site
 * in the first segment of the URL (`/<token>/en/home`). proxy.ts moves it to a
 * cookie, so the site's own links stay `/en/...`, and hands it to the page
 * in a request header.
 */

/** The request header that carries the visitor's API token to the server */
export const API_TOKEN_HEADER = 'x-datocms-api-token';

/** The cookie that keeps the API token across the visitor's navigation */
export const API_TOKEN_COOKIE = 'datocms_api_token';

/** Whether a URL segment is an API token rather than a locale or a slug */
export function isApiToken(segment: string | undefined): segment is string {
  return !!segment && /^[0-9a-f]{24,64}$/i.test(segment);
}

/** The API token of the current request, set by proxy.ts */
export async function getApiToken(): Promise<string> {
  const token = (await headers()).get(API_TOKEN_HEADER);
  if (!isApiToken(token ?? undefined)) notFound();
  return token as string;
}

type SiteResponse = {
  data?: { attributes?: { internal_domain?: string | null } };
};

/**
 * The admin URL of the token's project, for Content Link. Each demo project has
 * its own, so it comes from the Content Management API instead of an
 * environment variable. The token's role can read it because it can manage
 * shared filters (try.datocms.com sets that up).
 */
export const getBaseEditingUrl = cache(
  async (apiToken: string): Promise<string | undefined> => {
    try {
      const response = await fetch('https://site-api.datocms.com/site', {
        headers: {
          Authorization: `Bearer ${apiToken}`,
          Accept: 'application/json',
          'X-Api-Version': '3',
        },
        cache: 'no-store',
      });

      if (response.ok) {
        const body = (await response.json()) as SiteResponse;
        const internalDomain = body.data?.attributes?.internal_domain;
        if (internalDomain) return `https://${internalDomain}`;
      }
    } catch (error) {
      console.error(error);
    }

    return undefined;
  },
);
