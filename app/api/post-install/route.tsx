import { buildClient, type Client } from '@datocms/cma-client-node';
import { withCORS } from '@/app/api/utils';

/*
 * Called once by DatoCMS right after this starter is deployed (`postDeploy` in
 * datocms.json), with the new project's API token and the deployment's URL. It
 * wires the project to this deployment: the Web Previews plugin (preview links
 * and Visual Editing), the SEO/Readability Analysis plugin and the cache
 * invalidation webhook, each sending its secret token to the route it calls.
 * The endpoint can be removed afterwards.
 */

/**
 * The DatoCMS API token arrives in the request body, so without this check the
 * endpoint would happily write our secret tokens into any project a caller
 * names, and the caller could then read them back from their own project.
 */
async function isOurProject(callerClient: Client, ourApiToken: string) {
  const ourClient = buildClient({ apiToken: ourApiToken });

  const [callerProject, ourProject] = await Promise.all([
    callerClient.site.find(),
    ourClient.site.find(),
  ]);

  return callerProject.id === ourProject.id;
}

/** Preview links in the record sidebar (/api/draft/preview-links) and Visual Editing */
async function installWebPreviewsPlugin(client: Client, baseUrl: string) {
  const webPreviewsPlugin = await client.plugins.create({
    package_name: 'datocms-plugin-web-previews',
  });

  await client.plugins.update(webPreviewsPlugin.id, {
    parameters: {
      frontends: [
        {
          name: 'Production',
          previewWebhook: new URL(
            '/api/draft/preview-links',
            baseUrl,
          ).toString(),
          // The secret travels in a header: an URL ends up in logs, proxies and
          // in the plugin settings, where every collaborator can read it
          customHeaders: [
            {
              name: 'Authorization',
              value: `Bearer ${process.env.DRAFT_SECRET_TOKEN}`,
            },
          ],
          visualEditing: {
            // Opened by the browser, which can't send headers: the secret goes in ?token=
            enableDraftModeUrl: new URL(
              `/api/draft/enable?token=${process.env.DRAFT_SECRET_TOKEN}`,
              baseUrl,
            ).toString(),
            initialPath: '/',
          },
        },
      ],
      startOpen: true,
    },
  });
}

/** SEO and readability scores on every `seo_analysis` field (/api/seoAnalysis) */
async function installSEOAnalysisPlugin(client: Client, baseUrl: string) {
  const seoPlugin = await client.plugins.create({
    package_name: 'datocms-plugin-seo-readability-analysis',
  });

  await client.plugins.update(seoPlugin.id, {
    parameters: {
      htmlGeneratorUrl: new URL('/api/seoAnalysis', baseUrl).toString(),
      customHeaders: [
        {
          name: 'Authorization',
          value: `Bearer ${process.env.SEO_SECRET_TOKEN}`,
        },
      ],
      autoApplyToFieldsWithApiKey: 'seo_analysis',
      setSeoReadabilityAnalysisFieldExtensionId: true,
    },
  });
}

/** Clears the site's cached DatoCMS responses whenever content, models or assets change (/api/revalidateCache) */
async function createCacheInvalidationWebhook(client: Client, baseUrl: string) {
  await client.webhooks.create({
    name: '🔄 Cache Revalidation',
    url: new URL('/api/revalidateCache', baseUrl).toString(),
    custom_payload: null,
    headers: {
      Authorization: `Bearer ${process.env.CACHE_INVALIDATION_SECRET_TOKEN}`,
    },
    events: [
      {
        filters: [],
        entity_type: 'item',
        event_types: ['create', 'update', 'delete', 'publish', 'unpublish'],
      },
      {
        filters: [],
        entity_type: 'item_type',
        event_types: ['create', 'update', 'delete'],
      },
      {
        filters: [],
        entity_type: 'upload',
        event_types: ['update', 'delete'],
      },
    ],
    http_basic_user: null,
    http_basic_password: null,
    enabled: true,
    payload_api_version: '3',
    nested_items_in_payload: false,
  });
}

export async function OPTIONS() {
  return new Response('OK', withCORS());
}

export async function POST(request: Request) {
  const body = await request.json();

  const client = buildClient({ apiToken: body.datocmsApiToken });
  const baseUrl = body.frontendUrl as string;

  try {
    if (!(await isOurProject(client, process.env.DATOCMS_CMA_TOKEN!))) {
      return Response.json(
        { success: false, error: 'Invalid token' },
        withCORS({ status: 401 }),
      );
    }

    await Promise.all([
      installWebPreviewsPlugin(client, baseUrl),
      createCacheInvalidationWebhook(client, baseUrl),
      installSEOAnalysisPlugin(client, baseUrl),
    ]);

    return Response.json({ success: true }, withCORS());
  } catch (error) {
    // Never return the error: the DatoCMS client stores the failed request in
    // it, Authorization header and payload included
    console.error(error);

    return Response.json(
      { success: false, error: 'Internal server error' },
      withCORS({ status: 500 }),
    );
  }
}
