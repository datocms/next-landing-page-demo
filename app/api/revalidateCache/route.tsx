import { revalidateTag } from 'next/cache';
import type { NextRequest } from 'next/server';
import { hasBearerToken } from '@/app/api/utils';
import { DATOCMS_CACHE_TAG } from '@/lib/datocms/executeQuery';

/**
 * Called by the "🔄 Cache Revalidation" webhook (created by /api/post-install)
 * whenever content, models or assets change in DatoCMS
 */
export async function POST(request: NextRequest) {
  if (!hasBearerToken(request, process.env.CACHE_INVALIDATION_SECRET_TOKEN)) {
    return Response.json({ error: 'Invalid token' }, { status: 401 });
  }

  try {
    // Every DatoCMS request is cached under one tag (lib/datocms/executeQuery.ts),
    // so this invalidates all of them
    revalidateTag(DATOCMS_CACHE_TAG, 'default');
  } catch (error) {
    console.error(error);

    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }

  return Response.json({ status: 'Cache Cleared' });
}
