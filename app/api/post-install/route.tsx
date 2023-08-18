import { NextResponse } from 'next/server';
import { ApiError, buildClient, Client } from '@datocms/cma-client-node';

const cors = {
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'OPTIONS, POST',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  },
};

async function vercelInitialization(
  vercelProjectId: string,
  vercelTeamId_: string,
  vercelApiToken: string,
  sectetToken: string,
  datoApiToken: string
) {
  await fetch(`https://api.vercel.com/v10/projects/${vercelProjectId}/env`, {
    headers: {
      Authorization: `Bearer ${vercelApiToken}`,
    },
    method: 'post',
    body: JSON.stringify([
      {
        type: 'encrypted',
        key: 'SEO_SECRET_TOKEN',
        value: sectetToken,
        target: ['development', 'production', 'preview'],
      },
      {
        type: 'encrypted',
        key: 'DRAFT_SECRET_TOKEN',
        value: sectetToken,
        target: ['development', 'production', 'preview'],
      },
      {
        type: 'encrypted',
        key: 'CACHE_INVALIDATION_SECRET_TOKEN',
        value: sectetToken,
        target: ['development', 'production', 'preview'],
      },
      // {
      //   type: 'encrypted',
      //   key: 'DATOCMS_READONLY_API_TOKEN',
      //   value: datoApiToken,
      //   target: ['development', 'production', 'preview'],
      // },
    ]),
  });
}

/*
  These endpoints are called right after bootstrapping the Starter project...
  they can be removed afterwards!
*/

export async function OPTIONS() {
  return new Response('OK', cors);
}

const baseUrl = process.env.VERCEL_URL
  ? // Vercel auto-populates this environment variable
    `https://${process.env.VERCEL_URL}`
  : // Netlify auto-populates this environment variable
    process.env.URL;

const secretToken = 'superSecretToken';

async function installWebPreviewsPlugin(client: Client) {
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

export async function POST(request: Request) {
  const body = await request.json();

  const client = buildClient({ apiToken: body.datocmsApiToken });

  if (body.integrationInfo.adapter === 'vercel') {
    await vercelInitialization(
      body.integrationInfo.vercelProjectId,
      body.integrationInfo.vercelTeamId,
      body.integrationInfo.vercelApiToken,
      secretToken,
      body.datocmsApiToken
    );
  }

  try {
    await Promise.all([
      installWebPreviewsPlugin(client),
      client.webhooks.create({
        name: '🔄 Cache Revalidation',
        url: `${baseUrl}api/revalidateCache?token=${secretToken}`,
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
      }),
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
