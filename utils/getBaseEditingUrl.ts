const ONE_DAY_IN_SECONDS = 60 * 60 * 24;

type SiteResponse = {
  data?: { attributes?: { internal_domain?: string | null } };
};

/**
 * Returns the URL of the DatoCMS admin area for the project of the API token.
 *
 * Each project has a different admin URL, and the API token comes from the
 * page URL. Thus, a fixed environment variable cannot give the correct value.
 * This function gets the domain of the project from the Content Management API.
 *
 * The Next.js Data Cache keeps the response for one day. The admin URL of a
 * project does not change, and the cache is shared between all instances.
 *
 * The API gives the domain only to a token whose role can manage shared
 * filters. If the token cannot read the domain (for example, the default
 * read-only token, or a token for the Content Delivery API only), the
 * function returns DATOCMS_BASE_EDITING_URL. If that
 * variable is not set, it returns undefined.
 */
export default async function getBaseEditingUrl(
  apiToken: string,
): Promise<string | undefined> {
  try {
    const response = await fetch('https://site-api.datocms.com/site', {
      headers: {
        Authorization: `Bearer ${apiToken}`,
        Accept: 'application/json',
        'X-Api-Version': '3',
      },
      next: { revalidate: ONE_DAY_IN_SECONDS },
    });

    if (response.ok) {
      const body = (await response.json()) as SiteResponse;
      const internalDomain = body.data?.attributes?.internal_domain;

      if (internalDomain) {
        return `https://${internalDomain}`;
      }
    }
  } catch (error) {
    console.error(error);
  }

  return process.env.DATOCMS_BASE_EDITING_URL || undefined;
}
