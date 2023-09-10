import { NextResponse } from 'next/server';
import { ApiError, buildClient, Client } from '@datocms/cma-client-node';

const cors = {
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'OPTIONS, POST',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  },
};

/*
  These endpoints are called right after bootstrapping the Starter project...
  they can be removed afterwards!
*/

export async function OPTIONS() {
  return new Response('OK', cors);
}

const secretToken = 'superSecretToken';

async function installWebPreviewsPlugin(client: Client, baseUrl: string) {
  const webPreviewsPlugin = await client.plugins.create({
    package_name: 'datocms-plugin-web-previews',
  });

  await client.plugins.update(webPreviewsPlugin, {
    parameters: {
      frontends: [
        {
          name: 'Production',
          previewWebhook: `${baseUrl}/api/draft/preview-links?token=${secretToken}`,
        },
      ],
      startOpen: true,
    },
  });
}

async function installSEOAnalysisPlugin(client: Client, baseUrl: string) {
  const seoPlugin = await client.plugins.create({
    package_name: 'datocms-plugin-seo-readability-analysis',
  });

  await client.plugins.update(seoPlugin.id, {
    parameters: {
      htmlGeneratorUrl: `${baseUrl}/api/seoAnalysis?token=${secretToken}`,
      autoApplyToFieldsWithApiKey: 'seo_analysis',
      setSeoReadabilityAnalysisFieldExtensionId: true,
    },
  });
}

async function createCacheInvalidationWebhook(client: Client, baseUrl: string) {
  await client.webhooks.create({
    name: '🔄 Cache Revalidation',
    url: `${baseUrl}/api/revalidateCache?token=${secretToken}`,
    custom_payload: null,
    headers: {},
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

export async function POST(request: Request) {
  const body = await request.json();

  const client = buildClient({ apiToken: body.datocmsApiToken });

  const projectName = process.env.VERCEL_BRANCH_URL?.split('-git-main-')[0];
  const baseUrl = (
    projectName ? `https://${projectName}.vercel.app` : process.env.URL
  ) as string;

  try {
    await Promise.all([
      installWebPreviewsPlugin(client, baseUrl),
      createCacheInvalidationWebhook(client, baseUrl),
      installSEOAnalysisPlugin(client, baseUrl),
    ]);

    return NextResponse.json({ success: true }, cors);
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
          request: error.request,
          response: error.response,
        },
        { status: 500, ...cors }
      );
    }

    return NextResponse.json({ success: false }, { status: 500, ...cors });
  }
}
