import { revalidateTag } from 'next/cache';
import { type NextRequest, NextResponse } from 'next/server';
import { cacheTag } from '@/lib/datocms/executeQuery';

/**
 * Called by the "🔄 Cache Revalidation" webhook (created by /api/post-install)
 * whenever content, models or assets change in DatoCMS
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  // The token is sent by the webhook as a request header (see /api/post-install)
  const token = request.headers.get('authorization')?.replace(/^Bearer /, '');

  if (!token || token !== process.env.CACHE_INVALIDATION_SECRET_TOKEN) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  try {
    // Every DatoCMS request is cached under one tag (lib/datocms/executeQuery.ts),
    // so this invalidates all of them
    await revalidateTag(cacheTag, 'default');
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }

  return NextResponse.json({ status: 'Cache Cleared' });
}
